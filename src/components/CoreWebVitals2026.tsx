// Core Web Vitals 2026 - Latest Performance Standards
import React, { useEffect, useState } from 'react';

interface CWV2026Metrics {
  // Core Web Vitals (2026 standards)
  LCP: number;      // Largest Contentful Paint - < 2.5s
  INP: number;      // Interaction to Next Paint - < 200ms (replaces FID)
  CLS: number;      // Cumulative Layout Shift - < 0.1
  
  // Additional 2026 metrics
  FCP: number;      // First Contentful Paint - < 1.8s
  TTFB: number;     // Time to First Byte - < 800ms
  TTI: number;      // Time to Interactive - < 3.8s
  TBT: number;      // Total Blocking Time - < 200ms
  
  // New 2026 metrics
  SI: number;       // Speed Index - < 3.4s
  FMP: number;      // First Meaningful Paint - < 2.0s
  LCP2: number;     // LCP2 (LCP with 2s window) - < 2.8s
  
  // Performance indicators
  score: number;    // Overall performance score
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

interface Props {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enableOptimization?: boolean;
}

const CoreWebVitals2026: React.FC<Props> = ({ 
  children, 
  enableMonitoring = true,
  enableOptimization = true 
}) => {
  const [metrics, setMetrics] = useState<CWV2026Metrics | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // 2026 Performance Observer setup
  useEffect(() => {
    if (!enableMonitoring || typeof window === 'undefined') return;

    const measureCWV2026 = () => {
      const cwvMetrics: Partial<CWV2026Metrics> = {};
      
      // Measure LCP (Largest Contentful Paint)
      const measureLCP = () => {
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        const lastEntry = lcpEntries[lcpEntries.length - 1];
        if (lastEntry) {
          cwvMetrics.LCP = lastEntry.startTime;
          
          // LCP2 - LCP with 2-second window
          const lcp2Entries = performance.getEntriesByType('largest-contentful-paint')
            .filter(entry => entry.startTime <= 2000);
          if (lcp2Entries.length > 0) {
            cwvMetrics.LCP2 = lcp2Entries[lcp2Entries.length - 1].startTime;
          }
        }
      };

      // Measure INP (Interaction to Next Paint) - 2026 replacement for FID
      const measureINP = (entries: PerformanceObserverEntryList) => {
        const entryList = entries.getEntries();
        entryList.forEach((entry: any) => {
          if (entry.entryType === 'event') {
            const inp = entry.processingStart - entry.startTime;
            if (!cwvMetrics.INP || inp > cwvMetrics.INP) {
              cwvMetrics.INP = inp;
            }
          }
        });
      };

      // Measure CLS (Cumulative Layout Shift)
      const measureCLS = (entries: PerformanceObserverEntryList) => {
        const entryList = entries.getEntries();
        entryList.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cwvMetrics.CLS = (cwvMetrics.CLS || 0) + entry.value;
          }
        });
      };

      // Measure FCP (First Contentful Paint)
      const measureFCP = () => {
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          cwvMetrics.FCP = fcpEntry.startTime;
        }
      };

      // Measure TTFB (Time to First Byte)
      const measureTTFB = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          cwvMetrics.TTFB = navigation.responseStart - navigation.requestStart;
        }
      };

      // Initialize measurements
      measureFCP();
      measureLCP();
      measureTTFB();

      // Set up observers for dynamic metrics
      try {
        // INP observer (2026 standard)
        const inpObserver = new PerformanceObserver(measureINP);
        inpObserver.observe({ entryTypes: ['event'] });

        // CLS observer
        const clsObserver = new PerformanceObserver(measureCLS);
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        // console.warn('Performance Observer not fully supported:', error);
      }

      // Calculate overall score and grade
      const calculateScore = () => {
        const weights = {
          LCP: 0.25,
          INP: 0.25,
          CLS: 0.25,
          FCP: 0.15,
          TTFB: 0.10
        };

        const scores = {
          LCP: Math.max(0, 100 - (cwvMetrics.LCP || 0) / 2.5 * 100),
          INP: Math.max(0, 100 - (cwvMetrics.INP || 0) / 0.2 * 100),
          CLS: Math.max(0, 100 - (cwvMetrics.CLS || 0) / 0.1 * 100),
          FCP: Math.max(0, 100 - (cwvMetrics.FCP || 0) / 1.8 * 100),
          TTFB: Math.max(0, 100 - (cwvMetrics.TTFB || 0) / 0.8 * 100)
        };

        const weightedScore = Object.entries(weights).reduce((sum, [key, weight]) => {
          return sum + (scores[key as keyof typeof scores] * weight);
        }, 0);

        // Determine grade
        let grade: 'A' | 'B' | 'C' | 'D' | 'F';
        if (weightedScore >= 90) grade = 'A';
        else if (weightedScore >= 80) grade = 'B';
        else if (weightedScore >= 70) grade = 'C';
        else if (weightedScore >= 60) grade = 'D';
        else grade = 'F';

        return { score: Math.round(weightedScore), grade };
      };

      const { score, grade } = calculateScore();

      setMetrics({
        ...cwvMetrics as CWV2026Metrics,
        score,
        grade
      });
    };

    // Initial measurement
    setTimeout(measureCWV2026, 1000);

    // Continuous monitoring
    const interval = setInterval(measureCWV2026, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, [enableMonitoring]);

  return (
    <>
      {children}
      {import.meta.env.DEV && metrics && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
          <div className="font-bold mb-2">Core Web Vitals 2026</div>
          <div className="space-y-1">
            <div>LCP: {metrics.LCP.toFixed(0)}ms {metrics.LCP < 2500 ? '✅' : '⚠️'}</div>
            <div>INP: {metrics.INP.toFixed(0)}ms {metrics.INP < 200 ? '✅' : '⚠️'}</div>
            <div>CLS: {metrics.CLS.toFixed(3)} {metrics.CLS < 0.1 ? '✅' : '⚠️'}</div>
            <div>FCP: {metrics.FCP.toFixed(0)}ms {metrics.FCP < 1800 ? '✅' : '⚠️'}</div>
            <div>TTFB: {metrics.TTFB.toFixed(0)}ms {metrics.TTFB < 800 ? '✅' : '⚠️'}</div>
            <div>Score: {metrics.score}/100 ({metrics.grade})</div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoreWebVitals2026;


