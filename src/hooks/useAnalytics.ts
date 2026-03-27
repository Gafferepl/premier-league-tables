import { useEffect, useCallback } from 'react';

// Analytics interface for type safety
interface AnalyticsEvent {
  eventName: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

interface PageView {
  path: string;
  title?: string;
  customParameters?: Record<string, any>;
}

// FPL-specific custom dimensions
interface FPLCustomDimensions {
  fplTeamId?: string;
  userFplRank?: number;
  favoriteTeam?: string;
  fplExperienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const useAnalytics = () => {
  // Check if gtag is available (will be false until GA_MEASUREMENT_ID is added)
  const isGtagAvailable = useCallback(() => {
    return typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined';
  }, []);

  // Generic event tracking
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (isGtagAvailable()) {
      const gtag = (window as any).gtag;
      const params: any = {
        'event_category': event.category
      };
      
      if (event.label) params['event_label'] = event.label;
      if (event.value !== undefined) params['value'] = event.value;
      if (event.customParameters) {
        Object.assign(params, event.customParameters);
      }
      
      gtag('event', event.eventName, params);
    }
  }, [isGtagAvailable]);

  // Page view tracking
  const trackPageView = useCallback((pageView: PageView) => {
    if (isGtagAvailable()) {
      const gtag = (window as any).gtag;
      const params: any = {
        'page_path': pageView.path
      };
      
      if (pageView.title) params['page_title'] = pageView.title;
      if (pageView.customParameters) {
        Object.assign(params, pageView.customParameters);
      }
      
      gtag('config', 'GA_MEASUREMENT_ID', params);
    }
  }, [isGtagAvailable]);

  // FPL-specific tracking methods
  const fplAnalytics = {
    // Beat The Gaffer game tracking
    trackGameStarted: useCallback(() => {
      const params = {
        eventName: 'game_started',
        category: 'beat_the_gaffer',
        label: 'weekly_prediction'
      };
      trackEvent(params);
    }, [trackEvent]),

    trackGameCompleted: useCallback((predictionsCount: number, score: number) => {
      const params = {
        eventName: 'game_completed',
        category: 'beat_the_gaffer',
        label: 'weekly_prediction_submitted',
        value: score,
        customParameters: {
          predictions_count: predictionsCount,
          final_score: score
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    trackGameStateChange: useCallback((gameState: string, predictionsCount: number) => {
      const params = {
        eventName: 'game_state_change',
        category: 'beat_the_gaffer',
        label: gameState,
        customParameters: {
          game_state: gameState,
          predictions_count: predictionsCount
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    // Player Database tracking
    trackPlayerSearch: useCallback((searchTerm: string, resultsCount: number) => {
      const params = {
        eventName: 'player_search',
        category: 'player_database',
        label: searchTerm,
        value: resultsCount,
        customParameters: {
          search_term: searchTerm,
          results_count: resultsCount
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    trackTooltipView: useCallback((tooltipType: string, metricName: string) => {
      const params = {
        eventName: 'tooltip_view',
        category: 'education',
        label: metricName,
        customParameters: {
          tooltip_type: tooltipType,
          metric_name: metricName
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    trackFilterApplied: useCallback((filterType: string, filterValue: string) => {
      const params = {
        eventName: 'filter_applied',
        category: 'player_database',
        label: `${filterType}_${filterValue}`,
        customParameters: {
          filter_type: filterType,
          filter_value: filterValue
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    // Newsletter/Lead tracking
    trackNewsletterSignup: useCallback((source: string) => {
      const params = {
        eventName: 'newsletter_signup',
        category: 'lead_generation',
        label: source,
        customParameters: {
          signup_source: source
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    trackUserProfileComplete: useCallback((profileData: FPLCustomDimensions) => {
      const params = {
        eventName: 'user_profile_complete',
        category: 'user_engagement',
        label: 'profile_completion',
        customParameters: profileData
      };
      trackEvent(params);
    }, [trackEvent]),

    // Premium Features tracking
    trackPremiumFeatureUsed: useCallback((featureName: string) => {
      const params = {
        eventName: 'premium_feature_used',
        category: 'engagement',
        label: featureName,
        customParameters: {
          feature_name: featureName
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    // Content tracking
    trackSectionView: useCallback((sectionName: string, timeSpent?: number) => {
      const params = {
        eventName: 'section_view',
        category: 'content_engagement',
        label: sectionName,
        value: timeSpent,
        customParameters: {
          section_name: sectionName,
          time_spent_seconds: timeSpent
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    trackSocialShare: useCallback((platform: string, content: string) => {
      const params = {
        eventName: 'social_share',
        category: 'content_distribution',
        label: platform,
        customParameters: {
          platform: platform,
          content_type: content
        }
      };
      trackEvent(params);
    }, [trackEvent]),

    // Navigation tracking
    trackNavigationClick: useCallback((destination: string, source: string) => {
      const params = {
        eventName: 'navigation_click',
        category: 'user_interaction',
        label: `${source}_to_${destination}`,
        customParameters: {
          destination: destination,
          source: source
        }
      };
      trackEvent(params);
    }, [trackEvent])
  };

  // Set custom dimensions for FPL user data
  const setFPLCustomDimensions = useCallback((dimensions: FPLCustomDimensions) => {
    if (isGtagAvailable()) {
      const gtag = (window as any).gtag;
      // Set custom dimensions for future events
      Object.entries(dimensions).forEach(([key, value]) => {
        if (value !== undefined) {
          gtag('set', 'user_properties', {
            [key]: value
          });
        }
      });
    }
  }, [isGtagAvailable]);

  // Enhanced ecommerce tracking (for premium features)
  const ecommerce = {
    trackPurchase: useCallback((transactionId: string, value: number, item: any) => {
      if (isGtagAvailable()) {
        const gtag = (window as any).gtag;
        gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: value,
          currency: 'GBP',
          items: [item]
        });
      }
    }, [isGtagAvailable]),

    trackBeginCheckout: useCallback((value: number, items: any[]) => {
      if (isGtagAvailable()) {
        const gtag = (window as any).gtag;
        gtag('event', 'begin_checkout', {
          value: value,
          currency: 'GBP',
          items: items
        });
      }
    }, [isGtagAvailable])
  };

  return {
    // Basic tracking
    trackEvent,
    trackPageView,
    
    // FPL-specific tracking
    ...fplAnalytics,
    
    // Advanced features
    setFPLCustomDimensions,
    ecommerce,
    
    // Utility
    isGtagAvailable
  };
};

// Global analytics utility for non-component usage
export const analytics = {
  trackEvent: (event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      const gtag = (window as any).gtag;
      const params: any = {
        'event_category': event.category
      };
      
      if (event.label) params['event_label'] = event.label;
      if (event.value !== undefined) params['value'] = event.value;
      if (event.customParameters) {
        Object.assign(params, event.customParameters);
      }
      
      gtag('event', event.eventName, params);
    }
  },
  
  trackPageView: (path: string, title?: string) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      const gtag = (window as any).gtag;
      gtag('config', 'GA_MEASUREMENT_ID', {
        'page_path': path,
        'page_title': title
      });
    }
  }
};

export default useAnalytics;


