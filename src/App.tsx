
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { IndividualData } from './types';
import { globalResources } from './data/globalData';
import { mockReportData } from './data/mockData';

import Header from './components/Header';
import IndividualInfo from './components/IndividualInfo';
import DomainCard from './components/DomainCard';
import GlobalResources from './components/GlobalResources';
import { GeneralDisclaimer, IndividualsDisclaimer } from './components/Disclaimer';
import AtAGlance from './components/AtAGlance';
import VerificationSeal from './components/VerificationSeal';
import AssessmentForm from './components/AssessmentForm';
import { fetchDynamicReportData, fetchInsights } from './services/api';
import { BrandIcon } from './components/icons';
import ReportActions from './components/ReportActions';
import NextSteps from './components/NextSteps';

const App: React.FC = () => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<IndividualData | null>(null);
    const [loadingState, setLoadingState] = useState<{ isLoading: boolean; message: string; error: string | null }>({
        isLoading: true,
        message: 'Initializing...',
        error: null,
    });
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const submissionId = urlParams.get('submissionId');
        const isTestMode = urlParams.get('test') === 'true';

        if (isTestMode) {
            setLoadingState({ isLoading: true, message: 'Loading test report...', error: null });
            // Use a timeout to simulate a small loading delay for better UX
            setTimeout(() => {
                setReportData(mockReportData);
                setLoadingState({ isLoading: false, message: '', error: null });
            }, 500);
        } else if (submissionId) {
            const loadReport = async () => {
                try {
                    setLoadingState({ isLoading: true, message: 'Fetching your assessment results...', error: null });
                    const baseData = await fetchDynamicReportData(submissionId);

                    setLoadingState({ isLoading: true, message: 'Generating AI-powered insights...', error: null });
                    const insights = await fetchInsights(baseData);

                    const finalData = {
                        ...baseData,
                        domains: baseData.domains.map((domain, index) => ({
                            ...domain,
                            insightsAndSupport: insights[index] || domain.insightsAndSupport,
                        })),
                    };
                    
                    setReportData(finalData);
                    setLoadingState({ isLoading: false, message: '', error: null });

                } catch (err: any) {
                     setLoadingState({ isLoading: false, message: '', error: err.message || 'An unknown error occurred.' });
                }
            };
            loadReport();
        } else {
            setLoadingState({ isLoading: false, message: '', error: null });
        }
    }, []);

    useEffect(() => {
        if (!reportData || !reportRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    entry.target.classList.remove('opacity-0');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const sections = reportRef.current?.querySelectorAll('.report-section');
        sections?.forEach(section => {
            section.classList.add('opacity-0'); // Start hidden
            observer.observe(section);
        });

        return () => {
            sections?.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, [reportData]);
    
    if (loadingState.isLoading) {
        return (
            <div role="status" aria-live="polite" className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 font-inter text-center">
                <BrandIcon className="h-16 w-16 mx-auto text-sky-600 mb-6 animate-pulse" />
                <h1 className="text-3xl font-bold text-slate-800">{loadingState.message}</h1>
                <p className="text-slate-600 mt-2">This may take a few moments. Thank you for your patience.</p>
            </div>
        );
    }
    
    if (loadingState.error) {
        return (
             <div role="alert" aria-live="assertive" className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 font-inter text-center">
                <h1 className="text-3xl font-bold text-rose-800 mb-4">An Error Occurred</h1>
                <p className="text-rose-700 max-w-lg">{loadingState.error}</p>
                 <a href="/" className="mt-8 px-6 py-3 bg-sky-600 text-white font-bold rounded-full shadow-lg hover:bg-sky-700 transition-colors">
                    Start a New Assessment
                </a>
            </div>
        );
    }

    if (reportData) {
        return (
            <div className="min-h-screen bg-slate-100 font-inter">
                 <ReportActions />
                 <main className="p-4 sm:p-6 lg:p-8 flex flex-col items-center">
                    <div className="max-w-7xl w-full">
                        <div ref={reportRef} className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 lg:p-12 border border-slate-200">
                            <div className="report-section"><Header /></div>
                            <div className="report-section"><IndividualInfo data={reportData} /></div>
                            <div className="report-section"><AtAGlance domains={reportData.domains} /></div>

                            <div className="mt-16 report-section">
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b pb-3 border-slate-300">Your Detailed Results</h2>
                                <div className="space-y-8 mt-8">
                                    {reportData.domains.map((domain, index) => (
                                        <div key={index} className="report-section">
                                            <DomainCard domain={domain} index={index} />
                                        </div>
                                    ))}
                                </div>
                                <div className="report-section"><IndividualsDisclaimer /></div>
                            </div>
                            
                            <div className="report-section"><GlobalResources resources={globalResources} /></div>
                            
                            <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-stretch justify-between gap-8 report-section">
                                <VerificationSeal />
                                <div className="flex-1">
                                     <GeneralDisclaimer />
                                </div>
                            </div>
                        </div>
                        <div className="report-section"><NextSteps /></div>
                    </div>
                </main>
            </div>
        );
    }

    // Default View: The integrated assessment form.
    return <AssessmentForm />;
};

export default App;