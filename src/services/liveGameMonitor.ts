// Live Game Monitor for Organic Twitter Integration
// Integrates with FPL scheduler to capture live events

import { organicTwitterService, GameEvent } from './organicTwitterService';

interface LiveGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'ht' | 'ft';
  kickoffTime: Date;
  currentMinute: number;
  events: GameEvent[];
}

interface LiveGameData {
  fixtures: any[];
  events: any[];
  standings: any;
}

class LiveGameMonitor {
  private liveGames: Map<string, LiveGame> = new Map();
  private isMonitoring = false;
  private lastUpdate = 0;
  private processedEvents = new Set<string>(); // Track processed events

  // Start monitoring live games
  start(): void {
    if (this.isMonitoring) {
      // console.log('Live game monitor already running');
      return;
    }

    this.isMonitoring = true;
    // console.log('Live game monitor started');

    // Monitor every 2 minutes during match times
    setInterval(async () => {
      if (this.isMonitoring && this.isMatchTime()) {
        await this.updateLiveGames();
      }
    }, 120000); // 2 minutes
  }

  // Stop monitoring
  stop(): void {
    this.isMonitoring = false;
    // console.log('Live game monitor stopped');
  }

  // Check if it's match time
  private isMatchTime(): boolean {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getUTCHours();
    
    // Weekend match times
    const isWeekendMatchDay = [0, 6].includes(dayOfWeek);
    const isWeekendMatchHour = (hour >= 14 && hour <= 17) || (hour >= 19 && hour <= 22);
    
    // Midweek match times
    const isMidweekMatchDay = dayOfWeek === 3; // Wednesday
    const isMidweekMatchHour = hour >= 19 && hour <= 22;
    
    return (isWeekendMatchDay && isWeekendMatchHour) || (isMidweekMatchDay && isMidweekMatchHour);
  }

  // Update live games from FPL data
  private async updateLiveGames(): Promise<void> {
    try {
      // This would integrate with your existing FPL service
      const liveData = await this.fetchLiveData();
      
      if (!liveData) return;

      // Process fixtures
      liveData.fixtures.forEach(fixture => {
        this.processFixture(fixture);
      });

      // Process events
      liveData.events.forEach(event => {
        this.processLiveEvent(event);
      });

      this.lastUpdate = Date.now();
      // console.log(`Live games updated: ${this.liveGames.size} games active`);

    } catch (error) {
      // console.error('Failed to update live games:', error);
    }
  }

  // Fetch live data (mock implementation - integrate with your FPL service)
  private async fetchLiveData(): Promise<LiveGameData | null> {
    // This would integrate with your existing fplApiService
    // For now, returning mock data
    
    return {
      fixtures: [
        {
          id: 1,
          team_h: 1, // Arsenal
          team_a: 3, // Man City
          team_h_score: 2,
          team_a_score: 1,
          status: 'L',
          kickoff_time: new Date().toISOString(),
          minutes: 67,
          events: [
            { type: 'goal', minute: 23, team: 'H', player: 'Saka' },
            { type: 'goal', minute: 45, team: 'A', player: 'De Bruyne' },
            { type: 'penalty', minute: 50, team: 'H', player: 'Rashford', outcome: 'missed', missed: true },
            { type: 'substitution', minute: 55, team: 'H', player_on: 'Martinelli', player_off: 'Saka' },
            { type: 'var', minute: 60, team: 'A', decision_type: 'penalty_review', reason: 'Handball check' },
            { type: 'goal', minute: 67, team: 'H', player: 'Rice' }
          ]
        },
        {
          id: 2,
          team_h: 8, // Liverpool
          team_a: 14, // Man Utd
          team_h_score: 0,
          team_a_score: 0,
          status: 'L',
          kickoff_time: new Date().toISOString(),
          minutes: 34,
          events: [
            { type: 'card', minute: 15, team: 'A', player: 'Rashford', card_type: 'yellow' },
            { type: 'injury', minute: 28, team: 'H', player: 'Van Dijk' },
            { type: 'weather', minute: 30, condition: 'Heavy rain', stadium: 'Anfield' }
          ]
        },
        {
          id: 3,
          team_h: 20, // Chelsea
          team_a: 13, // Spurs
          team_h_score: 1,
          team_a_score: 1,
          status: 'L',
          kickoff_time: new Date().toISOString(),
          minutes: 85,
          events: [
            { type: 'goal', minute: 20, team: 'H', player: 'Sterling' },
            { type: 'milestone', minute: 75, team: 'A', player: 'Salah', description: '100th Premier League goal' },
            { type: 'var', minute: 80, team: 'H', decision_type: 'goal_disallowed', reason: 'offside' }
          ]
        }
      ],
      events: [],
      standings: {}
    };
  }

  // Process individual fixture
  private processFixture(fixture: any): void {
    const gameId = `fixture_${fixture.id}`;
    const teams = `${this.getTeamName(fixture.team_h)} vs ${this.getTeamName(fixture.team_a)}`;

    let game = this.liveGames.get(gameId);
    
    if (!game) {
      // New game detected
      game = {
        id: gameId,
        homeTeam: this.getTeamName(fixture.team_h),
        awayTeam: this.getTeamName(fixture.team_a),
        homeScore: fixture.team_h_score || 0,
        awayScore: fixture.team_a_score || 0,
        status: this.mapStatus(fixture.status),
        kickoffTime: new Date(fixture.kickoff_time),
        currentMinute: fixture.minutes || 0,
        events: []
      };
      
      this.liveGames.set(gameId, game);
      
      // Add kickoff event
      organicTwitterService.addEvent({
        type: 'kickoff',
        time: 0,
        teams,
        details: 'Match started',
        importance: 'medium'
      });
      
    } else {
      // Update existing game
      const previousStatus = game.status;
      game.homeScore = fixture.team_h_score || 0;
      game.awayScore = fixture.team_a_score || 0;
      game.status = this.mapStatus(fixture.status);
      game.currentMinute = fixture.minutes || 0;
      
      // Check for status changes
      this.checkStatusChange(game, previousStatus);
    }
  }

  // Process live events from fixture
  private processLiveEvent(fixture: any): void {
    const gameId = `fixture_${fixture.id}`;
    const game = this.liveGames.get(gameId);
    
    if (!game || !fixture.events) return;

    fixture.events.forEach((event: any) => {
      const eventId = `${gameId}_${event.type}_${event.minute}`;
      
      // Skip if already processed
      if (this.processedEvents.has(eventId)) return;
      
      this.processGameEvent(game, event);
      this.processedEvents.add(eventId);
    });
  }

  // Process individual game event
  private processGameEvent(game: LiveGame, event: any): void {
    const teams = `${game.homeTeam} vs ${game.awayTeam}`;
    let eventType: GameEvent['type'];
    let details: string;
    let importance: GameEvent['importance'];
    let player: string | undefined;
    let team: string | undefined;

    switch (event.type) {
      case 'goal':
        eventType = 'goal';
        details = event.player || 'Unknown player';
        importance = 'high';
        player = event.player;
        team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        break;
        
      case 'card':
        eventType = 'card';
        details = `${event.player} - ${event.card_type} card`;
        importance = event.card_type === 'red' ? 'high' : 'medium';
        player = event.player;
        team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        break;
        
      case 'penalty':
        // Check if missed or scored
        if (event.outcome === 'missed' || event.missed) {
          eventType = 'missed_penalty';
          details = `Penalty missed by ${event.player || 'Unknown player'}`;
          importance = 'high';
          player = event.player;
          team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        } else {
          eventType = 'penalty';
          details = `Penalty scored by ${event.player || 'Unknown player'}`;
          importance = 'high';
          player = event.player;
          team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        }
        break;
        
      case 'substitution':
        eventType = 'substitution';
        details = `${event.player_on} → ${event.player_off}`;
        importance = 'low';
        player = event.player_on;
        team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        break;
        
      case 'injury':
        eventType = 'injury';
        details = `${event.player} receiving treatment`;
        importance = 'medium';
        player = event.player;
        team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        break;
        
      case 'var':
        eventType = 'var';
        if (event.decision_type === 'penalty_review') {
          details = `VAR penalty review for ${event.team === 'H' ? game.homeTeam : game.awayTeam}`;
        } else if (event.decision_type === 'goal_disallowed') {
          details = `Goal disallowed for ${event.team === 'H' ? game.homeTeam : game.awayTeam} (${event.reason || 'offside'})`;
        } else {
          details = `VAR check: ${event.reason || 'under review'}`;
        }
        importance = 'high';
        team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        break;
        
      case 'milestone':
        eventType = 'milestone';
        details = event.description || 'Milestone achieved';
        importance = 'medium';
        player = event.player;
        team = event.team === 'H' ? game.homeTeam : game.awayTeam;
        break;
        
      case 'weather':
        eventType = 'weather';
        details = event.condition || 'Weather affecting play';
        importance = 'low';
        team = game.homeTeam; // Use stadium as team reference
        break;
        
      default:
        return; // Skip other event types
    }

    organicTwitterService.addEvent({
      type: eventType,
      time: event.minute,
      teams,
      details,
      importance,
      player,
      team
    });

    // Add to game's event list
    const eventId = `${game.id}_${eventType}_${event.minute}`;
    game.events.push({
      id: eventId,
      type: eventType,
      time: event.minute,
      teams,
      details,
      importance,
      timestamp: Date.now(),
      player,
      team
    });
  }

  // Check for status changes (HT, FT)
  private checkStatusChange(game: LiveGame, previousStatus: string): void {
    const teams = `${game.homeTeam} vs ${game.awayTeam}`;

    if (previousStatus !== 'ht' && game.status === 'ht') {
      organicTwitterService.addEvent({
        type: 'ht',
        time: game.currentMinute,
        teams,
        details: `Half Time: ${game.homeTeam} ${game.homeScore} - ${game.awayScore} ${game.awayTeam}`,
        importance: 'medium'
      });
    }

    if (previousStatus !== 'ft' && game.status === 'ft') {
      organicTwitterService.addEvent({
        type: 'ft',
        time: game.currentMinute,
        teams,
        details: `Full Time: ${game.homeTeam} ${game.homeScore} - ${game.awayScore} ${game.awayTeam}`,
        importance: 'high'
      });
      
      // Remove game from active monitoring
      this.liveGames.delete(game.id);
    }
  }

  // Map FPL status to our status
  private mapStatus(fplStatus: string): LiveGame['status'] {
    switch (fplStatus) {
      case 'L': return 'live';
      case 'HT': return 'ht';
      case 'FT': return 'ft';
      default: return 'scheduled';
    }
  }

  // Get team name from ID (mock - integrate with your team data)
  private getTeamName(teamId: number): string {
    const teams: Record<number, string> = {
      1: 'Arsenal',
      3: 'Man City',
      8: 'Liverpool',
      14: 'Man Utd'
    };
    return teams[teamId] || `Team ${teamId}`;
  }

  // Get current monitoring status
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      activeGames: this.liveGames.size,
      lastUpdate: this.lastUpdate ? new Date(this.lastUpdate).toISOString() : null,
      processedEvents: this.processedEvents.size,
      isMatchTime: this.isMatchTime()
    };
  }

  // Get active games summary
  getActiveGames(): any[] {
    return Array.from(this.liveGames.values()).map(game => ({
      id: game.id,
      teams: `${game.homeTeam} vs ${game.awayTeam}`,
      score: `${game.homeScore} - ${game.awayScore}`,
      status: game.status,
      minute: game.currentMinute,
      events: game.events.length
    }));
  }

  // Force update (for testing)
  async forceUpdate(): Promise<void> {
    await this.updateLiveGames();
  }

  // Add manual event (for testing)
  addManualEvent(event: Omit<GameEvent, 'id' | 'timestamp'>): void {
    organicTwitterService.addEvent(event);
  }
}

export const liveGameMonitor = new LiveGameMonitor();
export type { LiveGame, LiveGameData };


