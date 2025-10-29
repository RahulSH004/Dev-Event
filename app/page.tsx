import React from 'react'
import Explorebutton from '@/components/Explorebutton';
import { events } from '@/lib/constants';
import EventCard from '@/components/EventCard';

const page = () => {
  return (
    <section>
      <h1 className='text-center'> The Hub for Every Developers <br />Events and Communitys</h1>
      <p className='text-center mt-5'>Hackathons , Meetups and Conferences, All in One Place</p>

      <Explorebutton />

      <div className='mt-20 space-y-7'>
        <h3>Feature Events</h3>
        <ul className='events'>
          {events.map((event) => (
            <li key={event.title} className='event-card'>
                <EventCard {...event}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page
