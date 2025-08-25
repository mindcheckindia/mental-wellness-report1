
import React from 'react';
import { DocumentArrowDownIcon } from './icons';

interface DownloadButtonProps {
    onClick: () => void;
    isGenerating: boolean;
    variant?: 'full' | 'compact';
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, isGenerating, variant = 'full' }) => {
    
    const baseClasses = "inline-flex items-center justify-center font-bold rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed";
    
    const variantClasses = variant === 'full' 
        ? "px-8 py-4 bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300 transform hover:scale-105"
        : "px-5 py-2 bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300 text-sm";
    
    const iconClasses = variant === 'full' ? 'h-6 w-6 mr-2' : 'h-5 w-5 mr-2';

    return (
        <div className={variant === 'full' ? "text-center mt-12 mb-4" : ""}>
            <button
                onClick={onClick}
                disabled={isGenerating}
                className={`${baseClasses} ${variantClasses}`}
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {variant === 'full' ? 'Generating PDF...' : 'Generating...'}
                    </>
                ) : (
                    <>
                        <DocumentArrowDownIcon className={iconClasses} />
                        {variant === 'full' ? 'Download as PDF' : 'Download'}
                    </>
                )}
            </button>
        </div>
    );
};

export default DownloadButton;