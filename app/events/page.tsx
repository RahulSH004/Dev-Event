import EventsPageClient from '@/components/EventsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Events | Dev Events',
  description: 'Browse all developer events including hackathons, meetups, and conferences',
};

export default function EventsPage() {
  return (
    <section>
      <EventsPageClient />
    </section>
  );
}
