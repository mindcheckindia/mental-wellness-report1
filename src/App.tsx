
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { IndividualData } from './types';
import { globalResources } from './data/globalData';
import { mockReportData } from './data/mockData';

import Header from './components/Header';
import IndividualInfo from './components/IndividualInfo';
import DomainCard from './components/DomainCard';
import GlobalResources from './components/GlobalResources';
import { GeneralDisclaimer, IndividualsDisclaimer } from './components/Disclaimer';
import DownloadButton from './components/DownloadButton';
import AtAGlance from './components/AtAGlance';
import VerificationSeal from './components/VerificationSeal';
import AssessmentForm from './components/AssessmentForm';
import { fetchDynamicReportData, fetchInsights } from './services/api';
import { FeatherIcon } from './components/icons';

declare const html2pdf: any;

const App: React.FC = () => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
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


    const handleDownloadPdf = useCallback(() => {
        setIsGeneratingPdf(true);
        const element = reportRef.current;
        if (element) {
            const opt = {
                margin: 0.5,
                filename: `Mental_Wellness_Report_${reportData?.individualId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            if (typeof html2pdf !== 'undefined') {
                html2pdf().set(opt).from(element).save().then(() => setIsGeneratingPdf(false));
            } else {
                setIsGeneratingPdf(false);
            }
        } else {
            setIsGeneratingPdf(false);
        }
    }, [reportData]);
    
    if (loadingState.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-4 font-inter text-center">
                <FeatherIcon className="h-16 w-16 mx-auto text-sky-600 mb-6 animate-pulse" />
                <h1 className="text-3xl font-bold text-stone-800">{loadingState.message}</h1>
                <p className="text-stone-600 mt-2">This may take a few moments. Thank you for your patience.</p>
            </div>
        );
    }
    
    if (loadingState.error) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 font-inter text-center">
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center">
                 <div className="max-w-7xl w-full">
                     <div className="flex justify-between items-center mb-4">
                        <a 
                            href="/"
                            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            &larr; Start New Assessment
                        </a>
                    </div>
                    <div ref={reportRef} className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-12 border border-blue-200">
                        <Header />
                        <IndividualInfo data={reportData} />
                        <AtAGlance domains={reportData.domains} />

                        <div className="mt-12">
                            <h2 className="text-3xl font-bold text-blue-800 mb-6 border-b pb-3 border-blue-300">Your Detailed Results</h2>
                            <div className="space-y-8 mt-8">
                                {reportData.domains.map((domain, index) => (
                                    <DomainCard key={index} domain={domain} index={index} />
                                ))}
                            </div>
                            <IndividualsDisclaimer />
                        </div>

                        <GlobalResources resources={globalResources} />
                        
                        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:justify-between gap-8">
                            <VerificationSeal />
                            <div className="flex-1">
                                 <GeneralDisclaimer />
                            </div>
                        </div>
                    </div>
                    <DownloadButton onClick={handleDownloadPdf} isGenerating={isGeneratingPdf} />
                </div>
            </div>
        );
    }

    // Default View: The new integrated assessment form.
    return <AssessmentForm />;
};

export default App;