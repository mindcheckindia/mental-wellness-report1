import React, { useState, useMemo, useEffect, useRef } from 'react';
import { assessmentSections } from '../data/assessmentQuestions';
import Logo from './Logo';
import { AnswerOption, Question } from '../types';
import { shuffleArray } from '../utils/helpers';
import AnimatedBackground from './AnimatedBackground';

type QuestionWithContext = Question & {
    sectionTitle: string;
    timeframe: string;
};

const ProgressTracker = ({ part, progress, part1Total, part2Total, part1Answered, part2Answered }: { part: number; progress: number; part1Total: number; part2Total: number; part1Answered: number; part2Answered: number; }) => {
    return (
        <div className="w-full mb-4 text-white">
             <div className="grid grid-cols-2 gap-4 text-center mb-2 text-sm">
                <div className={part === 1 ? 'font-bold' : 'opacity-70'}>
                    Part 1: Quick Check-in <span className="font-normal opacity-80">({part1Answered}/{part1Total})</span>
                </div>
                <div className={part === 2 ? 'font-bold' : 'opacity-70'}>
                    Part 2: Deeper Dive <span className="font-normal opacity-80">({part2Answered}/{part2Total})</span>
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

const Timer: React.FC<{ 
    startTime: number;
    part: number;
    part1Total: number;
    part2Total: number;
}> = ({ startTime, part, part1Total, part2Total }) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (startTime) {
                setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    const questionsInPart = part === 1 ? part1Total : part2Total;
    const recommendedSeconds = questionsInPart * 15;
    const recommendedMinutes = Math.ceil(recommendedSeconds / 60);

    const recommendationText = questionsInPart > 0
        ? `Recommended time for this section: ~${recommendedMinutes} min`
        : 'Recommended time for this section: N/A';
        
    const timeTakenText = `Time you have taken: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div className="absolute top-4 right-4 text-xs font-semibold text-sky-200 text-center">
            <div className="bg-slate-900/50 px-4 py-2 rounded-full shadow-md border border-white/20 backdrop-blur-sm">
                {recommendationText} | {timeTakenText}
            </div>
             {questionsInPart > 0 && <p className="text-white/80 mt-1 text-[11px]">We recommend spending about 15 seconds per question.</p>}
        </div>
    );
};

const FormCard: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => (
    <div className={`w-full max-w-2xl bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/20 ${className}`}>
        {children}
    </div>
);

const AssessmentForm: React.FC = () => {
    const [step, setStep] = useState(0); // 0:Welcome, 1:Commitment, 2:Details, 3:Assessment
    const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', email: '' });
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commitmentText, setCommitmentText] = useState('');
    const [shuffledOptions, setShuffledOptions] = useState<{ [key: string]: AnswerOption[] }>({});
    const [questionIndex, setQuestionIndex] = useState(0);
    const [partStartTime, setPartStartTime] = useState<number | null>(null);

    useEffect(() => {
        const allQuestions = assessmentSections.flatMap(s => s.questions);
        const shuffled = allQuestions.reduce((acc, q) => {
            acc[q.id] = shuffleArray([...q.answerOptions]);
            return acc;
        }, {} as { [key: string]: AnswerOption[] });
        setShuffledOptions(shuffled);
    }, []);
    
    const l1Questions = useMemo<QuestionWithContext[]>(() => {
        return assessmentSections.flatMap(section => 
            section.questions
                .filter(q => q.id.includes('_l1_'))
                .map(q => ({ ...q, sectionTitle: section.title, timeframe: section.timeframe }))
        );
    }, []);

    const l2Questions = useMemo<QuestionWithContext[]>(() => {
        const LEVEL_2_THRESHOLD = 2;
        const isL1Complete = l1Questions.every(q => answers[q.id] !== undefined);
        if (!isL1Complete) return [];

        return assessmentSections.flatMap(section => 
            section.questions
                .filter(q => {
                    if (!q.id.includes('_l2_') || !q.condition) return false;
                    return q.condition.triggerIds.some(id => (answers[id] ?? 0) >= LEVEL_2_THRESHOLD);
                })
                .map(q => ({ ...q, sectionTitle: section.title, timeframe: section.timeframeL2 || section.timeframe }))
        );
    }, [answers, l1Questions]);

    const questionQueue = useMemo(() => [...l1Questions, ...l2Questions], [l1Questions, l2Questions]);

    const handleUserDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };
    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
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

    const handleNext = () => {
        if (questionIndex < questionQueue.length - 1) {
            setQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };
    const handlePrevious = () => {
        if (questionIndex > 0) {
            setQuestionIndex(prev => prev - 1);
        }
    };

    const startAssessment = () => {
        setPartStartTime(Date.now());
        setStep(3);
    }
    
    const isL1 = questionIndex < l1Questions.length;
    const part = isL1 ? 1 : 2;
    const prevPartRef = useRef(part);

    useEffect(() => {
        // When part changes from 1 to 2, reset the start time.
        if (prevPartRef.current === 1 && part === 2) {
            setPartStartTime(Date.now());
        }
        prevPartRef.current = part;
    }, [part]);

    const renderContent = () => {
        switch (step) {
            case 0: // Welcome
                return (
                    <FormCard className="flex flex-col items-center text-center max-w-4xl">
                        <div className="mb-8 transform scale-125">
                            <Logo />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-lora tracking-tight">
                            Personalized Mental Wellness Blueprint
                        </h1>
                        <p className="text-lg text-sky-300 font-semibold mb-8">First of its kind adaptive assessment- backed by scientific research, powered by AI</p>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">This isn't just another generic mental health assessment. It's a scientifically-designed, dynamic assessment that <span className="text-slate-100 font-medium">adapts in real-time</span> to your unique well-being needs.</p>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">Our methodology is grounded in established clinical frameworks, such as the <span className="text-slate-100 font-medium">DSM-5 criteria</span> and <span className="text-slate-100 font-medium">PROMIS® scales</span>.</p>
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
                        <form onSubmit={e => { e.preventDefault(); startAssessment(); }} className="space-y-4">
                            <input type="text" name="firstName" placeholder="First Name (Required)" value={userDetails.firstName} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg bg-slate-900/50 border-2 border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"/>
                            <input type="text" name="lastName" placeholder="Last Name" value={userDetails.lastName} onChange={handleUserDetailChange} className="w-full px-5 py-3 text-lg bg-slate-900/50 border-2 border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"/>
                            <input type="email" name="email" placeholder="Email (Required)" value={userDetails.email} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg bg-slate-900/50 border-2 border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"/>
                            <button type="submit" disabled={!userDetails.firstName || !userDetails.email} className="w-full mt-4 px-8 py-4 bg-sky-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-sky-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Begin Part 1: Check-in
                            </button>
                        </form>
                    </FormCard>
                );

            case 3: // Assessment Question View
                if (questionQueue.length === 0) {
                     handleSubmit(); // Submit if no questions are queued (e.g., L2 not triggered)
                     return <div className="text-white text-xl">Calculating your report...</div>;
                }
                const currentQuestion = questionQueue[questionIndex];

                const l1Answered = l1Questions.filter(q => answers[q.id] !== undefined).length;
                const l2Answered = l2Questions.filter(q => answers[q.id] !== undefined).length;
                const progress = isL1 
                    ? (l1Answered / l1Questions.length) * 100
                    : (l2Questions.length > 0 ? (l2Answered / l2Questions.length) * 100 : 0);
                
                const isLastQuestion = questionIndex === questionQueue.length - 1;
                const isNextDisabled = answers[currentQuestion.id] === undefined;

                return (
                    <FormCard>
                         <ProgressTracker part={part} progress={progress} part1Total={l1Questions.length} part2Total={l2Questions.length} part1Answered={l1Answered} part2Answered={l2Answered} />

                        <div className="min-h-[20rem] flex flex-col">
                            <div className="mb-6 p-4 bg-sky-900/50 rounded-lg border border-sky-700/50">
                                <h2 className="text-xl font-semibold text-sky-300">{currentQuestion.sectionTitle}</h2>
                                <p className="text-sky-300 text-sm font-medium">{currentQuestion.timeframe}</p>
                            </div>

                            <fieldset key={currentQuestion.id} className="flex-grow">
                                <legend className="text-lg font-medium text-white whitespace-pre-wrap mb-2">{currentQuestion.text}</legend>
                                {currentQuestion.description && (
                                    <p className="text-sm text-sky-200 mb-4 italic">{currentQuestion.description}</p>
                                )}
                                <div className="space-y-3">
                                    {(shuffledOptions[currentQuestion.id] || currentQuestion.answerOptions).map(opt => (
                                        <label key={opt.value} className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer transform ${answers[currentQuestion.id] === opt.value ? 'bg-sky-400/30 border-sky-400 scale-[1.02]' : 'border-slate-600 hover:border-slate-400 bg-slate-900/30'}`}>
                                            <input type="radio" name={currentQuestion.id} value={opt.value} checked={answers[currentQuestion.id] === opt.value} onChange={() => handleAnswerChange(currentQuestion.id, opt.value)} required className="h-5 w-5 text-sky-400 focus:ring-sky-500 border-slate-400 bg-transparent"/>
                                            <span className={`ml-4 text-base ${answers[currentQuestion.id] === opt.value ? 'font-semibold text-white' : 'text-slate-200'}`}>{opt.text}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                         <div className="mt-8 flex justify-between items-center">
                            <button onClick={handlePrevious} disabled={questionIndex === 0} className="px-6 py-3 bg-slate-700 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button onClick={handleNext} disabled={isNextDisabled || isSubmitting} className="px-8 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Submitting...' : (isLastQuestion ? 'Submit & View Report' : 'Next')}
                            </button>
                        </div>
                    </FormCard>
                );
        }
    };

    return (
        <div className="min-h-screen font-inter flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="fixed inset-0 w-full h-full -z-10">
                <AnimatedBackground />
                <div className="absolute inset-0 bg-slate-900/40"></div>
            </div>
             {step > 0 && (
                <div className="fixed bottom-4 left-4 opacity-60 transform scale-75 origin-bottom-left z-20" aria-hidden="true">
                    <Logo />
                </div>
            )}
             {step === 3 && (
                <div className="absolute top-4 left-4 text-xs font-semibold text-amber-200 text-center">
                    <div className="bg-slate-900/50 px-4 py-2 rounded-full shadow-md border border-white/20 backdrop-blur-sm">
                        Prototype: Do not share without permission
                    </div>
                </div>
            )}
             {step === 3 && partStartTime && (
                 <Timer 
                    startTime={partStartTime} 
                    part={part}
                    part1Total={l1Questions.length}
                    part2Total={l2Questions.length}
                />
             )}
            {renderContent()}
        </div>
    );
};

export default AssessmentForm;