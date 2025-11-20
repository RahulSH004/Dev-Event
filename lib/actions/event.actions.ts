'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { revalidatePath } from 'next/cache';

export const getAllEvents = async () => {
    try {
        await connectDB();
        const events = await Event.find({})
            .sort({ createdAt: -1 })
            .lean();
        
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug }).lean();
        
        return event ? JSON.parse(JSON.stringify(event)) : null;
    } catch (error) {
        console.error('Error fetching event:', error);
        return null;
    }
}

export const getEventById = async (id: string) => {
    try {
        await connectDB();
        const event = await Event.findById(id).lean();
        
        return event ? JSON.parse(JSON.stringify(event)) : null;
    } catch (error) {
        console.error('Error fetching event:', error);
        return null;
    }
}

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });
        
        if (!event) return [];

        return JSON.parse(JSON.stringify(
            await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } })
                .limit(3)
                .lean()
        ));
    } catch {
        return [];
    }
}

export const createEvent = async (eventData: any, userId: string) => {
    try {
        await connectDB();
        
        const newEvent = await Event.create({ ...eventData, createdBy: userId });
        
        revalidatePath('/');
        revalidatePath('/admin/events');
        
        return { success: true, event: JSON.parse(JSON.stringify(newEvent)) };
    } catch (error: any) {
        console.error('Error creating event:', error);
        return { success: false, error: error.message };
    }
}

export const updateEvent = async (id: string, eventData: any, userId: string) => {
    try {
        await connectDB();
        
        const existingEvent = await Event.findById(id);
        
        if (!existingEvent) {
            return { success: false, error: 'Event not found' };
        }
        
        if (existingEvent.createdBy !== userId) {
            return { success: false, error: 'Unauthorized: You can only edit events you created' };
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            eventData,
            { new: true, runValidators: true }
        );
        
        if (!updatedEvent) {
            return { success: false, error: 'Failed to update event' };
        }
        
        revalidatePath('/');
        revalidatePath('/admin/events');
        revalidatePath(`/events/${updatedEvent.slug}`);
        
        return { success: true, event: JSON.parse(JSON.stringify(updatedEvent)) };
    } catch (error: any) {
        console.error('Error updating event:', error);
        return { success: false, error: error.message };
    }
}

export const deleteEvent = async (id: string, userId: string) => {
    try {
        await connectDB();
        
        const existingEvent = await Event.findById(id);
        
        if (!existingEvent) {
            return { success: false, error: 'Event not found' };
        }
        
        if (existingEvent.createdBy !== userId) {
            return { success: false, error: 'Unauthorized: You can only delete events you created' };
        }
        
        await Event.findByIdAndDelete(id);
        
        revalidatePath('/');
        revalidatePath('/admin/events');
        
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting event:', error);
        return { success: false, error: error.message };
    }
}