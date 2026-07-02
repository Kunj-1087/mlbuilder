"use client";

import React, { createContext, useContext, useState, useRef } from 'react';
import { track } from '@/lib/analytics/track';
import { DisplayHeading, SectionHeading, Body, Label, Mono } from '@/components/typography';

// Context to share automation state with MDX children
export const AutomationContext = createContext<{
  zipUrl?: string;
  title?: string;
  category?: string;
  slug?: string;
} | null>(null);

export const AutomationProvider = AutomationContext.Provider;

export function Callout({ type = 'note', children }: { type?: 'note' | 'warning' | 'tip'; children: React.ReactNode }) {
  const icons = {
    note: '💡',
    warning: '⚠️',
    tip: '✨',
  };
  return (
    <div className="p-4 my-6 bg-cream-muted border-2 border-ink rounded-sharp flex gap-3 shadow-none">
      <span className="text-lg leading-none select-none">{icons[type]}</span>
      <Body size="sm" className="leading-relaxed">{children}</Body>
    </div>
  );
}

export function DifficultyBadge({ level }: { level: 'beginner' | 'intermediate' | 'advanced' }) {
  const colors = {
    beginner: 'bg-cover-teal text-cream',
    intermediate: 'bg-accent text-ink',
    advanced: 'bg-cover-maroon text-cream',
  };
  return (
    <Label className={`px-2.5 py-0.5 border-2 border-ink text-body-xs font-bold ${colors[level]}`}>
      {level}
    </Label>
  );
}

export function CompletionTime({ minutes }: { minutes: number | string }) {
  return (
    <Label className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EFEAD8] border-2 border-ink text-body-xs font-bold text-ink tracking-wider">
      ⏱️ {minutes}
    </Label>
  );
}

export function DownloadCTA() {
  const context = useContext(AutomationContext);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!context || !context.zipUrl) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      track('automation_download_started', {
        title: context.title || '',
        category: context.category || '',
        slug: context.slug || '',
      });

      const res = await fetch(context.zipUrl!);
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a minute before downloading again.');
        }
        if (res.status === 401) {
          throw new Error('Please sign in to download projects.');
        }
        throw new Error('Failed to download project zip.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${context.slug || 'project'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred during download.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="my-8 p-6 border-2 border-ink rounded-sharp bg-[#EFEAD8] shadow-hard-sm">
      <SectionHeading as="h4" size="md" className="mb-2">GRAB THE FULL CODE</SectionHeading>
      <Body size="sm" muted className="mb-4">
        Download the production-ready code files, environment setups, and instructions in a single ZIP.
      </Body>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="inline-block px-6 py-3 border-2 border-ink rounded-pill bg-accent text-ink font-body text-body-sm font-bold shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? 'Downloading...' : 'Download Project ZIP (Free) →'}
      </button>
      {error && (
        <Body size="xs" className="mt-2 text-red-700 font-semibold">{error}</Body>
      )}
    </div>
  );
}

function Pre({ children, ...props }: any) {
  return (
    <div className="my-6 border-2 border-ink rounded-sharp overflow-hidden shadow-hard-sm bg-cream">
      <div className="px-4 py-2 border-b-2 border-ink bg-[#EFEAD8] select-none block">
        <Label className="text-body-xs font-bold text-muted tracking-wider">PROJECT SCRIPT CODE</Label>
      </div>
      <pre className="overflow-x-auto font-mono text-body-xs" {...props}>
        {children}
      </pre>
    </div>
  );
}

function Code({ children, ...props }: any) {
  const isInline = !props['data-language'];
  if (isInline) {
    return (
      <Mono className="text-body-xs">
        {children}
      </Mono>
    );
  }
  return <code {...props}>{children}</code>;
}

export const mdxComponents = {
  h2: ({ children, id }: any) => (
    <SectionHeading as="h2" size="lg" id={id} className="mt-8 mb-4 scroll-mt-24">
      {children}
    </SectionHeading>
  ),
  h3: ({ children, id }: any) => (
    <SectionHeading as="h3" size="md" id={id} className="mt-6 mb-3 scroll-mt-24">
      {children}
    </SectionHeading>
  ),
  h4: ({ children, id }: any) => (
    <SectionHeading as="h4" size="sm" id={id} className="mt-4 mb-2 scroll-mt-24">
      {children}
    </SectionHeading>
  ),
  p: ({ children }: any) => (
    <Body size="md" className="mb-4">
      {children}
    </Body>
  ),
  ul: ({ children }: any) => (
    <ul className="list-none font-body text-body-md text-ink leading-relaxed mb-4 pl-1 space-y-2">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return (
            <li className="flex items-start gap-2">
              <span className="text-accent select-none mt-[3px] flex-shrink-0">▸</span>
              <span className="flex-1">{(child as React.ReactElement<any>).props.children}</span>
            </li>
          );
        }
        return child;
      })}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-none font-body text-body-md text-ink leading-relaxed mb-4 pl-1 space-y-2">
      {React.Children.map(children, (child, idx) => {
        if (React.isValidElement(child)) {
          return (
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold select-none flex-shrink-0">{idx + 1}.</span>
              <span className="flex-1">{(child as React.ReactElement<any>).props.children}</span>
            </li>
          );
        }
        return child;
      })}
    </ol>
  ),
  li: ({ children }: any) => (
    <>{children}</>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-accent pl-4 my-6 italic text-muted [&>p]:text-muted [&>p]:italic">
      {children}
    </blockquote>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6 border-2 border-ink rounded-sharp">
      <table className="min-w-full divide-y-2 divide-ink bg-cream-muted">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-[#EFEAD8] select-none">
      {children}
    </thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-ink/10 bg-cream">
      {children}
    </tbody>
  ),
  tr: ({ children }: any) => (
    <tr>{children}</tr>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">
      <Label className="text-xs text-ink">{children}</Label>
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-4 py-3">
      <Body size="sm" className="text-ink leading-relaxed">{children}</Body>
    </td>
  ),
  a: ({ children, ...props }: any) => (
    <a className="text-accent underline font-semibold hover:text-ink transition-colors" {...props}>
      {children}
    </a>
  ),
  pre: Pre,
  code: Code,
  Callout,
  DifficultyBadge,
  CompletionTime,
  DownloadCTA,
};
