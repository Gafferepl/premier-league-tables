// Twitter Integration Service
// Connects live game monitoring with organic Twitter posting

import { organicTwitterService } from './organicTwitterService';
import { liveGameMonitor } from './liveGameMonitor';

interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

interface PostingSchedule {
  preMatch: number; // hours before kickoff
  liveUpdates: boolean;
  postMatch: boolean;
  maxTweetsPerDay: number;
}

class TwitterIntegrationService {
  private isConfigured = false;
  private isRunning = false;
  private config: TwitterConfig | null = null;
  private postingSchedule: PostingSchedule;

  constructor() {
    this.postingSchedule = {
      preMatch: 1,
      liveUpdates: true,
      postMatch: true,
      maxTweetsPerDay: 50
    };
  }

  // Configure Twitter API credentials
  configure(config: TwitterConfig): void {
    this.config = config;
    this.isConfigured = true;
    // console.log('Twitter service configured');
  }

  // Start the complete integration
  async start(): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Twitter service not configured. Call configure() first.');
    }

    if (this.isRunning) {
      // console.log('Twitter integration already running');
      return;
    }

    // console.log('Starting Twitter integration service...');

    // Start the organic Twitter service
    organicTwitterService.start();

    // Start live game monitoring
    liveGameMonitor.start();

    // Start pre-match scheduling
    this.startPreMatchScheduling();

    this.isRunning = true;
    // console.log('Twitter integration service started successfully');
  }

  // Stop the integration
  stop(): void {
    if (!this.isRunning) return;

    // console.log('Stopping Twitter integration service...');

    organicTwitterService.stop();
    liveGameMonitor.stop();

    this.isRunning = false;
    // console.log('Twitter integration service stopped');
  }

  // Start pre-match scheduling
  private startPreMatchScheduling(): void {
    // Check every 30 minutes for upcoming matches
    setInterval(async () => {
      if (this.isRunning) {
        await this.checkUpcomingMatches();
      }
    }, 1800000); // 30 minutes
  }

  // Check for upcoming matches and post pre-match content
  private async checkUpcomingMatches(): Promise<void> {
    try {
      const upcomingMatches = await this.getUpcomingMatches();
      
      for (const match of upcomingMatches) {
        const timeUntilKickoff = match.kickoffTime.getTime() - Date.now();
        const hoursUntil = timeUntilKickoff / (1000 * 60 * 60);

        // Post 1 hour before kickoff
        if (hoursUntil <= 1.1 && hoursUntil >= 0.9) {
          await this.postPreMatchTweet(match);
        }
      }
    } catch (error) {
      // console.error('Error checking upcoming matches:', error);
    }
  }

  // Get upcoming matches (mock implementation)
  private async getUpcomingMatches(): Promise<any[]> {
    // This would integrate with your fixture service
    return [
      {
        id: 1,
        homeTeam: 'Arsenal',
        awayTeam: 'Manchester City',
        kickoffTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        stadium: 'Emirates Stadium'
      },
      {
        id: 2,
        homeTeam: 'Liverpool',
        awayTeam: 'Manchester United',
        kickoffTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        stadium: 'Anfield'
      }
    ];
  }

  // Post pre-match tweet
  private async postPreMatchTweet(match: any): Promise<void> {
    const content = `🏆 PREVIEW: ${match.homeTeam} vs ${match.awayTeam}\n\n⏰ Kickoff in 1 hour\n📍 ${match.stadium}\n\nWho are you backing? 🤔\n\n#PremierLeague #${match.homeTeam.replace(/\s+/g, '')}vs${match.awayTeam.replace(/\s+/g, '')}`;

    try {
      await organicTwitterService.postTweet(content);
      // console.log(`Pre-match tweet posted for ${match.homeTeam} vs ${match.awayTeam}`);
    } catch (error) {
      // console.error('Failed to post pre-match tweet:', error);
    }
  }

  // Post engagement tweet (questions, polls, etc.)
  async postEngagementTweet(type: 'question' | 'poll' | 'stat'): Promise<void> {
    const engagementContent = this.generateEngagementContent(type);
    
    try {
      await organicTwitterService.postTweet(engagementContent);
      // console.log(`Engagement tweet posted: ${type}`);
    } catch (error) {
      // console.error('Failed to post engagement tweet:', error);
    }
  }

  // Generate engagement content
  private generateEngagementContent(type: 'question' | 'poll' | 'stat'): string {
    switch (type) {
      case 'question':
        const questions = [
          "🤔 Who's your pick for Player of the Season so far?\n\n👇 Drop your choice below! 👇\n\n#PremierLeague #POTY",
          "⚽ Most surprising result this weekend?\n\nShare your thoughts! 👇\n\n#PremierLeague #Football",
          "🏆 Which team needs a January transfer window boost the most?\n\nVote below! 👇\n\n#PremierLeague #TransferWindow"
        ];
        return questions[Math.floor(Math.random() * questions.length)];

      case 'poll':
        const polls = [
          "📊 POLL: Who will finish in the Top 4 this season?\n\n🔵 Arsenal\n🔴 Man City\n🔵 Liverpool\n🔴 Chelsea\n\nVote! 👇\n\n#PremierLeague #Top4Race",
          "⚽ POLL: Best striker in the Premier League?\n\n⚽ Haaland\n⚽ Salah\n⚽ Saka\n⚽ Isak\n\nVote! 👇\n\n#PremierLeague #Strikers"
        ];
        return polls[Math.floor(Math.random() * polls.length)];

      case 'stat':
        const stats = [
          "📈 STAT ATTACK: Manchester City have won 15 of their last 17 Premier League games!\n\nCan anyone stop them? 🤔\n\n#PremierLeague #ManCity",
          "🔥 ON FIRE: Bukayo Saka has been involved in 12 goals in his last 10 games!\n\nIncredible form! ⚽\n\n#PremierLeague #Saka",
          "🏆 RECORD WATCH: Liverpool are unbeaten in 20 games across all competitions!\n\nInvincibles 2.0? 👀\n\n#PremierLeague #Liverpool"
        ];
        return stats[Math.floor(Math.random() * stats.length)];

      default:
        return "🏆 Premier League action this weekend! Who are you excited to watch? ⚽\n\n#PremierLeague #Football";
    }
  }

  // Post promotional content
  async postPromotionalTweet(): Promise<void> {
    const promotionalContent = [
      "🏆 Check out our Premier League stats and predictions!\n\n📊 League tables\n⚽ Fixtures\n🎮 Beat The Gaffer game\n\n👉 premierleaguetables.com\n\n#PremierLeague #FootballStats",
      "🎮 Think you know your Premier League?\n\nTest your knowledge with our Beat The Gaffer game!\n\n👉 premierleaguetables.com\n\n#PremierLeague #FootballQuiz",
      "📊 Live Premier League stats and analysis!\n\nReal-time updates\n📈 Form tables\n⚽ Player stats\n\n👉 premierleaguetables.com\n\n#PremierLeague #Stats"
    ];

    const content = promotionalContent[Math.floor(Math.random() * promotionalContent.length)];

    try {
      await organicTwitterService.postTweet(content);
      // console.log('Promotional tweet posted');
    } catch (error) {
      // console.error('Failed to post promotional tweet:', error);
    }
  }

  // Manual tweet posting (for special events)
  async postManualTweet(content: string): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('Twitter service not configured');
    }

    return await organicTwitterService.postTweet(content);
  }

  // Get comprehensive status
  getStatus() {
    return {
      isRunning: this.isRunning,
      isConfigured: this.isConfigured,
      twitterService: organicTwitterService.getStatus(),
      liveMonitor: liveGameMonitor.getStatus(),
      postingSchedule: this.postingSchedule,
      activeGames: liveGameMonitor.getActiveGames()
    };
  }

  // Get analytics dashboard
  getAnalytics() {
    const twitterAnalytics = organicTwitterService.getAnalytics();
    
    return {
      ...twitterAnalytics,
      integrationStatus: {
        isRunning: this.isRunning,
        uptime: this.isRunning ? Date.now() : 0,
        activeGames: liveGameMonitor.getActiveGames().length
      },
      recommendations: this.generateRecommendations(twitterAnalytics)
    };
  }

  // Generate recommendations based on analytics
  private generateRecommendations(analytics: any): string[] {
    const recommendations: string[] = [];

    if (analytics.averageEngagement < 2) {
      recommendations.push("Consider posting more engaging content like questions and polls");
    }

    if (analytics.postingFrequency < 5) {
      recommendations.push("Increase posting frequency during match days for better engagement");
    }

    if (analytics.growthPhase < 3) {
      recommendations.push("Focus on building follower base with consistent posting");
    }

    return recommendations;
  }

  // Update posting schedule
  updateSchedule(newSchedule: Partial<PostingSchedule>): void {
    this.postingSchedule = { ...this.postingSchedule, ...newSchedule };
    // console.log('Posting schedule updated:', this.postingSchedule);
  }

  // Test the integration (for development)
  async testIntegration(): Promise<void> {
    // console.log('Testing Twitter integration...');

    // Test manual tweet
    try {
      const tweetId = await this.postManualTweet("🧪 Testing Twitter integration - everything looks good! 🏆⚽\n\n#PremierLeague #Test");
      // console.log(`Test tweet posted: ${tweetId}`);
    } catch (error) {
      // console.error('Test tweet failed:', error);
    }

    // Test event addition
    try {
      organicTwitterService.addEvent({
        type: 'goal',
        time: 25,
        teams: 'Test Team A vs Test Team B',
        details: 'Test Player',
        importance: 'high'
      });
      // console.log('Test event added to queue');
    } catch (error) {
      // console.error('Test event failed:', error);
    }

    // console.log('Twitter integration test completed');
  }
}

export const twitterIntegration = new TwitterIntegrationService();
export type { TwitterConfig, PostingSchedule };


