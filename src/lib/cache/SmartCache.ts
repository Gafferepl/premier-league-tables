// Smart Cache - Multi-layer caching system
import { MemoryCache } from './MemoryCache';
import { SupabaseCache } from './SupabaseCache';

export class SmartCache {
  private memoryCache: MemoryCache;
  private supabaseCache: SupabaseCache;

  constructor() {
    this.memoryCache = new MemoryCache();
    this.supabaseCache = new SupabaseCache();
  }

  async getOrFetch(
    key: string,
    fetchFn: () => Promise<any>,
    options: {
      memoryTTL?: number;
      dbTTL?: number;
      apiSource?: string;
    } = {}
  ): Promise<any> {
    const { memoryTTL = 300, dbTTL = 3600, apiSource = 'fpl' } = options;

    // L1: Try memory cache (fastest)
    const memoryData = this.memoryCache.get(key);
    if (memoryData !== null) {
      await this.trackCacheHit(key, 'memory');
      return memoryData;
    }

    // L2: Try Supabase cache (medium)
    const dbData = await this.supabaseCache.get(key);
    if (dbData !== null) {
      this.memoryCache.set(key, dbData, memoryTTL);
      await this.trackCacheHit(key, 'database');
      return dbData;
    }

    // L3: Fetch fresh data
    try {
      const freshData = await fetchFn();
      
      // Cache in all layers
      await this.setAllLayers(key, freshData, memoryTTL, dbTTL, apiSource);
      await this.trackCacheHit(key, 'api');
      
      return freshData;
    } catch (error) {
      // console.error('Failed to fetch fresh data:', error);
      
      // Try stale cache as last resort
      const staleData = await this.supabaseCache.getStale(key);
      if (staleData) {
        await this.trackCacheHit(key, 'stale');
        return staleData;
      }
      
      throw error;
    }
  }

  async set(
    key: string,
    data: any,
    memoryTTL: number = 300,
    dbTTL: number = 3600,
    apiSource: string = 'fpl'
  ): Promise<void> {
    await this.setAllLayers(key, data, memoryTTL, dbTTL, apiSource);
  }

  private async setAllLayers(
    key: string,
    data: any,
    memoryTTL: number,
    dbTTL: number,
    apiSource: string
  ): Promise<void> {
    this.memoryCache.set(key, data, memoryTTL);
    await this.supabaseCache.set(key, data, dbTTL, apiSource);
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.supabaseCache.delete(key);
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.supabaseCache.clear();
  }

  async getStale(key: string): Promise<any | null> {
    return await this.supabaseCache.getStale(key);
  }

  private async trackCacheHit(key: string, layer: string): Promise<void> {
    // Track cache performance for monitoring
    try {
      const supabase = this.supabaseCache['supabase'];
      await supabase.from('cache_metrics').insert({
        cache_key: key,
        hit: true,
        layer,
        response_time: 0,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      // Silently fail - don't break cache functionality
    }
  }

  async getStats() {
    const memoryStats = this.memoryCache.getStats();
    const dbStats = await this.supabaseCache.getStats();
    
    return {
      memory: memoryStats,
      database: dbStats
    };
  }

  async cleanExpired(): Promise<void> {
    await this.supabaseCache.cleanExpired();
  }
}


