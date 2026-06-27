import { useState, type FormEvent, useEffect, useRef } from 'react';
import { claimLeadMagnet } from '@/lib/lead-magnet';
import { track, EVENTS } from '@/lib/analytics/track';
import InlineSpinner from '@/components/ui/loading/InlineSpinner';

interface LeadMagnetClaimFormProps {
  slug: string;
  source?: string;
}

export default function LeadMagnetClaimForm({
  slug,
  source = 'free-landing',
}: LeadMagnetClaimFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
          track(EVENTS.LEAD_MAGNET_FORM_VIEWED, { slug });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }

    track(EVENTS.LEAD_MAGNET_CLAIM_ATTEMPTED, { slug, source });
    setLoading(true);
    const result = await claimLeadMagnet(email, slug, source);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      track(EVENTS.LEAD_MAGNET_CLAIM_SUCCEEDED, { slug, source, already_subscribed: result.alreadySubscribed });
    } else {
      setError(result.error);
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div
        id="claim-form"
        className="border-2 border-ink rounded-sharp bg-cream p-6 md:p-8"
      >
        <h3 className="font-display text-2xl text-ink mb-2">
          CHECK YOUR INBOX.
        </h3>
        <p className="font-script text-ink text-base mb-4">
          I just sent the PDF link. If it doesn't arrive in 2 minutes, check
          spam.
        </p>
        <p className="font-body text-muted text-sm">
          Already subscribed? You're still good — same email, no duplicates.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      id="claim-form"
      className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-6 md:p-8"
    >
      {/* Heading */}
      <h3 className="font-display text-[24px] text-ink mb-1">GET IT FREE.</h3>

      {/* Script subtext */}
      <p className="font-script text-ink text-base mb-5">
        Drop your email and the link lands in your inbox in 30 seconds.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
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

        {/* Error */}
        {error && (
          <p className="font-body text-accent text-sm font-medium">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
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
            disabled:opacity-50 disabled:cursor-not-allowed
            px-8 py-3
          "
        >
          {loading ? (<>Sending <InlineSpinner size="sm" color="ink" className="ml-2" /></>) : 'Send Me The PDF →'}
        </button>
      </form>

      {/* Fineprint */}
      <p className="font-body text-muted text-[11px] mt-4 leading-relaxed">
        By downloading, you're also subscribed to the MLBuilder newsletter.
        Unsubscribe anytime — one click.
      </p>
    </div>
  );
}
