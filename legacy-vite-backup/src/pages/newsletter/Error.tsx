import SeoHead from '@/components/seo/SeoHead';
import PillButton from '@/components/PillButton';

export default function NewsletterError() {
  return (
    <>
      <SeoHead
        title="Confirmation Error"
        description="The confirmation link is either expired or already used. Try subscribing again."
        path="/newsletter/error"
        noindex
      />

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-surface border-2 border-ink rounded-sharp shadow-hard p-10 md:p-12 max-w-[520px] w-full text-center">
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">THAT LINK DIDN'T WORK.</h1>
          <p className="font-script text-muted text-xl mb-8">
            The confirmation link is either expired or already used. Try subscribing again — I'll send a fresh one.
          </p>

          <PillButton to="/newsletter" variant="primary" size="md">
            Subscribe again
          </PillButton>
        </div>
      </div>
    </>
  );
}
