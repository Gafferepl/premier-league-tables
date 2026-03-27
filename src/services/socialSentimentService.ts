// Social Sentiment Service - Twitter & Reddit API Integration
// Analyzes FPL community sentiment using free APIs

interface PlayerSentiment {
  score: number; // 0-100
  mentions: number;
  trend: 'rising' | 'stable' | 'falling';
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
}

interface SentimentData {
  [playerName: string]: PlayerSentiment;
}

interface ComprehensiveSentiment {
  players: SentimentData;
  trending: string[];
  buzzWords: string[];
  communityMood: 'bullish' | 'bearish' | 'neutral';
}

class SocialSentimentService {
  private twitterToken: string;
  private redditClientId: string;
  private redditClientSecret: string;
  private cacheKey = 'sentiment_cache';
  private cacheHours = 2;

  constructor() {
    this.twitterToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN || import.meta.env.TWITTER_BEARER_TOKEN || '';
    this.redditClientId = import.meta.env.VITE_REDDIT_CLIENT_ID || import.meta.env.REDDIT_CLIENT_ID || '';
    this.redditClientSecret = import.meta.env.VITE_REDDIT_CLIENT_SECRET || import.meta.env.REDDIT_CLIENT_SECRET || '';
  }

  /**
   * Get player sentiment data
   */
  async getPlayerSentiment(): Promise<SentimentData> {
    const cached = this.getCached('player');
    if (cached) {
      // console.log('✅ Using cached player sentiment');
      return cached;
    }

    try {
      const [twitterData, redditData] = await Promise.all([
        this.getTwitterSentiment(),
        this.getRedditSentiment()
      ]);

      const combined = this.combineSentiment(twitterData, redditData);
      this.cache('player', combined);
      return combined;
    } catch (error) {
      // console.error('❌ Sentiment analysis error:', error);
      return this.getMockSentiment();
    }
  }

  /**
   * Get comprehensive sentiment analysis
   */
  async getComprehensiveSentiment(): Promise<ComprehensiveSentiment> {
    const cached = this.getCached('comprehensive');
    if (cached) {
      // console.log('✅ Using cached comprehensive sentiment');
      return cached;
    }

    try {
      const playerSentiment = await this.getPlayerSentiment();
      const trending = this.identifyTrending(playerSentiment);
      const buzzWords = await this.extractBuzzWords();
      const communityMood = this.assessCommunityMood(playerSentiment);

      const comprehensive: ComprehensiveSentiment = {
        players: playerSentiment,
        trending,
        buzzWords,
        communityMood
      };

      this.cache('comprehensive', comprehensive);
      return comprehensive;
    } catch (error) {
      // console.error('❌ Comprehensive sentiment error:', error);
      return {
        players: this.getMockSentiment(),
        trending: [],
        buzzWords: [],
        communityMood: 'neutral'
      };
    }
  }

  /**
   * Get Twitter sentiment (Free tier: 500k tweets/month)
   */
  private async getTwitterSentiment(): Promise<SentimentData> {
    if (!this.twitterToken || this.twitterToken === 'your_twitter_bearer_token') {
      // console.warn('⚠️ Twitter API not configured');
      return {};
    }

    try {
      // Search for FPL-related tweets
      const query = encodeURIComponent('#FPL OR #FantasyPL -is:retweet');
      const response = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=100&tweet.fields=created_at,public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${this.twitterToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status}`);
      }

      const data = await response.json();
      return this.analyzeTwitterData(data.data || []);
    } catch (error) {
      // console.error('Twitter API error:', error);
      return {};
    }
  }

  /**
   * Get Reddit sentiment (Free: Unlimited)
   */
  private async getRedditSentiment(): Promise<SentimentData> {
    try {
      // Get hot posts from r/FantasyPL
      const response = await fetch('https://www.reddit.com/r/FantasyPL/hot.json?limit=50');
      
      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
      return this.analyzeRedditData(data.data?.children || []);
    } catch (error) {
      // console.error('Reddit API error:', error);
      return {};
    }
  }

  /**
   * Analyze Twitter data
   */
  private analyzeTwitterData(tweets: any[]): SentimentData {
    const sentiment: SentimentData = {};
    const playerNames = this.getTopPlayerNames();

    playerNames.forEach(player => {
      const relevantTweets = tweets.filter(tweet => 
        tweet.text?.toLowerCase().includes(player.toLowerCase())
      );

      if (relevantTweets.length > 0) {
        sentiment[player] = this.calculateSentiment(relevantTweets.map(t => t.text));
      }
    });

    return sentiment;
  }

  /**
   * Analyze Reddit data
   */
  private analyzeRedditData(posts: any[]): SentimentData {
    const sentiment: SentimentData = {};
    const playerNames = this.getTopPlayerNames();

    playerNames.forEach(player => {
      const relevantPosts = posts.filter(post => 
        post.data?.title?.toLowerCase().includes(player.toLowerCase()) ||
        post.data?.selftext?.toLowerCase().includes(player.toLowerCase())
      );

      if (relevantPosts.length > 0) {
        const texts = relevantPosts.map(p => `${p.data.title} ${p.data.selftext || ''}`);
        sentiment[player] = this.calculateSentiment(texts);
      }
    });

    return sentiment;
  }

  /**
   * Calculate sentiment from text array
   */
  private calculateSentiment(texts: string[]): PlayerSentiment {
    const positiveWords = ['captain', 'essential', 'must have', 'differential', 'haul', 'form', 'fixture'];
    const negativeWords = ['avoid', 'sell', 'bench', 'injury', 'rotation', 'overpriced', 'trap'];

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    texts.forEach(text => {
      const lower = text.toLowerCase();
      const hasPositive = positiveWords.some(word => lower.includes(word));
      const hasNegative = negativeWords.some(word => lower.includes(word));

      if (hasPositive && !hasNegative) positiveCount++;
      else if (hasNegative && !hasPositive) negativeCount++;
      else neutralCount++;
    });

    const total = positiveCount + negativeCount + neutralCount;
    const score = total > 0 ? Math.round((positiveCount / total) * 100) : 50;

    return {
      score,
      mentions: texts.length,
      trend: this.determineTrend(score, texts.length),
      positiveCount,
      negativeCount,
      neutralCount
    };
  }

  /**
   * Combine Twitter and Reddit sentiment
   */
  private combineSentiment(twitter: SentimentData, reddit: SentimentData): SentimentData {
    const combined: SentimentData = {};
    const allPlayers = new Set([...Object.keys(twitter), ...Object.keys(reddit)]);

    allPlayers.forEach(player => {
      const twitterSent = twitter[player];
      const redditSent = reddit[player];

      if (twitterSent && redditSent) {
        // Average the scores, sum the mentions
        combined[player] = {
          score: Math.round((twitterSent.score + redditSent.score) / 2),
          mentions: twitterSent.mentions + redditSent.mentions,
          trend: twitterSent.mentions > redditSent.mentions ? twitterSent.trend : redditSent.trend,
          positiveCount: twitterSent.positiveCount + redditSent.positiveCount,
          negativeCount: twitterSent.negativeCount + redditSent.negativeCount,
          neutralCount: twitterSent.neutralCount + redditSent.neutralCount
        };
      } else {
        combined[player] = twitterSent || redditSent;
      }
    });

    return combined;
  }

  /**
   * Determine trend based on score and mentions
   */
  private determineTrend(score: number, mentions: number): 'rising' | 'stable' | 'falling' {
    if (score > 70 && mentions > 10) return 'rising';
    if (score < 30 && mentions > 10) return 'falling';
    return 'stable';
  }

  /**
   * Identify trending players
   */
  private identifyTrending(sentiment: SentimentData): string[] {
    return Object.entries(sentiment)
      .filter(([, data]) => data.trend === 'rising')
      .sort(([, a], [, b]) => b.mentions - a.mentions)
      .slice(0, 10)
      .map(([player]) => player);
  }

  /**
   * Extract buzz words from discussions
   */
  private async extractBuzzWords(): Promise<string[]> {
    // Simplified - would analyze actual text content
    return ['captain', 'differential', 'haul', 'fixture swing', 'price rise'];
  }

  /**
   * Assess overall community mood
   */
  private assessCommunityMood(sentiment: SentimentData): 'bullish' | 'bearish' | 'neutral' {
    const scores = Object.values(sentiment).map(s => s.score);
    if (scores.length === 0) return 'neutral';

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (avgScore > 60) return 'bullish';
    if (avgScore < 40) return 'bearish';
    return 'neutral';
  }

  /**
   * Get top player names for analysis
   */
  private getTopPlayerNames(): string[] {
    return [
      'Haaland', 'Salah', 'Son', 'Kane', 'De Bruyne',
      'Saka', 'Rashford', 'Trent', 'Palmer', 'Watkins',
      'Isak', 'Bowen', 'Foden', 'Martinelli', 'Gordon',
      'Solanke', 'Mbeumo', 'Cunha', 'Eze', 'Kudus'
    ];
  }

  /**
   * Get mock sentiment (fallback)
   */
  private getMockSentiment(): SentimentData {
    const players = this.getTopPlayerNames().slice(0, 10);
    const sentiment: SentimentData = {};

    players.forEach(player => {
      sentiment[player] = {
        score: 50 + Math.random() * 40,
        mentions: Math.floor(Math.random() * 100),
        trend: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)] as any,
        positiveCount: Math.floor(Math.random() * 50),
        negativeCount: Math.floor(Math.random() * 30),
        neutralCount: Math.floor(Math.random() * 20)
      };
    });

    return sentiment;
  }

  /**
   * Cache management
   */
  private getCached(type: string): any {
    try {
      const cached = localStorage.getItem(`${this.cacheKey}_${type}`);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;
      const maxAge = this.cacheHours * 60 * 60 * 1000;

      if (age < maxAge) {
        return parsed.data;
      }

      localStorage.removeItem(`${this.cacheKey}_${type}`);
    } catch (error) {
      // console.error('Sentiment cache error:', error);
    }
    return null;
  }

  private cache(type: string, data: any): void {
    try {
      localStorage.setItem(`${this.cacheKey}_${type}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      // console.error('Sentiment cache write error:', error);
    }
  }
}

export const socialSentimentService = new SocialSentimentService();


