import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CommunityPageClient from './CommunityPageClient';

export const metadata: Metadata = {
  title: 'Community Hub — Share and Learn Automation',
  description: 'Connect with other vibe coders and builders. Share automation scripts, ask questions, and collaborate on building projects.',
  alternates: {
    canonical: 'https://mlbuilder.in/blog/community',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/blog/community');
  }

  return <CommunityPageClient />;
}
