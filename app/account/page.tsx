import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProfileHeader from '@/components/account/ProfileHeader';
import ProfileInfoForm from '@/components/account/ProfileInfoForm';

export const metadata: Metadata = {
  title: 'My Account Settings — MLBuilder',
  description: 'Manage your MLBuilder account, profile details, and preferences.',
  alternates: {
    canonical: 'https://mlbuilder.in/account',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/account');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect('/sign-in');
  }

  const serializableUser = {
    name: user.name || '',
    email: user.email,
    image: user.image,
    createdAt: user.createdAt.toISOString(),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <ProfileHeader name={serializableUser.name} email={serializableUser.email} />
      <ProfileInfoForm initialUser={serializableUser} />
    </div>
  );
}
