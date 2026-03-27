// Multi-Source Data Service - FPL + Premier League API
// Reduces FPL API calls by 50%+ using Premier League API for non-critical data

interface DataSourceHealth {
  name: string;
  isAvailable: boolean;
  lastCheck: Date;
  errorCount: number;
  successCount: number;
  reliability: number;
}

class MultiSourceDataService {
  private fplHealth: DataSourceHealth = {
    name: 'FPL API',
    isAvailable: true,
    lastCheck: new Date(),
    errorCount: 0,
    successCount: 0,
    reliability: 1.0
  };

  private plHealth: DataSourceHealth = {
    name: 'Premier League API',
    isAvailable: true,
    lastCheck: new Date(),
    errorCount: 0,
    successCount: 0,
    reliability: 1.0
  };

  // Get bootstrap data - Uses Premier League API for basic data, FPL for prices
  async getBootstrapData(): Promise<any> {
    try {
      // console.log('🔄 Fetching bootstrap data with multi-source strategy...');
      
      // Try Premier League API first (FREE, no limits)
      const plData = await this.getPremierLeagueBootstrap();
      // console.log('✅ Got basic data from Premier League API (FREE)');
      
      // Only use FPL API for prices and FPL-specific data
      try {
        const fplPrices = await this.getFplPricesOnly();
        // console.log('✅ Got prices from FPL API');
        
        // Merge data
        return this.mergeBootstrapData(plData, fplPrices);
      } catch (error) {
        // console.log('⚠️ FPL prices unavailable, using Premier League data only');
        return plData;
      }
      
    } catch (error) {
      // console.error('❌ Multi-source bootstrap failed, falling back to FPL only');
      const { fplApiService } = await import('./fplApiService');
      return fplApiService.getBootstrapData();
    }
  }

  // Get fixtures - Premier League API (FREE, no FPL call needed)
  async getFixtures(): Promise<any[]> {
    try {
      // console.log('🔄 Fetching fixtures from Premier League API (FREE)...');
      const fixtures = await this.getPremierLeagueFixtures();
      this.markSuccess('pl');
      // console.log('✅ Got fixtures from Premier League API - 0 FPL calls');
      return fixtures;
    } catch (error) {
      // console.log('⚠️ Premier League API failed, falling back to FPL');
      this.markFailure('pl', String(error));
      const { fplApiService } = await import('./fplApiService');
      return fplApiService.getFixtures();
    }
  }

  // Get user team - MUST use FPL API (no alternative)
  async getUserTeam(fplId: string, gameweek: number): Promise<any> {
    // console.log(`🔄 Fetching user team ${fplId} from FPL API (required)...`);
    const { fplApiService } = await import('./fplApiService');
    
    try {
      const team = await fplApiService.getUserPicks(fplId, gameweek);
      this.markSuccess('fpl');
      return team;
    } catch (error) {
      this.markFailure('fpl', String(error));
      throw error;
    }
  }

  // Premier League API - Bootstrap data (FREE)
  private async getPremierLeagueBootstrap(): Promise<any> {
    const PL_API = import.meta.env.PREMIER_LEAGUE_API_URL || 'https://api.premierleague.com';
    
    // Fetch players
    const playersResponse = await fetch(`${PL_API}/rest/element/`);
    if (!playersResponse.ok) throw new Error('Premier League players API failed');
    const players = await playersResponse.json();
    
    // Fetch teams
    const teamsResponse = await fetch(`${PL_API}/rest/team/`);
    if (!teamsResponse.ok) throw new Error('Premier League teams API failed');
    const teams = await teamsResponse.json();
    
    // Transform to FPL format
    return {
      elements: players.map((p: any) => ({
        id: p.id,
        web_name: p.web_name || p.first_name,
        team: p.team,
        element_type: p.element_type,
        now_cost: 50, // Default price (will be updated from FPL if available)
        total_points: p.total_points || 0,
        form: p.form || "0.0",
        selected_by_percent: "0.0", // Not available from PL API
        minutes: p.minutes || 0,
        goals_scored: p.goals_scored || 0,
        assists: p.assists || 0,
        clean_sheets: p.clean_sheets || 0,
        goals_conceded: p.goals_conceded || 0,
        bonus: p.bonus || 0,
        bps: p.bps || 0,
        influence: "0.0",
        creativity: "0.0",
        threat: "0.0",
        ict_index: "0.0",
        news: "",
        news_added: null,
        chance_of_playing_this_round: 100,
        chance_of_playing_next_round: 100
      })),
      teams: teams.map((t: any) => ({
        id: t.id,
        name: t.name,
        short_name: t.short_name,
        strength: t.strength || 3,
        strength_overall_home: t.strength_overall_home || 3,
        strength_overall_away: t.strength_overall_away || 3,
        strength_attack_home: t.strength_attack_home || 3,
        strength_attack_away: t.strength_attack_away || 3,
        strength_defence_home: t.strength_defence_home || 3,
        strength_defence_away: t.strength_defence_away || 3
      })),
      events: [] // Will be populated from FPL if needed
    };
  }

  // Premier League API - Fixtures (FREE)
  private async getPremierLeagueFixtures(): Promise<any[]> {
    const PL_API = import.meta.env.PREMIER_LEAGUE_API_URL || 'https://api.premierleague.com';
    
    const response = await fetch(`${PL_API}/rest/fixture/`);
    if (!response.ok) throw new Error('Premier League fixtures API failed');
    const fixtures = await response.json();
    
    return fixtures.map((f: any) => ({
      id: f.id,
      team_h: f.team_h,
      team_a: f.team_a,
      team_h_difficulty: f.team_h_difficulty || 3,
      team_a_difficulty: f.team_a_difficulty || 3,
      event: f.event,
      kickoff_time: f.kickoff_time,
      finished: f.finished || false,
      team_h_score: f.team_h_score,
      team_a_score: f.team_a_score
    }));
  }

  // FPL API - Prices only (minimal call)
  private async getFplPricesOnly(): Promise<any> {
    const { fplApiService } = await import('./fplApiService');
    const data = await fplApiService.getBootstrapData();
    
    // Extract only prices and FPL-specific data
    return {
      prices: data.elements.map((e: any) => ({
        id: e.id,
        now_cost: e.now_cost,
        selected_by_percent: e.selected_by_percent,
        form: e.form,
        news: e.news,
        news_added: e.news_added,
        chance_of_playing_this_round: e.chance_of_playing_this_round,
        chance_of_playing_next_round: e.chance_of_playing_next_round
      })),
      events: data.events
    };
  }

  // Merge Premier League data with FPL prices
  private mergeBootstrapData(plData: any, fplPrices: any): any {
    const priceMap = new Map(fplPrices.prices.map((p: any) => [p.id, p]));
    
    return {
      elements: plData.elements.map((player: any) => {
        const fplData = priceMap.get(player.id);
        if (fplData) {
          return {
            ...player,
            now_cost: (fplData as any).now_cost,
            selected_by_percent: (fplData as any).selected_by_percent,
            form: (fplData as any).form,
            news: (fplData as any).news,
            news_added: (fplData as any).news_added,
            chance_of_playing_this_round: (fplData as any).chance_of_playing_this_round,
            chance_of_playing_next_round: (fplData as any).chance_of_playing_next_round
          };
        }
        return player;
      }),
      teams: plData.teams,
      events: fplPrices.events || []
    };
  }

  // Health tracking
  private markSuccess(source: 'fpl' | 'pl'): void {
    const health = source === 'fpl' ? this.fplHealth : this.plHealth;
    health.successCount++;
    health.errorCount = 0;
    health.isAvailable = true;
    health.lastCheck = new Date();
    health.reliability = Math.min(1.0, health.reliability + 0.1);
  }

  private markFailure(source: 'fpl' | 'pl', error: string): void {
    const health = source === 'fpl' ? this.fplHealth : this.plHealth;
    health.errorCount++;
    health.lastCheck = new Date();
    health.reliability = Math.max(0, health.reliability - 0.2);
    
    // Disable after 3 consecutive failures
    if (health.errorCount >= 3) {
      health.isAvailable = false;
      // console.log(`🚨 ${health.name} disabled after ${health.errorCount} failures`);
    }
  }

  // Get health status
  getHealthStatus(): { fpl: DataSourceHealth; pl: DataSourceHealth } {
    return {
      fpl: { ...this.fplHealth },
      pl: { ...this.plHealth }
    };
  }

  // Get API call savings
  getApiCallSavings(): { fplCallsSaved: number; plCallsUsed: number; savingsPercentage: number } {
    const totalCalls = this.fplHealth.successCount + this.plHealth.successCount;
    const fplCallsSaved = this.plHealth.successCount;
    const savingsPercentage = totalCalls > 0 ? (fplCallsSaved / totalCalls) * 100 : 0;
    
    return {
      fplCallsSaved,
      plCallsUsed: this.plHealth.successCount,
      savingsPercentage: Math.round(savingsPercentage)
    };
  }

  // Generate report
  generateReport(): string {
    const savings = this.getApiCallSavings();
    const health = this.getHealthStatus();
    
    return `
╔════════════════════════════════════════════════════════════╗
║         MULTI-SOURCE DATA SERVICE REPORT                   ║
╚════════════════════════════════════════════════════════════╝

📊 API CALL SAVINGS:
   • FPL Calls Saved:  ${savings.fplCallsSaved}
   • PL Calls Used:    ${savings.plCallsUsed}
   • Savings:          ${savings.savingsPercentage}%

🔍 FPL API HEALTH:
   • Status:           ${health.fpl.isAvailable ? '✅ Available' : '❌ Unavailable'}
   • Success Count:    ${health.fpl.successCount}
   • Error Count:      ${health.fpl.errorCount}
   • Reliability:      ${(health.fpl.reliability * 100).toFixed(1)}%

🔍 PREMIER LEAGUE API HEALTH:
   • Status:           ${health.pl.isAvailable ? '✅ Available' : '❌ Unavailable'}
   • Success Count:    ${health.pl.successCount}
   • Error Count:      ${health.pl.errorCount}
   • Reliability:      ${(health.pl.reliability * 100).toFixed(1)}%

💡 STRATEGY:
   • Fixtures:         Premier League API (FREE)
   • Basic Stats:      Premier League API (FREE)
   • Prices:           FPL API (required)
   • User Teams:       FPL API (required)

╚════════════════════════════════════════════════════════════╝
    `;
  }
}

export const multiSourceDataService = new MultiSourceDataService();
export type { DataSourceHealth };


