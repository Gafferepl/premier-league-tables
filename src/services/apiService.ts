// Multi-API Service Layer with FPL Primary and Backup APIs
import { Player, Fixture, LeagueTableEntry } from '../../types';
import { transformFPLFixture, transformFootballDataFixture, transformApiFootballFixture } from './dataTransformer';

// Rate limiting configuration (more lenient for testing)
const RATE_LIMITS = {
  static_data: 5 * 60 * 1000, // 5 minutes instead of 24 hours for testing
  live_data: 30 * 1000,      // 30 seconds instead of 3 minutes for testing
  fixtures: 5 * 60 * 1000,   // 5 minutes instead of 12 hours for testing
  standings: 2 * 60 * 1000,  // 2 minutes instead of 30 minutes for testing
  players: 5 * 60 * 1000     // 5 minutes instead of 6 hours for testing
};

// API endpoints configuration
const API_ENDPOINTS = {
  // Primary: FPL API (Official)
  primary: {
    base: 'http://localhost:3001/api',
    bootstrap:'/fpl/bootstrap-static',
    fixtures: '/fpl/fixtures',
    events: '/fpl/events',
    live: '/event/*/live/',
    elementSummary: '/element-summary/{id}/',
    league: '/leagues-classic/{id}/standings/',
    entry: '/entry/{id}/',
    entryHistory: '/entry/{id}/history/'
  },
  // Backup 1: Football-Data.org
  backup1: {
    base: 'https://api.football-data.org/v4',
    competitions: '/competitions/PL/matches',
    teams: '/competitions/PL/teams',
    standings: '/competitions/PL/standings',
    matches: '/matches'
  },
  // Backup 2: API-Football
  backup2: {
    base: 'https://v3.football.api-sports.io',
    fixtures: '/fixtures?league=39&season=2024',
    teams: '/teams?league=39&season=2024',
    standings: '/standings?league=39&season=2024',
    players: '/players?league=39&season=2024'
  }
};

// Debug: Log the API endpoints
// console.log('🔍 API Endpoints loaded:', API_ENDPOINTS.primary);
// console.log('🔍 Fixtures URL:', API_ENDPOINTS.primary.base + API_ENDPOINTS.primary.fixtures);

// Cache management
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Rate limiting tracker
class RateLimiter {
  private lastCalls = new Map<string, number>();

  canMakeCall(endpoint: string): boolean {
    const now = Date.now();
    const lastCall = this.lastCalls.get(endpoint) || 0;
    const rateLimit = RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS] || RATE_LIMITS.static_data;
    
    if (now - lastCall >= rateLimit) {
      this.lastCalls.set(endpoint, now);
      return true;
    }
    
    return false;
  }

  getNextCallTime(endpoint: string): number {
    const lastCall = this.lastCalls.get(endpoint) || 0;
    const rateLimit = RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS] || RATE_LIMITS.static_data;
    return lastCall + rateLimit;
  }
}

// API Health Monitor
class HealthMonitor {
  private health = new Map<string, { healthy: boolean; lastCheck: number; errorCount: number }>();
  
  markHealthy(api: string): void {
    this.health.set(api, {
      healthy: true,
      lastCheck: Date.now(),
      errorCount: 0
    });
  }

  markUnhealthy(api: string): void {
    const current = this.health.get(api) || { healthy: true, lastCheck: 0, errorCount: 0 };
    this.health.set(api, {
      healthy: false,
      lastCheck: Date.now(),
      errorCount: current.errorCount + 1
    });
  }

  isHealthy(api: string): boolean {
    const status = this.health.get(api);
    return status ? status.healthy : true; // Assume healthy if no data
  }

  getHealthyApis(): string[] {
    return Array.from(this.health.entries())
      .filter(([_, status]) => status.healthy)
      .map(([api, _]) => api);
  }
}

// Main API Service
class ApiService {
  private cache = new CacheManager();
  private rateLimiter = new RateLimiter();
  private healthMonitor = new HealthMonitor();
  private apiKeys = {
    footballData: import.meta.env.VITE_FOOTBALL_DATA_API_KEY || '',
    apiFootball: import.meta.env.VITE_API_FOOTBALL_KEY || ''
  };

  constructor() {
    // Initialize all APIs as healthy
    this.healthMonitor.markHealthy('primary');
    this.healthMonitor.markHealthy('backup1');
    this.healthMonitor.markHealthy('backup2');
  }

  // Primary FPL API calls
  private async callFPLApi(endpoint: string, useCache = true): Promise<any> {
    const cacheKey = `fpl_${endpoint}`;
    
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    if (!this.rateLimiter.canMakeCall(endpoint)) {
      // console.log(`Rate limit exceeded for ${endpoint}. Using cache or waiting...`);
      // For testing, we'll allow more frequent calls
      // throw new Error(`Rate limit exceeded for ${endpoint}. Next call at ${new Date(this.rateLimiter.getNextCallTime(endpoint))}`);
    }

    try {
      const base = API_ENDPOINTS.primary.base;
      const endpointPath = API_ENDPOINTS.primary.fixtures;
      const cacheBuster = Date.now();
      const fullUrl = `${base}${endpointPath}?_=${cacheBuster}`;
      // console.log(`🔄 Calling FPL API: ${endpoint}`);
      // console.log(`🔗 Base URL: ${base}`);
      // console.log(`🔗 Endpoint Path: ${endpointPath}`);
      // console.log(`🔗 Full URL: ${fullUrl}`);
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`FPL API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log(`✅ FPL API success: ${endpoint}`, data);
      
      this.cache.set(cacheKey, data, RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS] || RATE_LIMITS.static_data);
      this.healthMonitor.markHealthy('primary');
      
      return data;
    } catch (error) {
      // console.error(`❌ FPL API failed: ${endpoint}`, error);
      this.healthMonitor.markUnhealthy('primary');
      throw error;
    }
  }

  // Backup 1: Football-Data.org
  private async callBackup1(endpoint: string, useCache = true): Promise<any> {
    const cacheKey = `backup1_${endpoint}`;
    
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const headers = {
        'X-Auth-Token': this.apiKeys.footballData
      };

      const response = await fetch(`${API_ENDPOINTS.backup1.base}${endpoint}`, { headers });
      
      if (!response.ok) {
        throw new Error(`Backup1 API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, data, RATE_LIMITS.static_data);
      this.healthMonitor.markHealthy('backup1');
      
      return data;
    } catch (error) {
      this.healthMonitor.markUnhealthy('backup1');
      throw error;
    }
  }

  // Backup 2: API-Football
  private async callBackup2(endpoint: string, useCache = true): Promise<any> {
    const cacheKey = `backup2_${endpoint}`;
    
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const headers = {
        'x-apisports-key': this.apiKeys.apiFootball
      };

      const response = await fetch(`${API_ENDPOINTS.backup2.base}${endpoint}`, { headers });
      
      if (!response.ok) {
        throw new Error(`Backup2 API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, data, RATE_LIMITS.static_data);
      this.healthMonitor.markHealthy('backup2');
      
      return data;
    } catch (error) {
      this.healthMonitor.markUnhealthy('backup2');
      throw error;
    }
  }

  // Fallback logic with multiple APIs
  private async fetchWithFallback<T>(
    primaryCall: () => Promise<T>,
    backup1Call: () => Promise<T>,
    backup2Call: () => Promise<T>,
    cacheKey: string
  ): Promise<T> {
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const errors: Error[] = [];

    // Try primary API
    if (this.healthMonitor.isHealthy('primary')) {
      try {
        const result = await primaryCall();
        return result;
      } catch (error) {
        errors.push(error as Error);
        // console.warn('Primary API failed, trying backup 1:', error);
      }
    }

    // Try backup 1
    if (this.healthMonitor.isHealthy('backup1')) {
      try {
        const result = await backup1Call();
        return result;
      } catch (error) {
        errors.push(error as Error);
        // console.warn('Backup 1 API failed, trying backup 2:', error);
      }
    }

    // Try backup 2
    if (this.healthMonitor.isHealthy('backup2')) {
      try {
        const result = await backup2Call();
        return result;
      } catch (error) {
        errors.push(error as Error);
        // console.warn('Backup 2 API failed:', error);
      }
    }

    // All APIs failed, return cached data if available
    const staleCache = this.cache.get(cacheKey);
    if (staleCache) {
      // console.warn('All APIs failed, returning stale cache data');
      return staleCache;
    }

    // No data available
    throw new Error(`All APIs failed: ${errors.map(e => e.message).join(', ')}`);
  }

  // Public API methods
  async getBootstrapData(): Promise<any> {
    return this.fetchWithFallback(
      () => this.callFPLApi('bootstrap-static'),
      () => this.callBackup1('/competitions/PL/teams'),
      () => this.callBackup2('/teams?league=39'),
      'bootstrap_data'
    );
  }

  async getCurrentGameweek(): Promise<number> {
    try {
      const bootstrapData = await this.getBootstrapData();
      // Find the current event (gameweek)
      const currentEvent = bootstrapData.events?.find((event: any) => 
        event.is_current || (event.finished && !event.is_next && !event.is_previous)
      );
      
      if (currentEvent) {
        // console.log('🎯 Current gameweek from FPL:', currentEvent.id);
        return currentEvent.id;
      }
      
      // If no current event, find the next upcoming one
      const nextEvent = bootstrapData.events?.find((event: any) => event.is_next);
      if (nextEvent) {
        // console.log('🔮 Next gameweek from FPL:', nextEvent.id);
        return nextEvent.id;
      }
      
      // Fallback to latest event
      const latestEvent = bootstrapData.events?.[bootstrapData.events.length - 1];
      if (latestEvent) {
        // console.log('📅 Latest gameweek from FPL:', latestEvent.id);
        return latestEvent.id;
      }
      
      // console.warn('⚠️ Could not determine gameweek from FPL, calculating manually...');
      
      // Manual calculation fallback
      const now = new Date();
      const seasonStart = new Date(2024, 7, 16); // August 16, 2024 (approximate start)
      const weeksPassed = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const calculatedGameweek = Math.max(1, Math.min(38, weeksPassed + 1));
      
      // console.log('📅 Calculated gameweek:', calculatedGameweek);
      return calculatedGameweek;
      
    } catch (error) {
      // console.error('❌ Failed to get current gameweek:', error);
      
      // Final fallback - manual calculation
      const now = new Date();
      const seasonStart = new Date(2024, 7, 16); // August 16, 2024
      const weeksPassed = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const calculatedGameweek = Math.max(1, Math.min(38, weeksPassed + 1));
      
      // console.log('📅 Emergency calculated gameweek:', calculatedGameweek);
      return calculatedGameweek;
    }
  }

  async getFixtures(): Promise<Fixture[]> {
    try {
      const rawData = await this.fetchWithFallback(
        () => this.callFPLApi('fixtures'),
        () => this.callBackup1('/competitions/PL/matches'),
        () => this.callBackup2('/fixtures?league=39&season=2024'),
        'fixtures'
      );
      
      // Transform the data based on which API provided it
      if (Array.isArray(rawData)) {
        // Try to detect which API format we have and transform accordingly
        if (rawData.length > 0 && rawData[0].team_h !== undefined) {
          // FPL format
          return rawData.map(transformFPLFixture);
        } else if (rawData.length > 0 && rawData[0].homeTeam !== undefined) {
          // Football-Data.org format
          return rawData.map(transformFootballDataFixture);
        } else if (rawData.length > 0 && rawData[0].teams !== undefined) {
          // API-Football format
          return rawData.map(transformApiFootballFixture);
        }
      }
      
      return rawData; // Return as-is if we can't determine format
    } catch (error) {
      // console.error('❌ Error in getFixtures:', error);
      throw error;
    }
  }

  async getLiveScores(eventId?: number): Promise<any> {
    const endpoint = eventId ? `event/${eventId}/live/` : 'live';
    return this.fetchWithFallback(
      () => this.callFPLApi(endpoint, false), // No cache for live data
      () => this.callBackup1('/matches?status=LIVE'),
      () => this.callBackup2('/fixtures?live=all'),
      `live_scores_${eventId || 'current'}`
    );
  }

  async getStandings(): Promise<LeagueTableEntry[]> {
    return this.fetchWithFallback(
      () => this.callFPLApi('events'),
      () => this.callBackup1('/competitions/PL/standings'),
      () => this.callBackup2('/standings?league=39&season=2024'),
      'standings'
    );
  }

  async getPlayerData(playerId: number): Promise<Player> {
    return this.fetchWithFallback(
      () => this.callFPLApi(`element-summary/${playerId}/`),
      () => this.callBackup1(`/players/${playerId}`),
      () => this.callBackup2(`/players?id=${playerId}`),
      `player_${playerId}`
    );
  }

  // Utility methods
  getApiHealth(): Record<string, boolean> {
    return {
      primary: this.healthMonitor.isHealthy('primary'),
      backup1: this.healthMonitor.isHealthy('backup1'),
      backup2: this.healthMonitor.isHealthy('backup2')
    };
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size(),
      keys: Array.from((this.cache as any).cache.keys())
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Rate limit info
  getNextCallTimes(): Record<string, string> {
    return {
      static_data: new Date(this.rateLimiter.getNextCallTime('static_data')).toLocaleTimeString(),
      live_data: new Date(this.rateLimiter.getNextCallTime('live_data')).toLocaleTimeString(),
      fixtures: new Date(this.rateLimiter.getNextCallTime('fixtures')).toLocaleTimeString(),
      standings: new Date(this.rateLimiter.getNextCallTime('standings')).toLocaleTimeString(),
      players: new Date(this.rateLimiter.getNextCallTime('players')).toLocaleTimeString()
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;


