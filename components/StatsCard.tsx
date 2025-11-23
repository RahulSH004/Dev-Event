'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    trendLabel?: string;
}

export default function StatsCard({ title, value, icon, trend, trendLabel }: StatsCardProps) {
    const getTrendIcon = () => {
        if (trend === undefined || trend === 0) return <Minus size={16} />;
        return trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
    };

    const getTrendColor = () => {
        if (trend === undefined || trend === 0) return 'text-light-400';
        return trend > 0 ? 'text-green-500' : 'text-red-500';
    };

    return (
        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6 hover:border-primary-500 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-500/10 rounded-lg">
                    <div className="text-primary-500">
                        {icon}
                    </div>
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                        {getTrendIcon()}
                        <span className="text-sm font-medium">
                            {Math.abs(trend)}%
                        </span>
                    </div>
                )}
            </div>
            <h3 className="text-light-300 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-light-100">{value}</p>
            {trendLabel && (
                <p className="text-light-400 text-xs mt-2">{trendLabel}</p>
            )}
        </div>
    );
}
