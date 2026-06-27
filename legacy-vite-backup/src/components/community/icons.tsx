/**
 * Platform icon components for the Community page.
 * Simple, thick-stroke SVGs in ink-black — brutalist style, no gradients.
 */

export function InstagramIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function EnvelopeIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  );
}

export function DiscordIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12V12.01" />
      <path d="M15 12V12.01" />
      <path d="M7.5 7.5C9.5 6.5 11 6 12 6C13 6 14.5 6.5 16.5 7.5" />
      <path d="M16.5 7.5C18 9 19 11 19 14C17 15.5 14.5 16 12 16C9.5 16 7 15.5 5 14C5 11 6 9 7.5 7.5" />
      <path d="M5 14C4 15 3.5 16.5 4 18" />
      <path d="M19 14C20 15 20.5 16.5 20 18" />
    </svg>
  );
}

export function YouTubeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="4" />
      <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4L11.5 12.5L4 20" />
      <path d="M20 4L12.5 12.5L20 20" />
    </svg>
  );
}

export function TelegramIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}
