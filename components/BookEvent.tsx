'use client'
import { createBooking } from '@/lib/actions/booking.actions';
import { useSession } from '@/lib/auth-client';
import posthog from 'posthog-js';
import { useState } from 'react';
import Link from 'next/link';

const BookEvent = ({eventId}: {eventId: string}) => {
   const { data: session, isPending } = useSession();
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       
       if (!session?.user?.email) {
           setMessage({ type: 'error', text: 'Please sign in to register' });
           return;
       }
       
       setLoading(true);
       setMessage(null);
       
       try {
           const result = await createBooking({ 
               eventId, 
               email: session.user.email,
               userId: session.user.id,
               userName: session.user.name || session.user.email
           });
           
           if (result.success) {
               setMessage({ type: 'success', text: result.message || 'Registration successful!' });
               posthog.capture('event_registered', { eventId, email: session.user.email });
           } else {
               setMessage({ type: 'error', text: result.message || 'Registration failed' });
               posthog.captureException('booking creation failed');
           }
       } catch {
           setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
       } finally {
           setLoading(false);
       }
   }

   if (isPending) {
       return (
           <div id='book-event'>
               <div className="loading-spinner"></div>
           </div>
       );
   }

   if (!session) {
       return (
           <div id='book-event'>
               <p className="text-sm text-light-200 mb-4">
                   You need to be signed in to register for this event.
               </p>
               <Link href="/auth/signin" className="button-submit block text-center">
                   Sign In to Register
               </Link>
           </div>
       );
   }

  return (
    <div id='book-event'>
        {message && (
            <div className={`message ${message.type}`}>
                {message.text}
            </div>
        )}
        
        {!message || message.type === 'error' ? (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="email">Email address</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={session.user.email || ''}
                        disabled
                        className="opacity-70"
                    />
                    <p className="text-xs text-light-200 mt-1">
                        Registering as {session.user.email}
                    </p>
                </div>
                <button type="submit" className="button-submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Now'}
                </button>
            </form>
        ) : (
            <div className="success-state">
                <p className="text-sm text-primary mb-4">
                    ✓ You&apos;re registered! Check your email for confirmation.
                </p>
            </div>
        )}
    </div>
  )
}

export default BookEvent