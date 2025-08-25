import React from 'react';
import { GlobalResource } from '../types';
import { BookOpenIcon } from './icons';

interface GlobalResourcesProps {
    resources: GlobalResource[];
}

const GlobalResources: React.FC<GlobalResourcesProps> = ({ resources }) => (
    <div className="mt-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-5 border-b pb-3 border-slate-300">Global Mental Wellness Resources</h2>
        <p className="text-slate-600 mb-6 text-lg">For comprehensive information and support on various mental health topics, you can explore the following reputable organizations:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
                <a 
                    key={index} 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group block p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-sky-400 transition-all"
                >
                    <div className="flex items-center">
                        <BookOpenIcon className="w-6 h-6 text-sky-600 mr-3 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 group-hover:text-sky-700">{resource.text}</span>
                    </div>
                </a>
            ))}
        </div>
    </div>
);

export default GlobalResources;