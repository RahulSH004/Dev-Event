import { getAllEvents } from '@/lib/actions/event.actions';
import EventList from '@/components/EventList';
import Link from 'next/link';

export default async function AdminEventsPage() {
  const events = await getAllEvents();

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
