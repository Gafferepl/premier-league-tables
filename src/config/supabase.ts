import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with validation
let supabaseClient: any = null;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-application-name': 'premier-league-hub'
        }
      }
    });
  }
} catch (error) {
  // console.warn('Supabase client initialization failed:', error);
}

// Create a proxy to handle null supabase client
export const supabase = supabaseClient ? supabaseClient : {
  from: () => ({ 
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: 'Supabase not configured' }) }) }),
    insert: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
    update: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
    delete: () => Promise.resolve({ data: null, error: 'Supabase not configured' })
  }),
  rpc: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
  auth: {
    getUser: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
    signIn: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
    signOut: () => Promise.resolve({ error: 'Supabase not configured' })
  }
};

// Database types
export interface User {
  id: string;
  email: string;
  ip_address?: string;
  user_agent?: string;
  fingerprint?: string;
  created_at: string;
  last_active: string;
  user_tier: 'free' | 'firstTeam' | 'seasonPass';
  is_blocked: boolean;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  feature: 'squad_analysis' | 'chat' | 'comparison' | 'other';
  usage_date: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface AbuseDetection {
  id: string;
  user_id?: string;
  ip_address: string;
  fingerprint?: string;
  suspicious_activity: string;
  detection_reason: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseClient && supabaseUrl && supabaseAnonKey);
};

// Helper to get user fingerprint
export const getUserFingerprint = (): string => {
  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorDepth: screen.colorDepth,
    hardwareConcurrency: navigator.hardwareConcurrency || 0
  };
  
  // Simple hash function
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Helper to get user IP (from server or proxy)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    // console.error('Failed to get IP:', error);
    return 'unknown';
  }
};

export default supabase;


