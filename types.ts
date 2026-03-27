
export interface Fact {
  fact: string;
  context: string;
}

export interface GoalTiming {
  '0-15': number;
  '16-30': number;
  '31-45': number;
  '46-60': number;
  '61-75': number;
  '76-90+': number;
}

export interface Player {
  name: string;
  team: string;
  goals: number;
  shirtNumber?: number; // New field for Locker Room feature
  penalties?: number; // New field for penalty kicks
  homeGoals?: number;
  awayGoals?: number;
  assists: number;
  boots: string;
  price: string;
  link: string;
  image: string;
  rank?: 'gold' | 'silver' | 'bronze';
  goalTiming?: GoalTiming;
  transferSentiment?: 'up' | 'down' | 'stable';
  // Advanced Analytics (xG/xA)
  xg?: number; // Expected Goals
  xa?: number; // Expected Assists
  xgi?: number; // xG + xA
  xg_per_90?: number; // Expected Goals per 90 minutes
  xa_per_90?: number; // Expected Assists per 90 minutes
  np_xg?: number; // Non-penalty Expected Goals
  xg_chain?: number; // xG from build-up play
  xg_buildup?: number; // xG from build-up
  minutes?: number; // Minutes played for per-90 calculations
}

export interface NavLink {
  id: string;
  label: string;
  icon: string;
}

export interface LeagueTableEntry {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
  form?: string[]; // e.g. ['W', 'L', 'D', 'W', 'W']
  // Gaffer Mode Stats
  yellowCards?: number;
  redCards?: number;
  possession?: number;
  cleanSheets?: number;
  // Advanced Analytics (xG/xA)
  xg?: number; // Expected Goals for
  xga?: number; // Expected Goals Against
  xgd?: number; // Expected Goal Difference (xG - xGA)
  xg_per_game?: number; // Expected Goals per game
  xga_per_game?: number; // Expected Goals Against per game
  ppda?: number; // Passes Per Defensive Action (lower = more aggressive)
  ppda_allowed?: number; // PPDA allowed (higher = more passive)
}

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time?: string; // Time or 'FT', 'LIVE'
  date?: string;
  score?: string; // e.g. "2 - 1" or null if not played
  status: 'upcoming' | 'live' | 'finished';
  fdrRating?: number; // 1 to 5 (Legacy/Fallback)
  gameweek?: number;
  venue?: string;
  referee?: string;
  difficulty?: {
    overall: number; // 1-5
    att: number;     // 1-5
    def: number;     // 1-5
  };
}

export interface MatchStats {
  id: number;
  homeTeam: string;
  awayTeam: string;
  score: string;
  date: string;
  homeScorers: string[];
  awayScorers: string[];
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  // Advanced Analytics (xG/xA)
  xg?: { home: number; away: number }; // Expected Goals
  xa?: { home: number; away: number }; // Expected Assists
  xg_total?: number; // Total xG in match
  big_chances_created?: { home: number; away: number }; // Big chances
  big_chances_missed?: { home: number; away: number }; // Big chances missed
  ppda?: { home: number; away: number }; // Passes Per Defensive Action
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  source: string;
  url: string;
  time: string;
  quote?: string;
  isAdvanced?: boolean;
}

export interface SackRaceEntry {
  manager: string;
  team: string;
  temperature: number; // 0-100 pressure level
  gafferVerdict: string;
  nextManager: string;
  odds: string;
}

export interface GafferTableEntry extends LeagueTableEntry {
  gafferPoints?: number;
}

export interface FPLPlayer {
  id: number;
  web_name: string;
  team: string;
  position: string;
  now_cost: number;
  total_points: number;
  form: string;
  selected_by_percent: number;
  expected_goals: number;
  expected_assists: number;
  creativity: number;
  threat: number;
  influence: number;
  bonus: number;
  bps: number;
  minutes: number;
  transfers_in: number;
  transfers_out: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  yellow_cards: number;
  starts: number;
  xg: number;
  xa: number;
  xgi: number;
  xg_per_90: number;
  xa_per_90: number;
}

export interface AppData {
  lastUpdated: number;
  currentGameweek?: number; // New field for Global Gameweek
  table: GafferTableEntry[];
  fixtures: Fixture[];
  news: NewsItem[];
  scorers: Player[];
  matchStats: MatchStats[];
  weeklyTip?: string;
  sackRace?: SackRaceEntry[];
}
