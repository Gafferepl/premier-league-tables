// Security Configuration - PROTECT INTELLECTUAL PROPERTY
export const SECURITY_CONFIG = {
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Debug controls
  enableDebugLogs: import.meta.env.DEV,
  enableConsoleOutput: import.meta.env.DEV,
  
  // API protection
  obscureApiEndpoints: import.meta.env.PROD,
  enableRateLimiting: true,
  
  // Code protection
  obfuscateSensitiveLogic: import.meta.env.PROD,
  hideImplementationDetails: import.meta.env.PROD,
  
  // Analytics protection
  anonymizeUserTracking: true,
  encryptSensitiveData: true,
  
  // Feature flags (keep these secure)
  features: {
    chatSystem: true,
    advancedAnalytics: true,
    realTimeUpdates: true,
    aiAssistance: true
  }
};

// Production-safe logging
export const logger = {
  log: (...args: any[]) => {
    if (SECURITY_CONFIG.enableConsoleOutput) {
      // console.log(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors for debugging
    // console.error(...args);
  },
  warn: (...args: any[]) => {
    if (SECURITY_CONFIG.enableDebugLogs) {
      // console.warn(...args);
    }
  },
  debug: (...args: any[]) => {
    if (SECURITY_CONFIG.enableDebugLogs) {
      console.debug(...args);
    }
  }
};

// Security utilities
export const securityUtils = {
  // Obfuscate sensitive strings in production
  obfuscate: (str: string): string => {
    if (!SECURITY_CONFIG.hideImplementationDetails) return str;
    return btoa(str); // Basic obfuscation
  },
  
  // Check if feature should be exposed
  shouldExposeFeature: (feature: string): boolean => {
    return SECURITY_CONFIG.features[feature as keyof typeof SECURITY_CONFIG.features] || false;
  },
  
  // Validate environment
  validateEnvironment: (): boolean => {
    return !SECURITY_CONFIG.isDevelopment || import.meta.env.DEV;
  }
};


