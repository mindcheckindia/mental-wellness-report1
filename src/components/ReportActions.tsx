
import React from 'react';

const ReportActions: React.FC = () => (
  <header className="sticky top-0 z-20 bg-slate-100/80 backdrop-blur-lg shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <a 
            href="/" 
            className="px-5 py-2 bg-white border border-slate-300 text-slate-800 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm shadow-sm"
          >
            &larr; New Assessment
          </a>
        </div>
    </div>
  </header>
);

export default ReportActions;