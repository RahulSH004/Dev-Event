'use server';

import Event from '@/database/event.model';
import Booking from '@/database/booking.model';
import connectDB from '@/lib/mongodb';

export const getOrganizerAnalytics = async (userId: string) => {
    try {
        await connectDB();

        // Get all events created by this organizer
        const events = await Event.find({ createdBy: userId }).lean();
        const eventIds = events.map(e => e._id);

        // Get all bookings for these events
        const bookings = await Booking.find({
            eventId: { $in: eventIds },
            status: 'confirmed'
        }).lean();

        // Calculate metrics
        const totalEvents = events.length;
        const totalBookings = bookings.length;

        // Get bookings from last 30 days for growth calculation
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentBookings = bookings.filter(b =>
            new Date(b.createdAt) >= thirtyDaysAgo
        );

        const previousBookings = bookings.filter(b =>
            new Date(b.createdAt) < thirtyDaysAgo
        );

        // Calculate growth rate
        const growthRate = previousBookings.length > 0
            ? ((recentBookings.length - previousBookings.length) / previousBookings.length) * 100
            : recentBookings.length > 0 ? 100 : 0;

        // Get popular events (top 5 by bookings)
        const eventBookingCounts = eventIds.map(eventId => {
            const count = bookings.filter(b =>
                b.eventId.toString() === eventId.toString()
            ).length;
            const event = events.find(e => e._id.toString() === eventId.toString());
            return {
                eventId: eventId.toString(),
                title: event?.title || 'Unknown',
                slug: event?.slug || '',
                bookings: count,
                date: event?.date || ''
            };
        });

        const popularEvents = eventBookingCounts
            .sort((a, b) => b.bookings - a.bookings)
            .slice(0, 5);

        return JSON.parse(JSON.stringify({
            totalEvents,
            totalBookings,
            growthRate: Math.round(growthRate * 10) / 10,
            popularEvents,
            recentBookingsCount: recentBookings.length
        }));
    } catch (error) {
        console.error('Error fetching organizer analytics:', error);
        return {
            totalEvents: 0,
            totalBookings: 0,
            growthRate: 0,
            popularEvents: [],
            recentBookingsCount: 0
        };
    }
};

export const getEventAnalytics = async (eventId: string, userId: string) => {
    try {
        await connectDB();

        // Verify the event belongs to this user
        const event = await Event.findById(eventId).lean();

        if (!event || event.createdBy !== userId) {
            return null;
        }

        // Get all bookings for this event
        const bookings = await Booking.find({
            eventId,
            status: 'confirmed'
        }).sort({ createdAt: 1 }).lean();

        // Calculate registration timeline (bookings per day)
        const timeline: { [key: string]: number } = {};
        bookings.forEach(booking => {
            const date = new Date(booking.createdAt).toISOString().split('T')[0];
            timeline[date] = (timeline[date] || 0) + 1;
        });

        const registrationTimeline = Object.entries(timeline).map(([date, count]) => ({
            date,
            count
        }));

        return JSON.parse(JSON.stringify({
            eventTitle: event.title,
            totalBookings: bookings.length,
            registrationTimeline,
            attendees: bookings.map(b => ({
                email: b.email,
                userName: b.userName || 'Guest',
                registeredAt: b.createdAt
            }))
        }));
    } catch (error) {
        console.error('Error fetching event analytics:', error);
        return null;
    }
};

export const getBookingTrends = async (userId: string, days: number = 30) => {
    try {
        await connectDB();

        // Get all events by this organizer
        const events = await Event.find({ createdBy: userId }).lean();
        const eventIds = events.map(e => e._id);

        // Get date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get bookings in this range
        const bookings = await Booking.find({
            eventId: { $in: eventIds },
            status: 'confirmed',
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 }).lean();

        // Group by date
        const trendData: { [key: string]: number } = {};

        // Initialize all dates with 0
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            trendData[dateStr] = 0;
        }

        // Fill in actual booking counts
        bookings.forEach(booking => {
            const date = new Date(booking.createdAt).toISOString().split('T')[0];
            if (trendData[date] !== undefined) {
                trendData[date]++;
            }
        });

        const trends = Object.entries(trendData).map(([date, count]) => ({
            date,
            bookings: count
        }));

        return JSON.parse(JSON.stringify(trends));
    } catch (error) {
        console.error('Error fetching booking trends:', error);
        return [];
    }
};
