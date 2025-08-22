
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
    'bg-green-500': { text: 'text-green-700', border: 'border-green-500', bg: 'bg-green-100', iconText: 'text-green-600' },
    'bg-yellow-500': { text: 'text-yellow-700', border: 'border-yellow-500', bg: 'bg-yellow-100', iconText: 'text-yellow-600' },
    'bg-amber-400': { text: 'text-amber-700', border: 'border-amber-500', bg: 'bg-amber-100', iconText: 'text-amber-600' },
    'bg-orange-500': { text: 'text-orange-700', border: 'border-orange-500', bg: 'bg-orange-100', iconText: 'text-orange-600' },
    'bg-red-500': { text: 'text-red-700', border: 'border-red-500', bg: 'bg-red-100', iconText: 'text-red-600' },
};

const defaultStyles = {
    textColor: 'text-gray-700',
    borderColor: 'border-gray-400',
    bgColor: 'bg-gray-100',
    iconTextColor: 'text-gray-600',
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
    
    // Fallback for edge cases, though the loop above should be sufficient
    if (!intervalColor) {
        let matched = false;
        for (const interval of [...intervals].reverse()) {
             if (score >= interval.min) {
                 intervalColor = interval.color;
                 matched = true;
                 break;
            }
        }
        if(!matched){
             const lowestInterval = intervals[0];
             if (lowestInterval && (lowestInterval.max === null || score <= lowestInterval.max)) {
                 intervalColor = lowestInterval.color;
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
