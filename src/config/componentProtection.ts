// Component Protection - HIDE IMPLEMENTATION DETAILS
export const COMPONENT_PROTECTION = {
  // Obfuscate component names in production
  obfuscatedNames: {
    'GafferChat': 'ChatComponent',
    'SquadBuilder': 'TeamBuilder',
    'TopScorers': 'ScorersTable',
    'GoldenBoot': 'TopScorers',
    'BeatTheGaffer': 'PredictionGame',
    'CaptainPicks': 'SelectionHelper',
    'PriceTracker': 'ValueMonitor',
    'PlayerComparison': 'PlayerAnalyzer',
    'LivePointsTracker': 'ScoreTracker',
    'AdvancedStats': 'AnalyticsView'
  },
  
  // Hide sensitive prop names
  sensitiveProps: [
    'apiRotator',
    'usageTracker',
    'replyBank',
    'detectionLogic',
    'abusePrevention',
    'rateLimiting',
    'userAnalytics',
    'trackingData',
    'internalState'
  ],
  
  // Obfuscate method names
  obfuscatedMethods: {
    'getGafferReply': 'getResponse',
    'trackUsage': 'logActivity',
    'detectAbuse': 'validateInput',
    'rotateAPI': 'selectProvider',
    'cacheResponse': 'storeData',
    'checkLimits': 'verifyQuota',
    'analyzeMessage': 'processInput',
    'generateReply': 'createOutput'
  }
};

// Component wrapper for production obfuscation
export const protectComponent = (componentName: string, component: any) => {
  if (import.meta.env.PROD) {
    const obfuscated = COMPONENT_PROTECTION.obfuscatedNames[componentName as keyof typeof COMPONENT_PROTECTION.obfuscatedNames];
    return {
      ...component,
      name: obfuscated || 'Component',
      displayName: obfuscated || 'Component'
    };
  }
  return component;
};

// Hide sensitive data in props
export const sanitizeProps = (props: Record<string, any>) => {
  if (import.meta.env.DEV) return props;
  
  const sanitized: Record<string, any> = {};
  Object.keys(props).forEach(key => {
    if (!COMPONENT_PROTECTION.sensitiveProps.includes(key)) {
      sanitized[key] = props[key];
    }
  });
  return sanitized;
};


