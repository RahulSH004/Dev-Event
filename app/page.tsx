import React from 'react'
import Explorebutton from '@/components/Explorebutton';
import EventCard from '@/components/EventCard';
import { cacheLife } from 'next/cache';
import { getAllEvents } from '@/lib/actions/event.actions';
import Link from 'next/link';
import { IEvent } from '@/database';

const page = async() => {
  'use cache';
  cacheLife('hours')
  
  const events = await getAllEvents();
  const featuredEvents = events.slice(0, 6); // Show only first 6 events

  return (
    <section>
      <h1 className='text-center'> The Hub for Every Developers <br />Events and Communities</h1>
      <p className='text-center mt-5'>Hackathons , Meetups and Conferences, All in One Place</p>

      <Explorebutton />

      <div className='mt-20 space-y-7'>
        <div className="flex flex-row justify-between items-center">
          <h3>Feature Events</h3>
          <Link href="/events" className="text-primary hover:text-primary/80 transition-colors">
            View All Events →
          </Link>
        </div>
        
        {featuredEvents.length > 0 ? (
          <ul className='events'>
            {featuredEvents.map((event: IEvent) => (
              <li key={String(event._id)} className='list-none'>
                <EventCard {...event}/>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No events available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default page