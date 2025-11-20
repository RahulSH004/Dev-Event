'use client';

import { useState, useMemo } from 'react';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import { IEvent } from '@/database';

interface EventListClientProps {
  events: IEvent[];
}

export default function EventListClient({ events }: EventListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();
    return events.filter((event) => {
      const searchableText = [
        event.title,
        event.description,
        event.location,
        event.venue,
        event.organizer,
        ...event.tags,
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });
  }, [events, searchQuery]);

  return (
    <>
      <SearchBar onSearch={setSearchQuery} />
      
      <div className='mt-20 space-y-7'>
        <div className="flex flex-row justify-between items-center">
          <h3>Feature Events</h3>
          {searchQuery && (
            <p className="text-light-200 text-sm">
              Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {filteredEvents.length > 0 ? (
          <ul className='events'>
            {filteredEvents.map((event: IEvent) => (
              <li key={String(event._id)} className='list-none'>
                <EventCard {...event}/>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No events found matching your search.</p>
          </div>
        )}
      </div>
    </>
  );
}
