"use client";

import { type ReactNode } from 'react';
import Link from 'next/link';

interface PillButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export default function PillButton({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
}: PillButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2
    font-body font-semibold
    rounded-pill
    border-2 border-ink
    shadow-hard-sm
    transition-all duration-150
    cursor-pointer
    select-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const hoverLift = !disabled ? 'hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-hard-sm' : '';

  const variants = {
    primary: `bg-accent text-cream hover:bg-ink hover:text-cream ${hoverLift}`,
    secondary: `bg-ink text-cream hover:bg-accent hover:text-cream ${hoverLift}`,
    ghost: `bg-transparent text-ink hover:bg-ink hover:text-cream ${hoverLift}`,
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link href={to} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
