import { notFound } from "next/navigation"
import Image from "next/image"
import { cacheLife } from "next/cache"
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions"
import { IEvent } from "@/database/event.model"
import BookEvent from "@/components/BookEvent"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon,alt,lable}: {icon:string, alt:string, lable:string}) => (
  <div className="flex-row-gap-2">
    <Image src={icon} alt={alt} width={14} height={14} />
    <p>{lable}</p>
  </div>
)
const EventAgenda = ({agendaItem} : {agendaItem: string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
      <ul>
        {agendaItem.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
  </div>
) 
const EventTags = ({tags}: {tags: string[]}) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>{tag}</div>
    ))}
  </div>
)




const EventDetailPage = async( {params}: {params: Promise<{slug: string}>}) => {
  'use cache'
  cacheLife('hours')
  const {slug} =   await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await request.json();
  const { description, date, time, location, image, mode, agenda, audience, overview, tags, organizer } = event;
  const bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  if(!description) return notFound();
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

        <div className="details">
          {/* Event Image */}
          <div className="content">
            <Image src={image} alt='Event Banner' width={800} height={800} className="banner" />

            <section className="flex-col gap-2">
              <h2>Overview</h2>
              <p className="mt-2">{overview}</p>
            </section>
            <section className="flex-col gap-2">
              <h2>Event Details</h2>
              <EventDetailItem icon="/icons/calendar.svg" alt="date" lable={date} />
              <EventDetailItem icon="/icons/clock.svg" alt="time" lable={time} />
              <EventDetailItem icon="/icons/pin.svg" alt="location" lable={location} />
              <EventDetailItem icon="/icons/mode.svg" alt="mode" lable={mode} />
              <EventDetailItem icon="/icons/audience.svg" alt="audience" lable={audience} />
            </section>

            <EventAgenda agendaItem={agenda} />

            <section className="flex-col gap-2">
              <h2>About The Organizer</h2>
              <p>{organizer}</p>
            </section>
            <EventTags tags={tags} />
            
          </div>

          {/* Event Overview */}
          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Seat</h2>
              {bookings > 0 ? (
                <p className="text-sm">
                  Join {bookings} people who have already booked their spot!
                  </p>
              ) : (
                <p className="text-sm">Be The First to Book Your Spot!</p>
              )}
              <BookEvent eventId={event._id} slug={event.slug}/>
            </div>      
          </aside>
        </div>
        <div className="flex w-full flex-col gap-4 pt-28">
          <h2>Similar Events</h2>
          <div className="events">
            {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
          </div>
        </div>
    </section>
    
  )
}

export default EventDetailPage