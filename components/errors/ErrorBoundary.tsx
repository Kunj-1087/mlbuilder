"use client";

/**
 * ErrorBoundary — React class component that catches runtime errors
 * in child components and renders a branded error UI instead of crashing.
 *
 * Used as a wrapper around route content in Root Layout.
 */
import { Component, type ReactNode } from 'react';
import Link from 'next/link';
import { logError } from '@/lib/errors/logError';
import AlternatingTitle from '@/components/errors/AlternatingTitle';
import { ScriptText, Body } from '@/components/typography';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback to render instead of the default error UI */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    logError(error, { source: 'ErrorBoundary' });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-start max-w-[520px] w-full mx-auto px-6 sm:px-12 py-16 md:py-24">
          <AlternatingTitle
            segments={[
              { text: 'THIS SECTION', color: 'black' },
              { text: 'HIT A', color: 'orange' },
              { text: 'BUG.', color: 'black' },
            ]}
            className="font-display text-ink leading-[0.95] tracking-tight mb-3 text-display-sm"
            tag="h2"
          />

          <ScriptText size="sm" className="mb-4">
            Don't worry — the rest of the site still works.
          </ScriptText>

          <Body size="sm" muted className="leading-relaxed mb-6">
            Something failed loading this part of MLBuilder. Try again or jump back to your dashboard.
          </Body>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={this.handleReset}
              className="
                inline-flex items-center justify-center
                font-body font-semibold text-body-sm
                rounded-pill border-2 border-ink
                bg-accent text-ink px-6 py-2.5
                shadow-hard-sm
                hover:shadow-[6px_6px_0_#111111] hover:-translate-y-[2px]
                transition-all duration-150 cursor-pointer
              "
            >
              Retry ↻
            </button>
            <Link
              href="/account"
              className="
                inline-flex items-center justify-center
                font-body font-semibold text-body-sm
                rounded-pill border-2 border-ink
                bg-cream text-ink px-6 py-2.5
                shadow-hard-sm
                hover:shadow-[6px_6px_0_#111111] hover:-translate-y-[2px]
                transition-all duration-150 cursor-pointer
              "
            >
              Back to Dashboard
            </Link>
          </div>

          {this.state.error?.message && (
            <Body size="xs" muted>
              Error: {this.state.error.message}
            </Body>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
