// Google Analytics 4 2026 - Latest Analytics Standards
import React, { useEffect } from 'react';

interface GoogleAnalytics2026Props {
  measurementId?: string;
  enableEnhancedMeasurement?: boolean;
  enableDebugMode?: boolean;
}

const GoogleAnalytics2026: React.FC<GoogleAnalytics2026Props> = ({ 
  measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID,
  enableEnhancedMeasurement = true,
  enableDebugMode = import.meta.env.DEV
}) => {
  useEffect(() => {
    // Load Google Analytics 4 script with 2026 enhancements
    if (measurementId && import.meta.env.PROD) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag with 2026 configuration
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args);
      };
      
      // 2026 Enhanced GA4 configuration
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        
        // 2026 Enhanced measurement
        send_page_view: enableEnhancedMeasurement,
        
        // 2026 Custom dimensions
        custom_map: {
          custom_parameter_1: 'user_tier',
          custom_parameter_2: 'feature_used',
          custom_parameter_3: 'engagement_time',
          custom_parameter_4: 'device_type',
          custom_parameter_5: 'session_source',
          custom_parameter_6: 'content_group',
          custom_parameter_7: 'ai_interaction',
          custom_parameter_8: 'performance_score'
        },
        
        // 2026 Enhanced ecommerce
        currency: 'GBP',
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        
        // 2026 Privacy controls
        anonymize_ip: true,
        cookie_flags: 'SameSite=Lax;Secure',
        
        // 2026 Cross-domain tracking
        linker: {
          domains: ['premierleaguetables.com', 'www.premierleaguetables.com']
        },
        
        // 2026 Content grouping
        content_group1: 'fantasy-football',
        content_group2: 'premier-league',
        
        // 2026 Enhanced attribution
        attribution_model: 'last_click',
        
        // 2026 Debug mode
        debug_mode: enableDebugMode
      });
      
      // 2026 Set initial user properties
      window.gtag('set', 'user_properties', {
        platform: 'web',
        app_version: '2026.1.0',
        browser_language: navigator.language,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        device_category: getDeviceCategory(),
        connection_type: getConnectionType(),
        battery_level: 'unknown' // Will be updated if available
      });
      
      // 2026 Track battery level if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          window.gtag('set', 'user_properties', {
            battery_level: Math.round(battery.level * 100) + '%'
          });
        });
      }
      
      // 2026 Track effective connection type
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        window.gtag('set', 'user_properties', {
          effective_connection_type: connection.effectiveType,
          downlink: Math.round(connection.downlink) + 'Mbps',
          rtt: connection.rtt + 'ms'
        });
      }
    }
  }, [measurementId, enableEnhancedMeasurement, enableDebugMode]);

  return null;
};

// 2026 Enhanced analytics hooks
export const useAnalytics2026 = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (measurementId && import.meta.env.PROD && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        custom_parameter_1: parameters?.userTier || 'unknown',
        custom_parameter_2: parameters?.feature || 'unknown',
        custom_parameter_3: parameters?.engagementTime || 0,
        custom_parameter_4: getDeviceCategory(),
        custom_parameter_5: getTrafficSource(),
        custom_parameter_6: parameters?.contentGroup || 'general',
        custom_parameter_7: parameters?.aiInteraction || false,
        custom_parameter_8: parameters?.performanceScore || 0
      });
    }
  };

  const trackPageView = (path: string, title?: string, contentGroup?: string) => {
    if (measurementId && import.meta.env.PROD && window.gtag) {
      window.gtag('config', measurementId, {
        page_path: path,
        page_title: title || document.title,
        content_group: contentGroup || 'general',
        custom_parameter_4: getDeviceCategory(),
        custom_parameter_5: getTrafficSource()
      });
    }
  };

  const trackUserTier = (tier: string) => {
    if (measurementId && import.meta.env.PROD && window.gtag) {
      window.gtag('set', 'user_properties', {
        user_tier: tier,
        user_type: getUserType(tier)
      });
    }
  };

  const trackFeatureUsage = (feature: string, userTier?: string, aiInteraction?: boolean) => {
    trackEvent('feature_used_2026', {
      feature_name: feature,
      user_tier: userTier || 'unknown',
      ai_interaction: aiInteraction || false,
      device_category: getDeviceCategory(),
      session_source: getTrafficSource()
    });
  };

  const trackEngagement = (feature: string, duration: number, userTier?: string) => {
    trackEvent('engagement_2026', {
      feature_name: feature,
      engagement_time: duration,
      user_tier: userTier || 'unknown',
      engagement_type: getEngagementType(duration),
      device_category: getDeviceCategory()
    });
  };

  const trackConversion = (type: string, value?: number, currency?: string) => {
    trackEvent('conversion_2026', {
      conversion_type: type,
      value: value || 0,
      currency: currency || 'GBP',
      device_category: getDeviceCategory(),
      session_source: getTrafficSource()
    });
  };

  const trackError = (error: string, context?: string, severity?: 'low' | 'medium' | 'high' | 'critical') => {
    trackEvent('error_2026', {
      error_message: error,
      error_context: context || 'unknown',
      error_severity: severity || 'medium',
      device_category: getDeviceCategory(),
      user_agent: navigator.userAgent.substring(0, 100)
    });
  };

  const trackAIInteraction = (aiFeature: string, userInput: string, aiResponse: string, responseTime: number) => {
    trackEvent('ai_interaction_2026', {
      ai_feature: aiFeature,
      input_length: userInput.length,
      response_length: aiResponse.length,
      response_time: responseTime,
      device_category: getDeviceCategory(),
      user_tier: 'unknown' // Will be updated
    });
  };

  const trackPerformance = (metric: string, value: number, threshold?: number) => {
    trackEvent('performance_2026', {
      metric_name: metric,
      metric_value: value,
      metric_threshold: threshold || 0,
      performance_grade: getPerformanceGrade(value, threshold),
      device_category: getDeviceCategory(),
      connection_type: getConnectionType()
    });
  };

  const trackSocialShare = (platform: string, content: string, contentType: string) => {
    trackEvent('social_share_2026', {
      platform: platform,
      content_type: contentType,
      content_length: content.length,
      device_category: getDeviceCategory(),
      session_source: getTrafficSource()
    });
  };

  const trackSearch = (query: string, resultsCount: number, searchType: string) => {
    trackEvent('search_2026', {
      search_query: query.substring(0, 50), // Limit length
      search_results: resultsCount,
      search_type: searchType,
      device_category: getDeviceCategory()
    });
  };

  const trackFormInteraction = (formName: string, action: 'start' | 'complete' | 'abandon', fields?: string[]) => {
    trackEvent('form_interaction_2026', {
      form_name: formName,
      form_action: action,
      form_fields: fields?.length || 0,
      device_category: getDeviceCategory()
    });
  };

  // 2026 Enhanced e-commerce tracking
  const trackEcommerce = (action: string, parameters: Record<string, any>) => {
    if (measurementId && import.meta.env.PROD && window.gtag) {
      window.gtag('event', action, {
        currency: 'GBP',
        value: parameters.value || 0,
        items: parameters.items || [],
        ...parameters
      });
    }
  };

  // 2026 Custom funnel tracking
  const trackFunnelStep = (funnelName: string, step: number, stepName: string) => {
    trackEvent('funnel_step_2026', {
      funnel_name: funnelName,
      funnel_step: step,
      funnel_step_name: stepName,
      device_category: getDeviceCategory(),
      session_source: getTrafficSource()
    });
  };

  // 2026 Heatmap and scroll tracking
  const trackScrollDepth = (maxScroll: number) => {
    const scrollPercentage = Math.round((maxScroll / 100) * 100);
    trackEvent('scroll_depth_2026', {
      scroll_percentage: scrollPercentage,
      scroll_depth: maxScroll,
      device_category: getDeviceCategory()
    });
  };

  // 2026 Video tracking
  const trackVideo = (videoTitle: string, action: 'play' | 'pause' | 'complete', progress?: number) => {
    trackEvent('video_2026', {
      video_title: videoTitle,
      video_action: action,
      video_progress: progress || 0,
      device_category: getDeviceCategory()
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackUserTier,
    trackFeatureUsage,
    trackEngagement,
    trackConversion,
    trackError,
    trackAIInteraction,
    trackPerformance,
    trackSocialShare,
    trackSearch,
    trackFormInteraction,
    trackEcommerce,
    trackFunnelStep,
    trackScrollDepth,
    trackVideo
  };
};

// 2026 Helper functions
const getDeviceCategory = (): string => {
  const width = window.innerWidth;
  if (width < 414) return 'mobile_small';
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'desktop';
  if (width < 1920) return 'desktop_large';
  return 'desktop_ultrawide';
};

const getTrafficSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  if (referrer.includes('google.com')) return 'google_search';
  if (referrer.includes('facebook.com')) return 'facebook';
  if (referrer.includes('twitter.com')) return 'twitter';
  if (referrer.includes('instagram.com')) return 'instagram';
  if (referrer.includes('linkedin.com')) return 'linkedin';
  return 'other_referral';
};

const getConnectionType = (): string => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection.effectiveType || 'unknown';
  }
  return 'unknown';
};

const getUserType = (tier: string): string => {
  switch (tier) {
    case 'free': return 'free_user';
    case 'firstTeam': return 'paid_user';
    case 'seasonPass': return 'premium_user';
    default: return 'unknown_user';
  }
};

const getEngagementType = (duration: number): string => {
  if (duration < 5000) return 'quick_engagement';
  if (duration < 15000) return 'normal_engagement';
  if (duration < 60000) return 'deep_engagement';
  return 'extended_engagement';
};

const getPerformanceGrade = (value: number, threshold: number): string => {
  if (value <= threshold * 0.5) return 'excellent';
  if (value <= threshold * 0.8) return 'good';
  if (value <= threshold) return 'acceptable';
  return 'poor';
};

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default GoogleAnalytics2026;


