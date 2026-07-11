'use client';

import { useEffect, useState } from 'react';

/**
 * Neubrutalist Theme Toggle button.
 * Swaps between light (#ced0ce) and dark (#0A0A0F) background colors.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const localTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (localTheme) {
      setTheme(localTheme);
    } else {
      const isSystemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      setTheme(isSystemLight ? 'light' : 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 border-2 border-ink rounded-sharp bg-surface opacity-50" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        w-9 h-9 flex items-center justify-center
        border-2 border-ink rounded-sharp
        shadow-hard-sm bg-surface text-ink
        hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
        transition-all cursor-pointer
      "
      aria-label="Toggle light/dark theme"
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
