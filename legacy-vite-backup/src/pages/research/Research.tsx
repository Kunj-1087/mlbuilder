import PillarLayout from '@/components/PillarLayout';

const subNav = [
  { label: 'Papers', to: '/research/papers' },
  { label: 'Library', to: '/research/library' },
  { label: 'Insights', to: '/research/insights' },
];

export default function Research() {
  return (
    <PillarLayout
      title="RESEARCH"
      description="Key AI papers digested in plain English — skip the 40-page PDFs."
      subNav={subNav}
      rootPath="/research/papers"
    />
  );
}
