/**
 * ErrorPageLayout — shared layout for all branded error pages.
 *
 * Features: massive error code with orange accent block, alternating-color
 * title, script-font subtext, CTA buttons, optional search suggestions.
 */
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '@/lib/search/SearchContext';
import AlternatingTitle from './AlternatingTitle';

interface ColorSegment {
  text: string;
  color: 'black' | 'orange';
}

interface CTA {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
  external?: boolean;
  onClick?: () => void;
}

interface ErrorPageLayoutProps {
  errorCode: string;
  titleSegments: ColorSegment[];
  script: string;
  description: string;
  ctas: CTA[];
  showSearchSuggestions?: boolean;
  variant?: 'full-layout' | 'minimal';
  /** Extra content to render below the CTAs (e.g. error digest card) */
  extra?: ReactNode;
}

const ERROR_SUGGESTIONS = ['n8n workflows', 'free PDF', 'research papers'];

export default function ErrorPageLayout({
  errorCode,
  titleSegments,
  script,
  description,
  ctas,
  showSearchSuggestions = false,
  variant = 'full-layout',
  extra,
}: ErrorPageLayoutProps) {
  const { openWithQuery } = useSearch();



  const content = (
    <div className="flex flex-col items-start max-w-[720px] w-full mx-auto px-6 sm:px-12 py-16 md:py-24" role="alert" aria-live="assertive">
      {/* ── Error code with orange accent block ── */}
      <div className="relative mb-8 select-none">
        {/* Orange accent block behind the code */}
        <div
          className="absolute bg-accent z-0"
          style={{
            top: '16px',
            left: '16px',
            width: '60%',
            height: '40%',
            transform: 'rotate(-2deg)',
          }}
        />
        <span
          className="relative z-10 font-display text-ink leading-none block"
          style={{
            fontSize: 'clamp(120px, 18vw, 180px)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            transform: 'rotate(-2deg)',
          }}
          aria-hidden="true"
        >
          {errorCode}
        </span>
      </div>

      {/* ── Title with alternating colors ── */}
      <AlternatingTitle
        segments={titleSegments}
        className="font-display text-ink leading-[0.95] tracking-tight mb-4 text-[36px] sm:text-[48px]"
      />

      {/* ── Script-font subtext ── */}
      <p className="font-script text-ink text-[22px] leading-snug max-w-xl mb-6">
        {script}
      </p>

      {/* ── Description ── */}
      <p className="font-body text-ink text-base leading-relaxed max-w-2xl mb-8">
        {description}
      </p>

      {/* ── CTA buttons ── */}
      <div className="flex flex-wrap gap-3 mb-8">
        {ctas.map((cta) => {
          const baseClasses =
            'inline-flex items-center justify-center font-body font-semibold text-[15px] rounded-pill border-2 border-ink px-8 py-3.5 shadow-hard-sm transition-all duration-150 cursor-pointer';

          const variantClasses =
            cta.variant === 'primary'
              ? 'bg-accent text-ink hover:shadow-[6px_6px_0_#111111] hover:-translate-y-[2px]'
              : 'bg-cream text-ink hover:shadow-[6px_6px_0_#111111] hover:-translate-y-[2px]';

          const classes = `${baseClasses} ${variantClasses}`;

          if (cta.onClick) {
            return (
              <button
                key={cta.label}
                onClick={cta.onClick}
                className={classes}
                autoFocus={cta.variant === 'primary'}
              >
                {cta.label}
              </button>
            );
          }

          if (cta.external) {
            return (
              <a
                key={cta.label}
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
              >
                {cta.label}
              </a>
            );
          }

          return (
            <Link
              key={cta.label}
              to={cta.href}
              className={classes}
              tabIndex={cta.variant === 'primary' ? 0 : undefined}
            >
              {cta.label}
            </Link>
          );
        })}
      </div>

      {/* ── Search suggestions ── */}
      {showSearchSuggestions && (
        <div className="mt-8">
          <p className="font-body text-[12px] font-semibold uppercase tracking-[0.1em] text-muted mb-3">
            § TRY SEARCHING FOR
          </p>
          <div className="flex flex-wrap gap-2">
            {ERROR_SUGGESTIONS.map((chip) => (
              <button
                key={chip}
                onClick={() => openWithQuery(chip)}
                className="
                  px-3 py-1.5 rounded-pill border-2 border-ink
                  bg-cream text-ink font-body text-[12px] font-medium
                  hover:bg-accent hover:text-ink
                  transition-colors cursor-pointer
                "
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Extra content (error digest, etc.) ── */}
      {extra && <div className="mt-8">{extra}</div>}
    </div>
  );

  if (variant === 'minimal') {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <main className="flex-1 flex items-center justify-center">
          {content}
        </main>
      </div>
    );
  }

  return content;
}
