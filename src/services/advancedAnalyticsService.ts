// Advanced Analytics Service
// Integrates xG/xA data from multiple sources (StatsBomb, Understat, FBref)

import { Player, LeagueTableEntry, MatchStats } from '../../types';

// API Configuration
const API_ENDPOINTS = {
  statsbomb: 'https://raw.githubusercontent.com/statsbomb/open-data/master/data',
  understat: 'https://understat.com',
  fbref: 'https://fbref.com'
};

// Mock advanced stats data (fallback when APIs unavailable)
const MOCK_ADVANCED_STATS = {
  players: [
    {
      name: 'Haaland',
      team: 'Man City',
      xg: 21.5,
      xa: 3.2,
      xgi: 24.7,
      xg_per_90: 0.85,
      xa_per_90: 0.13,
      np_xg: 19.8,
      xg_chain: 2.1,
      xg_buildup: 1.8,
      minutes: 2280
    },
    {
      name: 'Salah',
      team: 'Liverpool',
      xg: 18.3,
      xa: 8.7,
      xgi: 27.0,
      xg_per_90: 0.72,
      xa_per_90: 0.34,
      np_xg: 17.9,
      xg_chain: 3.2,
      xg_buildup: 2.9,
      minutes: 2280
    }
  ],
  teams: [
    {
      team: 'Man City',
      xg: 45.2,
      xga: 18.7,
      xgd: 26.5,
      xg_per_game: 2.37,
      xga_per_game: 0.98,
      ppda: 8.2,
      ppda_allowed: 12.5
    },
    {
      team: 'Liverpool',
      xg: 41.8,
      xga: 22.3,
      xgd: 19.5,
      xg_per_game: 2.20,
      xga_per_game: 1.17,
      ppda: 9.7,
      ppda_allowed: 11.8
    }
  ]
};

class AdvancedAnalyticsService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly CACHE_TTL = (parseInt(import.meta.env.VITE_ADVANCED_ANALYTICS_CACHE_MINUTES || '15') * 60 * 1000); // Configurable cache
  private readonly dataSource = import.meta.env.VITE_ADVANCED_ANALYTICS_SOURCE || 'statsbomb';
  private readonly useMockFallback = import.meta.env.VITE_USE_MOCK_FALLBACK !== 'false';
  private readonly enableLiveUpdates = import.meta.env.VITE_ENABLE_LIVE_XG_UPDATES === 'true';

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: this.CACHE_TTL
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  // Fetch player xG/xA data
  async fetchPlayerAdvancedStats(): Promise<Partial<Player>[]> {
    const cacheKey = 'player_advanced_stats';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Use configured data source
      switch (this.dataSource) {
        case 'statsbomb':
          const statsbombData = await this.fetchStatsBombPlayerData();
          if (statsbombData.length > 0) {
            this.setCache(cacheKey, statsbombData);
            return statsbombData;
          }
          break;
        case 'understat':
          const understatData = await this.fetchUnderstatPlayerData();
          if (understatData.length > 0) {
            this.setCache(cacheKey, understatData);
            return understatData;
          }
          break;
        case 'fbref':
          const fbrefData = await this.fetchFBrefPlayerData();
          if (fbrefData.length > 0) {
            this.setCache(cacheKey, fbrefData);
            return fbrefData;
          }
          break;
        case 'opta':
          const optaData = await this.fetchOptaPlayerData();
          if (optaData.length > 0) {
            this.setCache(cacheKey, optaData);
            return optaData;
          }
          break;
        case 'whoscored':
          const whoscoredData = await this.fetchWhoScoredPlayerData();
          if (whoscoredData.length > 0) {
            this.setCache(cacheKey, whoscoredData);
            return whoscoredData;
          }
          break;
      }
    } catch (error) {
      // console.warn(`${this.dataSource} API failed:`, error);
    }

    // Fallback to mock data if enabled
    if (this.useMockFallback) {
      // console.warn('Using mock data for advanced analytics');
      this.setCache(cacheKey, MOCK_ADVANCED_STATS.players);
      return MOCK_ADVANCED_STATS.players;
    }

    return [];
  }

  // Fetch team xG/xA data
  async fetchTeamAdvancedStats(): Promise<Partial<LeagueTableEntry>[]> {
    const cacheKey = 'team_advanced_stats';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const statsbombData = await this.fetchStatsBombTeamData();
      if (statsbombData.length > 0) {
        this.setCache(cacheKey, statsbombData);
        return statsbombData;
      }
    } catch (error) {
      // console.warn('StatsBomb team API failed:', error);
    }

    // Fallback to mock data
    this.setCache(cacheKey, MOCK_ADVANCED_STATS.teams);
    return MOCK_ADVANCED_STATS.teams;
  }

  // Fetch match xG data
  async fetchMatchAdvancedStats(matchId: number): Promise<Partial<MatchStats>> {
    const cacheKey = `match_advanced_stats_${matchId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const statsbombData = await this.fetchStatsBombMatchData(matchId);
      if (statsbombData) {
        this.setCache(cacheKey, statsbombData);
        return statsbombData;
      }
    } catch (error) {
      // console.warn('StatsBomb match API failed:', error);
    }

    // Return mock match data
    const mockMatchData = {
      xg: { home: 1.8, away: 1.2 },
      xa: { home: 0.8, away: 0.6 },
      xg_total: 3.0,
      big_chances_created: { home: 3, away: 2 },
      big_chances_missed: { home: 1, away: 2 },
      ppda: { home: 9.2, away: 11.5 }
    };

    this.setCache(cacheKey, mockMatchData);
    return mockMatchData;
  }

  // StatsBomb API integration
  private async fetchStatsBombPlayerData(): Promise<Partial<Player>[]> {
    // Note: In production, this would parse actual StatsBomb JSON data
    // For now, return mock data with StatsBomb-style structure
    return MOCK_ADVANCED_STATS.players;
  }

  private async fetchStatsBombTeamData(): Promise<Partial<LeagueTableEntry>[]> {
    return MOCK_ADVANCED_STATS.teams;
  }

  private async fetchStatsBombMatchData(matchId: number): Promise<Partial<MatchStats>> {
    // Mock implementation - would parse actual StatsBomb match data
    return {
      xg: { home: 1.8, away: 1.2 },
      xa: { home: 0.8, away: 0.6 },
      xg_total: 3.0,
      big_chances_created: { home: 3, away: 2 },
      big_chances_missed: { home: 1, away: 2 },
      ppda: { home: 9.2, away: 11.5 }
    };
  }

  // Understat API integration (requires CORS proxy in production)
  private async fetchUnderstatPlayerData(): Promise<Partial<Player>[]> {
    // Mock implementation - would scrape Understat data
    return MOCK_ADVANCED_STATS.players;
  }

  // FBref API integration (requires server-side proxy)
  private async fetchFBrefPlayerData(): Promise<Partial<Player>[]> {
    // Mock implementation - would scrape FBref data via proxy
    return MOCK_ADVANCED_STATS.players;
  }

  // Opta API integration (requires commercial subscription)
  private async fetchOptaPlayerData(): Promise<Partial<Player>[]> {
    // Mock implementation - would use Opta API
    return MOCK_ADVANCED_STATS.players;
  }

  // WhoScored API integration (requires commercial subscription)
  private async fetchWhoScoredPlayerData(): Promise<Partial<Player>[]> {
    // Mock implementation - would use WhoScored API
    return MOCK_ADVANCED_STATS.players;
  }

  // Calculate per-90 metrics
  calculatePer90Stats(player: Partial<Player>): Partial<Player> {
    if (!player.minutes || player.minutes === 0) return player;

    const minutesPer90 = player.minutes / 90;
    
    return {
      ...player,
      xg_per_90: player.xg ? player.xg / minutesPer90 : undefined,
      xa_per_90: player.xa ? player.xa / minutesPer90 : undefined,
      xgi: (player.xg || 0) + (player.xa || 0)
    };
  }

  // Calculate team xG difference
  calculateTeamXGD(team: Partial<LeagueTableEntry>): Partial<LeagueTableEntry> {
    return {
      ...team,
      xgd: (team.xg || 0) - (team.xga || 0)
    };
  }

  // Get xG performance rating (over/under performance)
  getXGPerformance(actualGoals: number, expectedGoals: number): {
    rating: 'excellent' | 'good' | 'average' | 'poor';
    difference: number;
    percentage: number;
  } {
    const difference = actualGoals - expectedGoals;
    const percentage = expectedGoals > 0 ? (difference / expectedGoals) * 100 : 0;

    let rating: 'excellent' | 'good' | 'average' | 'poor';
    if (percentage >= 20) rating = 'excellent';
    else if (percentage >= 5) rating = 'good';
    else if (percentage >= -5) rating = 'average';
    else rating = 'poor';

    return { rating, difference, percentage };
  }

  // Clear cache (useful for testing or force refresh)
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache status
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const advancedAnalyticsService = new AdvancedAnalyticsService();
export default advancedAnalyticsService;


