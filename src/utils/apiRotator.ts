// Smart API Rotation System for Gaffer Chat
import { API_CONFIG, API_PRIORITY, USER_LIMITS } from '../config/chatAPIs';
import { usageTracker } from '../services/usageTracker';
import { dataCacheManager } from './dataCacheManager';

interface APIUsage {
  daily: { [key: string]: number };
  monthly: { [key: string]: number };
  lastReset: string;
}

interface UserUsage {
  [email: string]: {
    daily: number;
    monthly: number;
    lastReset: string;
    lastMonthlyReset: string;
  };
}

class APIRotator {
  private usage: APIUsage;
  private userUsage: UserUsage;

  constructor() {
    this.usage = {
      daily: { groq: 0, deepseek: 0, openai: 0, gemini: 0 },
      monthly: { groq: 0, deepseek: 0, openai: 0, gemini: 0 },
      lastReset: new Date().toDateString()
    };
    this.userUsage = {};
    this.loadUsage();
  }

  private loadUsage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('apiUsage');
      if (stored) {
        this.usage = JSON.parse(stored);
      }
      const userStored = localStorage.getItem('userChatUsage');
      if (userStored) {
        this.userUsage = JSON.parse(userStored);
      }
    }
  }

  private saveUsage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiUsage', JSON.stringify(this.usage));
      localStorage.setItem('userChatUsage', JSON.stringify(this.userUsage));
    }
  }

  private resetIfNeeded() {
    const today = new Date().toDateString();
    if (this.usage.lastReset !== today) {
      this.usage.daily = { groq: 0, deepseek: 0, openai: 0, gemini: 0 };
      this.usage.lastReset = today;
      this.saveUsage();
    }
  }

  private isAPIAvailable(apiName: string): boolean {
    this.resetIfNeeded();
    
    const config = API_CONFIG[apiName as keyof typeof API_CONFIG];
    if (!config || !config.enabled) return false;

    // Check daily limits
    if (apiName === 'groq' && 'dailyLimit' in config) {
      return this.usage.daily.groq < config.dailyLimit * 0.8; // 80% threshold
    }

    // Check monthly limits
    if (apiName === 'deepseek' && 'monthlyLimit' in config) {
      return this.usage.monthly.deepseek < config.monthlyLimit * 0.8;
    }

    return true;
  }

  private selectBestAPI(userTier: 'free' | 'firstTeam' | 'seasonPass'): string | null {
    const priorities = API_PRIORITY[userTier];
    
    for (const api of priorities) {
      if (this.isAPIAvailable(api)) {
        return api;
      }
    }

    // If all preferred APIs are near limit, try any available
    for (const api of Object.keys(API_CONFIG)) {
      if (this.isAPIAvailable(api)) {
        return api;
      }
    }

    return null;
  }

  async canUserChat(email: string, tier: 'free' | 'firstTeam' | 'seasonPass'): Promise<{ allowed: boolean; remaining: number; message?: string }> {
    const limits = USER_LIMITS[tier];
    
    if (!limits.canChat) {
      return {
        allowed: false,
        remaining: 0,
        message: 'Upgrade to First Team or Season Pass to chat with The Gaffer!'
      };
    }

    // Use the database-backed usage tracker
    try {
      const result = await usageTracker.canUseFeature(email, 'chat', tier);
      return {
        allowed: result.allowed,
        remaining: result.remaining,
        message: result.message
      };
    } catch (error) {
      // console.error('Error checking chat usage:', error);
      // Fallback to localStorage if database fails
      return this.checkLocalChatUsage(email, tier);
    }
  }

  // Fallback method for localStorage
  private checkLocalChatUsage(email: string, tier: 'free' | 'firstTeam' | 'seasonPass'): { allowed: boolean; remaining: number; message?: string } {
    const limits = USER_LIMITS[tier];
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const userStats = this.userUsage[email];

    // Initialize user stats if not exists
    if (!userStats) {
      this.userUsage[email] = { 
        daily: 0, 
        monthly: 0, 
        lastReset: today, 
        lastMonthlyReset: `${currentYear}-${currentMonth}` 
      };
      this.saveUsage();
    }

    // Check for monthly reset (free users)
    if (tier === 'free') {
      const monthlyKey = `${currentYear}-${currentMonth}`;
      if (this.userUsage[email].lastMonthlyReset !== monthlyKey) {
        this.userUsage[email].monthly = 0;
        this.userUsage[email].lastMonthlyReset = monthlyKey;
        this.saveUsage();
      }

      const monthlyLimit = (limits as any).monthlyLimit;
      if (this.userUsage[email].monthly >= monthlyLimit) {
        return {
          allowed: false,
          remaining: 0,
          message: `Monthly limit of ${monthlyLimit} questions reached. Upgrade to Pro for unlimited access!`
        };
      }

      return {
        allowed: true,
        remaining: monthlyLimit - this.userUsage[email].monthly
      };
    }

    // Handle daily limits for paid tiers
    if (this.userUsage[email].lastReset !== today) {
      this.userUsage[email].daily = 0;
      this.userUsage[email].lastReset = today;
      this.saveUsage();
    }

    const dailyLimit = (limits as any).dailyLimit;
    if (this.userUsage[email].daily >= dailyLimit) {
      return {
        allowed: false,
        remaining: 0,
        message: tier === 'firstTeam' 
          ? 'Daily limit reached. Upgrade to Season Pass for unlimited chat!'
          : 'Daily limit reached. Try again tomorrow!'
      };
    }

    return {
      allowed: true,
      remaining: dailyLimit - this.userUsage[email].daily
    };
  }

  async trackUsage(email: string, apiName: string, userTier: 'free' | 'firstTeam' | 'seasonPass') {
    // Track API usage
    this.usage.daily[apiName] = (this.usage.daily[apiName] || 0) + 1;
    this.usage.monthly[apiName] = (this.usage.monthly[apiName] || 0) + 1;

    // Track user usage with database
    try {
      await usageTracker.trackUsage(email, 'chat', userTier);
    } catch (error) {
      // console.error('Error tracking usage:', error);
      // Fallback to localStorage
      this.trackLocalUsage(email, userTier);
    }
  }

  // Fallback method for localStorage
  private trackLocalUsage(email: string, userTier: 'free' | 'firstTeam' | 'seasonPass'): void {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyKey = `${currentYear}-${currentMonth}`;

    if (!this.userUsage[email]) {
      this.userUsage[email] = { 
        daily: 1, 
        monthly: userTier === 'free' ? 1 : 0, 
        lastReset: today, 
        lastMonthlyReset: monthlyKey 
      };
    } else {
      // Reset daily if needed
      if (this.userUsage[email].lastReset !== today) {
        this.userUsage[email].daily = 1;
        this.userUsage[email].lastReset = today;
      } else {
        this.userUsage[email].daily++;
      }

      // Reset monthly if needed (for free users)
      if (userTier === 'free') {
        if (this.userUsage[email].lastMonthlyReset !== monthlyKey) {
          this.userUsage[email].monthly = 1;
          this.userUsage[email].lastMonthlyReset = monthlyKey;
        } else {
          this.userUsage[email].monthly++;
        }
      }
    }
    this.saveUsage();
  }

  async makeRequest(
    prompt: string,
    userEmail: string,
    userTier: 'free' | 'firstTeam' | 'seasonPass',
    originalQuestion?: string
  ): Promise<{ success: boolean; response?: string; error?: string; api?: string; cached?: boolean }> {
    // Check if user can chat
    const canChat = await this.canUserChat(userEmail, userTier);
    if (!canChat.allowed) {
      return {
        success: false,
        error: canChat.message || 'Usage limit reached'
      };
    }

    // STEP 1: Check if we have a cached answer for this exact question
    if (originalQuestion) {
      const cachedAnswer = dataCacheManager.checkQuestionCache(originalQuestion);
      if (cachedAnswer) {
        // console.log('✅ Using cached answer - Saved 1 API call!');
        // Still track user usage but don't track API usage
        this.trackUserUsage(userEmail);
        return {
          success: true,
          response: cachedAnswer,
          cached: true
        };
      }
    }

    // STEP 2: Try to enrich prompt with cached Supabase data (no API call)
    const cachedContext = dataCacheManager.buildContextFromCache(userEmail);
    let enrichedPrompt = prompt;
    
    if (cachedContext) {
      // console.log('✅ Using cached Supabase data - No database query needed!');
      enrichedPrompt = `${cachedContext}\n\n${prompt}`;
    }

    // STEP 3: Select best available API
    const selectedAPI = this.selectBestAPI(userTier);
    if (!selectedAPI) {
      return {
        success: false,
        error: 'All APIs are currently at capacity. Please try again later.'
      };
    }

    try {
      const response = await this.callAPI(selectedAPI, enrichedPrompt);
      this.trackUsage(userEmail, selectedAPI, userTier);
      
      // Cache the answer for future use (1 hour TTL)
      if (originalQuestion) {
        dataCacheManager.cacheQuestion(originalQuestion, response, 60);
      }
      
      return {
        success: true,
        response,
        api: selectedAPI,
        cached: false
      };
    } catch (error) {
      // console.error(`API ${selectedAPI} failed:`, error);
      
      // Try fallback API
      const fallbackAPI = this.selectBestAPI(userTier);
      if (fallbackAPI && fallbackAPI !== selectedAPI) {
        try {
          const response = await this.callAPI(fallbackAPI, enrichedPrompt);
          this.trackUsage(userEmail, fallbackAPI, userTier);
          
          // Cache the answer
          if (originalQuestion) {
            dataCacheManager.cacheQuestion(originalQuestion, response, 60);
          }
          
          return {
            success: true,
            response,
            api: fallbackAPI,
            cached: false
          };
        } catch (fallbackError) {
          // console.error(`Fallback API ${fallbackAPI} failed:`, fallbackError);
        }
      }

      return {
        success: false,
        error: 'Failed to get response. Please try again.'
      };
    }
  }

  private trackUserUsage(email: string) {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyKey = `${currentYear}-${currentMonth}`;
    
    if (!this.userUsage[email] || this.userUsage[email].lastReset !== today) {
      this.userUsage[email] = { 
        daily: 1, 
        monthly: 0, 
        lastReset: today, 
        lastMonthlyReset: monthlyKey 
      };
    } else {
      this.userUsage[email].daily += 1;
    }
    this.saveUsage();
  }

  private async callAPI(apiName: string, prompt: string): Promise<string> {
    const config = API_CONFIG[apiName as keyof typeof API_CONFIG];
    
    if (apiName === 'groq') {
      return this.callGroq(prompt, config);
    } else if (apiName === 'deepseek') {
      return this.callDeepSeek(prompt, config);
    } else if (apiName === 'openai') {
      return this.callOpenAI(prompt, config);
    } else if (apiName === 'gemini') {
      return this.callGemini(prompt, config);
    }

    throw new Error(`Unknown API: ${apiName}`);
  }

  private async callGroq(prompt: string, config: any): Promise<string> {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) throw new Error('Groq API failed');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callDeepSeek(prompt: string, config: any): Promise<string> {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) throw new Error('DeepSeek API failed');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callOpenAI(prompt: string, config: any): Promise<string> {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) throw new Error('OpenAI API failed');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGemini(prompt: string, config: any): Promise<string> {
    const response = await fetch(
      `${config.baseUrl}/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300
          }
        })
      }
    );

    if (!response.ok) throw new Error('Gemini API failed');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  getUsageStats() {
    this.resetIfNeeded();
    return {
      daily: this.usage.daily,
      monthly: this.usage.monthly,
      limits: {
        groq: API_CONFIG.groq.dailyLimit,
        deepseek: API_CONFIG.deepseek.monthlyLimit
      }
    };
  }
}

export const apiRotator = new APIRotator();


