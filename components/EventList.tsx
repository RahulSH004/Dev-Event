'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEvent } from '@/lib/actions/event.actions';
import { useSession } from '@/lib/auth-client';
import { IEvent } from '@/database';
import Image from 'next/image';
import Link from 'next/link';

interface EventListProps {
  events: IEvent[];
}

export default function EventList({ events }: EventListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    if (!session?.user?.id) {
      alert('You must be signed in to delete events');
      return;
    }

    setDeleting(id);
    try {
      const result = await deleteEvent(id, session.user.id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete event');
      }
    } catch {
      alert('Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  if (events.length === 0) {
    return (
      <div className="empty-state">
        <p>No events found. Create your first event!</p>
        <Link href="/admin/events/create" className="btn-primary">
          Create Event
        </Link>
      </div>
    );
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <div key={String(event._id)} className="event-item">
          <div className="event-item-image">
            <Image
              src={event.image}
              alt={event.title}
              width={150}
              height={100}
              className="event-thumbnail"
            />
          </div>
          
          <div className="event-item-content">
            <h3>{event.title}</h3>
            <p className="event-meta">
              <span>{event.date}</span> • <span>{event.time}</span> • <span>{event.mode}</span>
            </p>
            <p className="event-description">{event.description}</p>
            <div className="event-tags">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="pill">{tag}</span>
              ))}
            </div>
          </div>
          
          <div className="event-item-actions">
            <Link
              href={`/events/${event.slug}`}
              className="btn-view"
              target="_blank"
            >
              View
            </Link>
            {session?.user?.id === event.createdBy && (
              <>
                <Link
                  href={`/admin/events/${String(event._id)}`}
                  className="btn-edit"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(String(event._id), event.title)}
                  className="btn-delete"
                  disabled={deleting === String(event._id)}
                >
                  {deleting === String(event._id) ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
