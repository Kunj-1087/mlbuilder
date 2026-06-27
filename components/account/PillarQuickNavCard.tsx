import Link from 'next/link';
import { type ReactNode } from 'react';

interface PillarQuickNavCardProps {
  icon: ReactNode;
  name: string;
  description: string;
  to: string;
  itemCount: number;
}

export default function PillarQuickNavCard({ icon, name, description, to, itemCount }: PillarQuickNavCardProps) {
  return (
    <Link
      href={to}
      className="
        border-2 border-ink rounded-sharp bg-cream
        shadow-hard p-6
        transition-all duration-150
        hover:shadow-hard-lg hover:-translate-y-[2px]
        block no-underline
      "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-ink">{icon}</div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink flex-shrink-0">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
      <h3 className="font-display text-[24px] text-ink mb-2">{name}</h3>
      <p className="font-body text-ink text-[14px] leading-[1.5] mb-3 line-clamp-2">{description}</p>
      <span className="font-body text-muted text-[11px] uppercase tracking-wide">{itemCount} items</span>
    </Link>
  );
}
