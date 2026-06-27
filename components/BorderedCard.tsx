import { type ReactNode } from 'react';

interface BorderedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function BorderedCard({ children, className = '', hover = false }: BorderedCardProps) {
  const base = `
    bg-surface
    border-2 border-ink
    rounded-sharp
    shadow-hard
    p-6
    transition-all duration-150
  `;

  const hoverClass = hover
    ? 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm cursor-pointer'
    : '';

  return <div className={`${base} ${hoverClass} ${className}`}>{children}</div>;
}
