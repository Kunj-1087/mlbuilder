import { Metadata } from 'next';
import NewsletterForm from '@/components/NewsletterForm';

export const metadata: Metadata = {
  title: 'Stay Ahead — Join the MLBuilder Newsletter',
  description: 'Get weekly AI automation breakdowns, curated research digests, and developer tools delivered directly to your inbox.',
  alternates: {
    canonical: 'https://mlbuilder.in/newsletter',
  },
};

const bullets = [
  {
    title: 'Build logs',
    description: 'Step-by-step breakdowns of AI automations I actually shipped — not tutorials that stop at hello world.',
  },
  {
    title: 'Research',
    description: 'Key papers digested in plain English, with takeaways you can act on right away.',
  },
  {
    title: 'Tool drops',
    description: 'Free tools worth bookmarking. No paywalls, no "upgrade to unlock" — just things that work.',
  },
];

export default function NewsletterPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4 select-none">
          § MLBUILDER / NEWSLETTER
        </p>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-ink leading-[0.95] mb-4 select-none">
          THE MLBUILDER<br />
          <span className="text-accent">NEWSLETTER.</span>
        </h1>

        {/* Script subtext */}
        <p className="font-script text-ink text-xl md:text-2xl leading-snug max-w-lg mx-auto mb-10 select-none">
          Build logs, research notes, and tool drops — straight to your inbox. Weekly-ish, no spam, unsubscribe anytime.
        </p>

        {/* What's inside bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 select-none">
          {bullets.map((b) => (
            <div
              key={b.title}
              className="border-2 border-ink rounded-sharp bg-cream p-5 text-left shadow-hard-sm"
            >
              <h3 className="font-display text-base text-ink mb-1">{b.title}</h3>
              <p className="font-body text-muted text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="flex justify-center">
          <NewsletterForm
            variant="card"
            source="newsletter-page"
            heading="GET THE WEEKLY DROP."
            subheading="One email, zero fluff."
          />
        </div>
      </div>
    </div>
  );
}
