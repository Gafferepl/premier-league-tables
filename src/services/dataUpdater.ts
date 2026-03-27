// Data Updater Service - Updates fallback data with fresh FPL API data
import { apiService } from './apiService';
import { transformFPLPlayer } from './dataTransformer';
import { AppData, Player, LeagueTableEntry, Fixture } from '../../types';

// Fresh data from FPL API
export class DataUpdater {
  private static instance: DataUpdater;
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): DataUpdater {
    if (!DataUpdater.instance) {
      DataUpdater.instance = new DataUpdater();
    }
    return DataUpdater.instance;
  }

  // Update fallback data with fresh FPL data
  async updateFallbackData(): Promise<void> {
    try {
      // console.log('🔄 Updating fallback data with fresh FPL API data...');
      
      // Get fresh data from FPL API
      const bootstrapData = await apiService.getBootstrapData();
      const currentGameweek = await apiService.getCurrentGameweek();
      const freshFixtures = await apiService.getFixtures();
      
      // console.log('📊 FPL API data received:', {
        gameweek: currentGameweek,
        players: bootstrapData.elements?.length,
        fixtures: freshFixtures.length,
        teams: bootstrapData.teams?.length,
        events: bootstrapData.events?.length,
        // Debug the structure
        bootstrapKeys: Object.keys(bootstrapData),
        sampleTeam: bootstrapData.teams?.[0],
        samplePlayer: bootstrapData.elements?.[0],
        sampleEvent: bootstrapData.events?.[0]
      });

      // Create fresh AppData with current FPL data
      const freshData: AppData = {
        lastUpdated: Date.now(),
        currentGameweek,
        table: this.transformLeagueTable(bootstrapData),
        fixtures: freshFixtures,
        news: this.generateCurrentNews(bootstrapData),
        scorers: this.transformTopScorers(bootstrapData),
        matchStats: this.transformRecentMatches(freshFixtures),
        weeklyTip: this.generateWeeklyTip(bootstrapData, currentGameweek),
        sackRace: this.generateSackRace(bootstrapData)
      };

      // Save fresh data to localStorage
      localStorage.setItem('premier_league_hub_fresh_data', JSON.stringify(freshData));
      
      // Also update the cache key that gemini.ts uses
      localStorage.setItem('premier_league_hub_data_v113_live_refresh', JSON.stringify(freshData));
      
      // console.log('✅ Fallback data updated successfully:', {
        currentGameweek: freshData.currentGameweek,
        tableSize: freshData.table.length,
        fixturesCount: freshData.fixtures.length,
        scorersCount: freshData.scorers.length
      });

    } catch (error) {
      // console.error('❌ Failed to update fallback data:', error);
    }
  }

  // Transform FPL league table data
  private transformLeagueTable(bootstrapData: any): LeagueTableEntry[] {
    // console.log('🔍 Raw FPL bootstrap data:', {
      hasTeams: !!bootstrapData.teams,
      teamsCount: bootstrapData.teams?.length,
      sampleTeam: bootstrapData.teams?.[0]
    });

    if (!bootstrapData.teams) {
      // console.warn('⚠️ No teams data in FPL bootstrap');
      return [];
    }
    
    const transformedTable = bootstrapData.teams
      .sort((a: any, b: any) => {
        // Sort by points (overall_position if available, otherwise by points)
        if (a.overall_position !== undefined && b.overall_position !== undefined) {
          return a.overall_position - b.overall_position;
        }
        return (b.points || 0) - (a.points || 0);
      })
      .slice(0, 20) // Top 20
      .map((team: any, index: number) => {
        const entry = {
          position: team.overall_position || index + 1,
          team: team.name,
          played: team.played || 0,
          won: team.won || 0,
          drawn: team.drawn || 0,
          lost: team.lost || 0,
          gd: team.goal_difference || 0,
          points: team.points || 0,
          form: this.generateForm(team),
          // Additional stats
          goalsFor: team.goals_for || 0,
          goalsAgainst: team.goals_against || 0,
          cleanSheets: team.clean_sheets || 0
        };
        
        // console.log(`📊 Team ${index + 1}:`, entry);
        return entry;
      });

    // console.log('🏆 Final transformed table (top 5):', transformedTable.slice(0, 5));
    return transformedTable;
  }

  // Transform top scorers from FPL data
  private transformTopScorers(bootstrapData: any): Player[] {
    if (!bootstrapData.elements) return [];
    
    return bootstrapData.elements
      .filter((player: any) => player.element_type === 2 || player.element_type === 3 || player.element_type === 4) // FWD, MID, DEF
      .sort((a: any, b: any) => b.total_points - a.total_points)
      .slice(0, 20) // Top 20
      .map((player: any) => transformFPLPlayer(player));
  }

  // Transform recent matches
  private transformRecentMatches(fixtures: Fixture[]): any[] {
    return fixtures
      .filter(f => f.status === 'finished' && f.score)
      .slice(0, 10)
      .map(fixture => ({
        id: parseInt(fixture.id),
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        score: fixture.score || '0-0',
        date: new Date(fixture.date || '').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
        homeScorers: [],
        awayScorers: [],
        possession: { home: 50, away: 50 },
        shots: { home: 12, away: 10 },
        shotsOnTarget: { home: 5, away: 4 }
      }));
  }

  // Generate current news based on FPL data
  private generateCurrentNews(bootstrapData: any): any[] {
    const topPlayers = bootstrapData.elements?.slice(0, 5) || [];
    const currentGameweek = bootstrapData.events?.find((e: any) => e.is_current);
    
    return topPlayers.map((player: any, index: number) => ({
      id: index + 1,
      title: `${player.web_name} in ${player.chances_in_next_match ? 'doubt' : 'lineup'} for ${player.team_short_name}`,
      summary: `${player.web_name} has ${player.goals_scored} goals and ${player.assists} assists this season.`,
      image: '',
      source: player.team_short_name,
      url: `https://www.google.com/search?q=${player.web_name}+${player.team_short_name}+news`,
      time: `${index + 1}h ago`
    }));
  }

  // Generate weekly tip
  private generateWeeklyTip(bootstrapData: any, currentGameweek: number): string {
    const topScorer = bootstrapData.elements?.find((p: any) => p.element_type === 4 && p.goals_scored > 0);
    const currentEvent = bootstrapData.events?.find((e: any) => e.id === currentGameweek);
    
    if (topScorer && currentEvent) {
      return `GW${currentGameweek} Captain Pick: ${topScorer.web_name} (${topScorer.team_short_name}) - ${topScorer.chances_in_next_match}% chance of scoring`;
    }
    
    return `GW${currentGameweek} Tip: Check fixture difficulty ratings before picking your team!`;
  }

  // Generate sack race based on team form
  private generateSackRace(bootstrapData: any): any[] {
    const teams = bootstrapData.teams || [];
    
    return teams
      .filter((team: any) => team.position > 15) // Bottom 5 teams
      .map((team: any, index: number) => ({
        manager: this.getManagerName(team.name),
        team: team.name,
        temperature: Math.max(20, 100 - (team.position * 5)),
        gafferVerdict: this.getGafferVerdict(team.position),
        nextManager: this.getNextManager(),
        odds: `${(team.position * 2)}/1`
      }));
  }

  // Helper methods
  private generateForm(team: any): string[] {
    // Generate form based on recent results (mock for now)
    const results = ['W', 'D', 'L', 'W', 'L'];
    return results.slice(-5);
  }

  private getManagerName(teamName: string): string {
    const managers: { [key: string]: string } = {
      'Man City': 'Pep Guardiola',
      'Arsenal': 'Mikel Arteta',
      'Liverpool': 'Arne Slot',
      'Chelsea': 'Enzo Maresca',
      'Man Utd': 'Ruben Amorim',
      'Spurs': 'Ange Postecoglou',
      'Newcastle': 'Eddie Howe',
      'Brighton': 'Fabian Hurzeler',
      'Aston Villa': 'Unai Emery'
    };
    return managers[teamName] || 'Unknown Manager';
  }

  private getGafferVerdict(position: number): string {
    if (position > 18) return 'On borrowed time';
    if (position > 16) return 'Pressure mounting';
    return 'Safe for now';
  }

  private getNextManager(): string {
    const managers = ['Big Sam', 'Brendan Rodgers', 'David Moyes', 'Nuno Espirito Santo'];
    return managers[Math.floor(Math.random() * managers.length)];
  }

  // Start auto-update system
  startAutoUpdate(intervalMinutes: number = 30): void {
    // Clear existing interval
    this.stopAutoUpdate();
    
    // console.log(`🔄 Starting auto-update every ${intervalMinutes} minutes`);
    
    // Update immediately
    this.updateFallbackData();
    
    // Set up regular updates
    this.updateInterval = setInterval(() => {
      this.updateFallbackData();
    }, intervalMinutes * 60 * 1000);
  }

  // Stop auto-update system
  stopAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      // console.log('⏹️ Auto-update stopped');
    }
  }

  // Get fresh data
  getFreshData(): AppData | null {
    try {
      const freshData = localStorage.getItem('premier_league_hub_fresh_data');
      if (freshData) {
        return JSON.parse(freshData);
      }
    } catch (error) {
      // console.error('❌ Failed to get fresh data:', error);
    }
    return null;
  }
}

export default DataUpdater;


