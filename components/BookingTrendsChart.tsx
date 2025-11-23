'use client';

interface TrendData {
    date: string;
    bookings: number;
}

interface BookingTrendsChartProps {
    data: TrendData[];
}

export default function BookingTrendsChart({ data }: BookingTrendsChartProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-light-400">
                No booking data available
            </div>
        );
    }

    const maxBookings = Math.max(...data.map(d => d.bookings), 1);
    const chartHeight = 200;

    return (
        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-light-100 mb-6">Booking Trends (Last 30 Days)</h3>
            
            <div className="relative" style={{ height: chartHeight + 40 }}>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-xs text-light-400">
                    <span>{maxBookings}</span>
                    <span>{Math.floor(maxBookings / 2)}</span>
                    <span>0</span>
                </div>

                {/* Chart area */}
                <div className="ml-8 h-full flex items-end gap-1">
                    {data.map((item, index) => {
                        const height = (item.bookings / maxBookings) * chartHeight;
                        const isWeekend = new Date(item.date).getDay() % 6 === 0;
                        
                        return (
                            <div
                                key={item.date}
                                className="flex-1 flex flex-col items-center group relative"
                            >
                                {/* Bar */}
                                <div
                                    className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t hover:from-primary-400 hover:to-primary-300 transition-all duration-200 cursor-pointer"
                                    style={{ height: `${height}px`, minHeight: item.bookings > 0 ? '4px' : '0' }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-400 text-light-100 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        <div className="font-semibold">{item.bookings} booking{item.bookings !== 1 ? 's' : ''}</div>
                                        <div className="text-light-300">
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                {/* X-axis label (show every 5 days) */}
                                {index % 5 === 0 && (
                                    <div className="text-xs text-light-400 mt-2 transform -rotate-45 origin-top-left">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
