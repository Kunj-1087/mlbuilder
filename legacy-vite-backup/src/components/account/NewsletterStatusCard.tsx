import { useState } from 'react';
import PillButton from '@/components/PillButton';
import NewsletterForm from '@/components/NewsletterForm';
import { unsubscribeFromNewsletter } from '@/lib/newsletter';

type SubStatus = 'CONFIRMED' | 'PENDING' | 'NONE';

interface NewsletterStatusCardProps {
  status: SubStatus;
  subscribedAt?: string;
  createdAt?: string;
  email: string;
  onStatusChange: () => void;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function NewsletterStatusCard({
  status,
  subscribedAt,
  createdAt,
  email,
  onStatusChange,
}: NewsletterStatusCardProps) {
  const [localStatus, setLocalStatus] = useState(status);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleUnsubscribe = () => {
    const result = unsubscribeFromNewsletter(email);
    if (result.success) {
      setLocalStatus('NONE');
      onStatusChange();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg('');
    await new Promise((r) => setTimeout(r, 600));
    setResending(false);
    setResendMsg('Confirmation resent — check your inbox.');
  };

  // CONFIRMED
  if (localStatus === 'CONFIRMED') {
    return (
      <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-[32px] text-accent">SUBSCRIBED ✓</span>
          <span className="bg-accent text-ink text-[12px] font-bold tracking-wide rounded-pill px-3 py-1 font-body">ACTIVE</span>
        </div>
        <p className="font-script text-ink text-[18px] mb-2">
          You're on the list. Next drop lands soon.
        </p>
        {subscribedAt && (
          <p className="font-body text-muted text-[14px] mb-6">Subscribed since {formatDate(subscribedAt)}</p>
        )}
        <PillButton onClick={handleUnsubscribe} variant="ghost" size="sm">
          Unsubscribe
        </PillButton>
      </div>
    );
  }

  // PENDING
  if (localStatus === 'PENDING') {
    return (
      <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-[28px] text-ink">PENDING CONFIRMATION.</span>
          <span className="bg-cream border border-ink text-ink text-[12px] font-bold tracking-wide rounded-pill px-3 py-1 font-body">AWAITING</span>
        </div>
        <p className="font-script text-ink text-[18px] mb-2">
          Check your inbox — I sent a confirmation link.
        </p>
        {createdAt && (
          <p className="font-body text-muted text-[14px] mb-6">Sent on {formatDate(createdAt)}</p>
        )}

        {resendMsg ? (
          <p className="font-body text-accent text-sm font-medium">{resendMsg}</p>
        ) : (
          <div className="flex gap-3 flex-wrap">
            <PillButton onClick={handleResend} variant="ghost" size="sm" disabled={resending}>
              {resending ? 'Sending...' : 'Resend Confirmation'}
            </PillButton>
            <PillButton onClick={() => setShowEmailForm(!showEmailForm)} variant="ghost" size="sm">
              Use Different Email
            </PillButton>
          </div>
        )}

        {showEmailForm && (
          <div className="mt-4">
            <NewsletterForm variant="inline" source="account-resubscribe" />
          </div>
        )}
      </div>
    );
  }

  // NONE / UNSUBSCRIBED
  return (
    <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-8">
      <div className="mb-4">
        <span className="font-display text-[28px] text-ink">NOT SUBSCRIBED YET.</span>
      </div>
      <p className="font-script text-ink text-[18px] mb-6">
        Get build logs, research notes, and tool drops straight to your inbox.
      </p>
      <NewsletterForm variant="inline" source="account-page" />
    </div>
  );
}
