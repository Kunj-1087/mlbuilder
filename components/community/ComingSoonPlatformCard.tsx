import { type ReactNode } from 'react';

interface ComingSoonPlatformCardProps {
  icon: ReactNode;
  name: string;
  description: string;
  voteCount: number;
  hasVoted: boolean;
  onVote: () => void;
}

export default function ComingSoonPlatformCard({
  icon,
  name,
  description,
  voteCount,
  hasVoted,
  onVote,
}: ComingSoonPlatformCardProps) {
  return (
    <div
      className="
        border-2 border-ink rounded-sharp bg-cream-muted
        p-6
        transition-all duration-150
        hover:border-ink hover:bg-cream-muted/80
      "
    >
      {/* Top row: icon + soon tag */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-ink">{icon}</div>
        <span className="bg-cream border border-ink text-ink text-[10px] font-bold tracking-wide rounded-pill px-2.5 py-0.5 font-body">
          SOON
        </span>
      </div>

      {/* Platform name */}
      <h3 className="font-display text-[22px] text-ink leading-none mb-2">{name}</h3>

      {/* Description */}
      <p className="font-body text-muted text-[13px] leading-relaxed mb-4 line-clamp-2">{description}</p>

      {/* Vote count */}
      {voteCount > 0 && (
        <p className="font-body text-muted text-[11px] mb-3">
          {voteCount} vote{voteCount !== 1 ? 's' : ''}
        </p>
      )}

      {/* Vote link */}
      <button
        onClick={hasVoted ? undefined : onVote}
        disabled={hasVoted}
        className={`font-body text-[12px] font-semibold transition-colors ${
          hasVoted ? 'text-muted cursor-default' : 'text-accent hover:text-ink cursor-pointer'
        }`}
      >
        {hasVoted ? (
          <>
            <span className="sr-only">Vote to prioritize</span>
            <span>✓ Voted</span>
          </>
        ) : (
          <span>Vote to prioritize →</span>
        )}
      </button>
    </div>
  );
}
