interface DashboardStatRowProps {
  value: string;
  label: string;
}

export default function DashboardStatRow({ value, label }: DashboardStatRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-ink/10 last:border-0">
      <span className="font-display text-[36px] text-accent leading-none">{value}</span>
      <span className="font-body text-[14px] text-ink text-right max-w-[160px] leading-tight">{label}</span>
    </div>
  );
}
