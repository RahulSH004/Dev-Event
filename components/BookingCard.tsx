'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCalendarButton from './AddToCalendarButton';

interface Event {
    _id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    date: string;
    time: string;
    location: string;
    venue: string;
    mode: string;
}

interface Booking {
    _id: string;
    eventId: Event;
    createdAt: string;
}

interface BookingCardProps {
    booking: Booking;
    onCancel?: (bookingId: string) => void;
    showCancel?: boolean;
}

export default function BookingCard({ booking, onCancel, showCancel = true }: BookingCardProps) {
    const { eventId: event } = booking;
    const [cancelling, setCancelling] = useState(false);

    if (!event) {
        return null;
    }

    const handleCancel = async () => {
        if (!onCancel || !confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        setCancelling(true);
        await onCancel(booking._id);
        setCancelling(false);
    };

    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Check if event is past
    const isPast = new Date(event.date) < new Date();

    return (
        <div className="bg-dark-200 border border-dark-300 rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-300">
            <div className="flex flex-col md:flex-row">
                {/* Event Image */}
                <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                    {isPast && (
                        <div className="absolute top-2 right-2 bg-dark-400/90 text-light-100 px-3 py-1 rounded-full text-sm">
                            Past Event
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="flex-1 p-5">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <Link href={`/events/${event.slug}`}>
                                <h3 className="text-xl font-semibold text-light-100 hover:text-primary-500 transition-colors mb-2">
                                    {event.title}
                                </h3>
                            </Link>
                            <p className="text-light-200 text-sm line-clamp-2 mb-4">
                                {event.description}
                            </p>
                        </div>
                        {showCancel && !isPast && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="text-light-400 hover:text-red-500 transition-colors p-2"
                                title="Cancel booking"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-light-300">
                            <Calendar size={16} />
                            <span className="text-sm">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-light-300">
                            <Clock size={16} />
                            <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-light-300">
                            <MapPin size={16} />
                            <span className="text-sm">
                                {event.mode === 'online' ? 'Online' : event.location}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href={`/events/${event.slug}`} className="btn-secondary text-sm">
                            View Details
                        </Link>
                        {!isPast && (
                            <AddToCalendarButton
                                event={{
                                    title: event.title,
                                    description: event.description,
                                    location: event.location,
                                    date: event.date,
                                    time: event.time,
                                    mode: event.mode
                                }}
                                className="text-sm"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
