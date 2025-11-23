'use server';
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import connectDB from "../mongodb";
import { revalidatePath } from "next/cache";
import { sendBookingConfirmation } from "../email";

export const createBooking = async ({
    eventId,
    email,
    userId,
    userName
}: {
    eventId: string;
    email: string;
    userId?: string;
    userName?: string;
}) => {
    try {
        await connectDB();

        // Check if user already registered for this event
        const existingBooking = await Booking.findOne({
            eventId,
            email,
            status: 'confirmed'
        });

        if (existingBooking) {
            return { success: false, message: 'You have already registered for this event with this email.' };
        }

        // Create booking
        await Booking.create({
            eventId,
            email,
            userId,
            userName,
            status: 'confirmed'
        });

        // Fetch event details for email
        const event = await Event.findById(eventId).lean();

        if (!event) {
            return { success: false, message: 'Event not found.' };
        }

        // Send confirmation email
        try {
            await sendBookingConfirmation({
                email,
                eventTitle: event.title,
                eventDate: event.date,
                eventTime: event.time,
                eventLocation: event.location,
                eventVenue: event.venue,
                eventMode: event.mode,
                eventImage: event.image,
                eventSlug: event.slug
            });
            console.log('Confirmation email sent to:', email);
        } catch (emailError) {
            // Log error but don't fail the booking
            console.error('Failed to send confirmation email:', emailError);
            // Booking is still successful even if email fails
        }

        revalidatePath('/events/[slug]');

        return { success: true, message: 'Registration successful! Check your email for confirmation.' };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, message: 'Failed to create booking. Please try again.' };
    }
}

export const getBookingsByEventId = async (eventId: string) => {
    try {
        await connectDB();
        const bookings = await Booking.find({ eventId, status: 'confirmed' }).lean();
        return JSON.parse(JSON.stringify(bookings));
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

export const getBookingsCount = async (eventId: string) => {
    try {
        await connectDB();
        const count = await Booking.countDocuments({ eventId, status: 'confirmed' });
        return count;
    } catch (error) {
        console.error('Error counting bookings:', error);
        return 0;
    }
}

export const getBookingsByUserId = async (userId: string) => {
    try {
        await connectDB();
        const bookings = await Booking.find({ userId, status: 'confirmed' })
            .populate('eventId')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(bookings));
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return [];
    }
}

export const getBookingsByEmail = async (email: string) => {
    try {
        await connectDB();
        const bookings = await Booking.find({ email, status: 'confirmed' })
            .populate('eventId')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(bookings));
    } catch (error) {
        console.error('Error fetching email bookings:', error);
        return [];
    }
}

export const getUserUpcomingEvents = async (userId: string, email: string) => {
    try {
        await connectDB();
        const today = new Date().toISOString().split('T')[0];

        // Find bookings by userId or email
        const query = userId ? { userId, status: 'confirmed' } : { email, status: 'confirmed' };
        const bookings = await Booking.find(query)
            .populate('eventId')
            .lean();

        // Filter for upcoming events
        const upcomingBookings = bookings.filter((booking: any) => {
            return booking.eventId && booking.eventId.date >= today;
        });

        return JSON.parse(JSON.stringify(upcomingBookings));
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return [];
    }
}

export const getUserPastEvents = async (userId: string, email: string) => {
    try {
        await connectDB();
        const today = new Date().toISOString().split('T')[0];

        // Find bookings by userId or email
        const query = userId ? { userId, status: 'confirmed' } : { email, status: 'confirmed' };
        const bookings = await Booking.find(query)
            .populate('eventId')
            .lean();

        // Filter for past events
        const pastBookings = bookings.filter((booking: any) => {
            return booking.eventId && booking.eventId.date < today;
        });

        return JSON.parse(JSON.stringify(pastBookings));
    } catch (error) {
        console.error('Error fetching past events:', error);
        return [];
    }
}

export const cancelBooking = async (bookingId: string, userId?: string, email?: string) => {
    try {
        await connectDB();

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return { success: false, message: 'Booking not found.' };
        }

        // Verify ownership
        if (userId && booking.userId !== userId) {
            return { success: false, message: 'Unauthorized to cancel this booking.' };
        }

        if (!userId && email && booking.email !== email) {
            return { success: false, message: 'Unauthorized to cancel this booking.' };
        }

        // Update status instead of deleting
        booking.status = 'cancelled';
        await booking.save();

        revalidatePath('/dashboard');
        revalidatePath('/events/[slug]');

        return { success: true, message: 'Booking cancelled successfully.' };
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return { success: false, message: 'Failed to cancel booking. Please try again.' };
    }
}