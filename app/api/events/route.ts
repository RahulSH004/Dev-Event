import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 })
        }

        const file = formData.get('image') as File;

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 })

        const tagsData = formData.get('tags');
        const agendaData = formData.get('agenda');

        if (!tagsData || !agendaData) {
            return NextResponse.json({ message: 'Tags and agenda are required' }, { status: 400 });
        }

        let tags, agenda;
        try {
            tags = JSON.parse(tagsData as string);
            agenda = JSON.parse(agendaData as string);
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON format for tags or agenda' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const date = searchParams.get('date') || '';
        const mode = searchParams.get('mode') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');

        // Build query object
        const query: any = {};

        // Search query - searches across multiple fields
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { location: { $regex: q, $options: 'i' } },
                { venue: { $regex: q, $options: 'i' } },
                { organizer: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } },
            ];
        }

        // Date filter
        if (date) {
            query.date = date;
        }

        // Mode filter
        if (mode && ['online', 'offline', 'hybrid'].includes(mode)) {
            query.mode = mode;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const [events, total] = await Promise.all([
            Event.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Event.countDocuments(query)
        ]);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            message: 'Events fetched successfully',
            events,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        }, { status: 200 });
    } catch (e) {
        console.error('Error fetching events:', e);
        return NextResponse.json({
            message: 'Event fetching failed',
            error: e instanceof Error ? e.message : 'Unknown error'
        }, { status: 500 });
    }
}