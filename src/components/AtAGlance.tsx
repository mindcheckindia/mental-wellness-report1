
import React from 'react';
import { Domain } from '../types';
import { getStylesForScore } from '../utils/helpers';
import { domainIcons } from './icons';

const AtAGlance: React.FC<{ domains: Domain[] }> = ({ domains }) => {
    return (
        <div className="mb-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-5">Results Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {domains.map((domain, index) => {
                    const IconComponent = domainIcons[domain.name];
                    const { bgColor, textColor, iconTextColor } = getStylesForScore(domain.score, domain.referenceIntervals);
                    const ariaLabel = `${domain.name}: ${domain.userInterpretation}`;
                    
                    return (
                        <div 
                            key={index} 
                            title={ariaLabel} 
                            aria-label={ariaLabel} 
                            className={`p-3 rounded-lg flex flex-col items-center justify-center text-center ${bgColor}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/50 mb-2`}>
                                {IconComponent ? <IconComponent className={`h-7 w-7 ${iconTextColor}`} /> : <div className={`h-7 w-7`}></div>}
                            </div>
                            <p className="text-xs font-semibold text-slate-800 leading-tight w-full mb-0.5">{domain.name}</p>
                            <p className={`text-xs font-bold ${textColor}`}>{domain.userInterpretation}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default AtAGlance;