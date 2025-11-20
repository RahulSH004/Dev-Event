import EventForm from '@/components/EventForm';
import Link from 'next/link';

export default function CreateEventPage() {
  return (
    <section className="admin-section">
      <div className="admin-header">
        <div>
          <h1>Create New Event</h1>
          <p className="text-light-100">Fill in the details to create a new event</p>
        </div>
        <Link href="/admin/events" className="btn-secondary">
          Back to Events
        </Link>
      </div>

      <EventForm />
    </section>
  );
}
