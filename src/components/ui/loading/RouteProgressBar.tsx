/**
 * RouteProgressBar — thin loading bar at the very top of the viewport
 * during client-side route transitions.
 *
 * Shows during navigation, hides when complete.
 * Avoids flicker for very fast transitions (<150ms).
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    setProgress(10);
    // Delay showing the bar by 150ms to avoid flicker on fast transitions
    showTimerRef.current = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => {
        setProgress(80);
      });
    }, 150);
  }, []);

  const complete = useCallback(() => {
    // Clear the show timer if it hasn't fired yet (fast navigation)
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    // If bar was never shown, don't flash it
    setVisible((prev) => {
      if (!prev) return false;
      setProgress(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return true;
    });
  }, []);

  // Listen for route changes (navigation completed)
  useEffect(() => {
    complete();
  }, [location.pathname, location.search, complete]);

  // Listen for link clicks to trigger start
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || target.getAttribute('target') === '_blank') return;

      start();
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [start]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
