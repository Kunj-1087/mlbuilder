import PillarLayout from '@/components/PillarLayout';

const subNav = [
  { label: 'Free Tools', to: '/tools/free' },
];

export default function Tools() {
  return (
    <PillarLayout
      title="TOOLS"
      description="Free tools built to solve real problems. No paywalls, no catch."
      subNav={subNav}
      rootPath="/tools/free"
    />
  );
}
