'use client';

import { useEffect, useState } from 'react';
import { getAllEvents } from '@/lib/actions/event.actions';
import EventList from '@/components/EventList';
import Link from 'next/link';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return (
      <section className="admin-section">
        <p>Loading events...</p>
      </section>
    );
  }

  return (
    <section className="admin-section">
      <div className="admin-header">
        <div>
          <h1>Manage Events</h1>
          <p className="text-light-100">Create, edit, and manage your events</p>
        </div>
        <Link href="/admin/events/create" className="btn-primary">
          Create New Event
        </Link>
      </div>

      <EventList events={events} />
    </section>
  );
}
