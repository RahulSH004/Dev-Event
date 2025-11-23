'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardClient from '@/components/DashboardClient';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/signin?redirect=/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <section className="container-padding py-12">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-dark-300 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-dark-300 rounded w-1/2"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!session) {
    return null;
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
