import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import Event from "@/database/event.model";
import { NextRequest , NextResponse } from "next/server";


export async function POST(req : NextRequest) {
    try{
        await connectDB();

        const fromdata = await req.formData();
        let event;
        try {
            event = Object.fromEntries(fromdata.entries());
        } catch (e) {
            return NextResponse.json({message: 'Invalid Json data format'}, {status: 400});
        } 

        const file = fromdata.get('image') as File;

        if(!file){
            return NextResponse.json({message: 'Image file is required'}, {status: 400});
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'events'}, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        });
        event.image = (uploadResult as { secure_url: string }).secure_url;
        const createdEvent = await Event.create(event);

        return NextResponse.json({message: 'Event Created Successfully', event: createdEvent}, {status: 201});
        
    }catch(e){
        console.error(e);
        return NextResponse.json({message: 'Event Creatrion Failed', error: e instanceof Error ? e.message : 'Unknown Error'}, {status: 500});
    }
}

export async function GET(){
    try{
        await connectDB();
        const events =  await Event.find().sort({createdAt: -1});
        return NextResponse.json({events}, {status: 200});
    }catch(e){
        return NextResponse.json({message: 'Failed to fetch events', error: e }, {status: 500});
    }
}

// a route that accepts a slug as an input and return the event destails