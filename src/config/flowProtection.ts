// Application Flow Protection - HIDE BUSINESS LOGIC
export const FLOW_PROTECTION = {
  // Obfuscate route names and flow steps
  routeAliases: {
    '/chat': '/conversation',
    '/squad-builder': '/team-builder',
    '/golden-boot': '/scorers',
    '/beat-the-gaffer': '/predictions',
    '/captain-picks': '/selections',
    '/price-tracker': '/values',
    '/player-comparison': '/analysis',
    '/advanced-stats': '/insights',
    '/live-points': '/scores'
  },
  
  // Hide sensitive flow steps
  hiddenSteps: [
    'api-rotation',
    'usage-tracking',
    'abuse-detection',
    'rate-limiting',
    'quota-check',
    'cache-validation',
    'user-profiling',
    'behavior-analysis',
    'conversion-tracking'
  ],
  
  // Obfuscate state management
  stateAliases: {
    'chatMessages': 'conversationHistory',
    'userTier': 'accessLevel',
    'apiUsage': 'requestCount',
    'abuseFlags': 'warnings',
    'rateLimitStatus': 'requestStatus',
    'quotaRemaining': 'allowance',
    'trackingData': 'activityData',
    'userPreferences': 'settings'
  },
  
  // Hide sensitive events
  hiddenEvents: [
    'user-tracked',
    'abuse-detected',
    'api-rotated',
    'quota-checked',
    'rate-limited',
    'cache-hit',
    'cache-miss',
    'conversion-event',
    'behavior-tracked'
  ]
};

// Route protection middleware
export const protectRoute = (routeName: string) => {
  if (import.meta.env.DEV) return routeName;
  
  return FLOW_PROTECTION.routeAliases[routeName as keyof typeof FLOW_PROTECTION.routeAliases] || routeName;
};

// State sanitization
export const sanitizeState = (state: Record<string, any>) => {
  if (import.meta.env.DEV) return state;
  
  const sanitized: Record<string, any> = {};
  
  Object.keys(state).forEach(key => {
    const alias = FLOW_PROTECTION.stateAliases[key as keyof typeof FLOW_PROTECTION.stateAliases];
    const newKey = alias || key;
    
    // Hide sensitive data
    if (!FLOW_PROTECTION.hiddenSteps.includes(key)) {
      sanitized[newKey] = state[key];
    }
  });
  
  return sanitized;
};

// Event tracking protection
export const protectEventTracking = (eventName: string, eventData: any) => {
  if (import.meta.env.DEV) {
    // console.log('Event:', eventName, eventData);
    return;
  }
  
  // Don't track sensitive events in production logs
  if (!FLOW_PROTECTION.hiddenEvents.includes(eventName)) {
    // Send to analytics with obfuscated name
    const obfuscatedName = eventName.replace(/_/g, '-');
    // Analytics call would go here
  }
};

// Flow step obfuscation
export const obfuscateFlowStep = (stepName: string) => {
  if (import.meta.env.DEV) return stepName;
  
  // Hide sensitive flow steps
  if (FLOW_PROTECTION.hiddenSteps.includes(stepName)) {
    return 'processing';
  }
  
  return stepName.replace(/-/g, '_').toLowerCase();
};

// Component flow wrapper
export const withFlowProtection = (componentName: string, flowSteps: string[]) => {
  if (import.meta.env.DEV) {
    return {
      componentName,
      flowSteps,
      debug: true
    };
  }
  
  return {
    componentName: `Component${Math.floor(Math.random() * 1000)}`,
    flowSteps: flowSteps.map(step => obfuscateFlowStep(step)),
    debug: false
  };
};


