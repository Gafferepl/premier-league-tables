// TypeScript Type Protection - HIDE TYPE DEFINITIONS
export const TYPE_PROTECTION = {
  // Obfuscate sensitive type names
  typeAliases: {
    'UserTier': 'AccessLevel',
    'ChatMessage': 'ConversationItem',
    'UsageData': 'ActivityRecord',
    'AbuseDetection': 'ValidationResult',
    'APIConfig': 'ProviderConfig',
    'RateLimit': 'RequestLimit',
    'UserAnalytics': 'UserMetrics',
    'TrackingData': 'ActivityData',
    'ReplyBank': 'ResponseLibrary',
    'DetectionLogic': 'AnalysisRules'
  },
  
  // Hide sensitive interface properties
  hiddenProperties: [
    'apiKey',
    'apiSecret',
    'internalId',
    'trackingId',
    'abuseScore',
    'rateLimitCount',
    'usageQuota',
    'detectionRules',
    'implementation',
    'internalState'
  ],
  
  // Obfuscate enum values
  enumAliases: {
    'free': 'basic',
    'firstTeam': 'standard',
    'seasonPass': 'premium',
    'abuse': 'flagged',
    'limited': 'restricted',
    'unlimited': 'open'
  }
};

// Type obfuscation utility
export const obfuscateTypeName = (typeName: string) => {
  if (import.meta.env.DEV) return typeName;
  
  return TYPE_PROTECTION.typeAliases[typeName as keyof typeof TYPE_PROTECTION.typeAliases] || typeName;
};

// Property sanitization for types
export const sanitizeTypeProperties = <T extends Record<string, any>>(obj: T): Partial<T> => {
  if (import.meta.env.DEV) return obj;
  
  const sanitized: Partial<T> = {};
  
  Object.keys(obj).forEach(key => {
    if (!TYPE_PROTECTION.hiddenProperties.includes(key)) {
      sanitized[key as keyof T] = obj[key as keyof T];
    }
  });
  
  return sanitized;
};

// Enum value obfuscation
export const obfuscateEnumValue = (value: string): string => {
  if (import.meta.env.DEV) return value;
  
  return TYPE_PROTECTION.enumAliases[value as keyof typeof TYPE_PROTECTION.enumAliases] || value;
};

// Protected type definitions (production use)
export interface ProtectedUser {
  id: string;
  email: string;
  accessLevel: string; // Instead of UserTier
  username: string;
  team: string;
  metrics: {
    totalPredictions: number;
    accuracy: number;
    currentStreak: number;
    bestStreak: number;
    weeklyPoints: number;
    monthlyPoints: number;
    allTimePoints: number;
  };
}

export interface ProtectedChatMessage {
  id: string;
  role: string;
  content: string;
  timestamp: Date;
  // Sensitive properties removed
}

export interface ProtectedUsageData {
  userId: string;
  feature: string;
  count: number;
  lastUsed: Date;
  // Internal tracking removed
}

export interface ProtectedAPIConfig {
  provider: string;
  model: string;
  enabled: boolean;
  // API keys and secrets removed
}

// Type guards for production
export const isProductionType = (type: any): boolean => {
  return import.meta.env.PROD;
};

// Runtime type validation (obfuscated)
export const validateProtectedType = (data: any, typeName: string): boolean => {
  if (import.meta.env.DEV) return true; // Skip validation in dev
  
  // Basic validation - hide complex logic
  return data && typeof data === 'object';
};

// Generate protected types from original types
export const createProtectedType = <T>(originalType: T, typeName: string) => {
  if (import.meta.env.DEV) return originalType;
  
  // Return obfuscated version in production
  return {
    ...originalType,
    __typeName: obfuscateTypeName(typeName),
    __protected: true
  };
};


