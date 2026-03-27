// Smart Data Cache Manager - Reduces AI API calls by using existing Supabase data
import { createClient } from '@supabase/supabase-js';

interface CachedData {
  user?: any;
  players: any[];
  fixtures: any[];
  userTeam: any;
  miniLeague: any;
  lastUpdated: Date;
  expiresAt: Date;
}

interface QuestionCache {
  question: string;
  answer: string;
  timestamp: Date;
  expiresAt: Date;
}

class DataCacheManager {
  private cache: Map<string, CachedData> = new Map();
  private questionCache: Map<string, QuestionCache> = new Map();
  private supabase: any;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromLocalStorage();
    }
  }

  // Initialize Supabase client
  initSupabase(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Load cached data from localStorage
  private loadFromLocalStorage() {
    try {
      const cached = localStorage.getItem('fpl_data_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        Object.entries(parsed).forEach(([key, value]: [string, any]) => {
          this.cache.set(key, {
            ...value,
            lastUpdated: new Date(value.lastUpdated),
            expiresAt: new Date(value.expiresAt)
          });
        });
      }

      const qCache = localStorage.getItem('fpl_question_cache');
      if (qCache) {
        const parsed = JSON.parse(qCache);
        Object.entries(parsed).forEach(([key, value]: [string, any]) => {
          this.questionCache.set(key, {
            ...value,
            timestamp: new Date(value.timestamp),
            expiresAt: new Date(value.expiresAt)
          });
        });
      }
    } catch (error) {
      // console.error('Failed to load cache:', error);
    }
  }

  // Save cache to localStorage
  private saveToLocalStorage() {
    try {
      const cacheObj: any = {};
      this.cache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem('fpl_data_cache', JSON.stringify(cacheObj));

      const qCacheObj: any = {};
      this.questionCache.forEach((value, key) => {
        qCacheObj[key] = value;
      });
      localStorage.setItem('fpl_question_cache', JSON.stringify(qCacheObj));
    } catch (error) {
      // console.error('Failed to save cache:', error);
    }
  }

  // Check if cached data is still valid
  private isCacheValid(userEmail: string): boolean {
    const cached = this.cache.get(userEmail);
    if (!cached) return false;
    return new Date() < cached.expiresAt;
  }

  // Get or fetch user data from Supabase
  async getUserData(userEmail: string, forceRefresh = false): Promise<any> {
    // Check cache first
    if (!forceRefresh && this.isCacheValid(userEmail)) {
      // console.log('✅ Using cached data - No API call needed');
      return this.cache.get(userEmail);
    }

    // Fetch fresh data from Supabase
    // console.log('🔄 Fetching fresh data from Supabase');
    try {
      const data = await this.fetchFromSupabase(userEmail);
      
      // Cache for 5 minutes
      const cachedData: CachedData = {
        ...data,
        lastUpdated: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      };

      this.cache.set(userEmail, cachedData);
      this.saveToLocalStorage();
      
      return cachedData;
    } catch (error) {
      // console.error('Failed to fetch from Supabase:', error);
      // Return stale cache if available
      return this.cache.get(userEmail) || null;
    }
  }

  // Fetch data from Supabase
  private async fetchFromSupabase(userEmail: string): Promise<any> {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    // Fetch user and team data
    const { data: user } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();

    // Fetch player stats (cached globally, not per user)
    const { data: players } = await this.supabase
      .from('players')
      .select('*');

    // Fetch fixtures
    const { data: fixtures } = await this.supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true })
      .limit(10);

    // Fetch user's FPL team if they have one
    let userTeam = null;
    if (user?.fpl_team_id) {
      const { data: team } = await this.supabase
        .from('fpl_teams')
        .select('*')
        .eq('id', user.fpl_team_id)
        .single();
      userTeam = team;
    }

    // Fetch mini-league data if user is in one
    let miniLeague = null;
    if (user?.mini_league_id) {
      const { data: league } = await this.supabase
        .from('mini_leagues')
        .select('*, members(*)')
        .eq('id', user.mini_league_id)
        .single();
      miniLeague = league;
    }

    return {
      user,
      players,
      fixtures,
      userTeam,
      miniLeague
    };
  }

  // Check if we can answer from cached questions
  checkQuestionCache(question: string): string | null {
    const normalized = this.normalizeQuestion(question);
    const cached = this.questionCache.get(normalized);
    
    if (cached && new Date() < cached.expiresAt) {
      // console.log('✅ Using cached answer - No AI API call needed');
      return cached.answer;
    }
    
    return null;
  }

  // Cache a question and answer
  cacheQuestion(question: string, answer: string, ttlMinutes = 60) {
    const normalized = this.normalizeQuestion(question);
    
    this.questionCache.set(normalized, {
      question,
      answer,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000)
    });

    this.saveToLocalStorage();
  }

  // Normalize question for caching (remove case, extra spaces, etc.)
  private normalizeQuestion(question: string): string {
    return question
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[?!.]+$/, '');
  }

  // Build context from cached data (no API call needed)
  buildContextFromCache(userEmail: string): string | null {
    const cached = this.cache.get(userEmail);
    if (!cached) return null;

    const { user, players, fixtures, userTeam, miniLeague } = cached;

    let context = `USER CONTEXT (from cached data):\n`;
    
    if (user) {
      context += `- Name: ${user.name || 'Manager'}\n`;
      context += `- Tier: ${user.tier || 'free'}\n`;
      context += `- Total Points: ${user.total_points || 'N/A'}\n`;
    }

    if (userTeam) {
      context += `\nTEAM:\n`;
      context += `- Captain: ${userTeam.captain || 'Not set'}\n`;
      context += `- Team Value: £${userTeam.team_value || 'N/A'}m\n`;
      context += `- Free Transfers: ${userTeam.free_transfers || 0}\n`;
      context += `- Bank: £${userTeam.bank || 0}m\n`;
    }

    if (miniLeague) {
      context += `\nMINI-LEAGUE:\n`;
      context += `- League: ${miniLeague.name}\n`;
      context += `- Position: ${user.league_position || 'N/A'}\n`;
      context += `- Points Behind Leader: ${miniLeague.points_behind || 'N/A'}\n`;
    }

    if (fixtures && fixtures.length > 0) {
      context += `\nUPCOMING FIXTURES (next 5):\n`;
      fixtures.slice(0, 5).forEach((f: any) => {
        context += `- ${f.home_team} vs ${f.away_team} (Difficulty: ${f.difficulty}/5)\n`;
      });
    }

    return context;
  }

  // Clear cache for a user
  clearUserCache(userEmail: string) {
    this.cache.delete(userEmail);
    this.saveToLocalStorage();
  }

  // Clear all caches
  clearAllCaches() {
    this.cache.clear();
    this.questionCache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fpl_data_cache');
      localStorage.removeItem('fpl_question_cache');
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      userDataCached: this.cache.size,
      questionsCached: this.questionCache.size,
      estimatedAPISavings: this.questionCache.size + (this.cache.size * 5) // Rough estimate
    };
  }
}

export const dataCacheManager = new DataCacheManager();


