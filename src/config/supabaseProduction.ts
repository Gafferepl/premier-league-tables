// Supabase Production Configuration
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
const validateSupabaseConfig = () => {
  const errors: string[] = [];
  
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is required');
  } else if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL');
  }
  
  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  } else if (supabaseAnonKey.length < 100) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)');
  }
  
  if (import.meta.env.PROD && !supabaseServiceKey) {
    // console.warn('VITE_SUPABASE_SERVICE_ROLE_KEY not set - some admin features may not work');
  }
  
  if (errors.length > 0) {
    throw new Error(`Supabase configuration errors: ${errors.join(', ')}`);
  }
  
  return true;
};

// Create Supabase client with production optimizations
let supabaseClient: SupabaseClient | null = null;

try {
  validateSupabaseConfig();
  
  supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: import.meta.env.DEV
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'premier-league-hub',
        'x-client-version': '1.0.0',
        'x-client-info': 'premier-league-hub-web'
      }
    },
    // Real-time subscriptions
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
  
  // console.log('✅ Supabase client initialized successfully');
  
} catch (error) {
  // console.error('❌ Failed to initialize Supabase client:', error);
  
  // Create fallback client for development
  if (import.meta.env.DEV) {
    // console.warn('⚠️ Using fallback client for development');
    supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false }
    });
  }
}

// Service role client for admin operations
let supabaseAdminClient: SupabaseClient | null = null;

if (supabaseServiceKey && supabaseUrl) {
  try {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-application-name': 'premier-league-hub-admin',
          'x-client-version': '1.0.0'
        }
      }
    });
    
    // console.log('✅ Supabase admin client initialized');
    
  } catch (error) {
    // console.error('❌ Failed to initialize Supabase admin client:', error);
  }
}

// Connection health check
export const checkSupabaseHealth = async (): Promise<boolean> => {
  if (!supabaseClient) return false;
  
  try {
    const { error } = await supabaseClient
      .from('health_check')
      .select('id')
      .limit(1)
      .single();
    
    // If table doesn't exist, that's actually ok for health check
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return true;
  } catch (error) {
    // console.error('Supabase health check failed:', error);
    return false;
  }
};

// Retry configuration
export const retryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

// Retry wrapper for Supabase operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  customRetryConfig?: Partial<typeof retryConfig>
): Promise<T> => {
  const config = { ...retryConfig, ...customRetryConfig };
  let lastError: Error;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === config.maxRetries) {
        throw lastError;
      }
      
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt),
        config.maxDelay
      );
      
      // console.warn(`Supabase operation failed (attempt ${attempt + 1}/${config.maxRetries + 1}), retrying in ${delay}ms:`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Batch operations for performance
export const batchOperations = {
  // Batch insert with retry
  batchInsert: async <T>(table: string, records: T[], batchSize = 100) => {
    if (!supabaseClient) throw new Error('Supabase client not initialized');
    
    const results = [];
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const result = await withRetry(async () => {
        const { data, error } = await supabaseClient
          .from(table)
          .insert(batch)
          .select();
        
        if (error) throw error;
        return data;
      });
      
      results.push(...(result || []));
    }
    
    return results;
  },
  
  // Batch update with retry
  batchUpdate: async <T>(table: string, updates: Array<{ id: string; data: Partial<T> }>, batchSize = 100) => {
    if (!supabaseClient) throw new Error('Supabase client not initialized');
    
    const results = [];
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      const batchPromises = batch.map(({ id, data }) =>
        withRetry(async () => {
          const { data: result, error } = await supabaseClient
            .from(table)
            .update(data)
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          return result;
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }
};

// Connection pooling optimization
export const connectionPool = {
  // Connection reuse
  getClient: () => {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    return supabaseClient;
  },
  
  getAdminClient: () => {
    if (!supabaseAdminClient) {
      throw new Error('Supabase admin client not initialized');
    }
    return supabaseAdminClient;
  },
  
  // Health check with caching
  healthCheckWithCache: (() => {
    let lastCheck = 0;
    let lastResult = false;
    const cacheDuration = 30000; // 30 seconds
    
    return async () => {
      const now = Date.now();
      
      if (now - lastCheck < cacheDuration) {
        return lastResult;
      }
      
      lastResult = await checkSupabaseHealth();
      lastCheck = now;
      
      return lastResult;
    };
  })()
};

// Export clients and utilities
export { supabaseClient as supabase, supabaseAdminClient as supabaseAdmin };

// Helper to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabaseClient !== null;
};

// Helper to get Supabase info for debugging
export const getSupabaseInfo = () => ({
  url: supabaseUrl ? new URL(supabaseUrl).hostname : 'Not configured',
  hasClient: !!supabaseClient,
  hasAdminClient: !!supabaseAdminClient,
  isProduction: import.meta.env.PROD,
  environment: import.meta.env.MODE
});

// Graceful degradation
export const gracefulDegradation = {
  // Fallback for when Supabase is unavailable
  fallbackResponse: <T>(fallbackData: T) => ({
    data: fallbackData,
    error: null,
    usingFallback: true
  }),
  
  // Check availability before operations
  checkBeforeOperation: async (operation: () => Promise<any>, fallbackData?: any) => {
    try {
      const isHealthy = await connectionPool.healthCheckWithCache();
      
      if (!isHealthy) {
        // console.warn('Supabase unhealthy, using fallback');
        return gracefulDegradation.fallbackResponse(fallbackData);
      }
      
      return await operation();
    } catch (error) {
      // console.error('Supabase operation failed:', error);
      
      if (fallbackData !== undefined) {
        return gracefulDegradation.fallbackResponse(fallbackData);
      }
      
      throw error;
    }
  }
};


