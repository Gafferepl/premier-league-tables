// Ultra-Conservative FPL API Service
// Built for maximum safety and reliability

export interface FPLPlayer {
  id: number;
  web_name: string;
  team: number;
  team_code: number;
  position: number;
  now_cost: number;
  total_points: number;
  form: string;
  selected_by_percent: string;
  expected_goals: number;
  expected_assists: number;
  expected_goal_involvements: number;
  creativity: number;
  threat: number;
  influence: number;
  bonus: number;
  bps: number;
  minutes?: number;
  transfers_in?: number;
  transfers_out?: number;
}

export interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
  strength: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}

export interface FPLFixture {
  id: number;
  team_h: number;
  team_a: number;
  team_h_difficulty: number;
  team_a_difficulty: number;
  event: number;
  kickoff_time: string;
  finished: boolean;
}

// Fallback mock data for when API fails
const mockBootstrapData: FPLBootstrap = {
  elements: [
    {
      id: 328,
      web_name: "Haaland",
      team: 3,
      team_code: 45,
      position: 4,
      now_cost: 115,
      total_points: 145,
      form: "7.2",
      selected_by_percent: "45.2",
      expected_goals: 0.8,
      expected_assists: 0.2,
      expected_goal_involvements: 1.0,
      creativity: 25.5,
      threat: 45.2,
      influence: 78.3,
      bonus: 8,
      bps: 123,
      minutes: 2340,
      transfers_in: 12345,
      transfers_out: 2345
    },
    {
      id: 239,
      web_name: "Salah",
      team: 8,
      team_code: 8,
      position: 3,
      now_cost: 125,
      total_points: 158,
      form: "8.1",
      selected_by_percent: "52.3",
      expected_goals: 0.6,
      expected_assists: 0.4,
      expected_goal_involvements: 1.0,
      creativity: 45.2,
      threat: 35.8,
      influence: 82.1,
      bonus: 12,
      bps: 145,
      minutes: 2610,
      transfers_in: 15678,
      transfers_out: 1234
    },
    {
      id: 252,
      web_name: "Saka",
      team: 1,
      team_code: 1,
      position: 3,
      now_cost: 95,
      total_points: 132,
      form: "6.8",
      selected_by_percent: "38.7",
      expected_goals: 0.4,
      expected_assists: 0.3,
      expected_goal_involvements: 0.7,
      creativity: 38.9,
      threat: 42.1,
      influence: 71.5,
      bonus: 6,
      bps: 98,
      minutes: 2430,
      transfers_in: 9876,
      transfers_out: 3456
    },
    {
      id: 376,
      web_name: "De Bruyne",
      team: 3,
      team_code: 45,
      position: 3,
      now_cost: 105,
      total_points: 98,
      form: "5.2",
      selected_by_percent: "18.9",
      expected_goals: 0.3,
      expected_assists: 0.5,
      expected_goal_involvements: 0.8,
      creativity: 55.6,
      threat: 28.4,
      influence: 68.9,
      bonus: 4,
      bps: 76,
      minutes: 1560,
      transfers_in: 5432,
      transfers_out: 6543
    },
    {
      id: 303,
      web_name: "Rashford",
      team: 14,
      team_code: 26,
      position: 3,
      now_cost: 80,
      total_points: 76,
      form: "2.1",
      selected_by_percent: "15.6",
      expected_goals: 0.3,
      expected_assists: 0.2,
      expected_goal_involvements: 0.5,
      creativity: 22.3,
      threat: 32.1,
      influence: 45.6,
      bonus: 2,
      bps: 45,
      minutes: 1890,
      transfers_in: 8765,
      transfers_out: 9876
    },
    {
      id: 456,
      web_name: "Odegaard",
      team: 1,
      team_code: 1,
      position: 3,
      now_cost: 75,
      total_points: 89,
      form: "4.5",
      selected_by_percent: "12.3",
      expected_goals: 0.2,
      expected_assists: 0.4,
      expected_goal_involvements: 0.6,
      creativity: 41.2,
      threat: 26.8,
      influence: 58.7,
      bonus: 3,
      bps: 67,
      minutes: 2100,
      transfers_in: 4321,
      transfers_out: 3210
    },
    {
      id: 278,
      web_name: "Rice",
      team: 1,
      team_code: 1,
      position: 2,
      now_cost: 55,
      total_points: 98,
      form: "4.2",
      selected_by_percent: "28.9",
      expected_goals: 0.1,
      expected_assists: 0.1,
      expected_goal_involvements: 0.2,
      creativity: 18.7,
      threat: 15.3,
      influence: 52.4,
      bonus: 5,
      bps: 89,
      minutes: 2520,
      transfers_in: 7654,
      transfers_out: 2345
    },
    {
      id: 512,
      web_name: "Saliba",
      team: 1,
      team_code: 1,
      position: 2,
      now_cost: 45,
      total_points: 112,
      form: "5.1",
      selected_by_percent: "22.1",
      expected_goals: 0.05,
      expected_assists: 0.02,
      expected_goal_involvements: 0.07,
      creativity: 8.9,
      threat: 5.4,
      influence: 35.6,
      bonus: 7,
      bps: 102,
      minutes: 2340,
      transfers_in: 6543,
      transfers_out: 1234
    }
  ],
  teams: [
    {
      id: 1,
      name: "Arsenal",
      short_name: "ARS",
      strength: 2100,
      strength_overall_home: 1350,
      strength_overall_away: 1200,
      strength_attack_home: 1400,
      strength_attack_away: 1250,
      strength_defence_home: 1300,
      strength_defence_away: 1150
    },
    {
      id: 3,
      name: "Man City",
      short_name: "MCI",
      strength: 2500,
      strength_overall_home: 1600,
      strength_overall_away: 1450,
      strength_attack_home: 1650,
      strength_attack_away: 1500,
      strength_defence_home: 1550,
      strength_defence_away: 1400
    },
    {
      id: 8,
      name: "Liverpool",
      short_name: "LIV",
      strength: 2300,
      strength_overall_home: 1500,
      strength_overall_away: 1350,
      strength_attack_home: 1550,
      strength_attack_away: 1400,
      strength_defence_home: 1450,
      strength_defence_away: 1300
    },
    {
      id: 14,
      name: "Man Utd",
      short_name: "MUN",
      strength: 1900,
      strength_overall_home: 1250,
      strength_overall_away: 1100,
      strength_attack_home: 1300,
      strength_attack_away: 1150,
      strength_defence_home: 1200,
      strength_defence_away: 1050
    }
  ],
  fixtures: [
    {
      id: 1,
      team_h: 1,
      team_a: 3,
      team_h_difficulty: 3,
      team_a_difficulty: 4,
      event: 15,
      kickoff_time: "2024-01-28T15:00:00Z",
      finished: false
    },
    {
      id: 2,
      team_h: 8,
      team_a: 1,
      team_h_difficulty: 2,
      team_a_difficulty: 3,
      event: 15,
      kickoff_time: "2024-01-28T17:30:00Z",
      finished: false
    }
  ],
  events: [
    {
      id: 15,
      name: "Gameweek 15",
      deadline_time: "2024-01-27T18:30:00Z",
      is_current: true,
      finished: false
    }
  ]
};

export interface FPLBootstrap {
  elements: FPLPlayer[];
  teams: FPLTeam[];
  fixtures: FPLFixture[];
  events: any[];
}

class FPLApiService {
  private readonly BASE_URL = 'https://fantasy.premierleague.com/api';
  private readonly USE_MOCK_DATA = true; // Set to false to use real API
  private readonly RATE_LIMIT = {
    max_calls_per_minute: 5,
    max_calls_per_hour: 100,
    max_calls_per_day: 500
  };

  private callHistory: number[] = [];
  private lastCallTime = 0;
  private errorCount = 0;
  private blockedUntil = 0;

  // Rate limiting with exponential backoff
  private async checkRateLimit(): Promise<boolean> {
    const now = Date.now();
    
    // Check if we're blocked
    if (now < this.blockedUntil) {
      // console.warn('API calls blocked until', new Date(this.blockedUntil));
      return false;
    }

    // Clean old call history (older than 1 hour)
    this.callHistory = this.callHistory.filter(time => now - time < 3600000);

    // Check minute limit
    const minuteCalls = this.callHistory.filter(time => now - time < 60000).length;
    if (minuteCalls >= this.RATE_LIMIT.max_calls_per_minute) {
      this.blockedUntil = now + 60000; // Block for 1 minute
      return false;
    }

    // Check hour limit
    if (this.callHistory.length >= this.RATE_LIMIT.max_calls_per_hour) {
      this.blockedUntil = now + 3600000; // Block for 1 hour
      return false;
    }

    // Check daily limit (using localStorage for persistence)
    const dailyKey = `fpl_daily_calls_${new Date().toDateString()}`;
    const dailyCalls = parseInt(localStorage.getItem(dailyKey) || '0');
    if (dailyCalls >= this.RATE_LIMIT.max_calls_per_day) {
      this.blockedUntil = now + 86400000; // Block until tomorrow
      return false;
    }

    return true;
  }

  private async makeAPICall(endpoint: string): Promise<any> {
    // Check rate limiting
    if (!(await this.checkRateLimit())) {
      throw new Error('Rate limit exceeded');
    }

    // Add delay between calls
    const timeSinceLastCall = Date.now() - this.lastCallTime;
    if (timeSinceLastCall < 12000) { // 12 second minimum between calls
      await new Promise(resolve => setTimeout(resolve, 12000 - timeSinceLastCall));
    }

    try {
      const url = `${this.BASE_URL}${endpoint}`;
      // console.log(`Fetching FPL data from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Track successful call
      this.callHistory.push(Date.now());
      this.lastCallTime = Date.now();
      this.errorCount = 0;

      // Update daily counter
      const dailyKey = `fpl_daily_calls_${new Date().toDateString()}`;
      const dailyCalls = parseInt(localStorage.getItem(dailyKey) || '0');
      localStorage.setItem(dailyKey, (dailyCalls + 1).toString());

      // console.log('FPL data fetched successfully');
      return data;
    } catch (error) {
      this.errorCount++;
      // console.error('FPL API call failed:', error);
      
      // Exponential backoff on errors
      if (this.errorCount >= 3) {
        this.blockedUntil = Date.now() + (Math.pow(2, this.errorCount) * 60000);
      }
      
      throw error;
    }
  }

  // Get bootstrap data (main dataset)
  async getBootstrapData(): Promise<FPLBootstrap> {
    if (this.USE_MOCK_DATA) {
      // console.log('Using mock data (USE_MOCK_DATA = true)');
      return mockBootstrapData;
    }
    
    try {
      return await this.makeAPICall('/bootstrap-static/');
    } catch (error) {
      // console.error('FPL API failed, using fallback data:', error);
      return mockBootstrapData;
    }
  }

  // Get fallback data directly
  getFallbackData(): FPLBootstrap {
    // console.log('Using fallback mock data');
    return mockBootstrapData;
  }

  // Get individual player stats
  async getPlayerStats(playerId: number): Promise<any> {
    return this.makeAPICall(`/element-summary/${playerId}/`);
  }

  // Get all fixtures
  async getFixtures(): Promise<FPLFixture[]> {
    return this.makeAPICall('/fixtures/');
  }

  // Get game week data
  async getGameWeekData(gameWeekId: number): Promise<any> {
    return this.makeAPICall(`/event/${gameWeekId}/`);
  }

  // Get user's team picks for a specific gameweek
  async getUserPicks(userId: string, gameweek: number): Promise<any> {
    return this.makeAPICall(`/entry/${userId}/event/${gameweek}/picks/`);
  }

  // Get user's overall team info
  async getUserTeam(userId: string): Promise<any> {
    return this.makeAPICall(`/entry/${userId}/`);
  }

  // Get usage statistics
  getUsageStats() {
    const dailyKey = `fpl_daily_calls_${new Date().toDateString()}`;
    const dailyCalls = parseInt(localStorage.getItem(dailyKey) || '0');
    const hourlyCalls = this.callHistory.length;
    
    return {
      daily_calls: dailyCalls,
      hourly_calls: hourlyCalls,
      daily_limit: this.RATE_LIMIT.max_calls_per_day,
      hourly_limit: this.RATE_LIMIT.max_calls_per_hour,
      blocked_until: this.blockedUntil,
      error_count: this.errorCount
    };
  }

  // Check if API is currently blocked
  isBlocked(): boolean {
    return Date.now() < this.blockedUntil;
  }

  // Get time until unblocked
  getTimeUntilUnblocked(): number {
    return Math.max(0, this.blockedUntil - Date.now());
  }
}

export const fplApiService = new FPLApiService();


