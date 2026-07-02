import React from 'react';
import { cn } from '@/lib/utils';

export interface DisplayHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'div' | 'span';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  colorPattern?: { text: string; color: 'black' | 'orange' | 'cream' | string }[];
}

const sizeClasses = {
  xl: 'text-display-xl',
  lg: 'text-display-lg',
  md: 'text-display-md',
  sm: 'text-display-sm',
};

/**
 * DisplayHeading
 * Used for major headlines, page titles, hero text, section headings, and brand wordmark.
 * Uses the display font (Archivo Black), always uppercase, with tight line-height and letter-spacing.
 */
export function DisplayHeading({
  as: Component = 'h1',
  size = 'lg',
  colorPattern,
  children,
  className,
  ...props
}: DisplayHeadingProps) {
  const baseClass = cn(
    'font-display uppercase text-ink tracking-tight',
    sizeClasses[size],
    className
  );

  if (colorPattern && colorPattern.length > 0) {
    return (
      <Component className={baseClass} {...props}>
        {colorPattern.map((item, index) => {
          const colorClass = 
            item.color === 'orange' 
              ? 'text-accent' 
              : item.color === 'cream' 
              ? 'text-cream' 
              : 'text-ink';
          return (
            <React.Fragment key={index}>
              <span className={colorClass}>{item.text}</span>
              {index < colorPattern.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </Component>
    );
  }

  return (
    <Component className={baseClass} {...props}>
      {children}
    </Component>
  );
}
