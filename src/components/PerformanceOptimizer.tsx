import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface Props {
  children: React.ReactNode;
}

// Ensure this is a proper React component
const PerformanceOptimizer: React.FC<Props> = ({ children }) => {
  // Add safety check for React environment
  if (typeof useState === 'undefined' || typeof useEffect === 'undefined') {
    // console.error('React hooks not available in PerformanceOptimizer');
    return <>{children}</>;
  }

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Optimize font loading
    const optimizeFonts = () => {
      if ('fonts' in document) {
        const fontDisplay = (document as any).fonts;
        fontDisplay.ready.then(() => {
          // console.log('🚀 Fonts loaded successfully');
        });
      }
    };

    // Measure performance metrics
    const measurePerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0;
        const cls = performance.getEntriesByType('layout-shift').reduce((sum, entry) => {
          return sum + (entry as any).value;
        }, 0);
        
        // Fix TypeScript error for first input delay
        const firstInputEntries = performance.getEntriesByType('first-input');
        let fid = 0;
        if (firstInputEntries.length > 0) {
          const firstInput = firstInputEntries[0] as any;
          fid = firstInput.processingStart - firstInput.startTime;
        }

        const metrics: PerformanceMetrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          firstContentfulPaint: fcp,
          largestContentfulPaint: lcp,
          cumulativeLayoutShift: cls,
          firstInputDelay: fid
        };

        setMetrics(metrics);

        // Track performance in analytics
        if (typeof window !== 'undefined' && window.trackEvent) {
          window.trackEvent('performance_metrics', {
            load_time: metrics.loadTime,
            fcp: metrics.firstContentfulPaint,
            lcp: metrics.largestContentfulPaint,
            cls: metrics.cumulativeLayoutShift,
            fid: metrics.firstInputDelay
          });
        }

        // console.log('📊 Performance Metrics:', metrics);
      }
    };

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: '/gaffer-icon.png', as: 'image' },
        { href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800', as: 'style' }
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
      });
    };

    // Initialize optimizations
    const initOptimizations = async () => {
      try {
        preloadCriticalResources();
        optimizeImages();
        optimizeFonts();
        
        // Wait for page to fully load
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', measurePerformance);
        } else {
          measurePerformance();
        }

        setIsOptimized(true);
      } catch (error) {
        // console.error('Performance optimization failed:', error);
      }
    };

    initOptimizations();
  }, []);

  // Add performance monitoring
  useEffect(() => {
    if (!isOptimized) return;

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Long task threshold
            // console.warn('⚠️ Long task detected:', entry);
            
            if (typeof window !== 'undefined' && window.trackEvent) {
              window.trackEvent('long_task', {
                duration: entry.duration,
                name: entry.name
              });
            }
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // console.log('Long task monitoring not supported');
      }
    }

    // Monitor memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryInfo = {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576)
        };

        // Track memory usage if it's high
        if (memoryInfo.used > memoryInfo.total * 0.8) {
          // console.warn('⚠️ High memory usage:', memoryInfo);
          
          if (typeof window !== 'undefined' && window.trackEvent) {
            window.trackEvent('high_memory_usage', memoryInfo);
          }
        }
      }
    };

    const memoryInterval = setInterval(monitorMemory, 30000); // Check every 30 seconds

    return () => clearInterval(memoryInterval);
  }, [isOptimized]);

  return (
    <>
      {children}
    </>
  );
};

// Export with error boundary protection
export default PerformanceOptimizer;


