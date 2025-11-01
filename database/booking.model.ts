import mongoose, { Document, Model, Schema } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
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
  },
  {
    timestamps: true,
  }
);

// Index on eventId for faster lookups
BookingSchema.index({ eventId: 1 });

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
