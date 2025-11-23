// Google Calendar integration utilities

export interface CalendarEvent {
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    mode: string;
}

/**
 * Generate an iCal (.ics) file content for calendar download
 * This works with all calendar applications (Google Calendar, Apple Calendar, Outlook, etc.)
 */
export function generateICalContent(event: CalendarEvent): string {
    const { title, description, location, date, time, mode } = event;

    // Parse date and time
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');

    // Create start datetime (assuming 1 hour duration)
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

    // Format dates for iCal (YYYYMMDDTHHmmss)
    const formatICalDate = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    };

    const dtStart = formatICalDate(startDate);
    const dtEnd = formatICalDate(endDate);
    const dtStamp = formatICalDate(new Date());

    // Build location string
    const locationStr = mode === 'online' ? 'Online Event' : location;

    // Build iCal content
    const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Dev Events//Event Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `DTSTAMP:${dtStamp}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${locationStr}`,
        `STATUS:CONFIRMED`,
        `SEQUENCE:0`,
        `UID:${Date.now()}@devevents.com`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return icalContent;
}

/**
 * Generate a Google Calendar URL for adding an event
 * This opens Google Calendar in the browser with pre-filled event details
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
    const { title, description, location, date, time, mode } = event;

    // Parse date and time
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');

    // Create start datetime
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

    // Format dates for Google Calendar (YYYYMMDDTHHmmss)
    const formatGoogleDate = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    };

    const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
    const locationStr = mode === 'online' ? 'Online Event' : location;

    // Build Google Calendar URL
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: dates,
        details: description,
        location: locationStr
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Download an iCal file
 */
export function downloadICalFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
