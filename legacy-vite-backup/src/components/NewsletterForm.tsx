import { useState, type FormEvent, useEffect, useRef } from 'react';
import { subscribeNewsletter } from '@/lib/newsletter';
import { track, EVENTS } from '@/lib/analytics/track';
import InlineSpinner from '@/components/ui/loading/InlineSpinner';

interface NewsletterFormProps {
  variant: 'inline' | 'card' | 'footer-strip';
  source: string;
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
}

export default function NewsletterForm({
  variant,
  source,
  heading,
  subheading,
  buttonLabel = 'Subscribe →',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef(false);

  // Track form viewed when element enters viewport
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewedRef.current) {
          viewedRef.current = true;
          track(EVENTS.NEWSLETTER_FORM_VIEWED, { variant, source });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, source]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }

    track(EVENTS.NEWSLETTER_SUBSCRIBE_ATTEMPTED, { source, variant });
    setLoading(true);
    const result = await subscribeNewsletter(email, source);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setSuccessMsg(result.message);
      track(EVENTS.NEWSLETTER_SUBSCRIBE_SUCCEEDED, { source, already_subscribed: result.message?.includes('already') });
    } else {
      setError(result.error);
      track(EVENTS.NEWSLETTER_SUBSCRIBE_FAILED, { source, error_type: result.error });
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div className="border-2 border-ink rounded-sharp bg-cream p-6 text-center max-w-md">
        <div className="font-display text-xl text-ink mb-2">CHECK YOUR INBOX.</div>
        <p className="font-script text-muted text-lg">{successMsg}</p>
      </div>
    );
  }

  /* ── Form element (shared across variants) ── */
  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(''); }}
        placeholder="your@email.com"
        className={`
          w-full px-4 py-3
          bg-cream border-2 border-ink rounded-sharp
          font-body text-ink placeholder:text-muted/50
          focus:outline-none focus:border-accent focus:shadow-hard-sm
          transition-all
          ${error ? 'border-accent' : ''}
        `}
      />
      <button
        type="submit"
        disabled={loading}
        className="
          flex-shrink-0
          inline-flex items-center justify-center
          font-body font-semibold text-base
          rounded-pill border-2 border-ink
          bg-accent text-ink
          shadow-hard
          hover:shadow-hard-lg hover:-translate-y-[2px]
          transition-all duration-150
          cursor-pointer select-none
          disabled:opacity-50 disabled:cursor-not-allowed
          px-8 py-3
        "
      >
        {loading ? (<>Sending <InlineSpinner size="sm" color="ink" className="ml-2" /></>) : buttonLabel}
      </button>
    </form>
  );

  const errorEl = error && (
    <p className="font-body text-accent text-sm font-medium mt-2">{error}</p>
  );

  /* ── Variant: inline ── */
  if (variant === 'inline') {
    return (
      <div ref={formRef} className="max-w-xl">
        {form}
        {errorEl}
      </div>
    );
  }

  /* ── Variant: card ── */
  if (variant === 'card') {
    return (
      <div ref={formRef} className="border-2 border-ink rounded-sharp bg-surface shadow-hard p-8 md:p-10 max-w-lg text-center">
        {heading && <h3 className="font-display text-2xl md:text-3xl text-ink mb-2">{heading}</h3>}
        {subheading && <p className="font-script text-muted text-lg mb-6">{subheading}</p>}
        {form}
        {errorEl}
      </div>
    );
  }

  /* ── Variant: footer-strip ── */
  if (variant === 'footer-strip') {
    return (
      <div ref={formRef} className="border-y-2 border-ink bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              {heading && <h3 className="font-display text-xl md:text-2xl text-ink">{heading}</h3>}
              {subheading && <p className="font-script text-muted text-base">{subheading}</p>}
            </div>
            <div className="flex-1 w-full">
              {form}
              {errorEl}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
