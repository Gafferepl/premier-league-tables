// Sentry Error Tracking Service
// Captures and reports errors in production

interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
}

class SentryService {
  private initialized = false;
  private readonly config: SentryConfig;

  constructor() {
    this.config = {
      dsn: process.env.SENTRY_DSN || '',
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
      tracesSampleRate: 0.1, // 10% of transactions
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0 // 100% of errors
    };
  }

  /**
   * Initialize Sentry (call once on app start)
   */
  async init(): Promise<void> {
    if (this.initialized || !this.config.dsn) {
      // console.log('⚠️ Sentry not initialized (no DSN configured)');
      return;
    }

    try {
      // Dynamic import to avoid bundling if not used
      const Sentry = await import('@sentry/browser');
      
      Sentry.init({
        dsn: this.config.dsn,
        environment: this.config.environment,
        integrations: [
          new Sentry.BrowserTracing(),
          new Sentry.Replay()
        ],
        tracesSampleRate: this.config.tracesSampleRate,
        replaysSessionSampleRate: this.config.replaysSessionSampleRate,
        replaysOnErrorSampleRate: this.config.replaysOnErrorSampleRate,
        
        // Filter out sensitive data
        beforeSend(event) {
          // Remove sensitive headers
          if (event.request?.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['Cookie'];
          }
          return event;
        }
      });

      this.initialized = true;
      // console.log('✅ Sentry initialized');
    } catch (error) {
      // console.error('Failed to initialize Sentry:', error);
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) {
      // console.error('Sentry not initialized, logging error:', error);
      return;
    }

    import('@sentry/browser').then(Sentry => {
      if (context) {
        Sentry.setContext('additional', context);
      }
      Sentry.captureException(error);
    });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.initialized) {
      // console.log(`Sentry not initialized, logging message [${level}]:`, message);
      return;
    }

    import('@sentry/browser').then(Sentry => {
      Sentry.captureMessage(message, level);
    });
  }

  /**
   * Set user context
   */
  setUser(user: { id?: string; email?: string; username?: string }): void {
    if (!this.initialized) return;

    import('@sentry/browser').then(Sentry => {
      Sentry.setUser(user);
    });
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    if (!this.initialized) return;

    import('@sentry/browser').then(Sentry => {
      Sentry.setUser(null);
    });
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(message: string, category?: string, data?: Record<string, any>): void {
    if (!this.initialized) return;

    import('@sentry/browser').then(Sentry => {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info'
      });
    });
  }

  /**
   * Start a transaction for performance monitoring
   */
  startTransaction(name: string, op: string): any {
    if (!this.initialized) return null;

    return import('@sentry/browser').then(Sentry => {
      return Sentry.startTransaction({ name, op });
    });
  }

  /**
   * Wrap async function with error tracking
   */
  wrapAsync<T>(fn: () => Promise<T>, context?: Record<string, any>): Promise<T> {
    return fn().catch(error => {
      this.captureException(error as Error, context);
      throw error;
    });
  }

  /**
   * Check if Sentry is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export const sentryService = new SentryService();


