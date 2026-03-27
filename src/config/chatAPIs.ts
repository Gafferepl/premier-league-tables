// AI Chat API Configuration
export const API_CONFIG = {
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama3-70b-8192',
    dailyLimit: parseInt(import.meta.env.GROQ_DAILY_LIMIT || '14000'),
    enabled: !!import.meta.env.VITE_GROQ_API_KEY
  },
  
  deepseek: {
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    monthlyLimit: parseInt(import.meta.env.DEEPSEEK_MONTHLY_LIMIT || '1000000'),
    enabled: !!import.meta.env.VITE_DEEPSEEK_API_KEY
  },
  
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    enabled: !!import.meta.env.VITE_OPENAI_API_KEY
  },
  
  gemini: {
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
    baseUrl: 'https://generativelanguage.googleapis.com',
    model: 'gemini-1.5-flash',
    enabled: !!import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
  }
};

// User tier limits
export const USER_LIMITS = {
  free: {
    monthlyLimit: 3, // 3 questions per month for free users
    canChat: true,
    showUpgrade: true
  },
  firstTeam: {
    dailyLimit: parseInt(import.meta.env.VITE_CHAT_FIRSTTEAM_DAILY_LIMIT || '10'),
    canChat: true,
    showUpgrade: true
  },
  seasonPass: {
    dailyLimit: parseInt(import.meta.env.VITE_CHAT_SEASONPASS_DAILY_LIMIT || '999999'),
    canChat: true,
    showUpgrade: false
  }
};

// API priority by user tier
export const API_PRIORITY = {
  seasonPass: ['openai', 'deepseek', 'groq', 'gemini'],
  firstTeam: ['groq', 'deepseek', 'gemini', 'openai'],
  free: ['gemini', 'groq', 'deepseek', 'openai']
};


