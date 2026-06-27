interface StatBoxProps {
  value: string;
  label: string;
  className?: string;
}

export default function StatBox({ value, label, className = '' }: StatBoxProps) {
  return (
    <div
      className={`
        bg-surface border-2 border-ink rounded-sharp shadow-hard
        p-6 text-center
        ${className}
      `}
    >
      <div className="font-display text-4xl md:text-5xl text-accent leading-none">{value}</div>
      <div className="font-body text-muted text-sm mt-2 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}
