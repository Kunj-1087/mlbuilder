import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SavedPageClient from './SavedPageClient';

export const metadata: Metadata = {
  title: 'My Bookmarked Automations — MLBuilder',
  description: 'View and run your saved AI automations, scraping setups, and developer tools.',
  alternates: {
    canonical: 'https://mlbuilder.in/account/saved',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/account/saved');
  }

  return <SavedPageClient />;
}
