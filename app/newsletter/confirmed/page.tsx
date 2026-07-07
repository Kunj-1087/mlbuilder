import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import PillButton from '@/components/PillButton';
import { BRAND } from '@/lib/brand/constants';

export const metadata: Metadata = {
  title: "You're subscribed",
  description: "You're subscribed to the MLBuilder newsletter. Check your inbox for the first email.",
  alternates: {
    canonical: 'https://mlbuilder.in/newsletter/confirmed',
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface ConfirmedPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Page({ searchParams }: ConfirmedPageProps) {
  const params = await searchParams;
  const token = params.token;

  if (token) {
    try {
      const subscriber = await prisma.subscriber.findUnique({
        where: { confirmationToken: token },
      });

      if (subscriber && subscriber.status !== 'CONFIRMED') {
        // Confirm the subscriber
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date(),
            confirmationToken: null, // Clear token — single use
          },
        });

        // Send welcome email
        await sendEmail({
          to: subscriber.email,
          subject: 'Welcome to MLBuilder — You are in!',
          html: `<p>Welcome to MLBuilder!</p>`,
        });
      }
    } catch (error) {
      console.error('Error confirming subscription:', error);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-cream border-2 border-ink rounded-sharp shadow-hard p-10 md:p-12 max-w-[520px] w-full text-center">
        {/* Star mark */}
        <div className="flex justify-center mb-5 select-none">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2L18.5 12.5L29 16L18.5 19.5L16 30L13.5 19.5L3 16L13.5 12.5L16 2Z"
              fill={BRAND.colors.orange}
              stroke="#111111"
              strokeWidth="2"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3 select-none">YOU'RE IN.</h1>
        <p className="font-script text-muted text-xl mb-8 select-none">
          Welcome — first email lands soon. Check your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PillButton to="/automation" variant="primary" size="md">
            Explore Automation
          </PillButton>
          <a
            href={BRAND.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PillButton variant="ghost" size="md">
              Follow on Instagram →
            </PillButton>
          </a>
        </div>
      </div>
    </div>
  );
}
