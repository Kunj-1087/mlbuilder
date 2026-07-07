import PillarLayout from '@/components/PillarLayout';

const subNav = [
  { label: 'Workflows', to: '/automation/workflows' },
  { label: 'Scripts', to: '/automation/scripts' },
  { label: 'Case Studies', to: '/automation/case-studies' },
];

export default function Automation() {
  return (
    <PillarLayout
      title="AUTOMATION"
      description="Step-by-step AI automations you can actually run — not just read about."
      subNav={subNav}
      rootPath="/automation/workflows"
    />
  );
}
