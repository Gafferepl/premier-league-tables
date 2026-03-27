// Performance monitoring hook for Core Web Vitals
import { useEffect } from 'react';

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

export const usePerformanceMonitor = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const metrics: PerformanceMetrics = {};

    // Measure FCP
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          // console.log('✅ FCP:', entry.startTime.toFixed(2), 'ms');
        }
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });

    // Measure LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      // console.log('✅ LCP:', metrics.LCP.toFixed(2), 'ms');
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure FID
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.FID = (entry as any).processingStart - entry.startTime;
        // console.log('✅ FID:', metrics.FID.toFixed(2), 'ms');
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Measure CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          metrics.CLS = clsValue;
          // console.log('✅ CLS:', clsValue.toFixed(4));
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Measure TTFB
    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.TTFB = (entry as any).responseStart - (entry as any).requestStart;
        // console.log('✅ TTFB:', metrics.TTFB.toFixed(2), 'ms');
      }
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });

    // Report to analytics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        reportMetrics(metrics);
      }, 3000);
    });

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      navigationObserver.disconnect();
    };
  }, [enabled]);
};

function reportMetrics(metrics: PerformanceMetrics) {
  // console.log('📊 Performance Metrics:', metrics);

  // Send to analytics
  if (window.gtag) {
    if (metrics.FCP) {
      window.gtag('event', 'performance_metric', {
        metric_name: 'FCP',
        value: Math.round(metrics.FCP),
        metric_rating: metrics.FCP < 1800 ? 'good' : metrics.FCP < 3000 ? 'needs_improvement' : 'poor'
      });
    }

    if (metrics.LCP) {
      window.gtag('event', 'performance_metric', {
        metric_name: 'LCP',
        value: Math.round(metrics.LCP),
        metric_rating: metrics.LCP < 2500 ? 'good' : metrics.LCP < 4000 ? 'needs_improvement' : 'poor'
      });
    }

    if (metrics.FID) {
      window.gtag('event', 'performance_metric', {
        metric_name: 'FID',
        value: Math.round(metrics.FID),
        metric_rating: metrics.FID < 100 ? 'good' : metrics.FID < 300 ? 'needs_improvement' : 'poor'
      });
    }

    if (metrics.CLS) {
      window.gtag('event', 'performance_metric', {
        metric_name: 'CLS',
        value: metrics.CLS,
        metric_rating: metrics.CLS < 0.1 ? 'good' : metrics.CLS < 0.25 ? 'needs_improvement' : 'poor'
      });
    }
  }

  // Display performance summary
  const summary = {
    FCP: metrics.FCP ? `${metrics.FCP.toFixed(0)}ms ${getPerformanceRating(metrics.FCP, 1800, 3000)}` : 'N/A',
    LCP: metrics.LCP ? `${metrics.LCP.toFixed(0)}ms ${getPerformanceRating(metrics.LCP, 2500, 4000)}` : 'N/A',
    FID: metrics.FID ? `${metrics.FID.toFixed(0)}ms ${getPerformanceRating(metrics.FID, 100, 300)}` : 'N/A',
    CLS: metrics.CLS ? `${metrics.CLS.toFixed(4)} ${getPerformanceRating(metrics.CLS, 0.1, 0.25)}` : 'N/A',
  };

  console.table(summary);
}

function getPerformanceRating(value: number, goodThreshold: number, poorThreshold: number): string {
  if (value < goodThreshold) return '✅ Good';
  if (value < poorThreshold) return '⚠️ Needs Improvement';
  return '❌ Poor';
}

// Export for manual usage
export const measurePerformance = () => {
  if (typeof window === 'undefined') return;

  const navigation = performance.getEntriesByType('navigation')[0] as any;
  const paint = performance.getEntriesByType('paint');

  // console.log('🔍 Performance Analysis:');
  // console.log('DNS Lookup:', navigation.domainLookupEnd - navigation.domainLookupStart, 'ms');
  // console.log('TCP Connection:', navigation.connectEnd - navigation.connectStart, 'ms');
  // console.log('Request Time:', navigation.responseStart - navigation.requestStart, 'ms');
  // console.log('Response Time:', navigation.responseEnd - navigation.responseStart, 'ms');
  // console.log('DOM Processing:', navigation.domComplete - navigation.domLoading, 'ms');
  // console.log('Load Complete:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');

  paint.forEach((entry) => {
    // console.log(entry.name + ':', entry.startTime.toFixed(2), 'ms');
  });
};


