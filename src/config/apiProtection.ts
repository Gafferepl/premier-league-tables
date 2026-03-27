// API Endpoint Protection - HIDE IMPLEMENTATION
export const API_PROTECTION = {
  // Obfuscate endpoint names
  endpointAliases: {
    '/api/chat': '/api/v1/conversation',
    '/api/usage': '/api/v1/analytics',
    '/api/gaffer-replies': '/api/v1/responses',
    '/api/track-user': '/api/v1/activity',
    '/api/rotate-apis': '/api/v1/provider',
    '/api/cache-data': '/api/v1/storage',
    '/api/detect-abuse': '/api/v1/validate',
    '/api/user-limits': '/api/v1/quota'
  },
  
  // Rate limiting by endpoint
  rateLimits: {
    '/api/v1/conversation': { requests: 10, window: '1m' },
    '/api/v1/analytics': { requests: 50, window: '1h' },
    '/api/v1/responses': { requests: 100, window: '1h' },
    '/api/v1/activity': { requests: 200, window: '1h' },
    '/api/v1/provider': { requests: 20, window: '1m' },
    '/api/v1/storage': { requests: 30, window: '1m' },
    '/api/v1/validate': { requests: 15, window: '1m' },
    '/api/v1/quota': { requests: 5, window: '1m' }
  },
  
  // Hide sensitive response fields
  hiddenResponseFields: [
    'apiKeys',
    'internalLogic',
    'detectionRules',
    'rateLimitConfig',
    'userAnalytics',
    'trackingData',
    'abuseDetection',
    'quotaManagement',
    'implementationDetails'
  ],
  
  // Obfuscate error messages
  errorMessages: {
    'Rate limit exceeded': 'Too many requests',
    'Invalid API key': 'Authentication failed',
    'User not found': 'Resource not found',
    'Database error': 'Service unavailable',
    'API rotation failed': 'Provider unavailable',
    'Abuse detected': 'Request blocked',
    'Quota exceeded': 'Limit reached'
  }
};

// Middleware to protect API endpoints
export const apiProtectionMiddleware = (req: any, res: any, next: any) => {
  // Obfuscate endpoint names in logs
  const originalUrl = req.url;
  const obfuscatedUrl = API_PROTECTION.endpointAliases[originalUrl as keyof typeof API_PROTECTION.endpointAliases] || originalUrl;
  
  // Hide sensitive headers
  const sanitizedHeaders = { ...req.headers };
  delete sanitizedHeaders.authorization;
  delete sanitizedHeaders['x-api-key'];
  
  // Log with obfuscated data
  if (import.meta.env.DEV) {
    // console.log(`API Request: ${obfuscatedUrl}`, {
      headers: sanitizedHeaders,
      method: req.method
    });
  }
  
  next();
};

// Sanitize API responses
export const sanitizeResponse = (data: any, endpoint: string) => {
  if (import.meta.env.DEV) return data;
  
  const sanitized = { ...data };
  
  // Remove sensitive fields
  API_PROTECTION.hiddenResponseFields.forEach(field => {
    delete sanitized[field];
  });
  
  // Obfuscate implementation details
  if (sanitized.implementation) {
    sanitized.implementation = 'Protected logic';
  }
  
  return sanitized;
};

// Generate secure API response
export const secureApiResponse = (data: any, endpoint: string) => {
  return {
    success: true,
    data: sanitizeResponse(data, endpoint),
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substr(2, 9)
  };
};


