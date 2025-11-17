import React from 'react'
import Explorebutton from '@/components/Explorebutton';
import { events } from '@/lib/constants';
import EventCard from '@/components/EventCard';
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';
import { getAllEvents } from '@/lib/actions/event.actions';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async() => {
  'use cache';
  cacheLife('hours')
  
  // const response = await fetch(`${BASE_URL}/api/events`, {
  //   next: { revalidate: 3600 }
  // });
  
  // if (!response.ok) {
  //   throw new Error('Failed to fetch events');
  // }
  
  const {events} = await getAllEvents();

  return (
    <section>
      <h1 className='text-center'> The Hub for Every Developers <br />Events and Communitys</h1>
      <p className='text-center mt-5'>Hackathons , Meetups and Conferences, All in One Place</p>

      <Explorebutton />

      <div className='mt-20 space-y-7'>
        <h3>Feature Events</h3>
        <ul className='events'>
          {events && events.length >0  && events.map((event : IEvent) => (
            <li key={event.title} className='list-none'>
                <EventCard {...event}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page