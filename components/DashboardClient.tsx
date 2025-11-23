'use client';

import { useEffect, useState } from 'react';
import { getUserUpcomingEvents, getUserPastEvents, cancelBooking } from '@/lib/actions/booking.actions';
import BookingCard from './BookingCard';
import { Calendar, CalendarX } from 'lucide-react';

interface DashboardClientProps {
    userId?: string;
    userEmail?: string;
}

export default function DashboardClient({ userId, userEmail }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [pastEvents, setPastEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, [userId, userEmail]);

    const loadBookings = async () => {
        if (!userId && !userEmail) return;

        setLoading(true);
        try {
            const [upcoming, past] = await Promise.all([
                getUserUpcomingEvents(userId || '', userEmail || ''),
                getUserPastEvents(userId || '', userEmail || '')
            ]);
            setUpcomingEvents(upcoming);
            setPastEvents(past);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        const result = await cancelBooking(bookingId, userId, userEmail);
        
        if (result.success) {
            // Reload bookings
            await loadBookings();
        } else {
            alert(result.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-light-300">Loading your events...</p>
                </div>
            </div>
        );
    }

    const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-dark-300">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-3 px-2 font-medium transition-colors relative ${
                        activeTab === 'upcoming'
                            ? 'text-primary-500'
                            : 'text-light-300 hover:text-light-100'
                    }`}
                >
                    Upcoming Events ({upcomingEvents.length})
                    {activeTab === 'upcoming' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`pb-3 px-2 font-medium transition-colors relative ${
                        activeTab === 'past'
                            ? 'text-primary-500'
                            : 'text-light-300 hover:text-light-100'
                    }`}
                >
                    Past Events ({pastEvents.length})
                    {activeTab === 'past' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                    )}
                </button>
            </div>

            {/* Events List */}
            {currentEvents.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-300 mb-4">
                        {activeTab === 'upcoming' ? (
                            <Calendar size={32} className="text-light-400" />
                        ) : (
                            <CalendarX size={32} className="text-light-400" />
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-light-100 mb-2">
                        No {activeTab} events
                    </h3>
                    <p className="text-light-300 mb-6">
                        {activeTab === 'upcoming'
                            ? "You haven't registered for any upcoming events yet."
                            : "You don't have any past event registrations."}
                    </p>
                    {activeTab === 'upcoming' && (
                        <a href="/events" className="btn-primary">
                            Browse Events
                        </a>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {currentEvents.map((booking) => (
                        <BookingCard
                            key={booking._id}
                            booking={booking}
                            onCancel={handleCancelBooking}
                            showCancel={activeTab === 'upcoming'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
