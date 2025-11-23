'use client';

import { Calendar, Download } from 'lucide-react';
import { generateGoogleCalendarUrl, generateICalContent, downloadICalFile, type CalendarEvent } from '@/lib/calendar';
import { useState } from 'react';

interface AddToCalendarButtonProps {
    event: CalendarEvent;
    className?: string;
}

export default function AddToCalendarButton({ event, className = '' }: AddToCalendarButtonProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleGoogleCalendar = () => {
        const url = generateGoogleCalendarUrl(event);
        window.open(url, '_blank');
        setShowDropdown(false);
    };

    const handleDownloadICal = () => {
        const content = generateICalContent(event);
        const filename = event.title.toLowerCase().replace(/\s+/g, '-');
        downloadICalFile(content, filename);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`btn-secondary flex items-center gap-2 ${className}`}
            >
                <Calendar size={18} />
                Add to Calendar
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-dark-200 border border-dark-300 rounded-lg shadow-lg z-20 overflow-hidden">
                        <button
                            onClick={handleGoogleCalendar}
                            className="w-full px-4 py-3 text-left hover:bg-dark-300 transition-colors flex items-center gap-3"
                        >
                            <Calendar size={18} className="text-primary-500" />
                            <span>Google Calendar</span>
                        </button>
                        <button
                            onClick={handleDownloadICal}
                            className="w-full px-4 py-3 text-left hover:bg-dark-300 transition-colors flex items-center gap-3 border-t border-dark-300"
                        >
                            <Download size={18} className="text-primary-500" />
                            <span>Download iCal</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
