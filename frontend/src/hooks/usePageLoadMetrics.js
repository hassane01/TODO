import { useEffect } from 'react';

/**
 * A development-only hook to log key web performance metrics on page load.
 */
export function usePageLoadMetrics() {
  useEffect(() => {
    // This hook is for development only and will be tree-shaken from production builds.
    if (import.meta.env.PROD) {
      return;
    }

    const [navigationTiming] = performance.getEntriesByType('navigation');

    if (navigationTiming instanceof PerformanceNavigationTiming) {
      const domContentLoadedTime = navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime;
      const dnsLookupTime = navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart;
      const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;

      console.group('Page Load Metrics');
      console.log(`DOM Content Loaded: ${domContentLoadedTime.toFixed(2)} ms`);
      console.log(`DNS Lookup: ${dnsLookupTime.toFixed(2)} ms`);
      console.log(`Time to First Byte (TTFB): ${ttfb.toFixed(2)} ms`);
      console.groupEnd();
    }
  }, []);
}