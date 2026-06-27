import SeoHead from '@/components/seo/SeoHead';
import PillButton from '@/components/PillButton';

export default function LeadMagnetError() {
  return (
    <>
      <SeoHead
        title="Download Error"
        description="The download link is invalid or expired. Try claiming the guide again."
        path="/free/error"
        noindex
      />

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-surface border-2 border-ink rounded-sharp shadow-hard p-10 md:p-12 max-w-[520px] w-full text-center">
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">
            DOWNLOAD LINK DIDN'T WORK.
          </h1>
          <p className="font-script text-muted text-xl mb-8">
            Either the link is invalid or something broke. Try claiming the guide again — I'll send a fresh link.
          </p>

          <PillButton to="/free" variant="primary" size="md">
            Browse Free Resources
          </PillButton>
        </div>
      </div>
    </>
  );
}
