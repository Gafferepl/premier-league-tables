// Multi-Layer Caching Service for FPL Data
// Ultra-Conservative Strategy Implementation

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  source: 'supabase' | 'memory' | 'api';
}

interface CacheConfig {
  bootstrap: number; // 4 hours
  fixtures: number;  // 6 hours  
  player_stats: number; // 2 hours
  live_data: number; // 5 minutes
  search_results: number; // 10 minutes
}

class FPLCacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_CONFIG: CacheConfig = {
    bootstrap: 4 * 60 * 60 * 1000,      // 4 hours
    fixtures: 6 * 60 * 60 * 1000,       // 6 hours
    player_stats: 2 * 60 * 60 * 1000,   // 2 hours
    live_data: 5 * 60 * 1000,            // 5 minutes
    search_results: 10 * 60 * 1000      // 10 minutes
  };

  // Generate cache key
  private getCacheKey(type: string, identifier?: string): string {
    return `fpl_cache_${type}${identifier ? `_${identifier}` : ''}`;
  }

  // Check if cache entry is valid
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() < entry.expiresAt;
  }

  // Get from memory cache
  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (entry && this.isValid(entry)) {
      return entry.data;
    }
    if (entry) {
      this.memoryCache.delete(key); // Clean expired entry
    }
    return null;
  }

  // Set in memory cache
  private setInMemory<T>(key: string, data: T, ttl: number, source: 'supabase' | 'api'): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      source
    };
    this.memoryCache.set(key, entry);
  }

  // Get from localStorage (persistent cache)
  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      if (this.isValid(entry)) {
        return entry.data;
      }
      localStorage.removeItem(key); // Clean expired entry
    } catch (error) {
      // console.warn('Failed to get from localStorage:', error);
      localStorage.removeItem(key);
    }
    return null;
  }

  // Set in localStorage
  private setInLocalStorage<T>(key: string, data: T, ttl: number, source: 'supabase' | 'api'): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        source
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      // console.warn('Failed to set in localStorage:', error);
    }
  }

  // Get cached data (multi-layer)
  async get<T>(type: keyof CacheConfig, identifier?: string): Promise<T | null> {
    const key = this.getCacheKey(type, identifier);

    // Layer 1: Memory cache (fastest)
    let data = this.getFromMemory<T>(key);
    if (data) {
      // console.log(`Cache hit (memory): ${key}`);
      return data;
    }

    // Layer 2: LocalStorage (persistent)
    data = this.getFromLocalStorage<T>(key);
    if (data) {
      // console.log(`Cache hit (localStorage): ${key}`);
      // Promote to memory cache for faster access
      this.setInMemory(key, data, this.CACHE_CONFIG[type], 'supabase');
      return data;
    }

    // console.log(`Cache miss: ${key}`);
    return null;
  }

  // Set cached data (multi-layer)
  async set<T>(type: keyof CacheConfig, data: T, identifier?: string, source: 'supabase' | 'api' = 'api'): Promise<void> {
    const key = this.getCacheKey(type, identifier);
    const ttl = this.CACHE_CONFIG[type];

    // Set in both layers
    this.setInMemory(key, data, ttl, source);
    this.setInLocalStorage(key, data, ttl, source);

    // console.log(`Cache set (${source}): ${key}`);
  }

  // Invalidate cache entry
  async invalidate(type: keyof CacheConfig, identifier?: string): Promise<void> {
    const key = this.getCacheKey(type, identifier);
    this.memoryCache.delete(key);
    localStorage.removeItem(key);
    // console.log(`Cache invalidated: ${key}`);
  }

  // Clear all cache
  async clear(): Promise<void> {
    this.memoryCache.clear();
    
    // Clear localStorage cache entries
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('fpl_cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    // console.log('All cache cleared');
  }

  // Get cache statistics
  getCacheStats() {
    const memoryEntries = Array.from(this.memoryCache.entries());
    const storageEntries = Object.keys(localStorage).filter(key => key.startsWith('fpl_cache_'));

    return {
      memory_cache: {
        entries: memoryEntries.length,
        valid_entries: memoryEntries.filter(([_, entry]) => this.isValid(entry)).length
      },
      localStorage_cache: {
        entries: storageEntries.length
      },
      total_cached_items: memoryEntries.length + storageEntries.length
    };
  }

  // Smart refresh based on data type
  async smartRefresh<T>(type: keyof CacheConfig, fetchFunction: () => Promise<T>, identifier?: string): Promise<T> {
    const cached = await this.get<T>(type, identifier);
    
    if (cached) {
      return cached;
    }

    // Cache miss - fetch fresh data
    try {
      const freshData = await fetchFunction();
      await this.set(type, freshData, identifier, 'api');
      return freshData;
    } catch (error) {
      // console.error('Failed to fetch fresh data:', error);
      // Return stale data if available
      if (cached) {
        // console.warn('Returning stale cache data due to fetch failure');
        return cached;
      }
      throw error;
    }
  }

  // Schedule-based cache refresh
  async scheduleRefresh(type: keyof CacheConfig, fetchFunction: () => Promise<any>, identifier?: string): Promise<void> {
    const key = this.getCacheKey(type, identifier);
    const entry = this.memoryCache.get(key);
    
    // Check if refresh is needed
    const needsRefresh = !entry || Date.now() > (entry.timestamp + (this.CACHE_CONFIG[type] * 0.8)); // Refresh at 80% of TTL
    
    if (needsRefresh) {
      try {
        const freshData = await fetchFunction();
        await this.set(type, freshData, identifier, 'api');
        // console.log(`Scheduled refresh completed: ${key}`);
      } catch (error) {
        // console.error(`Scheduled refresh failed: ${key}`, error);
      }
    }
  }

  // Live data handling (special case)
  async getLiveData<T>(fetchFunction: () => Promise<T>, identifier?: string): Promise<T | null> {
    const isMatchTime = this.isMatchTime();
    
    if (isMatchTime) {
      // During matches, use very short cache
      return this.smartRefresh('live_data', fetchFunction, identifier);
    } else {
      // Outside matches, use longer cache
      return this.get('player_stats', identifier);
    }
  }

  // Check if it's currently match time
  private isMatchTime(): boolean {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getUTCHours();
    
    // Weekend match times
    const isWeekendMatchDay = [0, 6].includes(dayOfWeek);
    const isWeekendMatchHour = (hour >= 14 && hour <= 17) || (hour >= 19 && hour <= 22);
    
    // Midweek match times  
    const isMidweekMatchDay = dayOfWeek === 3; // Wednesday
    const isMidweekMatchHour = hour >= 19 && hour <= 22;
    
    return (isWeekendMatchDay && isWeekendMatchHour) || (isMidweekMatchDay && isMidweekMatchHour);
  }
}

export const fplCacheService = new FPLCacheService();


