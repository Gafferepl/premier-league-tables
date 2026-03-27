// Enhanced Google Analytics 4 tracking service
// Provides type-safe event tracking with custom dimensions

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    trackEvent?: (eventName: string, eventParams?: Record<string, any>) => void;
    GA_MEASUREMENT_ID?: string;
  }
}

export type AnalyticsEventName =
  // User Actions
  | 'user_signup'
  | 'user_login'
  | 'newsletter_signup'
  | 'tier_upgrade'
  
  // Tool Usage
  | 'squad_builder_used'
  | 'player_comparison_used'
  | 'player_database_search'
  | 'advanced_analytics_viewed'
  
  // Engagement
  | 'beat_gaffer_played'
  | 'share_snapshot'
  | 'guide_opened'
  | 'captain_pick_viewed'
  
  // E-commerce
  | 'begin_checkout'
  | 'purchase'
  | 'add_payment_info'
  
  // Content
  | 'page_view'
  | 'scroll_depth'
  | 'video_play'
  | 'link_click';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  params?: {
    // E-commerce
    currency?: string;
    value?: number;
    transaction_id?: string;
    items?: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>;
    
    // User properties
    user_tier?: 'free' | 'firstTeam' | 'seasonPass';
    user_id?: string;
    
    // Tool usage
    tool_name?: string;
    feature_name?: string;
    
    // Content
    content_type?: string;
    content_id?: string;
    
    // Custom
    [key: string]: any;
  };
}

class AnalyticsService {
  private isInitialized = false;
  private eventQueue: AnalyticsEvent[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    // Check if GA is loaded
    if (window.gtag && window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      this.isInitialized = true;
      this.flushQueue();
    } else {
      // Retry after a short delay
      setTimeout(() => this.initialize(), 1000);
    }
  }

  private flushQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.trackEvent(event.name, event.params);
      }
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: AnalyticsEventName, eventParams?: Record<string, any>) {
    if (!this.isInitialized) {
      // Queue events until GA is ready
      this.eventQueue.push({ name: eventName, params: eventParams });
      return;
    }

    if (window.gtag) {
      window.gtag('event', eventName, eventParams);
      // console.log('📊 Analytics Event:', eventName, eventParams);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    this.trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href
    });
  }

  /**
   * Track user signup
   */
  trackSignup(tier: 'free' | 'firstTeam' | 'seasonPass', method: string = 'email') {
    this.trackEvent('user_signup', {
      method,
      user_tier: tier,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track newsletter signup
   */
  trackNewsletterSignup(tier: 'free' | 'firstTeam' | 'seasonPass') {
    this.trackEvent('newsletter_signup', {
      user_tier: tier,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track tool usage
   */
  trackToolUsage(toolName: string, action?: string) {
    const eventMap: Record<string, AnalyticsEventName> = {
      'squad-builder': 'squad_builder_used',
      'player-comparison': 'player_comparison_used',
      'player-database': 'player_database_search',
      'advanced-analytics': 'advanced_analytics_viewed'
    };

    const eventName = eventMap[toolName] || 'page_view';
    this.trackEvent(eventName, {
      tool_name: toolName,
      action: action || 'used',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track e-commerce purchase
   */
  trackPurchase(transactionId: string, value: number, tier: 'firstTeam' | 'seasonPass') {
    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value,
      currency: 'GBP',
      items: [{
        item_id: tier === 'firstTeam' ? 'first_team_monthly' : 'season_pass_yearly',
        item_name: tier === 'firstTeam' ? 'First Team Monthly' : 'Season Pass Yearly',
        price: value,
        quantity: 1
      }],
      user_tier: tier
    });
  }

  /**
   * Track checkout initiation
   */
  trackBeginCheckout(tier: 'firstTeam' | 'seasonPass', value: number) {
    this.trackEvent('begin_checkout', {
      currency: 'GBP',
      value,
      items: [{
        item_id: tier === 'firstTeam' ? 'first_team_monthly' : 'season_pass_yearly',
        item_name: tier === 'firstTeam' ? 'First Team Monthly' : 'Season Pass Yearly',
        price: value,
        quantity: 1
      }]
    });
  }

  /**
   * Track share action
   */
  trackShare(contentType: string, method: string = 'snapshot') {
    this.trackEvent('share_snapshot', {
      content_type: contentType,
      method,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage: number) {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
      this.trackEvent('scroll_depth', {
        percent_scrolled: percentage,
        page_path: window.location.pathname
      });
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: {
    user_id?: string;
    user_tier?: 'free' | 'firstTeam' | 'seasonPass';
    founding_member?: boolean;
    [key: string]: any;
  }) {
    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  /**
   * Track link clicks
   */
  trackLinkClick(url: string, linkText: string) {
    this.trackEvent('link_click', {
      link_url: url,
      link_text: linkText,
      outbound: !url.includes(window.location.hostname)
    });
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Auto-track scroll depth
if (typeof window !== 'undefined') {
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      analytics.trackScrollDepth(scrollPercent);
    }
  });
}


