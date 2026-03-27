import { supabase, isSupabaseConfigured, getUserFingerprint, getUserIP, User, UsageTracking, AbuseDetection } from '../config/supabase';

// Feature types
export type Feature = 'squad_analysis' | 'chat' | 'comparison' | 'other';
export type UserTier = 'free' | 'firstTeam' | 'seasonPass';

// Usage limits per tier
const USAGE_LIMITS = {
  free: {
    squad_analysis: { monthly: 1, daily: 1 },
    chat: { monthly: 3, daily: 1 },
    comparison: { monthly: 5, daily: 2 }
  },
  firstTeam: {
    squad_analysis: { monthly: 100, daily: 10 },
    chat: { monthly: 100, daily: 10 },
    comparison: { monthly: 100, daily: 10 }
  },
  seasonPass: {
    squad_analysis: { monthly: -1, daily: -1 }, // Unlimited
    chat: { monthly: -1, daily: -1 },
    comparison: { monthly: -1, daily: -1 }
  }
};

// Cache for usage data (1 hour TTL)
interface CachedUsage {
  data: number;
  timestamp: number;
}

const usageCache = new Map<string, CachedUsage>();
const CACHE_TTL = 3600000; // 1 hour

// Batch queue for DB updates
interface BatchUpdate {
  userId: string;
  feature: Feature;
  timestamp: number;
}

let batchQueue: BatchUpdate[] = [];
let batchTimer: NodeJS.Timeout | null = null;

class UsageTracker {
  private fallbackToLocalStorage = false;

  constructor() {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // console.warn('Supabase not configured, falling back to localStorage');
      this.fallbackToLocalStorage = true;
    }

    // Start batch processor
    this.startBatchProcessor();
  }

  /**
   * Get or create user in database
   */
  async getOrCreateUser(email: string, tier: UserTier = 'free'): Promise<User | null> {
    if (this.fallbackToLocalStorage) {
      return this.getLocalUser(email, tier);
    }

    try {
      const fingerprint = getUserFingerprint();
      const ipAddress = await getUserIP();

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser && !fetchError) {
        // Update last active
        await supabase
          .from('users')
          .update({ 
            last_active: new Date().toISOString(),
            ip_address: ipAddress,
            fingerprint 
          })
          .eq('id', existingUser.id);

        return existingUser as User;
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          user_tier: tier,
          ip_address: ipAddress,
          user_agent: navigator.userAgent,
          fingerprint
        })
        .select()
        .single();

      if (createError) {
        // console.error('Error creating user:', createError);
        return this.getLocalUser(email, tier);
      }

      return newUser as User;
    } catch (error) {
      // console.error('Error in getOrCreateUser:', error);
      return this.getLocalUser(email, tier);
    }
  }

  /**
   * Check if user can use a feature
   */
  async canUseFeature(
    email: string,
    feature: Feature,
    tier: UserTier
  ): Promise<{ allowed: boolean; remaining: number; message?: string }> {
    if (this.fallbackToLocalStorage) {
      return this.checkLocalUsage(email, feature, tier);
    }

    try {
      const user = await this.getOrCreateUser(email, tier);
      if (!user) {
        return { allowed: false, remaining: 0, message: 'User not found' };
      }

      // Check if user is blocked
      if (user.is_blocked) {
        return { 
          allowed: false, 
          remaining: 0, 
          message: 'Account suspended due to suspicious activity' 
        };
      }

      const limits = USAGE_LIMITS[tier][feature];
      
      // Unlimited access
      if (limits.monthly === -1) {
        return { allowed: true, remaining: -1 };
      }

      // Check cache first
      const cacheKey = `${user.id}_${feature}_monthly`;
      const cached = usageCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        const remaining = Math.max(0, limits.monthly - cached.data);
        return {
          allowed: cached.data < limits.monthly,
          remaining,
          message: cached.data >= limits.monthly ? 'Monthly limit reached' : undefined
        };
      }

      // Get monthly usage from database
      const { data, error } = await supabase.rpc('get_monthly_usage', {
        p_user_id: user.id,
        p_feature: feature
      });

      if (error) {
        // console.error('Error getting usage:', error);
        return this.checkLocalUsage(email, feature, tier);
      }

      const monthlyUsage = data || 0;

      // Update cache
      usageCache.set(cacheKey, {
        data: monthlyUsage,
        timestamp: Date.now()
      });

      const remaining = Math.max(0, limits.monthly - monthlyUsage);
      
      return {
        allowed: monthlyUsage < limits.monthly,
        remaining,
        message: monthlyUsage >= limits.monthly 
          ? `Monthly limit of ${limits.monthly} reached. Upgrade for unlimited access!`
          : undefined
      };
    } catch (error) {
      // console.error('Error in canUseFeature:', error);
      return this.checkLocalUsage(email, feature, tier);
    }
  }

  /**
   * Track feature usage
   */
  async trackUsage(email: string, feature: Feature, tier: UserTier): Promise<void> {
    if (this.fallbackToLocalStorage) {
      this.trackLocalUsage(email, feature);
      return;
    }

    try {
      const user = await this.getOrCreateUser(email, tier);
      if (!user) return;

      // Add to batch queue
      batchQueue.push({
        userId: user.id,
        feature,
        timestamp: Date.now()
      });

      // Also track locally as backup
      this.trackLocalUsage(email, feature);

      // Invalidate cache
      const cacheKey = `${user.id}_${feature}_monthly`;
      usageCache.delete(cacheKey);

      // Check for abuse
      await this.checkForAbuse(user);
    } catch (error) {
      // console.error('Error tracking usage:', error);
      this.trackLocalUsage(email, feature);
    }
  }

  /**
   * Check for abuse patterns
   */
  private async checkForAbuse(user: User): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('detect_abuse', {
        p_user_id: user.id,
        p_ip_address: user.ip_address || 'unknown',
        p_fingerprint: user.fingerprint || ''
      });

      if (error) {
        // console.error('Error detecting abuse:', error);
        return;
      }

      const result = data?.[0];
      if (result?.is_suspicious) {
        // Log abuse
        await supabase.from('abuse_detection').insert({
          user_id: user.id,
          ip_address: user.ip_address || 'unknown',
          fingerprint: user.fingerprint,
          suspicious_activity: result.reason,
          detection_reason: result.reason,
          severity: 'medium'
        });

        // Block user if high severity
        if (result.reason.includes('Multiple accounts') || result.reason.includes('Rapid usage')) {
          await supabase
            .from('users')
            .update({ is_blocked: true })
            .eq('id', user.id);
        }
      }
    } catch (error) {
      // console.error('Error checking abuse:', error);
    }
  }

  /**
   * Batch processor for DB updates
   */
  private startBatchProcessor(): void {
    const processBatch = async () => {
      if (batchQueue.length === 0) return;

      const batch = [...batchQueue];
      batchQueue = [];

      try {
        // Group by user and feature
        const grouped = batch.reduce((acc, item) => {
          const key = `${item.userId}_${item.feature}`;
          if (!acc[key]) {
            acc[key] = { user_id: item.userId, feature: item.feature, count: 0 };
          }
          acc[key].count++;
          return acc;
        }, {} as Record<string, any>);

        // Batch update to database
        const updates = Object.values(grouped).map(item => ({
          user_id: item.user_id,
          feature: item.feature
        }));

        if (updates.length > 0) {
          await supabase.rpc('batch_update_usage', {
            p_updates: updates
          });
        }
      } catch (error) {
        // console.error('Error processing batch:', error);
        // Re-add failed items to queue
        batchQueue.push(...batch);
      }
    };

    // Process batch every 5 minutes
    batchTimer = setInterval(processBatch, 300000);

    // Also process on page unload
    window.addEventListener('beforeunload', () => {
      if (batchQueue.length > 0) {
        processBatch();
      }
    });
  }

  /**
   * LocalStorage fallback methods
   */
  private getLocalUser(email: string, tier: UserTier): User {
    return {
      id: email,
      email,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
      user_tier: tier,
      is_blocked: false
    };
  }

  private checkLocalUsage(
    email: string,
    feature: Feature,
    tier: UserTier
  ): { allowed: boolean; remaining: number; message?: string } {
    const limits = USAGE_LIMITS[tier][feature];
    
    if (limits.monthly === -1) {
      return { allowed: true, remaining: -1 };
    }

    const storageKey = `usage_${email}_${feature}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      return { allowed: true, remaining: limits.monthly };
    }

    const { count, month } = JSON.parse(stored);
    const currentMonth = new Date().getMonth();

    // Reset if new month
    if (month !== currentMonth) {
      localStorage.removeItem(storageKey);
      return { allowed: true, remaining: limits.monthly };
    }

    const remaining = Math.max(0, limits.monthly - count);
    
    return {
      allowed: count < limits.monthly,
      remaining,
      message: count >= limits.monthly 
        ? `Monthly limit of ${limits.monthly} reached. Upgrade for unlimited access!`
        : undefined
    };
  }

  private trackLocalUsage(email: string, feature: Feature): void {
    const storageKey = `usage_${email}_${feature}`;
    const currentMonth = new Date().getMonth();
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify({
        count: 1,
        month: currentMonth
      }));
      return;
    }

    const { count, month } = JSON.parse(stored);

    if (month !== currentMonth) {
      localStorage.setItem(storageKey, JSON.stringify({
        count: 1,
        month: currentMonth
      }));
    } else {
      localStorage.setItem(storageKey, JSON.stringify({
        count: count + 1,
        month: currentMonth
      }));
    }
  }

  /**
   * Get usage statistics for a user
   */
  async getUsageStats(email: string, tier: UserTier): Promise<Record<Feature, number>> {
    if (this.fallbackToLocalStorage) {
      return this.getLocalUsageStats(email);
    }

    try {
      const user = await this.getOrCreateUser(email, tier);
      if (!user) return { squad_analysis: 0, chat: 0, comparison: 0, other: 0 };

      const features: Feature[] = ['squad_analysis', 'chat', 'comparison', 'other'];
      const stats: Record<Feature, number> = {} as any;

      for (const feature of features) {
        const { data } = await supabase.rpc('get_monthly_usage', {
          p_user_id: user.id,
          p_feature: feature
        });
        stats[feature] = data || 0;
      }

      return stats;
    } catch (error) {
      // console.error('Error getting usage stats:', error);
      return this.getLocalUsageStats(email);
    }
  }

  private getLocalUsageStats(email: string): Record<Feature, number> {
    const features: Feature[] = ['squad_analysis', 'chat', 'comparison', 'other'];
    const stats: Record<Feature, number> = {} as any;
    const currentMonth = new Date().getMonth();

    for (const feature of features) {
      const storageKey = `usage_${email}_${feature}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) {
        stats[feature] = 0;
        continue;
      }

      const { count, month } = JSON.parse(stored);
      stats[feature] = month === currentMonth ? count : 0;
    }

    return stats;
  }
}

// Export singleton instance
export const usageTracker = new UsageTracker();
export default usageTracker;


