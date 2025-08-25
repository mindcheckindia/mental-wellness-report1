
import React from 'react';
import DownloadButton from './DownloadButton';

interface ReportActionsProps {
  onDownload: () => void;
  isGenerating: boolean;
}

const ReportActions: React.FC<ReportActionsProps> = ({ onDownload, isGenerating }) => (
  <header className="sticky top-0 z-20 bg-slate-100/80 backdrop-blur-lg shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a 
            href="/" 
            className="px-4 py-2 bg-white border border-slate-300 text-slate-800 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            &larr; New Assessment
          </a>
          <DownloadButton onClick={onDownload} isGenerating={isGenerating} variant="compact" />
        </div>
    </div>
  </header>
);

export default ReportActions;