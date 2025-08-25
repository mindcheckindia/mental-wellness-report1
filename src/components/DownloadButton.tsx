import React from 'react';
import { DocumentArrowDownIcon } from './icons';

interface DownloadButtonProps {
    onClick: () => void;
    isGenerating: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, isGenerating }) => (
    <div className="text-center mt-12 mb-4">
        <button
            onClick={onClick}
            disabled={isGenerating}
            className={`inline-flex items-center justify-center px-8 py-4 bg-sky-600 text-white font-bold rounded-full shadow-lg hover:bg-sky-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-300 transform hover:scale-105
              ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {isGenerating ? (
                 <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                </>
            ) : (
                <>
                    <DocumentArrowDownIcon className="h-6 w-6 mr-2" />
                    Download as PDF
                </>
            )}
        </button>
    </div>
);

export default DownloadButton;