import React, { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface Props {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enableLazyLoading?: boolean;
  enableImageOptimization?: boolean;
}

const AdvancedPerformanceOptimizer: React.FC<Props> = ({ 
  children, 
  enableMonitoring = true,
  enableLazyLoading = true,
  enableImageOptimization = true 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const metricsRef = useRef<Partial<PerformanceMetrics>>({});

  // Core Web Vitals monitoring
  useEffect(() => {
    if (!enableMonitoring || typeof window === 'undefined') return;

    const measureWebVitals = () => {
      // First Contentful Paint
      const measureFCP = () => {
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
        if (fcpEntry) {
          metricsRef.current.fcp = fcpEntry.startTime;
        }
      };

      // Largest Contentful Paint
      const measureLCP = () => {
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        const lastEntry = lcpEntries[lcpEntries.length - 1];
        if (lastEntry) {
          metricsRef.current.lcp = lastEntry.startTime;
        }
      };

      // First Input Delay
      const measureFID = (entries: PerformanceObserverEntryList) => {
        entries.forEach((entry: any) => {
          if (entry.name === 'first-input') {
            metricsRef.current.fid = entry.processingStart - entry.startTime;
          }
        });
      };

      // Cumulative Layout Shift
      const measureCLS = (entries: PerformanceObserverEntryList) => {
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            metricsRef.current.cls = (metricsRef.current.cls || 0) + entry.value;
          }
        });
      };

      // Time to First Byte
      const measureTTFB = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          metricsRef.current.ttfb = navigation.responseStart - navigation.requestStart;
        }
      };

      // Initialize measurements
      measureFCP();
      measureLCP();
      measureTTFB();

      // Set up observers for dynamic metrics
      try {
        const fidObserver = new PerformanceObserver(measureFID);
        fidObserver.observe({ entryTypes: ['first-input'] });
        observerRef.current = fidObserver;

        const clsObserver = new PerformanceObserver(measureCLS);
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        // console.warn('Performance Observer not supported:', error);
      }

      // Update metrics periodically
      const updateMetrics = () => {
        setMetrics(metricsRef.current as PerformanceMetrics);
        setIsOptimized(true);
      };

      // Initial update
      setTimeout(updateMetrics, 1000);

      // Update LCP continuously (it can change)
      const lcpInterval = setInterval(() => {
        measureLCP();
        updateMetrics();
      }, 1000);

      return () => {
        clearInterval(lcpInterval);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    };

    const cleanup = measureWebVitals();
    return cleanup;
  }, [enableMonitoring]);

  // Image optimization
  const optimizeImages = useCallback(() => {
    if (!enableImageOptimization) return;

    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      
      // Intersection Observer for lazy loading
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLImageElement;
              const src = target.dataset.src;
              if (src) {
                target.src = src;
                target.removeAttribute('data-src');
                target.classList.add('loaded');
                imageObserver.unobserve(target);
              }
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        imageObserver.observe(imgElement);
      }
    });
  }, [enableImageOptimization]);

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/logo.png',
      '/hero-image.jpg'
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.woff2')) {
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      } else if (resource.match(/\.(jpg|jpeg|png|webp)$/)) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }, []);

  // Optimize font loading
  const optimizeFontLoading = useCallback(() => {
    // Font display swap for better perceived performance
    const fontDisplay = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inter-var.woff2') format('woff2');
      }
    `;

    const style = document.createElement('style');
    style.textContent = fontDisplay;
    document.head.appendChild(style);
  }, []);

  // Initialize optimizations
  useEffect(() => {
    preloadCriticalResources();
    optimizeFontLoading();
    optimizeImages();
  }, [preloadCriticalResources, optimizeFontLoading, optimizeImages]);

  // Service Worker registration disabled - handled by index.html nuclear cache clear
  // Old sw.js was causing stale cached JS bundles to be served
  useEffect(() => {
    // Unregister any remaining service workers from this component
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (registration.active?.scriptURL?.includes('sw.js')) {
            registration.unregister();
          }
        });
      });
    }
  }, []);

  // Log performance metrics in development
  useEffect(() => {
    if (import.meta.env.DEV && metrics) {
      // console.log('Performance Metrics:', metrics);
      
      // Performance recommendations
      if (metrics.fcp > 1800) {
        // console.warn('FCP is slow (>1.8s). Consider optimizing critical resources.');
      }
      if (metrics.lcp > 2500) {
        // console.warn('LCP is slow (>2.5s). Optimize largest content element.');
      }
      if (metrics.fid > 100) {
        // console.warn('FID is slow (>100ms). Reduce JavaScript execution time.');
      }
      if (metrics.cls > 0.1) {
        // console.warn('CLS is high (>0.1). Avoid layout shifts.');
      }
      if (metrics.ttfb > 800) {
        // console.warn('TTFB is slow (>800ms). Optimize server response time.');
      }
    }
  }, [metrics]);

  return (
    <>
      {children}
      {import.meta.env.DEV && metrics && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>FCP: {(metrics.fcp / 1000).toFixed(2)}s</div>
          <div>LCP: {(metrics.lcp / 1000).toFixed(2)}s</div>
          <div>FID: {(metrics.fid / 1000).toFixed(2)}s</div>
          <div>CLS: {metrics.cls.toFixed(3)}</div>
          <div>TTFB: {(metrics.ttfb / 1000).toFixed(2)}s</div>
        </div>
      )}
    </>
  );
};

export default AdvancedPerformanceOptimizer;


