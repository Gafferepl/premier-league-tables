// Data Transformer - Normalizes data from different APIs
import { Player, Fixture, LeagueTableEntry } from '../../types';

// FPL API Data Transformers
export const transformFPLBootstrap = (data: any) => {
  return {
    players: data.elements?.map((element: any) => transformFPLPlayer(element)) || [],
    teams: data.teams?.map((team: any) => transformFPLTeam(team)) || [],
    fixtures: data.fixtures?.map((fixture: any) => transformFPLFixture(fixture)) || [],
    events: data.events?.map((event: any) => transformFPLEvent(event)) || []
  };
};

export const transformFPLPlayer = (element: any): Player => {
  return {
    name: element.web_name || element.first_name + ' ' + element.second_name,
    team: getTeamName(element.team),
    goals: element.goals_scored || 0,
    assists: element.assists || 0,
    boots: 'Nike', // Default value
    price: `£${(element.now_cost / 10).toFixed(1)}`, // Convert from pence to pounds and format as string
    link: `/player/${element.id}`,
    image: `/images/players/${element.id}.png`,
    rank: element.total_points > 150 ? 'gold' : element.total_points > 100 ? 'silver' : 'bronze',
    goalTiming: {
      '0-15': 0,
      '16-30': 0,
      '31-45': 0,
      '46-60': 0,
      '61-75': 0,
      '76-90+': 0
    },
    transferSentiment: element.transfers_in > element.transfers_out ? 'up' : element.transfers_in < element.transfers_out ? 'down' : 'stable',
    // Additional fields
    shirtNumber: element.shirt_number,
    penalties: element.penalties_saved,
    homeGoals: Math.floor(element.goals_scored * 0.6), // Estimate
    awayGoals: Math.floor(element.goals_scored * 0.4)  // Estimate
  };
};

export const transformFPLFixture = (fixture: any): Fixture => {
  const homeScore = fixture.team_h_score;
  const awayScore = fixture.team_a_score;
  const score = (homeScore !== null && awayScore !== null) ? `${homeScore} - ${awayScore}` : undefined;
  
  return {
    id: fixture.id.toString(),
    homeTeam: fixture.team_h === 1 ? 'Arsenal' : getTeamName(fixture.team_h),
    awayTeam: fixture.team_a === 1 ? 'Arsenal' : getTeamName(fixture.team_a),
    date: fixture.kickoff_time,
    status: getFixtureStatus(fixture.status) as 'upcoming' | 'live' | 'finished',
    score,
    difficulty: {
      overall: fixture.team_h_difficulty || 3,
      att: fixture.team_h_difficulty || 3,
      def: fixture.team_a_difficulty || 3
    },
    fdrRating: fixture.team_h_difficulty,
    gameweek: fixture.event, // This is the actual gameweek from FPL
    time: fixture.minutes_elapsed ? `${fixture.minutes_elapsed}'` : fixture.finished ? 'FT' : fixture.kickoff_time ? new Date(fixture.kickoff_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBC'
  };
};

// Backup API Transformers (Football-Data.org)
export const transformFootballDataFixture = (fixture: any): Fixture => {
  const homeScore = fixture.score?.fullTime?.home;
  const awayScore = fixture.score?.fullTime?.away;
  const score = (homeScore !== null && awayScore !== null) ? `${homeScore} - ${awayScore}` : undefined;
  
  return {
    id: fixture.id.toString(),
    homeTeam: fixture.homeTeam?.name || 'Unknown',
    awayTeam: fixture.awayTeam?.name || 'Unknown',
    date: fixture.utcDate,
    status: fixture.status === 'SCHEDULED' ? 'upcoming' : fixture.status === 'LIVE' ? 'live' : 'finished',
    score,
    difficulty: {
      overall: 3, // Default difficulty
      att: 3,
      def: 3
    }
  };
};

// Backup API Transformers (API-Football)
export const transformApiFootballFixture = (fixture: any): Fixture => {
  const homeScore = fixture.goals?.home;
  const awayScore = fixture.goals?.away;
  const score = (homeScore !== null && awayScore !== null) ? `${homeScore} - ${awayScore}` : undefined;
  
  return {
    id: fixture.fixture?.id.toString(),
    homeTeam: fixture.teams?.home?.name || 'Unknown',
    awayTeam: fixture.teams?.away?.name || 'Unknown',
    date: fixture.fixture?.date,
    status: fixture.fixture?.status?.short === 'NS' ? 'upcoming' : fixture.fixture?.status?.short === 'LIVE' ? 'live' : 'finished',
    score,
    difficulty: {
      overall: 3, // Default difficulty
      att: 3,
      def: 3
    }
  };
};

// Helper functions
const getPositionFromCode = (code: number): string => {
  const positions: { [key: number]: string } = {
    1: 'GK',
    2: 'DEF',
    3: 'MID',
    4: 'FWD'
  };
  return positions[code] || 'Unknown';
};

const getTeamName = (teamId: number): string => {
  // This should match your team mapping
  const teams: { [key: number]: string } = {
    1: 'Arsenal', 2: 'Aston Villa', 3: 'Bournemouth', 4: 'Brentford',
    5: 'Brighton', 6: 'Chelsea', 7: 'Crystal Palace', 8: 'Everton',
    9: 'Fulham', 10: 'Liverpool', 11: 'Luton Town', 12: 'Manchester City',
    13: 'Manchester United', 14: 'Newcastle', 15: 'Nottingham Forest',
    16: 'Southampton', 17: 'Tottenham', 18: 'West Ham', 19: 'Wolves',
    20: 'Burnley', 21: 'Sheffield United'
  };
  return teams[teamId] || 'Unknown';
};

const getFixtureStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'NS': 'upcoming',
    'TBC': 'upcoming',
    'POSTP': 'postponed',
    'CANCL': 'cancelled',
    'SUSP': 'suspended'
  };
  return statusMap[status] || status.toLowerCase();
};

const transformFPLTeam = (team: any) => {
  return {
    id: team.id,
    name: team.name,
    shortName: team.short_name,
    strength: team.strength,
    strengthOverallHome: team.strength_overall_home,
    strengthOverallAway: team.strength_overall_away,
    strengthAttackHome: team.strength_attack_home,
    strengthAttackAway: team.strength_attack_away,
    strengthDefenceHome: team.strength_defence_home,
    strengthDefenceAway: team.strength_defence_away
  };
};

const transformFPLEvent = (event: any) => {
  return {
    id: event.id,
    name: event.name,
    deadline: event.deadline_time,
    averageEntryScore: event.average_entry_score,
    finished: event.finished,
    dataChecked: event.data_checked,
    highestScoringEntry: event.highest_scoring_entry,
    isPrevious: event.is_previous,
    isCurrent: event.is_current,
    isNext: event.is_next
  };
};

// League Table Transformers
export const transformFPLStandings = (data: any): LeagueTableEntry[] => {
  // FPL doesn't directly provide league table, so we might need to use backup APIs
  return [];
};

export const transformFootballDataStandings = (data: any): LeagueTableEntry[] => {
  return data.standings?.map((standing: any) => ({
    position: standing.position,
    team: standing.team?.name || 'Unknown',
    played: standing.playedGames,
    won: standing.won,
    drawn: standing.draw,
    lost: standing.lost,
    goalsFor: standing.goalsFor,
    goalsAgainst: standing.goalsAgainst,
    goalDifference: standing.goalDifference,
    points: standing.points,
    form: standing.form
  })) || [];
};

// Live Score Transformers
export const transformFPLLive = (data: any) => {
  return {
    eventId: data.id,
    fixtures: data.fixtures?.map((fixture: any) => ({
      id: fixture.id,
      homeTeam: fixture.team_h_name,
      awayTeam: fixture.team_a_name,
      homeScore: fixture.team_h_score,
      awayScore: fixture.team_a_score,
      minutesElapsed: fixture.minutes_elapsed,
      status: fixture.status,
      events: fixture.events?.map((event: any) => ({
        id: event.id,
        type: event.type,
        minute: event.minute,
        team: event.team,
        player: event.player,
        assist: event.assisting_player,
        description: getEventDescription(event.type)
      })) || []
    })) || []
  };
};

const getEventDescription = (type: string): string => {
  const eventTypes: { [key: string]: string } = {
    'Goal': '⚽ Goal',
    'Own Goal': '😅 Own Goal',
    'Yellow Card': '🟨 Yellow Card',
    'Red Card': '🟥 Red Card',
    'Assist': '🎯 Assist',
    'Penalty Saved': '🧤 Penalty Saved',
    'Penalty Missed': '❌ Penalty Missed',
    'VAR': '📺 VAR Intervention'
  };
  return eventTypes[type] || type;
};

// Data validation and sanitization
export const validatePlayer = (player: any): boolean => {
  return !!(
    player.id &&
    player.name &&
    player.team &&
    player.position &&
    player.price
  );
};

export const validateFixture = (fixture: any): boolean => {
  return !!(
    fixture.id &&
    fixture.homeTeam &&
    fixture.awayTeam &&
    fixture.date
  );
};

export const sanitizeData = (data: any): any => {
  // Remove null/undefined values and sanitize strings
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        sanitized[key] = typeof value === 'string' ? value.trim() : sanitizeData(value);
      }
    }
    return sanitized;
  }
  
  return data;
};


