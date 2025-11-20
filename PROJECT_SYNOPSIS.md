# Dev Events - Project Synopsis

## Overview

**Dev Events** is a comprehensive event management platform built specifically for the developer community. It serves as a centralized hub for discovering, managing, and registering for developer-focused events including hackathons, meetups, and conferences.

## Technology Stack

### Core Framework
- **Next.js 16.0.0** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development

### Database & ORM
- **MongoDB** - NoSQL database
- **Mongoose 8.19.3** - MongoDB object modeling

### Authentication
- **Better Auth 1.3.34** - Modern authentication solution
  - Email/Password authentication
  - Google OAuth integration
  - Session management with cookie caching

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Class Variance Authority** - Component variant management
- **Lucide React** - Icon library

### Additional Services
- **Cloudinary 2.8.0** - Image hosting and optimization
- **Resend 6.5.2** - Email delivery service
- **PostHog** - Product analytics and user tracking
- **OGL** - WebGL library for visual effects

## Project Structure

```
my_app/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   │   └── events/        # Event management (create, edit, delete)
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages (signin, signup)
│   ├── events/            # Public event pages
│   │   └── [slug]/        # Dynamic event detail pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── AuthButton.tsx     # Authentication button
│   ├── AuthForm.tsx       # Login/signup forms
│   ├── BookEvent.tsx      # Event registration component
│   ├── EventCard.tsx      # Event card display
│   ├── EventDetails.tsx   # Event detail view
│   ├── EventForm.tsx      # Event creation/editing form
│   ├── EventList.tsx      # Event listing
│   ├── EventListClient.tsx
│   ├── EventsPageClient.tsx
│   ├── Explorebutton.tsx  # CTA button
│   ├── Filters.tsx        # Event filtering
│   ├── LightRays.tsx      # Visual effects
│   ├── Navbar.tsx         # Navigation bar
│   ├── Pagination.tsx     # Pagination component
│   └── SearchBar.tsx      # Search functionality
├── database/              # Database models
│   ├── booking.model.ts   # Booking schema
│   ├── event.model.ts     # Event schema
│   └── index.ts           # Model exports
├── lib/                   # Utility libraries
│   ├── actions/           # Server actions
│   │   ├── booking.actions.ts
│   │   └── event.actions.ts
│   ├── auth.ts            # Authentication configuration
│   ├── auth-client.ts     # Client-side auth utilities
│   ├── constants.ts       # Application constants
│   ├── email.ts           # Email templates and sending
│   ├── mongodb.ts         # Database connection
│   └── utils.ts           # Helper functions
├── public/                # Static assets
└── middleware.ts          # Next.js middleware
```

## Core Features

### 1. Event Discovery
- **Homepage**: Displays featured events (first 6 events)
- **Events Page**: Complete listing of all available events
- **Search & Filter**: Find events by tags, mode, audience, etc.
- **Event Details**: Comprehensive event information including:
  - Title, description, and overview
  - Date, time, and location
  - Venue and mode (online/offline/hybrid)
  - Event image
  - Agenda and organizer details
  - Tags for categorization
  - Similar events recommendations

### 2. Event Management (Admin)
- **Create Events**: Admin interface for adding new events
- **Edit Events**: Update existing event details
- **Delete Events**: Remove events from the platform
- **Authorization**: Only event creators can edit/delete their events
- **Image Upload**: Integration with Cloudinary for event images

### 3. Event Registration
- **Booking System**: Users can register for events using their email
- **Duplicate Prevention**: System prevents multiple registrations with the same email
- **Email Confirmation**: Automated confirmation emails sent via Resend
- **Booking Tracking**: Count and list of attendees per event

### 4. Authentication System
- **Email/Password**: Traditional authentication
- **Google OAuth**: Social login integration
- **Session Management**: Secure session handling with cookie caching (5-minute cache)
- **Protected Routes**: Middleware-based route protection
- **User Context**: Client and server-side authentication state

### 5. Email Notifications
- **Booking Confirmation**: Professional HTML email template
- **Event Details**: Includes all relevant event information
- **Responsive Design**: Mobile-friendly email layout
- **Visual Elements**: Event images, badges, and formatted details
- **Call-to-Action**: Direct link to event details page

## Database Schema

### Event Model
```typescript
{
  title: string
  slug: string (auto-generated from title)
  description: string
  overview: string
  image: string (Cloudinary URL)
  venue: string
  location: string
  date: string (ISO format YYYY-MM-DD)
  time: string (HH:MM format)
  mode: 'online' | 'offline' | 'hybrid'
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdBy: string (user ID)
  createdAt: Date
  updatedAt: Date
}
```

### Booking Model
```typescript
{
  eventId: ObjectId (references Event)
  email: string (validated email format)
  createdAt: Date
  updatedAt: Date
}
```

## Key Technical Implementations

### 1. Server Actions
- All data mutations use Next.js Server Actions
- Type-safe server-side operations
- Automatic revalidation of cached pages

### 2. Data Validation
- **Pre-save Hooks**: 
  - Auto-generate URL-friendly slugs from event titles
  - Validate date and time formats
  - Verify event existence before creating bookings
- **Schema Validation**: Mongoose schema validation for all fields
- **Email Validation**: Regex-based email format checking

### 3. Caching Strategy
- Homepage uses Next.js cache with 'hours' lifetime
- Path revalidation after data mutations
- Session cookie caching for performance

### 4. Error Handling
- Graceful error handling in all server actions
- User-friendly error messages
- Email sending failures don't block bookings
- Comprehensive console logging for debugging

### 5. Performance Optimizations
- Lean queries for faster database operations
- JSON serialization for client-side data
- Indexed database fields (slug, eventId)
- Pagination support for large datasets

## User Flows

### Event Discovery Flow
1. User visits homepage
2. Views featured events (6 most recent)
3. Clicks "View All Events" or "Explore" button
4. Browses/searches/filters events
5. Clicks on event card to view details

### Event Registration Flow
1. User navigates to event detail page
2. Enters email address in booking form
3. Submits registration
4. System checks for duplicate registration
5. Creates booking record
6. Sends confirmation email
7. Displays success message

### Event Creation Flow (Admin)
1. Admin navigates to "Manage Events"
2. Clicks "Create Event"
3. Fills out event form with all details
4. Uploads event image to Cloudinary
5. Submits form
6. System validates and creates event
7. Auto-generates slug from title
8. Redirects to event management page

## Environment Configuration

The application requires the following environment variables:

- **Database**: MongoDB connection string
- **Authentication**: 
  - Google OAuth credentials (Client ID & Secret)
  - Better Auth configuration
- **Email Service**: Resend API key
- **Image Hosting**: Cloudinary credentials
- **Analytics**: PostHog API key
- **Application**: Base URL for link generation

## Design Philosophy

### User Experience
- **Clean Interface**: Modern, minimalist design
- **Responsive Layout**: Mobile-first approach
- **Fast Navigation**: Optimized routing and caching
- **Clear CTAs**: Prominent action buttons

### Developer Experience
- **Type Safety**: Full TypeScript coverage
- **Code Organization**: Clear separation of concerns
- **Reusable Components**: Modular component architecture
- **Server Actions**: Simplified data mutations

## Recent Enhancements

Based on conversation history, the following improvements were recently implemented:

1. **Email Delivery Pipeline**:
   - Integrated Resend email service
   - Created professional HTML email templates
   - Updated booking action to send confirmation emails
   - Configured environment variables
   - Resolved Resend API restrictions
   - Fixed `revalidatePath` warnings

## Future Considerations

- Email verification for authentication
- Event capacity limits
- Calendar integration (iCal/Google Calendar)
- Event categories and advanced filtering
- User dashboard for registered events
- Event reminders and notifications
- Social sharing features
- Event reviews and ratings

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

The application is designed to be deployed on Vercel, leveraging Next.js's native integration with the platform. All environment variables must be configured in the deployment environment.

---

**Last Updated**: November 2025  
**Version**: 0.1.0  
**Framework**: Next.js 16.0.0
