import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET handler to fetch a single event by its slug
 * @param request - Next.js request object
 * @param context - Contains route parameters including slug
 * @returns JSON response with event data or error message
 */
export async function GET(
  request: NextRequest,
  {params}: RouteParams
): Promise<NextResponse> {
  try {
    // Extract slug from route parameters
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Valid slug parameter is required' },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();
    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { success: false, error: `Event with slug ${sanitizedSlug} not found` },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (consider using a proper logger in production)
    console.error('Error fetching event by slug:', error);

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while fetching the event',
      },
      { status: 500 }
    );
  }
}
