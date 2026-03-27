// Enterprise-Grade User Team Cache Service
// Ultra-safe caching to prevent FPL API bans with 100,000+ users

interface CachedUserTeam {
  fplId: string;
  teamData: any;
  lastUpdated: Date;
  expiresAt: Date;
  gameweek: number;
  isStale: boolean;
  fetchAttempts: number;
  lastError?: string;
}

interface CacheStats {
  totalCached: number;
  freshCache: number;
  staleCache: number;
  hitRate: number;
  missRate: number;
  apiCallsSaved: number;
}

class UserTeamCacheService {
  private cache = new Map<string, CachedUserTeam>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly STALE_THRESHOLD = 12 * 60 * 60 * 1000; // 12 hours (warn if stale)
  private readonly MAX_FETCH_ATTEMPTS = 3;
  
  private stats = {
    cacheHits: 0,
    cacheMisses: 0,
    apiCalls: 0,
    apiCallsSaved: 0
  };

  // Get user team from cache or mark for refresh
  async getUserTeam(fplId: string, currentGameweek: number): Promise<any | null> {
    const cached = this.cache.get(fplId);
    
    // Cache hit - return fresh data
    if (cached && this.isFresh(cached) && cached.gameweek === currentGameweek) {
      this.stats.cacheHits++;
      this.stats.apiCallsSaved++;
      // console.log(`✅ Cache HIT for user ${fplId} (fresh, GW${currentGameweek})`);
      return cached.teamData;
    }
    
    // Cache miss or stale
    if (cached && this.isStale(cached)) {
      // console.log(`⚠️ Cache STALE for user ${fplId} (age: ${this.getAge(cached)}h)`);
    } else {
      // console.log(`❌ Cache MISS for user ${fplId}`);
    }
    
    this.stats.cacheMisses++;
    
    // Return stale data if available (better than nothing)
    if (cached) {
      // console.log(`📦 Returning stale cache for ${fplId} (will refresh in background)`);
      return cached.teamData;
    }
    
    return null;
  }

  // Set user team in cache
  setCachedTeam(fplId: string, teamData: any, gameweek: number): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CACHE_DURATION);
    
    this.cache.set(fplId, {
      fplId,
      teamData,
      lastUpdated: now,
      expiresAt,
      gameweek,
      isStale: false,
      fetchAttempts: 0
    });
    
    // console.log(`💾 Cached team for ${fplId} (expires: ${expiresAt.toISOString()})`);
  }

  // Mark cache entry as failed fetch
  markFetchFailed(fplId: string, error: string): void {
    const cached = this.cache.get(fplId);
    if (cached) {
      cached.fetchAttempts++;
      cached.lastError = error;
      cached.isStale = true;
      this.cache.set(fplId, cached);
    }
  }

  // Get users needing refresh (prioritized)
  getUsersNeedingRefresh(allFplIds: string[], currentGameweek: number): string[] {
    const needsRefresh: Array<{ fplId: string; priority: number }> = [];
    
    for (const fplId of allFplIds) {
      const cached = this.cache.get(fplId);
      
      // No cache - highest priority
      if (!cached) {
        needsRefresh.push({ fplId, priority: 1 });
        continue;
      }
      
      // Expired cache - high priority
      if (this.isExpired(cached)) {
        needsRefresh.push({ fplId, priority: 2 });
        continue;
      }
      
      // Wrong gameweek - high priority
      if (cached.gameweek !== currentGameweek) {
        needsRefresh.push({ fplId, priority: 3 });
        continue;
      }
      
      // Stale cache - medium priority
      if (this.isStale(cached)) {
        needsRefresh.push({ fplId, priority: 4 });
        continue;
      }
      
      // Failed fetches - retry with lower priority
      if (cached.fetchAttempts > 0 && cached.fetchAttempts < this.MAX_FETCH_ATTEMPTS) {
        needsRefresh.push({ fplId, priority: 5 });
        continue;
      }
    }
    
    // Sort by priority (lower number = higher priority)
    needsRefresh.sort((a, b) => a.priority - b.priority);
    
    return needsRefresh.map(item => item.fplId);
  }

  // Check if cache is fresh
  private isFresh(cached: CachedUserTeam): boolean {
    const age = Date.now() - cached.lastUpdated.getTime();
    return age < this.CACHE_DURATION && !cached.isStale;
  }

  // Check if cache is stale (but not expired)
  private isStale(cached: CachedUserTeam): boolean {
    const age = Date.now() - cached.lastUpdated.getTime();
    return age > this.STALE_THRESHOLD || cached.isStale;
  }

  // Check if cache is expired
  private isExpired(cached: CachedUserTeam): boolean {
    return Date.now() > cached.expiresAt.getTime();
  }

  // Get cache age in hours
  private getAge(cached: CachedUserTeam): number {
    const age = Date.now() - cached.lastUpdated.getTime();
    return Math.round(age / (60 * 60 * 1000));
  }

  // Get cache statistics
  getStats(): CacheStats {
    const totalCached = this.cache.size;
    let freshCache = 0;
    let staleCache = 0;
    
    for (const cached of this.cache.values()) {
      if (this.isFresh(cached)) {
        freshCache++;
      } else if (this.isStale(cached)) {
        staleCache++;
      }
    }
    
    const totalRequests = this.stats.cacheHits + this.stats.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.stats.cacheHits / totalRequests) * 100 : 0;
    const missRate = totalRequests > 0 ? (this.stats.cacheMisses / totalRequests) * 100 : 0;
    
    return {
      totalCached,
      freshCache,
      staleCache,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round(missRate * 100) / 100,
      apiCallsSaved: this.stats.apiCallsSaved
    };
  }

  // Clear expired cache entries
  clearExpired(): number {
    let cleared = 0;
    const now = Date.now();
    
    for (const [fplId, cached] of this.cache.entries()) {
      if (now > cached.expiresAt.getTime()) {
        this.cache.delete(fplId);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      // console.log(`🧹 Cleared ${cleared} expired cache entries`);
    }
    
    return cleared;
  }

  // Export cache for persistence
  exportCache(): string {
    const cacheArray = Array.from(this.cache.entries()).map(([fplId, data]) => ({
      fplId,
      ...data,
      lastUpdated: data.lastUpdated.toISOString(),
      expiresAt: data.expiresAt.toISOString()
    }));
    
    return JSON.stringify(cacheArray);
  }

  // Import cache from persistence
  importCache(cacheJson: string): number {
    try {
      const cacheArray = JSON.parse(cacheJson);
      let imported = 0;
      
      for (const item of cacheArray) {
        // Only import non-expired entries
        const expiresAt = new Date(item.expiresAt);
        if (Date.now() < expiresAt.getTime()) {
          this.cache.set(item.fplId, {
            fplId: item.fplId,
            teamData: item.teamData,
            lastUpdated: new Date(item.lastUpdated),
            expiresAt,
            gameweek: item.gameweek,
            isStale: item.isStale,
            fetchAttempts: item.fetchAttempts || 0,
            lastError: item.lastError
          });
          imported++;
        }
      }
      
      // console.log(`📥 Imported ${imported} cache entries from persistence`);
      return imported;
    } catch (error) {
      // console.error('❌ Failed to import cache:', error);
      return 0;
    }
  }

  // Reset statistics
  resetStats(): void {
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      apiCallsSaved: 0
    };
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
    this.resetStats();
    // console.log('🧹 Cache cleared completely');
  }
}

export const userTeamCacheService = new UserTeamCacheService();
export type { CachedUserTeam, CacheStats };


