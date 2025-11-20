'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/EventForm';
import Link from 'next/link';
import { getEventById } from '@/lib/actions/event.actions';
import { authClient } from '@/lib/auth-client';

interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdBy: string;
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadEventAndCheckAuth() {
      try {
        // Check authentication
        const session = await authClient.getSession();
        
        if (!session?.user) {
          router.push('/auth/signin');
          return;
        }

        // Load event
        const eventData = await getEventById(params.id);
        
        if (!eventData) {
          setError('Event not found');
          setLoading(false);
          return;
        }

        // Check authorization
        if (eventData.createdBy !== session.user.id) {
          setError('unauthorized');
          setLoading(false);
          return;
        }

        setEvent(eventData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Failed to load event');
        setLoading(false);
      }
    }

    loadEventAndCheckAuth();
  }, [params.id, router]);

  if (loading) {
    return (
      <section className="admin-section">
        <p>Loading...</p>
      </section>
    );
  }

  if (error === 'unauthorized') {
    return (
      <section className="admin-section">
        <div className="empty-state">
          <h2>Unauthorized Access</h2>
          <p>You can only edit events that you created.</p>
          <Link href="/" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="admin-section">
        <div className="empty-state">
          <h2>Event Not Found</h2>
          <p>{error || 'The event you are looking for does not exist.'}</p>
          <Link href="/admin/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-section">
      <div className="admin-header">
        <div>
          <h1>Edit Event</h1>
          <p className="text-light-100">Update event details</p>
        </div>
        <Link href="/admin/events" className="btn-secondary">
          Back to Events
        </Link>
      </div>

      <EventForm event={event} isEdit={true} />
    </section>
  );
}
