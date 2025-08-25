
import { ReferenceInterval } from '../types';

export const formatAssessmentDate = (isoDate: string): string => {
  if (!isoDate) return 'N/A';
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Invalid date format:', isoDate);
    return 'Invalid Date';
  }
};

const colorMap: { [key: string]: { text: string; border: string; bg: string; iconText: string; } } = {
    'bg-green-500': { text: 'text-teal-800', border: 'border-teal-500', bg: 'bg-teal-50', iconText: 'text-teal-600' },
    'bg-yellow-500': { text: 'text-amber-800', border: 'border-amber-500', bg: 'bg-amber-50', iconText: 'text-amber-600' },
    'bg-orange-500': { text: 'text-orange-800', border: 'border-orange-500', bg: 'bg-orange-50', iconText: 'text-orange-600' },
    'bg-red-500': { text: 'text-rose-800', border: 'border-rose-500', bg: 'bg-rose-50', iconText: 'text-rose-600' },
};

const defaultStyles = {
    textColor: 'text-slate-700',
    borderColor: 'border-slate-400',
    bgColor: 'bg-slate-100',
    iconTextColor: 'text-slate-600',
};

export const getStylesForScore = (score: number | null, intervals: ReferenceInterval[]) => {
    if (score === null || intervals.length === 0) {
        return defaultStyles;
    }

    let intervalColor = '';
    
    // Find the correct interval for the score
    for (const interval of intervals) {
        if (score >= interval.min && (interval.max === null || score <= interval.max)) {
            intervalColor = interval.color;
            break;
        }
    }
    
    // Fallback for edge cases where score might be outside defined max, but should match highest applicable interval.
    if (!intervalColor) {
        const sortedIntervals = [...intervals].sort((a,b) => b.min - a.min); // sort descending
        for (const interval of sortedIntervals) {
            if (score >= interval.min) {
                intervalColor = interval.color;
                break;
            }
        }
    }

    if (intervalColor && colorMap[intervalColor]) {
        const styles = colorMap[intervalColor];
        return {
            textColor: styles.text,
            borderColor: styles.border,
            bgColor: styles.bg,
            iconTextColor: styles.iconText,
        };
    }

    return defaultStyles;
};

/**
 * Shuffles an array in place and returns it.
 * @param array The array to shuffle.
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
