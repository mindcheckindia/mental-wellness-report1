

import React, { useState, useMemo, useEffect } from 'react';
import { assessmentSections } from '../data/assessmentQuestions';
import { BrandIcon } from './icons';
import { AnswerOption } from '../types';
import { shuffleArray } from '../utils/helpers';
import AnimatedBackground from './AnimatedBackground';

const ProgressTracker = ({ part, progress }: { part: number, progress: number }) => {
    return (
        <div className="w-full mb-8 text-white">
             <div className="grid grid-cols-2 gap-4 text-center mb-2">
                <div className={part === 1 ? 'font-bold' : 'opacity-70'}>
                    Part 1: Quick Check-in
                </div>
                <div className={part === 2 ? 'font-bold' : 'opacity-70'}>
                    Part 2: Deeper Dive
                </div>
            </div>
            <div className="flex bg-white/20 rounded-full h-2.5">
                <div 
                    className="bg-sky-400 h-2.5 rounded-l-full transition-all duration-500" 
                    style={{ width: `${part === 1 ? progress : 100}%` }}
                />
                <div 
                    className="bg-teal-400 h-2.5 rounded-r-full transition-all duration-500"
                    style={{ width: `${part === 2 ? progress : 0}%` }}
                />
            </div>
        </div>
    );
};

const FormCard: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => (
    <div className={`w-full max-w-4xl bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 sm:p-12 shadow-2xl border border-white/20 ${className}`}>
        {children}
    </div>
);

const AssessmentForm: React.FC = () => {
    const [step, setStep] = useState(0); // 0:Welcome, 1:Commitment, 2:Details, 3:L1, 4:L2
    const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', email: '' });
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commitmentText, setCommitmentText] = useState('');
    const [shuffledOptions, setShuffledOptions] = useState<{ [key: string]: AnswerOption[] }>({});

    useEffect(() => {
        // Pre-shuffle all question options on component mount to keep them stable
        const allQuestions = assessmentSections.flatMap(s => s.questions);
        const shuffled = allQuestions.reduce((acc, q) => {
            acc[q.id] = shuffleArray([...q.answerOptions]);
            return acc;
        }, {} as { [key: string]: AnswerOption[] });
        setShuffledOptions(shuffled);
    }, []);
    
    // --- L1 and L2 Questions Logic ---
    const l1Sections = useMemo(() => assessmentSections.map(section => ({
        ...section,
        questions: section.questions.filter(q => q.id.includes('_l1_'))
    })).filter(section => section.questions.length > 0), []);

    const visibleL2Sections = useMemo(() => {
        const LEVEL_2_THRESHOLD = 2;
        return assessmentSections.map(section => ({
            ...section,
            questions: section.questions.filter(q => {
                if (!q.id.includes('_l2_') || !q.condition) return false;
                return q.condition.triggerIds.some(id => (answers[id] ?? 0) >= LEVEL_2_THRESHOLD);
            })
        })).filter(section => section.questions.length > 0);
    }, [answers]);

    // --- Handlers ---
    const handleUserDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };
    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submissionData = { ...userDetails, answers };
        try {
            const response = await fetch('/api/submit-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Server error');
            const result = await response.json();
            window.location.href = `/?submissionId=${result.submissionId}`;
        } catch (error: any) {
            alert(`Submission failed: ${error.message}`);
            setIsSubmitting(false);
        }
    };
    
    const isL1Complete = () => l1Sections.flatMap(s => s.questions).every(q => answers[q.id] !== undefined);

    const isL2Complete = () => visibleL2Sections.flatMap(s => s.questions).every(q => answers[q.id] !== undefined);

    const renderContent = () => {
        switch (step) {
            case 0: // Welcome
                return (
                    <FormCard className="text-center">
                        <BrandIcon className="h-16 w-16 mx-auto text-sky-400 mb-6" />
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-lora tracking-tight">
                            Mindcheck<sup className="text-lg sm:text-2xl font-medium">&reg;</sup> Personalized Mental Wellness Blueprint
                        </h1>
                        <p className="text-lg text-sky-300 font-semibold mb-8">First of its kind adaptive assessment- backed by scientific research, powered by AI</p>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">This isn't just another generic test. It's a scientifically-designed, dynamic assessment that <span className="text-slate-100 font-medium">adapts in real-time</span> to your unique well-being needs.</p>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">Our methodology is grounded in established clinical frameworks, such as the <span className="text-slate-100 font-medium">DSM-5 criteria</span> and <span className="text-slate-100 font-medium">PROMIS® scales</span> among others.</p>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">The process is simple: Part 1 is a brief check-in. Your confidential responses here will intelligently shape Part 2, tailoring the deeper-dive questions to focus only on what's most relevant to you. This is much like how a physician uses an initial consultation to determine the need for specific follow-up tests.</p>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">Our ambition is to provide you with mental wellness insights that have the same <span className="text-slate-100 font-medium">clarity and depth as a physiological test</span>, like a blood analysis. This precise, adaptive approach creates a more accurate picture of your well-being, delivering <span className="text-slate-100 font-medium">actionable insights</span> to advance your personal mental wellness journey.</p>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">Your privacy is our top priority. All data you provide is <span className="text-sky-300 font-semibold">encrypted</span> and handled with the highest privacy standards to ensure your information remains secure and confidential.</p>
                        <button onClick={() => setStep(1)} className="px-12 py-4 bg-sky-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-sky-600 transition-all duration-300 transform hover:scale-105">
                            Get Started
                        </button>
                    </FormCard>
                );

            case 1: // Commitment
                const isCommitted = commitmentText.trim().toLowerCase() === 'i commit';
                return (
                    <FormCard>
                        <h1 className="text-3xl font-bold text-white mb-4 font-lora">A Commitment to Honesty</h1>
                        <p className="text-slate-300 mb-6">By taking this assessment, you're helping make mental health as openly discussed as physical health. For this to serve you and the wider community, please answer each question with complete honesty. Your responses are a compass for your wellness journey and are strictly confidential.</p>
                        <p className="text-sky-300 font-semibold mb-4">To affirm your commitment to this process, please type "I commit" in the box below.</p>
                        <input type="text" value={commitmentText} onChange={e => setCommitmentText(e.target.value)} className="w-full px-5 py-3 text-lg bg-slate-900/50 border-2 border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition" placeholder="Type here..." />
                        <button onClick={() => setStep(2)} disabled={!isCommitted} className="w-full mt-6 px-8 py-4 bg-sky-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-sky-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                           I Agree & Continue
                        </button>
                    </FormCard>
                );

            case 2: // User Details
                 return (
                    <FormCard>
                        <h1 className="text-3xl font-bold text-white mb-2 font-lora">Tell Us About Yourself</h1>
                        <p className="text-slate-300 mb-8">This information is used to personalize your final report.</p>
                        <form onSubmit={e => { e.preventDefault(); setStep(3); }} className="space-y-4">
                            <input type="text" name="firstName" placeholder="First Name (Required)" value={userDetails.firstName} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg bg-slate-900/50 border-2 border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"/>
                            <input type="text" name="lastName" placeholder="Last Name" value={userDetails.lastName} onChange={handleUserDetailChange} className="w-full px-5 py-3 text-lg bg-slate-900/50 border-2 border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"/>
                            <input type="email" name="email" placeholder="Email (Required)" value={userDetails.email} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg bg-slate-900/50 border-2 border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"/>
                            <button type="submit" disabled={!userDetails.firstName || !userDetails.email} className="w-full mt-4 px-8 py-4 bg-sky-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-sky-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Begin Part 1: Check-in
                            </button>
                        </form>
                    </FormCard>
                );
            
            case 3: // Level 1 Questions
                const answeredL1Count = Object.keys(answers).filter(key => l1Sections.flatMap(s => s.questions).some(q => q.id === key)).length;
                const totalL1Count = l1Sections.reduce((acc, s) => acc + s.questions.length, 0);
                const l1Progress = totalL1Count > 0 ? (answeredL1Count / totalL1Count) * 100 : 0;
                return(
                    <FormCard>
                        <ProgressTracker part={1} progress={l1Progress} />
                        <h1 className="text-3xl font-bold text-white mb-6 font-lora">Part 1: Quick Check-in</h1>
                        <div className="space-y-10 max-h-[60vh] overflow-y-auto pr-4 -mr-4">
                            {l1Sections.map(section => (
                                <div key={section.title}>
                                    <h2 className="text-2xl font-semibold text-sky-300 mb-2">{section.title}</h2>
                                    <p className="text-slate-300 italic mb-6">{section.timeframe}</p>
                                    {section.questions.map(q => (
                                         <fieldset key={q.id} className="mb-8">
                                            <legend className="text-lg font-medium text-white whitespace-pre-wrap">{q.text}</legend>
                                            <div className="mt-4 space-y-3">
                                                {(shuffledOptions[q.id] || q.answerOptions).map(opt => (
                                                    <label key={opt.value} className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer transform ${answers[q.id] === opt.value ? 'bg-sky-400/30 border-sky-400 scale-[1.02]' : 'border-slate-600 hover:border-slate-400 bg-slate-900/30'}`}>
                                                        <input type="radio" name={q.id} value={opt.value} checked={answers[q.id] === opt.value} onChange={() => handleAnswerChange(q.id, opt.value)} required className="h-5 w-5 text-sky-400 focus:ring-sky-500 border-slate-400 bg-transparent"/>
                                                        <span className={`ml-4 text-base ${answers[q.id] === opt.value ? 'font-semibold text-white' : 'text-slate-200'}`}>{opt.text}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    ))}
                                </div>
                            ))}
                        </div>
                         <button onClick={() => setStep(4)} disabled={!isL1Complete()} className="w-full mt-8 px-8 py-4 bg-sky-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-sky-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {visibleL2Sections.length > 0 ? 'Continue to Deeper Dive' : 'Calculate My Report'}
                         </button>
                    </FormCard>
                );

            case 4: // Level 2 Questions
                 if (visibleL2Sections.length === 0) {
                    // No L2 questions, so we just submit.
                    handleSubmit(new Event('submit') as any);
                    return <div className="text-white text-xl">Calculating your report...</div>;
                 }
                const answeredL2Count = Object.keys(answers).filter(key => visibleL2Sections.flatMap(s => s.questions).some(q => q.id === key)).length;
                const totalL2Count = visibleL2Sections.reduce((acc, s) => acc + s.questions.length, 0);
                const l2Progress = totalL2Count > 0 ? (answeredL2Count / totalL2Count) * 100 : 0;
                 return(
                     <form onSubmit={handleSubmit}>
                        <FormCard>
                            <ProgressTracker part={2} progress={l2Progress} />
                            <div className="space-y-10 max-h-[60vh] overflow-y-auto pr-4 -mr-4 pt-6">
                                {visibleL2Sections.map(section => (
                                    <div key={section.title}>
                                        <h2 className="text-2xl font-semibold text-sky-300 mb-2">{section.title}</h2>
                                        <p className="text-slate-300 italic mb-6">{section.timeframeL2 || section.timeframe}</p>
                                        {section.questions.map(q => (
                                             <fieldset key={q.id} className="mb-8">
                                                <legend className="text-lg font-medium text-white whitespace-pre-wrap">{q.text}</legend>
                                                <div className="mt-4 space-y-3">
                                                    {(shuffledOptions[q.id] || q.answerOptions).map(opt => (
                                                        <label key={opt.value} className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer transform ${answers[q.id] === opt.value ? 'bg-sky-400/30 border-sky-400 scale-[1.02]' : 'border-slate-600 hover:border-slate-400 bg-slate-900/30'}`}>
                                                            <input type="radio" name={q.id} value={opt.value} checked={answers[q.id] === opt.value} onChange={() => handleAnswerChange(q.id, opt.value)} required className="h-5 w-5 text-sky-400 focus:ring-sky-500 border-slate-400 bg-transparent"/>
                                                            <span className={`ml-4 text-base ${answers[q.id] === opt.value ? 'font-semibold text-white' : 'text-slate-200'}`}>{opt.text}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </fieldset>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <button type="submit" disabled={isSubmitting || !isL2Complete()} className="w-full mt-8 px-8 py-4 bg-teal-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Submitting...' : 'Submit & View Report'}
                            </button>
                        </FormCard>
                     </form>
                );
        }
    };

    return (
        <div className="min-h-screen font-inter flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="fixed inset-0 w-full h-full -z-10">
                <AnimatedBackground />
                <div className="absolute inset-0 bg-slate-900/40"></div>
            </div>
             {step !== 0 && step < 3 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap sm:left-auto sm:right-4 sm:-translate-x-0 bg-amber-200/90 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    PROTOTYPE: Please do not share without permission.
                </div>
            )}
            {renderContent()}
        </div>
    );
};

export default AssessmentForm;