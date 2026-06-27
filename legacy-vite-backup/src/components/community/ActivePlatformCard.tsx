import { useState, type ReactNode } from 'react';
import NewsletterForm from '@/components/NewsletterForm';

interface Stat {
  value: string;
  label: string;
}

interface ActivePlatformCardProps {
  icon: ReactNode;
  name: string;
  handle: string;
  description: string;
  stats: Stat[];
  ctaLabel: string;
  ctaHref?: string;
  ctaType?: 'newsletter-inline';
  newsletterSource?: string;
}

export default function ActivePlatformCard({
  icon,
  name,
  handle,
  description,
  stats,
  ctaLabel,
  ctaHref,
  ctaType,
  newsletterSource,
}: ActivePlatformCardProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      className="
        border-2 border-ink rounded-sharp bg-cream
        shadow-hard p-8
        transition-all duration-150
        hover:shadow-hard-lg hover:-translate-y-[2px]
      "
    >
      {/* Top row: icon + active tag */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-ink">{icon}</div>
        <span className="bg-accent text-ink text-[11px] font-bold tracking-wide rounded-pill px-3.5 py-1 font-body">
          ACTIVE
        </span>
      </div>

      {/* Platform name */}
      <h3 className="font-display text-[32px] text-ink leading-none mb-1">{name}</h3>

      {/* Handle */}
      <p className="font-script text-muted text-xl mb-3">{handle}</p>

      {/* Description */}
      <p className="font-body text-ink text-sm leading-relaxed mb-5 line-clamp-2">{description}</p>

      {/* Stats row */}
      <div className="flex gap-8 mb-6">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-[28px] text-accent leading-none">{s.value}</div>
            <div className="font-body text-[13px] text-ink mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {ctaType === 'newsletter-inline' ? (
        <button
          onClick={() => setShowForm(!showForm)}
          className="
            w-full
            inline-flex items-center justify-center
            font-body font-semibold text-base
            rounded-pill border-2 border-ink
            bg-accent text-ink
            shadow-hard
            hover:shadow-hard-lg hover:-translate-y-[2px]
            transition-all duration-150
            cursor-pointer select-none
            px-8 py-3
          "
        >
          {ctaLabel}
        </button>
      ) : (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-full
            inline-flex items-center justify-center
            font-body font-semibold text-base
            rounded-pill border-2 border-ink
            bg-accent text-ink
            shadow-hard
            hover:shadow-hard-lg hover:-translate-y-[2px]
            transition-all duration-150
            px-8 py-3
          "
        >
          {ctaLabel}
        </a>
      )}

      {/* Inline newsletter form (toggled) */}
      {ctaType === 'newsletter-inline' && showForm && (
        <div
          className="mt-4 overflow-hidden"
          style={{ animation: 'expandIn 200ms ease-out' }}
        >
          <NewsletterForm
            variant="inline"
            source={newsletterSource || 'community-newsletter'}
          />
        </div>
      )}

      <style>{`
        @keyframes expandIn {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
      `}</style>
    </div>
  );
}
