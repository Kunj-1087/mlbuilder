import BorderedCard from '@/components/BorderedCard';

interface ComingSoonProps {
  subtext: string;
}

export default function ComingSoon({ subtext }: ComingSoonProps) {
  return (
    <div className="flex justify-center py-6 md:py-10">
      <BorderedCard className="max-w-lg text-center">
        {/* Brand star icon — same mark as navbar and auth forms */}
        <div className="flex justify-center mb-5">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2L18.5 12.5L29 16L18.5 19.5L16 30L13.5 19.5L3 16L13.5 12.5L16 2Z"
              fill="#FF6A1A"
              stroke="#111111"
              strokeWidth="2"
            />
          </svg>
        </div>

        <h2 className="font-display text-xl md:text-2xl text-ink mb-3">
          This is being built right now.
        </h2>

        <p className="font-body text-muted text-sm leading-relaxed mb-6">
          {subtext}
        </p>

        <a
          href="https://instagram.com/mlbuilder.py"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            inline-flex items-center justify-center gap-2
            font-body font-semibold text-sm
            rounded-pill
            border-2 border-ink
            shadow-hard-sm
            transition-all duration-150
            cursor-pointer select-none
            bg-transparent text-ink
            hover:bg-ink hover:text-cream
            hover:translate-x-[1px] hover:translate-y-[1px]
            px-5 py-2
          `}
        >
          Follow progress on Instagram →
        </a>
      </BorderedCard>
    </div>
  );
}
