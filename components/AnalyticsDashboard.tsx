'use client';

import { useEffect, useState } from 'react';
import { getOrganizerAnalytics, getBookingTrends } from '@/lib/actions/analytics.actions';
import StatsCard from './StatsCard';
import BookingTrendsChart from './BookingTrendsChart';
import { Calendar, Users, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsDashboardProps {
    userId: string;
}

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
    const [analytics, setAnalytics] = useState<any>(null);
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [userId]);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const [analyticsData, trendsData] = await Promise.all([
                getOrganizerAnalytics(userId),
                getBookingTrends(userId, 30)
            ]);
            setAnalytics(analyticsData);
            setTrends(trendsData);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-light-300">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-16">
                <p className="text-light-300">Failed to load analytics data</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Events"
                    value={analytics.totalEvents}
                    icon={<Calendar size={24} />}
                />
                <StatsCard
                    title="Total Registrations"
                    value={analytics.totalBookings}
                    icon={<Users size={24} />}
                />
                <StatsCard
                    title="Recent Bookings"
                    value={analytics.recentBookingsCount}
                    icon={<TrendingUp size={24} />}
                    trendLabel="Last 30 days"
                />
                <StatsCard
                    title="Growth Rate"
                    value={`${analytics.growthRate}%`}
                    icon={<Award size={24} />}
                    trend={analytics.growthRate}
                    trendLabel="vs previous period"
                />
            </div>

            {/* Booking Trends Chart */}
            <BookingTrendsChart data={trends} />

            {/* Popular Events */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-light-100 mb-6">Popular Events</h3>
                
                {analytics.popularEvents.length === 0 ? (
                    <div className="text-center py-8 text-light-400">
                        No events yet
                    </div>
                ) : (
                    <div className="space-y-4">
                        {analytics.popularEvents.map((event: any, index: number) => (
                            <div
                                key={event.eventId}
                                className="flex items-center justify-between p-4 bg-dark-300 rounded-lg hover:bg-dark-400 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/10 text-primary-500 font-bold">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/events/${event.slug}`}>
                                            <h4 className="font-medium text-light-100 hover:text-primary-500 transition-colors">
                                                {event.title}
                                            </h4>
                                        </Link>
                                        <p className="text-sm text-light-400">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary-500">
                                        {event.bookings}
                                    </div>
                                    <div className="text-xs text-light-400">
                                        registration{event.bookings !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
