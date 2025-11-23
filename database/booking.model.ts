import mongoose, { Document, Model, Schema } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  userId?: string;
  userName?: string;
  email: string;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type: String,
      trim: true,
      // Optional field for authenticated users
    },
    userName: {
      type: String,
      trim: true,
      // Optional field for display purposes
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Index on eventId for faster lookups
BookingSchema.index({ eventId: 1 });
// Compound index for user bookings
BookingSchema.index({ userId: 1, eventId: 1 });
// Index on email for backward compatibility
BookingSchema.index({ email: 1 });

/**
 * Pre-save hook to verify that the referenced event exists in the database.
 * Throws an error if the event is not found.
 */
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's modified or the document is new
  if (booking.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(booking.eventId);

      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(
        new Error('Error validating event reference: ' + (error as Error).message)
      );
    }
  }

  next();
});

// Prevent model recompilation in development
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;