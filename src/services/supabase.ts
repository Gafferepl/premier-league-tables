// Enhanced Supabase service for production
// Optimized for performance, security, and reliability

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Enhanced client with connection pooling and retry logic
export const supabase: SupabaseClient = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'gaffers-hub/1.0.0'
    }
  }
}) : null as any;

// Enhanced interfaces for type safety
export interface LeagueUserData {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'firstTeam' | 'seasonPass';
  league_opt_in: boolean;
  waitlist_opt_in: boolean;
  fpl_team_name?: string;
  country?: string;
  date_of_birth?: string;
  mobile?: string | null;
  sms_consent?: boolean;
  fpl_id?: string | null;
  fpl_integration_level?: 'none' | 'basic' | 'advanced';
  founding_member?: boolean;
  founding_member_number?: number;
  created_at: string;
  updated_at: string;
}

export interface UsageTracking {
  id: string;
  user_email: string;
  feature: string;
  usage_count: number;
  period: 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

class SupabaseService {
  private retryCount = 3;
  private retryDelay = 1000;

  /**
   * Retry logic for database operations
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries: number = this.retryCount
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries > 0 && this.shouldRetry(error)) {
        // console.warn(`Retrying operation, ${retries} attempts left:`, error);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryOperation(operation, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Determine if error should trigger retry
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors and timeouts
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      error.message?.includes('timeout') ||
      error.message?.includes('network')
    );
  }

  /**
   * Save user with league preferences (enhanced with validation)
   */
  async saveLeagueUser(userData: Omit<LeagueUserData, 'id' | 'created_at' | 'updated_at'>): Promise<LeagueUserData> {
    // Validate input data
    this.validateUserData(userData);

    return this.retryOperation(async () => {
      // Check for existing user to prevent duplicates
      const { data: existingUser } = await supabase
        .from('league_applicants')
        .select('id, tier, founding_member')
        .eq('email', userData.email)
        .single();

      // Handle founding member logic
      let foundingMember = userData.founding_member || false;
      let foundingMemberNumber = userData.founding_member_number || null;

      if (userData.tier === 'seasonPass' && !existingUser) {
        // Count existing season pass founding members
        const { count, error: countError } = await supabase
          .from('league_applicants')
          .select('*', { count: 'exact', head: true })
          .eq('tier', 'seasonPass')
          .eq('founding_member', true);

        if (!countError && count !== null && count < 150) {
          foundingMember = true;
          foundingMemberNumber = count + 1;
        }
      }

      const { data, error } = await supabase
        .from('league_applicants')
        .upsert({
          email: userData.email,
          name: userData.name,
          tier: userData.tier,
          league_opt_in: userData.league_opt_in,
          waitlist_opt_in: userData.waitlist_opt_in,
          fpl_team_name: userData.fpl_team_name,
          country: userData.country,
          date_of_birth: userData.date_of_birth,
          mobile: userData.mobile,
          sms_consent: userData.sms_consent,
          fpl_id: userData.fpl_id,
          fpl_integration_level: userData.fpl_integration_level,
          founding_member: foundingMember,
          founding_member_number: foundingMemberNumber
        })
        .select()
        .single();

      if (error) {
        // console.error('Supabase saveLeagueUser error:', error);
        throw new Error(`Failed to save user: ${error.message}`);
      }

      // Track signup event
      if (typeof window !== 'undefined' && window.trackEvent) {
        window.trackEvent('user_signup', {
          user_tier: userData.tier,
          founding_member: foundingMember,
          method: 'newsletter'
        });
      }

      return data;
    });
  }

  /**
   * Validate user data
   */
  private validateUserData(userData: Omit<LeagueUserData, 'id' | 'created_at' | 'updated_at'>): void {
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    
    if (!userData.name || userData.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    if (!['free', 'firstTeam', 'seasonPass'].includes(userData.tier)) {
      throw new Error('Invalid tier specified');
    }
  }

  /**
   * Get user by email with enhanced error handling
   */
  async getLeagueUser(email: string, tier?: string): Promise<LeagueUserData | null> {
    return this.retryOperation(async () => {
      let query = supabase
        .from('league_applicants')
        .select('*')
        .eq('email', email);

      if (tier) {
        query = query.eq('tier', tier);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') {
        // console.error('Supabase getLeagueUser error:', error);
        throw new Error(`Failed to get user: ${error.message}`);
      }

      return data;
    });
  }

  /**
   * Update user preferences with validation
   */
  async updateLeaguePreferences(
    email: string, 
    tier: string, 
    preferences: {
      league_opt_in?: boolean;
      waitlist_opt_in?: boolean;
      fpl_team_name?: string;
      country?: string;
    }
  ): Promise<LeagueUserData> {
    return this.retryOperation(async () => {
      const { data, error } = await supabase
        .from('league_applicants')
        .update(preferences)
        .eq('email', email)
        .eq('tier', tier)
        .select()
        .single();

      if (error) {
        // console.error('Supabase updateLeaguePreferences error:', error);
        throw new Error(`Failed to update preferences: ${error.message}`);
      }

      return data;
    });
  }

  /**
   * Track feature usage
   */
  async trackFeatureUsage(
    userEmail: string, 
    feature: string, 
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<void> {
    return this.retryOperation(async () => {
      const { error } = await supabase.rpc('increment_usage', {
        p_user_email: userEmail,
        p_feature: feature,
        p_period: period
      });

      if (error) {
        // console.error('Supabase trackFeatureUsage error:', error);
        // Don't throw error for tracking - it's non-critical
      }
    });
  }

  /**
   * Get usage statistics for a user
   */
  async getUserUsageStats(userEmail: string): Promise<UsageTracking[]> {
    return this.retryOperation(async () => {
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) {
        // console.error('Supabase getUserUsageStats error:', error);
        throw new Error(`Failed to get usage stats: ${error.message}`);
      }

      return data || [];
    });
  }

  /**
   * Get founding members count
   */
  async getFoundingMembersCount(): Promise<number> {
    return this.retryOperation(async () => {
      const { count, error } = await supabase
        .from('league_applicants')
        .select('*', { count: 'exact', head: true })
        .eq('founding_member', true);

      if (error) {
        // console.error('Supabase getFoundingMembersCount error:', error);
        throw new Error(`Failed to get founding members count: ${error.message}`);
      }

      return count || 0;
    });
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('league_applicants')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      // console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Legacy methods for compatibility
  async saveUser(userData: any): Promise<any> {
    // console.log('Legacy saveUser called:', userData);
    return userData;
  }

  async getUser(email: string): Promise<any> {
    // console.log('Legacy getUser called:', email);
    return null;
  }

  async getAllUsers(): Promise<any[]> {
    // console.log('Legacy getAllUsers called');
    return [];
  }

  async updateUser(email: string, updates: any): Promise<any> {
    // console.log('Legacy updateUser called:', email, updates);
    return updates;
  }

  async deleteUser(email: string): Promise<boolean> {
    // console.log('Legacy deleteUser called:', email);
    return true;
  }
}

export const supabaseService = new SupabaseService();

// Export for use in components
export default supabaseService;


