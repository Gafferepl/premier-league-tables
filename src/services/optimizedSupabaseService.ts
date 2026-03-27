// Optimized Supabase Service with Caching and Query Optimization
// Reduces database calls and improves performance

import { supabase } from './supabase';
import type { LeagueUserData } from './supabase';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class OptimizedSupabaseService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '900') * 1000; // 15 minutes default
  private queryStats = {
    cacheHits: 0,
    cacheMisses: 0,
    dbQueries: 0,
    errors: 0
  };

  /**
   * Get user with caching
   */
  async getLeagueUser(email: string, tier: string): Promise<LeagueUserData | null> {
    const cacheKey = `user:${email}:${tier}`;
    
    // Check cache first
    const cached = this.getFromCache<LeagueUserData>(cacheKey);
    if (cached) {
      this.queryStats.cacheHits++;
      // console.log(`✅ Cache hit for user ${email}`);
      return cached;
    }

    this.queryStats.cacheMisses++;
    this.queryStats.dbQueries++;

    try {
      const { data, error } = await supabase
        .from('league_applicants')
        .select('*')
        .eq('email', email)
        .eq('tier', tier)
        .single();

      if (error && error.code !== 'PGRST116') {
        this.queryStats.errors++;
        throw error;
      }

      // Cache the result
      if (data) {
        this.setCache(cacheKey, data, this.DEFAULT_TTL);
      }

      return data;
    } catch (error) {
      // console.error('Error fetching user:', error);
      this.queryStats.errors++;
      throw error;
    }
  }

  /**
   * Save user with cache invalidation
   */
  async saveLeagueUser(userData: Omit<LeagueUserData, 'id' | 'created_at' | 'updated_at'>): Promise<LeagueUserData> {
    this.queryStats.dbQueries++;

    try {
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
          fpl_integration_level: userData.fpl_integration_level
        })
        .select()
        .single();

      if (error) {
        this.queryStats.errors++;
        throw error;
      }

      // Invalidate cache for this user
      this.invalidateUserCache(userData.email, userData.tier);

      // Cache the new data
      const cacheKey = `user:${userData.email}:${userData.tier}`;
      this.setCache(cacheKey, data, this.DEFAULT_TTL);

      return data;
    } catch (error) {
      // console.error('Error saving user:', error);
      this.queryStats.errors++;
      throw error;
    }
  }

  /**
   * Get users by tier with caching
   */
  async getUsersByTier(tier: string): Promise<LeagueUserData[]> {
    const cacheKey = `users:tier:${tier}`;
    
    // Check cache
    const cached = this.getFromCache<LeagueUserData[]>(cacheKey);
    if (cached) {
      this.queryStats.cacheHits++;
      // console.log(`✅ Cache hit for tier ${tier}`);
      return cached;
    }

    this.queryStats.cacheMisses++;
    this.queryStats.dbQueries++;

    try {
      const { data, error } = await supabase
        .from('league_applicants')
        .select('*')
        .eq('tier', tier)
        .order('created_at', { ascending: false });

      if (error) {
        this.queryStats.errors++;
        throw error;
      }

      // Cache the results (shorter TTL for lists)
      this.setCache(cacheKey, data || [], this.DEFAULT_TTL / 2);

      return data || [];
    } catch (error) {
      // console.error('Error fetching users by tier:', error);
      this.queryStats.errors++;
      throw error;
    }
  }

  /**
   * Get users with FPL ID (for personalized emails)
   */
  async getUsersWithFplId(): Promise<LeagueUserData[]> {
    const cacheKey = 'users:with-fpl-id';
    
    const cached = this.getFromCache<LeagueUserData[]>(cacheKey);
    if (cached) {
      this.queryStats.cacheHits++;
      return cached;
    }

    this.queryStats.cacheMisses++;
    this.queryStats.dbQueries++;

    try {
      const { data, error } = await supabase
        .from('league_applicants')
        .select('*')
        .not('fpl_id', 'is', null)
        .neq('fpl_id', '')
        .order('created_at', { ascending: false });

      if (error) {
        this.queryStats.errors++;
        throw error;
      }

      // Cache for 5 minutes
      this.setCache(cacheKey, data || [], 5 * 60 * 1000);

      return data || [];
    } catch (error) {
      // console.error('Error fetching users with FPL ID:', error);
      this.queryStats.errors++;
      throw error;
    }
  }

  /**
   * Batch update users (optimized)
   */
  async batchUpdateUsers(updates: Array<{ email: string; tier: string; data: Partial<LeagueUserData> }>): Promise<void> {
    this.queryStats.dbQueries += updates.length;

    try {
      // Use Promise.all for parallel updates
      await Promise.all(
        updates.map(async ({ email, tier, data }) => {
          const { error } = await supabase
            .from('league_applicants')
            .update(data)
            .eq('email', email)
            .eq('tier', tier);

          if (error) {
            this.queryStats.errors++;
            // console.error(`Error updating user ${email}:`, error);
          } else {
            // Invalidate cache
            this.invalidateUserCache(email, tier);
          }
        })
      );
    } catch (error) {
      // console.error('Error in batch update:', error);
      this.queryStats.errors++;
      throw error;
    }
  }

  /**
   * Cache management
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private invalidateUserCache(email: string, tier: string): void {
    const cacheKey = `user:${email}:${tier}`;
    this.cache.delete(cacheKey);
    
    // Also invalidate tier list cache
    this.cache.delete(`users:tier:${tier}`);
    this.cache.delete('users:with-fpl-id');
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
    // console.log('🧹 Cache cleared');
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): number {
    let cleared = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleared++;
      }
    }

    if (cleared > 0) {
      // console.log(`🧹 Cleared ${cleared} expired cache entries`);
    }

    return cleared;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    missRate: number;
    dbQueries: number;
    errors: number;
  } {
    const totalRequests = this.queryStats.cacheHits + this.queryStats.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.queryStats.cacheHits / totalRequests) * 100 : 0;
    const missRate = totalRequests > 0 ? (this.queryStats.cacheMisses / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round(missRate * 100) / 100,
      dbQueries: this.queryStats.dbQueries,
      errors: this.queryStats.errors
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.queryStats = {
      cacheHits: 0,
      cacheMisses: 0,
      dbQueries: 0,
      errors: 0
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const stats = this.getCacheStats();
    const dbCallsSaved = this.queryStats.cacheHits;
    const savingsPercentage = stats.hitRate;

    return `
╔════════════════════════════════════════════════════════════╗
║         SUPABASE OPTIMIZATION REPORT                       ║
╚════════════════════════════════════════════════════════════╝

📊 CACHE PERFORMANCE:
   • Cache Size:       ${stats.size} entries
   • Hit Rate:         ${stats.hitRate}%
   • Miss Rate:        ${stats.missRate}%
   • DB Calls Saved:   ${dbCallsSaved}

📈 DATABASE QUERIES:
   • Total Queries:    ${stats.dbQueries}
   • Errors:           ${stats.errors}
   • Success Rate:     ${((stats.dbQueries - stats.errors) / stats.dbQueries * 100).toFixed(1)}%

💡 OPTIMIZATION IMPACT:
   • Queries Avoided:  ${dbCallsSaved}
   • Savings:          ${savingsPercentage.toFixed(1)}%
   • Performance:      ${stats.hitRate > 80 ? '✅ Excellent' : stats.hitRate > 50 ? '⚠️ Good' : '❌ Needs Improvement'}

╚════════════════════════════════════════════════════════════╝
    `;
  }

  /**
   * Start automatic cache cleanup (every 5 minutes)
   */
  startAutoCacheCleanup(): void {
    setInterval(() => {
      this.clearExpiredCache();
    }, 5 * 60 * 1000);

    // console.log('🔄 Auto cache cleanup started (every 5 minutes)');
  }
}

export const optimizedSupabaseService = new OptimizedSupabaseService();
export type { CacheEntry };


