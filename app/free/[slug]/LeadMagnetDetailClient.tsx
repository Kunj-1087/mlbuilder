"use client";

import { useState } from 'react';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import LeadMagnetCoverArt from '@/components/lead-magnet/LeadMagnetCoverArt';
import LeadMagnetClaimForm from '@/components/lead-magnet/LeadMagnetClaimForm';
import { formatFileSize } from '@/lib/lead-magnet';
import PillButton from '@/components/PillButton';

interface LeadMagnetMapped {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverColor: string;
  coverEmoji: string | null;
  fileSizeKb: number;
  pageCount: number | null;
  downloadCount: number;
  whatYouLearn: string[];
}

interface LeadMagnetDetailClientProps {
  magnet: LeadMagnetMapped;
  source: string;
}

const faqs = [
  {
    q: 'Is this really free?',
    a: 'Yes. No upsell, no premium tier hiding behind it. The newsletter is free too. I build these resources because I use them myself — sharing them costs me nothing.',
  },
  {
    q: 'Why do I need to give my email?',
    a: "Honestly, two reasons: to send you the file (the link has to go somewhere), and to occasionally share new resources when I publish them. One-click unsubscribe always — no tricks.",
  },
  {
    q: 'What format is the file?',
    a: 'PDF. Works on every device — phone, laptop, tablet, e-reader. You can print it too.',
  },
  {
    q: 'Can I share this with friends?',
    a: 'Yes, please. Or send them the link to this page so they get the file delivered properly too.',
  },
  {
    q: 'Who made this?',
    a: "I'm Kunj — I build MLBuilder solo. Automation, research, and free tools for people who actually want to ship things. Check the /about page if you want the full story.",
  },
];

function AccordionIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-ink">
        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-ink">
      <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-2 border-ink rounded-sharp bg-cream">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
      >
        <span className="font-display text-[18px] text-ink pr-4">{question}</span>
        <AccordionIcon open={open} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="font-body text-[14px] text-muted leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function LeadMagnetDetailClient({ magnet, source }: LeadMagnetDetailClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* TOP SECTION — TWO-COLUMN */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left column: Hero + form */}
        <div className="lg:col-span-7">
          {/* Breadcrumb */}
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4 select-none">
            § FREE / {magnet.title.toUpperCase()}
          </p>

          {/* Title */}
          <h1 className="font-display text-[48px] sm:text-[56px] md:text-[64px] text-ink leading-[0.95] tracking-tight mb-3 line-clamp-3 select-none">
            {magnet.title}
          </h1>

          {/* Tagline */}
          <p className="font-script text-ink text-[24px] leading-snug mb-5 line-clamp-2 select-none">
            {magnet.tagline}
          </p>

          {/* Bookmark + Description */}
          <div className="flex items-center gap-3 mb-6 select-none">
            <BookmarkButton
              item={{
                itemType: 'lead-magnet',
                itemId: magnet.slug,
                itemTitle: magnet.title,
                itemExcerpt: magnet.tagline,
                itemUrl: `/free/${magnet.slug}`,
                itemCoverColor: magnet.coverColor,
                itemCoverEmoji: magnet.coverEmoji,
                itemCategory: 'Free Downloads',
              }}
              variant="icon-label"
            />
          </div>
          <p className="font-body text-ink text-[16px] leading-relaxed mb-8 max-w-2xl select-none">
            {magnet.description}
          </p>

          {/* What's inside */}
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-3 select-none">
            § WHAT'S INSIDE
          </p>
          <ul className="space-y-3 mb-8 select-none">
            {magnet.whatYouLearn.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-[14px]">▸</span>
                <span className="font-body text-ink text-[16px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* Claim form */}
          <LeadMagnetClaimForm slug={magnet.slug} source={source} />
        </div>

        {/* Right column: Visual cover */}
        <div className="lg:col-span-5 select-none">
          <div className="lg:sticky lg:top-24">
            {/* Large book cover */}
            <div className="rotate-[-2deg]">
              <LeadMagnetCoverArt
                title={magnet.title}
                coverColor={magnet.coverColor}
                coverEmoji={magnet.coverEmoji}
                pageCount={magnet.pageCount}
                variant="detail"
                className="w-full max-w-[360px] mx-auto shadow-[12px_12px_0_#111111]"
              />
            </div>

            {/* File metadata */}
            <p className="font-body text-muted text-[13px] text-center mt-4">
              {formatFileSize(magnet.fileSizeKb)} PDF · {magnet.pageCount ?? '—'} pages · {magnet.downloadCount} downloads
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION — FAQ + Final CTA */}
      <section className="mt-16 md:mt-24">
        {/* FAQ */}
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-3 select-none">
          § COMMON QUESTIONS
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-8 select-none">
          EVERYTHING YOU MIGHT ASK.
        </h2>

        <div className="space-y-3 max-w-3xl select-none">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-24 select-none">
          <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-10 md:p-16 text-center">
            <h2 className="font-display text-[36px] md:text-[40px] text-ink mb-3">
              STILL HERE? GRAB IT.
            </h2>
            <p className="font-script text-ink text-[22px] mb-8">
              30 seconds. One email. Done.
            </p>
            <PillButton
              onClick={() => {
                const el = document.getElementById('claim-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="primary"
              size="lg"
            >
              Send Me The PDF →
            </PillButton>
          </div>
        </div>
      </section>
    </div>
  );
}
