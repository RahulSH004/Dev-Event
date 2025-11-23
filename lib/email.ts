import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface BookingConfirmationParams {
  email: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventVenue: string;
  eventMode: string;
  eventImage?: string;
  eventSlug: string;
}

export async function sendBookingConfirmation({
  email,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  eventVenue,
  eventMode,
  eventImage,
  eventSlug
}: BookingConfirmationParams) {
  try {
    // Format date for better readability
    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const eventUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventSlug}`;

    if (!resend) {
      console.warn('Resend API key not found. Email sending skipped.');
      return { success: false, error: 'Resend API key missing' };
    }

    const { data, error } = await resend.emails.send({
      from: 'Dev Events <onboarding@resend.dev>', // Use your verified domain
      to: [email],
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #59deca;
                margin: 0;
                font-size: 24px;
              }
              .event-image {
                width: 100%;
                max-width: 500px;
                height: auto;
                border-radius: 8px;
                margin: 20px 0;
              }
              .event-title {
                font-size: 22px;
                font-weight: bold;
                color: #0d161a;
                margin: 20px 0 10px;
              }
              .event-details {
                background-color: #f8f9fa;
                border-left: 4px solid #59deca;
                padding: 15px;
                margin: 20px 0;
              }
              .detail-row {
                margin: 10px 0;
                display: flex;
                align-items: start;
              }
              .detail-label {
                font-weight: 600;
                min-width: 80px;
                color: #555;
              }
              .detail-value {
                color: #333;
              }
              .mode-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                background-color: #e7f2ff;
                color: #0d161a;
              }
              .cta-button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #59deca;
                color: #000;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Registration Confirmed!</h1>
                <p style="color: #666; margin: 10px 0 0;">You're all set for this event</p>
              </div>

              ${eventImage ? `<img src="${eventImage}" alt="${eventTitle}" class="event-image" />` : ''}

              <div class="event-title">${eventTitle}</div>

              <div class="event-details">
                <div class="detail-row">
                  <span class="detail-label">📅 Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">🕐 Time:</span>
                  <span class="detail-value">${eventTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">📍 Venue:</span>
                  <span class="detail-value">${eventVenue}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">🌍 Location:</span>
                  <span class="detail-value">${eventLocation}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">💻 Mode:</span>
                  <span class="detail-value"><span class="mode-badge">${eventMode}</span></span>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="${eventUrl}" class="cta-button">View Event Details</a>
              </div>

              <div style="margin-top: 30px; padding: 15px; background-color: #fff9e6; border-radius: 6px;">
                <p style="margin: 0; color: #856404;">
                  <strong>📌 Important:</strong> Please save this email for your records. 
                  We recommend adding this event to your calendar.
                </p>
              </div>

              <div class="footer">
                <p>This is an automated confirmation email from Dev Events.</p>
                <p style="margin: 5px 0;">If you have any questions, please contact the event organizer.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return { success: false, error };
  }
}
