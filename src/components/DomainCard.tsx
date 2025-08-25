
import React, { useState } from 'react';
import { Domain } from '../types';
import { getStylesForScore } from '../utils/helpers';
import { InformationCircleIcon, LightbulbIcon, UsersIcon, domainIcons, ChevronDownIcon } from './icons';
import ScoreBar from './ScoreBar';

interface DomainCardProps {
  domain: Domain;
  index: number;
}

const AccordionSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    uniqueId: string;
}> = ({ title, icon, isOpen, onToggle, children, uniqueId }) => (
    <div className="border-t border-slate-200">
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center py-4 text-left text-lg font-semibold text-slate-800 hover:bg-slate-50 rounded-md"
            aria-expanded={isOpen}
            aria-controls={`accordion-content-${uniqueId}`}
            id={`accordion-button-${uniqueId}`}
        >
            <div className="flex items-center">
                {icon}
                <span className="ml-3">{title}</span>
            </div>
            <ChevronDownIcon className={`h-6 w-6 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div
                id={`accordion-content-${uniqueId}`}
                role="region"
                aria-labelledby={`accordion-button-${uniqueId}`}
                className="pb-4 pl-10 text-slate-700 text-base leading-relaxed"
            >
                {children}
            </div>
        )}
    </div>
);


const DomainCard: React.FC<DomainCardProps> = ({ domain, index }) => {
    const { textColor, borderColor } = getStylesForScore(domain.score, domain.referenceIntervals);
    const IconComponent = domainIcons[domain.name];
    const isPromisDomain = !!domain.tScore;
    
    const [isAboutOpen, setAboutOpen] = useState(false);
    const [isInsightsOpen, setInsightsOpen] = useState(true);
    const [isFiguresOpen, setFiguresOpen] = useState(false);
    
    const domainId = domain.name.replace(/\s+/g, '-');

    return (
        <div id={`domain-${index}`} className={`bg-white rounded-xl shadow-md border border-slate-200 border-l-4 transition-shadow duration-300 hover:shadow-lg ${borderColor}`}>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 sm:gap-x-4">
                    <div className="flex items-center mb-2 sm:mb-0">
                        {IconComponent && <IconComponent className="h-8 w-8 mr-3 text-sky-700 flex-shrink-0" />}
                        <h3 className="text-2xl font-bold text-slate-900 text-left">
                            {domain.name}
                        </h3>
                    </div>
                    <p className={`text-xl font-bold ${textColor} text-left sm:text-right sm:mt-1 flex-shrink-0`}>
                        {domain.userInterpretation}
                    </p>
                </div>

                {domain.score !== null && domain.referenceIntervals.length > 0 ? (
                    <div className="mb-6">
                        <ScoreBar 
                            score={domain.score} 
                            intervals={domain.referenceIntervals}
                            scoreLabel={isPromisDomain ? `T-Score: ${domain.tScore}` : `Score: ${domain.rawScore}`}
                            minScale={isPromisDomain ? 30 : undefined} 
                            maxScale={isPromisDomain ? 85 : undefined} 
                        />
                    </div>
                ) : (
                    <div className="mb-6 p-3 bg-slate-50 rounded-lg text-center text-slate-600 italic">Score not available</div>
                )}

                <div className="space-y-1">
                    <AccordionSection 
                        title="Insights & Support"
                        icon={<LightbulbIcon className="h-6 w-6 text-amber-500" />}
                        isOpen={isInsightsOpen}
                        onToggle={() => setInsightsOpen(!isInsightsOpen)}
                        uniqueId={`insights-${domainId}`}>
                        <p className="whitespace-pre-wrap">{domain.insightsAndSupport}</p>
                    </AccordionSection>
                    
                    <AccordionSection 
                        title="About This Domain"
                        icon={<InformationCircleIcon className="h-6 w-6 text-sky-500" />}
                        isOpen={isAboutOpen}
                        onToggle={() => setAboutOpen(!isAboutOpen)}
                        uniqueId={`about-${domainId}`}>
                        <p>{domain.about}</p>
                        {domain.aboutLink && (
                           <a href={domain.aboutLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline text-sm font-medium mt-2 inline-block">
                                Learn More <span aria-hidden="true">&rarr;</span>
                           </a>
                        )}
                    </AccordionSection>
                    
                     <AccordionSection 
                        title="Notable Figures with Similar Experiences"
                        icon={<UsersIcon className="h-6 w-6 text-teal-500" />}
                        isOpen={isFiguresOpen}
                        onToggle={() => setFiguresOpen(!isFiguresOpen)}
                        uniqueId={`figures-${domainId}`}>
                         {domain.individualsExperienced && domain.individualsExperienced.length > 0 ? (
                             <div className="space-y-1 text-base">
                                 {domain.individualsExperienced.map((person, pIndex) => (
                                     <div key={pIndex}>
                                         <a href={person.link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline font-medium">
                                             {person.name}
                                         </a>
                                     </div>
                                 ))}
                             </div>
                         ) : (
                             <p className="text-slate-600 italic text-base">N/A</p>
                         )}
                    </AccordionSection>
                </div>
            </div>
        </div>
    );
};

export default DomainCard;