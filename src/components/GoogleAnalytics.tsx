import React, { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID 
}) => {
  useEffect(() => {
    // Load Google Analytics script
    if (measurementId && import.meta.env.PROD) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'user_tier',
          custom_parameter_2: 'feature_used',
          custom_parameter_3: 'engagement_time'
        }
      });
    }
  }, [measurementId]);

  return null;
};

// Custom analytics hooks
export const useAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (measurementId && import.meta.env.PROD && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        custom_parameter_1: parameters?.userTier || 'unknown',
        custom_parameter_2: parameters?.feature || 'unknown',
        custom_parameter_3: parameters?.engagementTime || 0
      });
    }
  };

  const trackPageView = (path: string, title?: string) => {
    if (measurementId && import.meta.env.PROD && window.gtag) {
      window.gtag('config', measurementId, {
        page_path: path,
        page_title: title || document.title
      });
    }
  };

  const trackUserTier = (tier: string) => {
    if (measurementId && import.meta.env.PROD && window.gtag) {
      window.gtag('set', 'user_properties', {
        user_tier: tier
      });
    }
  };

  const trackFeatureUsage = (feature: string, userTier?: string) => {
    trackEvent('feature_used', {
      feature_name: feature,
      user_tier: userTier || 'unknown'
    });
  };

  const trackEngagement = (feature: string, duration: number, userTier?: string) => {
    trackEvent('engagement', {
      feature_name: feature,
      engagement_time: duration,
      user_tier: userTier || 'unknown'
    });
  };

  const trackConversion = (type: string, value?: number) => {
    trackEvent('conversion', {
      conversion_type: type,
      value: value || 0
    });
  };

  const trackError = (error: string, context?: string) => {
    trackEvent('error', {
      error_message: error,
      error_context: context || 'unknown'
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackUserTier,
    trackFeatureUsage,
    trackEngagement,
    trackConversion,
    trackError
  };
};

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default GoogleAnalytics;


