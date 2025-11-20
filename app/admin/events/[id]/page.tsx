import { getEventById } from '@/lib/actions/event.actions';
import EventForm from '@/components/EventForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  // Check if user is authenticated and authorized
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return (
      <section className="admin-section">
        <div className="empty-state">
          <h2>Authentication Required</h2>
          <p>You must be signed in to edit events.</p>
          <Link href="/auth/signin" className="btn-primary">
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  // Check if user is the creator of this event
  if (event.createdBy !== session.user.id) {
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
