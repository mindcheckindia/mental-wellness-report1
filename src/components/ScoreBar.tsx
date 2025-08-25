
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
            'bg-green-500': '#a7f3d0', 'bg-yellow-500': '#fde68a',
            'bg-orange-500': '#fed7aa', 'bg-red-500': '#fecaca',
        };

        const colorStops = sortedIntervals.map(interval => {
            const color = colorMap[interval.color] || '#e5e7eb';
            const startPercent = ((interval.min - minVal) / totalDisplayRange) * 100;
            const endPercent = (((interval.max ?? maxVal) - minVal) / totalDisplayRange) * 100;
            return `${color} ${startPercent}%, ${color} ${endPercent}%`;
        });
        const gradientCss = `linear-gradient(to right, ${colorStops.join(', ')})`;
        
        // Use equal widths for labels for better visual alignment and professionalism
        const gridCols = `repeat(${sortedIntervals.length}, 1fr)`;
        
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
                        <span className="px-2 py-0.5 bg-slate-700 text-white text-xs font-bold rounded-md whitespace-nowrap">{scoreLabel}</span>
                        <div className="w-px h-2 bg-slate-700 mt-1" />
                    </div>
                )}
                
                <div className="h-2.5 rounded-full" style={{ background: gradient }} />

                <div className="grid w-full mt-1.5" style={{ gridTemplateColumns }}>
                    {displaySegments.map((seg, index) => (
                        <div key={index} className="flex flex-col items-center text-center px-1">
                            <span className="text-xs font-semibold text-slate-600 leading-tight">{seg.label}</span>
                             <span className="text-xs text-slate-500 -mt-0.5">
                                {seg.max !== null ? `${seg.min} - ${seg.max}` : `${seg.min}+`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScoreBar;