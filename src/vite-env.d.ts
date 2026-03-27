/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FOOTBALL_DATA_API_KEY: string;
  readonly VITE_API_FOOTBALL_KEY: string;
  // Advanced Analytics
  readonly VITE_STATSBOMB_API_KEY: string;
  readonly VITE_ADVANCED_ANALYTICS_SOURCE: string;
  readonly VITE_ADVANCED_ANALYTICS_CACHE_MINUTES: string;
  readonly VITE_ENABLE_LIVE_XG_UPDATES: string;
  readonly VITE_USE_MOCK_FALLBACK: string;
  
  // Gaffer Bot AI Chat APIs
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_GOOGLE_GEMINI_API_KEY: string;
  
  // Chat User Limits
  readonly VITE_CHAT_FREE_USER_DAILY_LIMIT: string;
  readonly VITE_CHAT_FIRSTTEAM_DAILY_LIMIT: string;
  readonly VITE_CHAT_SEASONPASS_DAILY_LIMIT: string;
  
  // Legacy support
  readonly GROQ_DAILY_LIMIT: string;
  readonly DEEPSEEK_MONTHLY_LIMIT: string;
  readonly API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


