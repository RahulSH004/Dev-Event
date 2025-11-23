import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Events | Dev Events',
  description: 'View and manage your event registrations',
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/signin?redirect=/dashboard');
  }

  return (
    <section className="container-padding py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-light-100 mb-2">My Events</h1>
          <p className="text-light-300">
            View and manage your event registrations
          </p>
        </div>

        <DashboardClient 
          userId={session.user.id} 
          userEmail={session.user.email}
        />
      </div>
    </section>
  );
}
