
import React, { useMemo } from 'react';
import { ReferenceInterval } from '../types';

interface ScoreBarProps {
    score: number | null;
    intervals: ReferenceInterval[];
    scoreLabel: string;
    minScale?: number;
    maxScale?: number;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, intervals, scoreLabel, minScale, maxScale }) => {
    const { scorePercentage, gradient, gridTemplateColumns, displaySegments } = useMemo(() => {
        if (intervals.length === 0) {
            return { scorePercentage: 0, gradient: '', gridTemplateColumns: '', displaySegments: [] };
        }

        const sortedIntervals = [...intervals].sort((a, b) => a.min - b.min);
        const minVal = minScale ?? sortedIntervals[0].min;
        const maxVal = maxScale ?? Math.max(...sortedIntervals.map(i => i.max ?? i.min));
        const totalDisplayRange = maxVal - minVal;

        const percentage = score !== null ? ((score - minVal) / totalDisplayRange) * 100 : 0;
        const scorePerc = Math.max(0, Math.min(100, percentage));

        const colorMap: { [key: string]: string } = {
            'bg-green-500': '#22c55e', 'bg-yellow-500': '#eab308',
            'bg-orange-500': '#f97316', 'bg-red-500': '#ef4444',
        };

        const colorStops = sortedIntervals.map(interval => {
            const color = colorMap[interval.color] || '#d1d5db';
            const startPercent = ((interval.min - minVal) / totalDisplayRange) * 100;
            const endPercent = (((interval.max ?? maxVal) - minVal) / totalDisplayRange) * 100;
            return `${color} ${startPercent}%, ${color} ${endPercent}%`;
        });
        const gradientCss = `linear-gradient(to right, ${colorStops.join(', ')})`;

        const gridCols = sortedIntervals.map(interval => `${(interval.max ?? maxVal) - interval.min}fr`).join(' ');
        
        return {
            scorePercentage: scorePerc,
            gradient: gradientCss,
            displaySegments: sortedIntervals,
            gridTemplateColumns: gridCols,
        };
    }, [score, intervals, minScale, maxScale]);

    if (intervals.length === 0) return null;

    return (
        <div className="w-full">
            <div className="relative pt-8">
                {score !== null && (
                    <div className="absolute top-0 flex flex-col items-center transition-all duration-500 z-10"
                         style={{ 
                            left: `clamp(4.5em, ${scorePercentage}%, calc(100% - 4.5em))`, 
                            transform: 'translateX(-50%)' 
                         }}>
                        <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{scoreLabel}</span>
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-700 mt-1" />
                    </div>
                )}
                
                <div className="h-3 rounded-full" style={{ background: gradient }} />

                <div className="grid w-full mt-1 items-start" style={{ gridTemplateColumns }}>
                    {displaySegments.map((seg, index) => (
                        <div key={index} className="flex flex-col items-center text-center px-1">
                            <span className="text-xs font-semibold text-gray-600 leading-tight">{seg.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScoreBar;
