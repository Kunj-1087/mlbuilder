export default function TickerBar() {
  const items = [
    'BUILT SOLO',
    'AI AUTOMATION',
    'RESEARCH BREAKDOWNS',
    'NEW DROPS WEEKLY',
    'FOLLOW @MLBUILDER.PY',
    'OPEN ACCESS',
    'DAY ONE',
  ];

  const bullet = <span className="text-accent text-sm mx-4">•</span>;

  const content = items.map((item, i) => (
    <span key={i} className="flex items-center whitespace-nowrap">
      <span className="font-body text-[13px] font-semibold tracking-[0.18em] text-ink">{item}</span>
      {bullet}
    </span>
  ));

  return (
    <div className="ticker-container border-y-[3px] border-ink bg-cream overflow-hidden py-3">
      <div className="animate-ticker flex w-max">
        {content}
        {content}
      </div>
    </div>
  );
}
