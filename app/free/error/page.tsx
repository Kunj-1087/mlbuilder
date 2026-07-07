import { Metadata } from 'next';
import PillButton from '@/components/PillButton';

export const metadata: Metadata = {
  title: 'Download Error — MLBuilder',
  description: 'The download link is invalid or expired. Try claiming the guide again.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-cream border-2 border-ink rounded-sharp shadow-hard p-10 md:p-12 max-w-[520px] w-full text-center">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3 select-none">
          DOWNLOAD LINK DIDN'T WORK.
        </h1>
        <p className="font-script text-muted text-xl mb-8 select-none">
          Either the link is invalid or something broke. Try claiming the guide again — I'll send a fresh link.
        </p>

        <PillButton to="/free" variant="primary" size="md">
          Browse Free Resources
        </PillButton>
      </div>
    </div>
  );
}
