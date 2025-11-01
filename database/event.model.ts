import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster slug-based queries
EventSchema.index({ slug: 1 });

/**
 * Pre-save hook to generate slug from title, normalize date to ISO format,
 * and ensure time is in consistent format (HH:MM)
 */
EventSchema.pre('save', function (next) {
  const event = this as IEvent;

  // Generate slug only if title is modified or document is new
  if (event.isModified('title')) {
    const generatedSlug = event.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

    if (!generatedSlug) {
      return next(
        new Error('Title must include alphanumeric characters to generate a slug')
      );
    }

    event.slug = generatedSlug;
  }

  // Normalize date to ISO format (YYYY-MM-DD) if modified
  if (event.isModified('date')) {
    try {
      // Parse as UTC midnight to avoid timezone shifts
      const dateParts = event.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!dateParts) {
        return next(new Error('Date must be in YYYY-MM-DD format'));
      }
      const year = parseInt(dateParts[1]);
      const month = parseInt(dateParts[2]) - 1;
      const day = parseInt(dateParts[3]);
      
      const parsedDate = new Date(Date.UTC(year, month, day));
      if (isNaN(parsedDate.getTime())) {
        return next(new Error('Invalid date format'));
      }
      
      // Validate that the date components match (catch rollovers like 2024-02-30)
      if (
        parsedDate.getUTCFullYear() !== year ||
        parsedDate.getUTCMonth() !== month ||
        parsedDate.getUTCDate() !== day
      ) {
        return next(new Error('Invalid calendar date'));
      }
      
      // Store as ISO date string
      event.date = parsedDate.toISOString().split('T')[0];
    } catch (error) {
      return next(new Error('Invalid date format'));
    }
  }

  // Normalize time format to HH:MM if modified
  if (event.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(event.time)) {
      return next(new Error('Time must be in HH:MM format'));
    }
  }

  next();
});

// Prevent model recompilation in development
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
