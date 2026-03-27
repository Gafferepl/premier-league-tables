// Organic Twitter/X Automation Service
// Smart event grouping, rate limiting, and organic growth simulation

interface GameEvent {
  id: string;
  type: 'goal' | 'card' | 'penalty' | 'substitution' | 'kickoff' | 'ht' | 'ft' | 'var' | 'injury' | 'milestone' | 'weather' | 'missed_penalty';
  time: number;
  teams: string;
  details: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  player?: string;
  team?: string;
}

interface TweetMetrics {
  tweetId: string;
  content: string;
  timestamp: number;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
  };
  performance: {
    engagementRate: number;
    reach: number;
    virality: number;
  };
}

interface GrowthPhase {
  week: number;
  maxTweets: number;
  delayRange: [number, number]; // min/max seconds between tweets
  contentTypes: {
    liveUpdates: number;
    stats: number;
    engagement: number;
    promotional: number;
  };
}

class OrganicTwitterService {
  private eventQueue: GameEvent[] = [];
  private tweetHistory: TweetMetrics[] = [];
  private dailyCount = 0;
  private last15Min: number[] = [];
  private lastTweet = 0;
  private currentWeek = 1;
  private isRunning = false;

  // API Rate Limits (Twitter API v2)
  private readonly API_LIMITS = {
    FREE: { tweets_per_24h: 300, tweets_per_15min: 300 },
    BASIC: { tweets_per_24h: 1500, tweets_per_15min: 300 },
    PRO: { tweets_per_24h: 3000, tweets_per_15min: 300 }
  };

  // Anti-repetition system
  private usedQuotes = new Map<string, Set<string>>();
  
  // Smart timing delays by event type (in seconds)
  private readonly EVENT_DELAYS = {
    'missed_penalty': [300, 420],     // 5-7 minutes - quick reaction
    'var': [180, 300],               // 3-5 minutes - immediate updates
    'injury': [480, 600],            // 8-10 minutes - allow treatment time
    'substitution': [600, 720],       // 10-12 minutes - normal timing
    'milestone': [900, 1080],        // 15-18 minutes - let moment build
    'weather': [1200, 1440],         // 20-24 minutes - lower priority
    'goal': [60, 180],               // 1-3 minutes - immediate
    'card': [120, 240],              // 2-4 minutes
    'kickoff': [0, 60],              // Immediate
    'ht': [0, 120],                  // 0-2 minutes
    'ft': [0, 120]                   // 0-2 minutes
  };

  // Organic Growth Phases
  private readonly GROWTH_PHASES: GrowthPhase[] = [
    {
      week: 1,
      maxTweets: 3,
      delayRange: [1800, 3600], // 30-60 minutes
      contentTypes: { liveUpdates: 0.8, stats: 0.1, engagement: 0.1, promotional: 0.0 }
    },
    {
      week: 2,
      maxTweets: 4,
      delayRange: [1500, 3000], // 25-50 minutes
      contentTypes: { liveUpdates: 0.7, stats: 0.15, engagement: 0.1, promotional: 0.05 }
    },
    {
      week: 3,
      maxTweets: 6,
      delayRange: [1200, 2400], // 20-40 minutes
      contentTypes: { liveUpdates: 0.6, stats: 0.2, engagement: 0.15, promotional: 0.05 }
    },
    {
      week: 4,
      maxTweets: 8,
      delayRange: [900, 1800], // 15-30 minutes
      contentTypes: { liveUpdates: 0.6, stats: 0.2, engagement: 0.15, promotional: 0.05 }
    },
    {
      week: 5,
      maxTweets: 10,
      delayRange: [720, 1440], // 12-24 minutes
      contentTypes: { liveUpdates: 0.6, stats: 0.2, engagement: 0.15, promotional: 0.05 }
    },
    {
      week: 6,
      maxTweets: 12,
      delayRange: [600, 1200], // 10-20 minutes
      contentTypes: { liveUpdates: 0.6, stats: 0.2, engagement: 0.15, promotional: 0.05 }
    }
  ];

  // Tweet Templates
  private readonly TWEET_TEMPLATES = {
    KICKOFF: (games: string[]) => {
      const gameList = games.slice(0, 3).join(' • ');
      const moreGames = games.length > 3 ? ` +${games.length - 3} more` : '';
      return `🟢 KICK OFF! ${games.length} games underway\n${gameList}${moreGames}\n\n#PremierLeague #EPL`;
    },
    
    GOAL: (scorer: string, team: string, time: string) =>
      `⚽ GOAL! ${scorer} (${team}) ${time}'\n\n#PremierLeague #${team.replace(/\s+/g, '')}`,
    
    MULTIPLE_GOALS: (goals: GameEvent[]) => {
      let tweet = "⚽ GOAL RUSH! 🏆\n\n";
      goals.forEach(goal => {
        tweet += `• ${goal.details} (${goal.teams}) ${goal.time}'\n`;
      });
      tweet += `\n#PremierLeague #GoalFest`;
      return tweet;
    },
    
    HALFTIME: (games: any[]) => {
      let tweet = "⏱️ HALF TIME SCORES\n\n";
      games.forEach(game => {
        tweet += `${game.home} ${game.score} ${game.away}\n`;
      });
      tweet += `\n#PremierLeague #HT`;
      return tweet;
    },
    
    REDCARD: (player: string, team: string, time: string) =>
      `🔴 RED CARD! ${player} (${team}) ${time}'\n\n#PremierLeague #RedCard`,
    
    FULLTIME: (results: any[]) => {
      let tweet = "🏁 FULL TIME RESULTS\n\n";
      results.forEach(result => {
        tweet += `${result.home} ${result.score} ${result.away}\n`;
      });
      tweet += `\n#PremierLeague #FT`;
      return tweet;
    },

    // Gaffer-style templates with anti-repetition
    MISSED_PENALTY: [
      (player: string, team: string) =>
        `❌ PENALTY MISSED! ${player} (${team})\n\n🎭 Gaffer: 'Should have asked the ball boy to step up! That was worse than my Sunday league effort!'\n\n#PremierLeague #PenaltyMiss`,
      
      (player: string, team: string) =>
        `❌ PENALTY MISSED! ${player} (${team})\n\n🎭 Gaffer: 'My nan could have scored that! Pressure got to him! Proper bottle job!'\n\n#PremierLeague #PenaltyMiss`,
      
      (player: string, team: string) =>
        `❌ PENALTY MISSED! ${player} (${team})\n\n🎭 Gaffer: 'That's why they pay the keeper the big money! Looked like he'd never taken one before!'\n\n#PremierLeague #PenaltyMiss`,
      
      (player: string, team: string) =>
        `❌ PENALTY MISSED! ${player} (${team})\n\n🎭 Gaffer: 'Even the ball boys were laughing at that one! Time for the penalty practice!'\n\n#PremierLeague #PenaltyMiss`
    ],

    VAR_PENALTY_REVIEW: [
      (team: string) =>
        `⚠️ VAR CHECK: Penalty review for ${team}...\n\n🎭 Gaffer: 'Even my grandma could see that's a penalty! Clear as day!'\n\n#PremierLeague #VAR`,
      
      (team: string) =>
        `⚠️ VAR CHECK: Penalty review for ${team}...\n\n🎭 Gaffer: 'Ref needs his glasses checked! That's softer than a Sunday morning kickabout!'\n\n#PremierLeague #VAR`,
      
      (team: string) =>
        `⚠️ VAR CHECK: Penalty review for ${team}...\n\n🎭 Gaffer: 'Been watching too much diving practice in training! Get up and play proper football!'\n\n#PremierLeague #VAR`
    ],

    VAR_GOAL_DISALLOWED: [
      (team: string) =>
        `⚠️ VAR CHECK: Goal disallowed for offside (${team})\n\n🎭 Gaffer: 'Linesman's got his laser eyes working today! Millimetres matter!'\n\n#PremierLeague #VAR`,
      
      (team: string) =>
        `⚠️ VAR CHECK: Goal disallowed for foul (${team})\n\n🎭 Gaffer: 'That's not a foul, that's just proper defending! Health and safety gone mad!'\n\n#PremierLeague #VAR`,
      
      (team: string) =>
        `⚠️ VAR CHECK: Goal disallowed (${team})\n\n🎭 Gaffer: 'VAR's gone mad again! What happened to letting them play football!'\n\n#PremierLeague #VAR`
    ],

    SUBSTITUTION: [
      (playerOn: string, playerOff: string, team: string, minute: string) =>
        `🔄 SUB: ${playerOff} OFF → ${playerOn} ON (${team}) ${minute}'\n\n🎭 Gaffer: 'Time to bring on the magician! ${playerOff} did the hard work, now ${playerOn} to finish it!'\n\n#PremierLeague`,
      
      (playerOn: string, playerOff: string, team: string, minute: string) =>
        `🔄 SUB: ${playerOff} OFF → ${playerOn} ON (${team}) ${minute}'\n\n🎭 Gaffer: '${playerOff}'s run himself into the ground! ${playerOn} fresh legs to cause trouble!'\n\n#PremierLeague`,
      
      (playerOn: string, playerOff: string, team: string, minute: string) =>
        `🔄 SUB: ${playerOff} OFF → ${playerOn} ON (${team}) ${minute}'\n\n🎭 Gaffer: 'Manager's had enough! ${playerOn} needs to make an impact or it's the bench for good!'\n\n#PremierLeague`
    ],

    INJURY: [
      (player: string, team: string) =>
        `🏥 INJURY UPDATE: ${player} (${team}) down receiving treatment\n\n🎭 Gaffer: 'That's a proper knock! Hope he's alright, ${team} need their big man!'\n\n#PremierLeague`,
      
      (player: string, team: string) =>
        `🏥 INJURY UPDATE: ${player} (${team}) limping off\n\n🎭 Gaffer: 'That's a blow for ${team}! ${player}'s their engine room! Time for Plan B!'\n\n#PremierLeague`,
      
      (player: string, team: string) =>
        `🏥 INJURY UPDATE: ${player} (${team}) needs attention\n\n🎭 Gaffer: '${player}'s taken a proper whack! Tough lad, he'll be back up in a minute!'\n\n#PremierLeague`
    ],

    MILESTONE: [
      (player: string, team: string, milestone: string) =>
        `🏆 ${milestone}! ${player} (${team})\n\n🎭 Gaffer: 'Proper achievement! ${player} - legend in the making!'\n\n#PremierLeague #Milestone`,
      
      (player: string, team: string, milestone: string) =>
        `🏆 ${milestone}! ${player} (${team})\n\n🎭 Gaffer: 'What a player! ${player} just keeps delivering the goods!'\n\n#PremierLeague #Milestone`,
      
      (player: string, team: string, milestone: string) =>
        `🏆 ${milestone}! ${player} (${team})\n\n🎭 Gaffer: 'Proper professional! ${player} - one of the best in the business!'\n\n#PremierLeague #Milestone`
    ],

    WEATHER: [
      (stadium: string, condition: string) =>
        `🌧️ ${condition} at ${stadium} affecting play...\n\n🎭 Gaffer: 'Perfect weather for proper mud and thunder football! No fancy stuff today!'\n\n#PremierLeague #Weather`,
      
      (stadium: string, condition: string) =>
        `☀️ ${condition} at the ${stadium}...\n\n🎭 Gaffer: 'Players will be feeling this in the second half! Hope they remembered their water bottles!'\n\n#PremierLeague #Weather`,
      
      (stadium: string, condition: string) =>
        `💨 ${condition} at ${stadium}...\n\n🎭 Gaffer: 'Long balls will be flying everywhere today! Keepers will have their work cut out!'\n\n#PremierLeague #Weather`
    ],

    MULTIPLE_EVENTS: (events: GameEvent[]) => {
      const grouped = this.groupEventsByGame(events);
      let tweet = "🏆 Premier League Updates ⚽\n\n";
      
      Object.entries(grouped).forEach(([game, gameEvents]) => {
        tweet += `📍 ${game}\n`;
        gameEvents.forEach(event => {
          tweet += this.formatEvent(event);
        });
        tweet += "\n";
      });
      
      return tweet;
    }
  };

  // Check if we can post (rate limiting)
  canPost(): boolean {
    const now = Date.now();
    
    // Clean old 15-minute history
    this.last15Min = this.last15Min.filter(time => now - time < 900000); // 15 minutes
    
    // Check 15-minute limit
    if (this.last15Min.length >= 300) {
      // console.warn('15-minute tweet limit reached');
      return false;
    }
    
    // Check daily limit
    if (this.dailyCount >= 1500) {
      // console.warn('Daily tweet limit reached');
      return false;
    }
    
    return true;
  }

  // Get unique quote with anti-repetition
  private getUniqueQuote(eventType: string, team: string, ...args: any[]): string {
    const currentMonth = new Date().toISOString().slice(0, 7); // "2025-02"
    const key = `${eventType}_${team}_${currentMonth}`;
    
    const templates = this.TWEET_TEMPLATES[eventType as keyof typeof this.TWEET_TEMPLATES];
    if (!templates || !Array.isArray(templates)) {
      // Handle single template functions
      const template = templates as any;
      return template(...args);
    }
    
    const usedThisMonth = this.usedQuotes.get(key) || new Set<string>();
    
    // Find unused quote
    const unusedQuotes = templates.filter((template: any) => !usedThisMonth.has(template.toString()));
    
    let selectedTemplate: any;
    if (unusedQuotes.length === 0) {
      // All quotes used, reset for this month
      usedThisMonth.clear();
      selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    } else {
      selectedTemplate = unusedQuotes[Math.floor(Math.random() * unusedQuotes.length)];
    }
    
    usedThisMonth.add(selectedTemplate.toString());
    this.usedQuotes.set(key, usedThisMonth);
    
    return selectedTemplate(...args);
  }

  // Get smart delay based on event type
  private getEventDelay(eventType: string): number {
    const delays = this.EVENT_DELAYS[eventType as keyof typeof this.EVENT_DELAYS];
    if (!delays) {
      return 600; // Default 10 minutes
    }
    
    const [min, max] = delays;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Add event to queue
  addEvent(event: Omit<GameEvent, 'id' | 'timestamp'>): void {
    const fullEvent: GameEvent = {
      ...event,
      id: `${event.type}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now()
    };
    
    this.eventQueue.push(fullEvent);
    // console.log(`Event added to queue: ${event.type} - ${event.teams}`);
  }

  // Check if we should post now (smart grouping logic)
  shouldPostNow(event?: GameEvent): boolean {
    const now = Date.now();
    const timeSinceLastTweet = now - this.lastTweet;
    
    // Critical events post immediately
    if (event?.importance === 'critical') {
      return true;
    }
    
    // Group rapid events within 2 minutes
    if (timeSinceLastTweet < 120000 && this.eventQueue.length < 5) {
      return false;
    }
    
    // Post if queue has enough events
    if (this.eventQueue.length >= 3) {
      return true;
    }
    
    // Post if it's been too long
    if (timeSinceLastTweet > 300000) { // 5 minutes
      return true;
    }
    
    return false;
  }

  // Group events by game
  private groupEventsByGame(events: GameEvent[]): Record<string, GameEvent[]> {
    return events.reduce((groups, event) => {
      if (!groups[event.teams]) {
        groups[event.teams] = [];
      }
      groups[event.teams].push(event);
      return groups;
    }, {} as Record<string, GameEvent[]>);
  }

  // Format individual event
  private formatEvent(event: GameEvent): string {
    switch (event.type) {
      case 'goal':
        return `⚽ ${event.details} ${event.time}'\n`;
      case 'card':
        return event.details.includes('red') ? `🔴 ${event.details} ${event.time}'\n` : `🟡 ${event.details} ${event.time}'\n`;
      case 'penalty':
        return `🎯 ${event.details} ${event.time}'\n`;
      default:
        return `• ${event.details} ${event.time}'\n`;
    }
  }

  // Format tweet based on events
  formatTweet(events: GameEvent[]): string {
    if (events.length === 1) {
      const event = events[0];
      switch (event.type) {
        case 'kickoff':
          return this.TWEET_TEMPLATES.KICKOFF([event.teams]);
        case 'goal':
          return this.TWEET_TEMPLATES.GOAL(event.details, event.teams, event.time.toString());
        case 'missed_penalty':
          return this.getUniqueQuote('MISSED_PENALTY', event.team || event.teams, event.player || 'Player', event.team || 'Team');
        case 'var':
          if (event.details.includes('penalty')) {
            return this.getUniqueQuote('VAR_PENALTY_REVIEW', event.team || event.teams);
          } else if (event.details.includes('disallowed') || event.details.includes('offside')) {
            return this.getUniqueQuote('VAR_GOAL_DISALLOWED', event.team || event.teams);
          }
          return `⚠️ VAR CHECK: ${event.details}\n\n#PremierLeague #VAR`;
        case 'substitution':
          const players = event.details.match(/(\w+) → (\w+)/);
          if (players) {
            return this.getUniqueQuote('SUBSTITUTION', players[2], players[1], event.team || event.teams, event.time.toString());
          }
          return `🔄 ${event.details} ${event.time}'\n\n#PremierLeague`;
        case 'injury':
          return this.getUniqueQuote('INJURY', event.player || 'Player', event.team || event.teams);
        case 'milestone':
          return this.getUniqueQuote('MILESTONE', event.player || 'Player', event.team || event.teams, event.details);
        case 'weather':
          const stadium = event.teams.split(' vs ')[0] || 'Stadium';
          return this.getUniqueQuote('WEATHER', stadium, event.details);
        case 'ht':
          return this.TWEET_TEMPLATES.HALFTIME([]); // Would need real game data
        case 'ft':
          return this.TWEET_TEMPLATES.FULLTIME([]); // Would need real game data
        case 'card':
          if (event.details.includes('red')) {
            return this.TWEET_TEMPLATES.REDCARD(event.player || 'Player', event.team || event.teams, event.time.toString());
          }
          return `🟡 Yellow card: ${event.details} ${event.time}'\n\n#PremierLeague`;
        default:
          return `• ${event.details} ${event.time}'\n\n#PremierLeague`;
      }
    }
    
    // Multiple events
    const goals = events.filter(e => e.type === 'goal');
    if (goals.length > 1) {
      return this.TWEET_TEMPLATES.MULTIPLE_GOALS(goals);
    }
    
    return this.TWEET_TEMPLATES.MULTIPLE_EVENTS(events);
  }

  // Post tweet (mock implementation)
  async postTweet(content: string): Promise<string> {
    if (!this.canPost()) {
      throw new Error('Rate limit exceeded');
    }
    
    // Mock Twitter API call
    const tweetId = `tweet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update tracking
    const now = Date.now();
    this.last15Min.push(now);
    this.dailyCount++;
    this.lastTweet = now;
    
    // Create metrics record
    const metrics: TweetMetrics = {
      tweetId,
      content,
      timestamp: now,
      engagement: { likes: 0, retweets: 0, replies: 0, impressions: 0 },
      performance: { engagementRate: 0, reach: 0, virality: 0 }
    };
    
    this.tweetHistory.push(metrics);
    
    // console.log(`Tweet posted: ${tweetId}`);
    // console.log(`Content: ${content}`);
    
    return tweetId;
  }

  // Process event queue
  async processEventQueue(): Promise<void> {
    while (this.eventQueue.length > 0 && this.shouldPostNow()) {
      const eventsToPost = this.getEventsToPost();
      if (eventsToPost.length === 0) break;
      
      const tweetContent = this.formatTweet(eventsToPost);
      
      try {
        await this.postTweet(tweetContent);
        
        // Remove posted events from queue
        this.eventQueue = this.eventQueue.filter(
          event => !eventsToPost.includes(event)
        );
        
        // Add organic delay
        const delay = this.getOrganicDelay();
        await this.sleep(delay * 1000);
        
      } catch (error) {
        // console.error('Failed to post tweet:', error);
        break;
      }
    }
  }

  // Get events to post (grouping logic)
  private getEventsToPost(): GameEvent[] {
    if (this.eventQueue.length === 0) return [];
    
    // Check for critical events
    const criticalEvents = this.eventQueue.filter(e => e.importance === 'critical');
    if (criticalEvents.length > 0) {
      return [criticalEvents[0]]; // Post critical events immediately
    }
    
    // Group recent events
    const now = Date.now();
    const recentEvents = this.eventQueue.filter(e => now - e.timestamp < 120000);
    
    if (recentEvents.length >= 3) {
      return recentEvents.slice(0, 5); // Post up to 5 recent events
    }
    
    // Post oldest event if queue is getting full
    if (this.eventQueue.length >= 5) {
      return [this.eventQueue[0]];
    }
    
    return [];
  }

  // Get organic delay based on growth phase
  private getOrganicDelay(): number {
    const phase = this.GROWTH_PHASES[Math.min(this.currentWeek - 1, this.GROWTH_PHASES.length - 1)];
    const [min, max] = phase.delayRange;
    
    // Add random variation for organic feel
    const baseDelay = min + Math.random() * (max - min);
    const randomVariation = Math.random() * 300; // 0-5 minutes random
    
    return baseDelay + randomVariation;
  }

  // Sleep helper
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Start the service
  start(): void {
    if (this.isRunning) {
      // console.log('Twitter service already running');
      return;
    }
    
    this.isRunning = true;
    // console.log('Organic Twitter service started');
    
    // Main processing loop
    setInterval(async () => {
      if (this.isRunning) {
        await this.processEventQueue();
      }
    }, 30000); // Check every 30 seconds
  }

  // Stop the service
  stop(): void {
    this.isRunning = false;
    // console.log('Twitter service stopped');
  }

  // Get current status
  getStatus() {
    const phase = this.GROWTH_PHASES[Math.min(this.currentWeek - 1, this.GROWTH_PHASES.length - 1)];
    
    return {
      isRunning: this.isRunning,
      currentWeek: this.currentWeek,
      dailyCount: this.dailyCount,
      queueSize: this.eventQueue.length,
      tweetsPosted: this.tweetHistory.length,
      currentPhase: phase,
      canPost: this.canPost(),
      lastTweet: this.lastTweet ? new Date(this.lastTweet).toISOString() : null
    };
  }

  // Advance to next week (for growth simulation)
  advanceWeek(): void {
    this.currentWeek++;
    // console.log(`Advanced to week ${this.currentWeek}`);
  }

  // Get performance analytics
  getAnalytics(): any {
    const recentTweets = this.tweetHistory.slice(-50); // Last 50 tweets
    
    return {
      totalTweets: this.tweetHistory.length,
      averageEngagement: recentTweets.reduce((sum, tweet) => 
        sum + tweet.performance.engagementRate, 0) / recentTweets.length,
      topPerformingTweets: recentTweets
        .sort((a, b) => b.performance.engagementRate - a.performance.engagementRate)
        .slice(0, 5),
      postingFrequency: this.calculatePostingFrequency(),
      growthPhase: this.currentWeek
    };
  }

  private calculatePostingFrequency(): number {
    const now = Date.now();
    const dayAgo = now - 86400000; // 24 hours ago
    const recentTweets = this.tweetHistory.filter(t => t.timestamp > dayAgo);
    return recentTweets.length;
  }
}

export const organicTwitterService = new OrganicTwitterService();
export type { GameEvent, TweetMetrics, GrowthPhase };


