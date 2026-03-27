// FPL Data Transformation Utilities
// Converts raw FPL API data to application-ready format

import { FPLPlayer, FPLTeam, FPLFixture } from '../services/fplApiService';

export interface TransformedPlayer {
  id: number;
  name: string;
  team: string;
  teamId: number;
  position: 'GKP' | 'DEF' | 'MID' | 'FWD';
  price: number;
  totalPoints: number;
  form: number;
  selectedByPercent: number;
  xG: number;
  xA: number;
  xGI: number;
  creativity: number;
  threat: number;
  influence: number;
  bonus: number;
  bps: number;
  pointsPerGame: number;
  valueForm: number;
  valueSeason: number;
  transfersIn: number;
  transfersOut: number;
  fixtureDifficulty: number;
  upcomingFixtures: number;
  utilityScore?: number;
}

export interface TransformedFixture {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number;
  awayTeamId: number;
  homeDifficulty: number;
  awayDifficulty: number;
  kickoffTime: string;
  isFinished: boolean;
  gameWeek: number;
}

export interface TeamStrength {
  id: number;
  name: string;
  strengthOverall: number;
  strengthHome: number;
  strengthAway: number;
  attackHome: number;
  attackAway: number;
  defenceHome: number;
  defenceAway: number;
}

class FPLDataTransformer {
  private positionMap: { [key: number]: 'GKP' | 'DEF' | 'MID' | 'FWD' } = {
    1: 'GKP',
    2: 'DEF',
    3: 'MID',
    4: 'FWD'
  };

  // Transform player data
  transformPlayer(player: FPLPlayer, teams: FPLTeam[], fixtures: FPLFixture[]): TransformedPlayer {
    const team = teams.find(t => t.id === player.team);
    const teamName = team?.name || 'Unknown';
    
    return {
      id: player.id,
      name: player.web_name,
      team: teamName,
      teamId: player.team,
      position: this.positionMap[player.position] || 'MID',
      price: player.now_cost / 10, // Convert from 0.1M to M
      totalPoints: player.total_points,
      form: parseFloat(player.form) || 0,
      selectedByPercent: parseFloat(player.selected_by_percent) || 0,
      xG: player.expected_goals || 0,
      xA: player.expected_assists || 0,
      xGI: player.expected_goal_involvements || 0,
      creativity: player.creativity || 0,
      threat: player.threat || 0,
      influence: player.influence || 0,
      bonus: player.bonus || 0,
      bps: player.bps || 0,
      pointsPerGame: this.calculatePointsPerGame(player),
      valueForm: this.calculateValueForm(player),
      valueSeason: this.calculateValueSeason(player),
      transfersIn: player.transfers_in || 0,
      transfersOut: player.transfers_out || 0,
      fixtureDifficulty: this.calculateAverageFixtureDifficulty(player.team, fixtures),
      upcomingFixtures: this.getUpcomingFixturesCount(player.team, fixtures)
    };
  }

  // Transform all players
  transformAllPlayers(players: FPLPlayer[], teams: FPLTeam[], fixtures: FPLFixture[]): TransformedPlayer[] {
    return players.map(player => this.transformPlayer(player, teams, fixtures));
  }

  // Transform fixtures
  transformFixtures(fixtures: FPLFixture[], teams: FPLTeam[]): TransformedFixture[] {
    return fixtures.map(fixture => {
      const homeTeam = teams.find(t => t.id === fixture.team_h);
      const awayTeam = teams.find(t => t.id === fixture.team_a);
      
      return {
        id: fixture.id,
        homeTeam: homeTeam?.name || 'Unknown',
        awayTeam: awayTeam?.name || 'Unknown',
        homeTeamId: fixture.team_h,
        awayTeamId: fixture.team_a,
        homeDifficulty: fixture.team_h_difficulty,
        awayDifficulty: fixture.team_a_difficulty,
        kickoffTime: fixture.kickoff_time,
        isFinished: fixture.finished,
        gameWeek: fixture.event
      };
    });
  }

  // Transform team strengths
  transformTeamStrengths(teams: FPLTeam[]): TeamStrength[] {
    return teams.map(team => ({
      id: team.id,
      name: team.name,
      strengthOverall: team.strength,
      strengthHome: team.strength_overall_home,
      strengthAway: team.strength_overall_away,
      attackHome: team.strength_attack_home,
      attackAway: team.strength_attack_away,
      defenceHome: team.strength_defence_home,
      defenceAway: team.strength_defence_away
    }));
  }

  // Calculate points per game
  private calculatePointsPerGame(player: FPLPlayer): number {
    const totalPoints = player.total_points || 0;
    const minutes = player.minutes || 0;
    
    if (minutes === 0) return 0;
    
    // Approximate games played (90 minutes per game)
    const gamesPlayed = Math.floor(minutes / 90);
    
    return gamesPlayed > 0 ? Math.round((totalPoints / gamesPlayed) * 10) / 10 : 0;
  }

  // Calculate value form (points per million)
  private calculateValueForm(player: FPLPlayer): number {
    const form = parseFloat(player.form) || 0;
    const price = player.now_cost / 10;
    
    return price > 0 ? Math.round((form / price) * 100) / 100 : 0;
  }

  // Calculate value season (total points per million)
  private calculateValueSeason(player: FPLPlayer): number {
    const totalPoints = player.total_points || 0;
    const price = player.now_cost / 10;
    
    return price > 0 ? Math.round((totalPoints / price) * 100) / 100 : 0;
  }

  // Calculate average fixture difficulty
  private calculateAverageFixtureDifficulty(teamId: number, fixtures: FPLFixture[]): number {
    const teamFixtures = fixtures.filter(f => 
      !f.finished && (f.team_h === teamId || f.team_a === teamId)
    ).slice(0, 5); // Next 5 fixtures

    if (teamFixtures.length === 0) return 2.5; // Default medium difficulty

    let totalDifficulty = 0;
    teamFixtures.forEach(fixture => {
      const difficulty = fixture.team_h === teamId ? fixture.team_h_difficulty : fixture.team_a_difficulty;
      totalDifficulty += difficulty;
    });

    return Math.round((totalDifficulty / teamFixtures.length) * 10) / 10;
  }

  // Get upcoming fixtures count
  private getUpcomingFixturesCount(teamId: number, fixtures: FPLFixture[]): number {
    return fixtures.filter(f => 
      !f.finished && (f.team_h === teamId || f.team_a === teamId)
    ).length;
  }

  // Calculate utility score (Gaffer's proprietary formula)
  calculateUtilityScore(player: TransformedPlayer): number {
    const formWeight = 0.3;
    const xGIWeight = 0.2;
    const ppgWeight = 0.3;
    const fixtureWeight = 0.2;

    // Normalize values to 0-10 scale
    const normalizedForm = Math.min(10, player.form * 1.5);
    const normalizedXGI = Math.min(10, player.xGI * 10);
    const normalizedPPG = Math.min(10, player.pointsPerGame * 1.2);
    const normalizedFixtures = Math.max(0, 10 - (player.fixtureDifficulty - 2) * 2);

    const utility = (
      (normalizedForm * formWeight) +
      (normalizedXGI * xGIWeight) +
      (normalizedPPG * ppgWeight) +
      (normalizedFixtures * fixtureWeight)
    );

    return Math.round(utility * 10) / 10;
  }

  // Calculate fairness score for player comparison
  calculateFairnessScore(player1: TransformedPlayer, player2: TransformedPlayer): number {
    const utility1 = player1.utilityScore || this.calculateUtilityScore(player1);
    const utility2 = player2.utilityScore || this.calculateUtilityScore(player2);
    
    const diff = Math.abs(utility1 - utility2);
    const fairness = Math.max(0, 100 - (diff * 15)); // 15 points per utility point difference
    
    return Math.round(fairness);
  }

  // Search players by name
  searchPlayers(players: TransformedPlayer[], query: string): TransformedPlayer[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return [];
    
    return players.filter(player => 
      player.name.toLowerCase().includes(normalizedQuery) ||
      player.team.toLowerCase().includes(normalizedQuery) ||
      player.position.toLowerCase().includes(normalizedQuery)
    );
  }

  // Get players by position
  getPlayersByPosition(players: TransformedPlayer[], position: 'GKP' | 'DEF' | 'MID' | 'FWD'): TransformedPlayer[] {
    return players.filter(player => player.position === position);
  }

  // Get players by team
  getPlayersByTeam(players: TransformedPlayer[], teamId: number): TransformedPlayer[] {
    return players.filter(player => player.teamId === teamId);
  }

  // Get top players by utility score
  getTopPlayersByUtility(players: TransformedPlayer[], limit: number = 10): TransformedPlayer[] {
    return players
      .map(player => ({
        ...player,
        utilityScore: player.utilityScore || this.calculateUtilityScore(player)
      }))
      .sort((a, b) => (b.utilityScore || 0) - (a.utilityScore || 0))
      .slice(0, limit);
  }

  // Get value picks (high utility, low price)
  getValuePicks(players: TransformedPlayer[], maxPrice: number = 6.0, limit: number = 10): TransformedPlayer[] {
    return players
      .filter(player => player.price <= maxPrice)
      .map(player => ({
        ...player,
        utilityScore: player.utilityScore || this.calculateUtilityScore(player)
      }))
      .sort((a, b) => (b.utilityScore || 0) - (a.utilityScore || 0))
      .slice(0, limit);
  }

  // Get differentials (low ownership, high utility)
  getDifferentials(players: TransformedPlayer[], maxOwnership: number = 5.0, limit: number = 10): TransformedPlayer[] {
    return players
      .filter(player => player.selectedByPercent <= maxOwnership)
      .map(player => ({
        ...player,
        utilityScore: player.utilityScore || this.calculateUtilityScore(player)
      }))
      .sort((a, b) => (b.utilityScore || 0) - (a.utilityScore || 0))
      .slice(0, limit);
  }

  // Get in-form players
  getInFormPlayers(players: TransformedPlayer[], minForm: number = 6.0, limit: number = 10): TransformedPlayer[] {
    return players
      .filter(player => player.form >= minForm)
      .sort((a, b) => b.form - a.form)
      .slice(0, limit);
  }

  // Get popular transfers in
  getPopularTransfersIn(players: TransformedPlayer[], limit: number = 10): TransformedPlayer[] {
    return players
      .sort((a, b) => b.transfersIn - a.transfersIn)
      .slice(0, limit);
  }

  // Get popular transfers out
  getPopularTransfersOut(players: TransformedPlayer[], limit: number = 10): TransformedPlayer[] {
    return players
      .sort((a, b) => b.transfersOut - a.transfersOut)
      .slice(0, limit);
  }
}

export const fplDataTransformer = new FPLDataTransformer();


