// Hybrid Data Service - Multi-API fallback system
import { FPLApiClient } from '../api/FPLApiClient';
import { SmartCache } from '../cache/SmartCache';

export class HybridDataService {
  private fplClient: FPLApiClient;
  private cache: SmartCache;

  constructor() {
    this.fplClient = new FPLApiClient();
    this.cache = new SmartCache();
  }

  async getBootstrapData(): Promise<any> {
    return this.cache.getOrFetch(
      'bootstrap-static',
      () => this.fplClient.getBootstrapStatic(),
      {
        memoryTTL: 300, // 5 minutes
        dbTTL: 3600, // 1 hour
        apiSource: 'fpl'
      }
    );
  }

  async getPlayerData(playerId: number): Promise<any> {
    return this.cache.getOrFetch(
      `player-${playerId}`,
      () => this.fplClient.getPlayer(playerId),
      {
        memoryTTL: 300,
        dbTTL: 1800, // 30 minutes
        apiSource: 'fpl'
      }
    );
  }

  async getFixtures(): Promise<any> {
    return this.cache.getOrFetch(
      'fixtures',
      () => this.fplClient.getFixtures(),
      {
        memoryTTL: 600, // 10 minutes
        dbTTL: 3600,
        apiSource: 'fpl'
      }
    );
  }

  async getGameweekData(gameweek: number): Promise<any> {
    return this.cache.getOrFetch(
      `gameweek-${gameweek}`,
      () => this.fplClient.getGameweek(gameweek),
      {
        memoryTTL: 60, // 1 minute during live games
        dbTTL: 300, // 5 minutes
        apiSource: 'fpl'
      }
    );
  }

  async getTeamData(teamId: number): Promise<any> {
    return this.cache.getOrFetch(
      `team-${teamId}`,
      () => this.fplClient.getTeam(teamId),
      {
        memoryTTL: 300,
        dbTTL: 1800,
        apiSource: 'fpl'
      }
    );
  }

  async getLeagueData(leagueId: number): Promise<any> {
    return this.cache.getOrFetch(
      `league-${leagueId}`,
      () => this.fplClient.getLeague(leagueId),
      {
        memoryTTL: 300,
        dbTTL: 1800,
        apiSource: 'fpl'
      }
    );
  }

  async refreshCache(key: string): Promise<void> {
    await this.cache.delete(key);
  }

  async getCacheStats() {
    return this.cache.getStats();
  }
}


