'use server';
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import connectDB from "../mongodb";
import { revalidatePath } from "next/cache";
import { sendBookingConfirmation } from "../email";

export const createBooking = async ({ eventId, email }: { eventId: string, email: string }) => {
    try {
        await connectDB();

        // Check if user already registered for this event
        const existingBooking = await Booking.findOne({ eventId, email });

        if (existingBooking) {
            return { success: false, message: 'You have already registered for this event with this email.' };
        }

        // Create booking
        await Booking.create({ eventId, email });

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
        const bookings = await Booking.find({ eventId }).lean();
        return JSON.parse(JSON.stringify(bookings));
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

export const getBookingsCount = async (eventId: string) => {
    try {
        await connectDB();
        const count = await Booking.countDocuments({ eventId });
        return count;
    } catch (error) {
        console.error('Error counting bookings:', error);
        return 0;
    }
}