
import React, { useState, useMemo, useEffect } from 'react';
import { assessmentSections } from '../data/assessmentQuestions';
import { BrandIcon } from './icons';
import { AssessmentSection, Question } from '../types';

interface AssessmentFormProps {
    // No props needed for live version
}

const ProgressTracker = ({ current, total, sections }: { current: number, total: number, sections: AssessmentSection[] }) => {
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-sky-700">
                    Step {current + 1} of {total}
                </span>
                <span className="text-sm font-medium text-slate-600">
                    {sections[current]?.title}
                </span>
            </div>
            <div className="flex space-x-1">
                {Array.from({ length: total }).map((_, index) => (
                    <div key={index} className="h-1.5 flex-1 rounded-full bg-slate-200">
                        <div 
                           className="h-1.5 rounded-full bg-sky-600" 
                           style={{ 
                             width: index < current ? '100%' : index === current ? '50%' : '0%',
                             transition: 'width 0.5s ease-in-out'
                           }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const AssessmentForm: React.FC<AssessmentFormProps> = () => {
    const [step, setStep] = useState(0); // 0 = user details, 1+ = assessment sections
    const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', email: '' });
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUserDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers({ ...answers, [questionId]: value });
    };
    
    // Determines if a question should be visible based on answers to trigger questions.
    const isQuestionVisible = (question: Question): boolean => {
        if (!question.condition) return true; // Always visible if no condition
        const { triggerIds, threshold } = question.condition;
        return triggerIds.some(id => (answers[id] ?? 0) >= threshold);
    };

    const visibleSections = useMemo(() => {
        return assessmentSections.filter(section => 
            section.questions.some(q => isQuestionVisible(q))
        );
    }, [answers]);
    
    const getVisibleQuestionsForSection = (section: AssessmentSection) => {
        if (!section) return [];
        return section.questions.filter(q => isQuestionVisible(q));
    };
    
    useEffect(() => {
        if (step > 0 && step > visibleSections.length) {
            setStep(visibleSections.length);
        }
    }, [visibleSections, step]);


    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        const submissionData = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            answers,
        };
    
        try {
            const response = await fetch('/api/submit-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }
    
            const result = await response.json();
            window.location.href = `/?submissionId=${result.submissionId}`;
    
        } catch (error: any) {
            console.error("Submission failed:", error);
            alert(`An error occurred during submission: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    const isCurrentSectionAnswered = () => {
        if (step === 0) {
            return userDetails.firstName.trim() !== '' && userDetails.email.trim() !== '';
        }
        const currentSection = visibleSections[step - 1];
        if (!currentSection) return false;

        const visibleQuestions = getVisibleQuestionsForSection(currentSection);
        const mandatoryQuestionsToCheck = visibleQuestions.filter(q => q.mandatory);
    
        return mandatoryQuestionsToCheck.every(q => answers[q.id] !== undefined);
    };


    if (step === 0) {
        return (
            <div className="min-h-screen bg-white font-inter grid md:grid-cols-2">
                 <div className="flex flex-col items-center justify-center p-8 sm:p-12 order-2 md:order-1">
                    <div className="max-w-md w-full">
                        <BrandIcon className="h-12 w-12 text-sky-600 mb-4" />
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 tracking-tight">Mental Wellness Assessment</h1>
                        <p className="text-lg text-slate-600 mb-8">Begin your confidential self-assessment. Your personalized report will be generated upon completion.</p>

                        <form onSubmit={e => { e.preventDefault(); nextStep(); }} className="space-y-4">
                            <input type="text" name="firstName" placeholder="First Name (Required)" value={userDetails.firstName} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
                            <input type="text" name="lastName" placeholder="Last Name" value={userDetails.lastName} onChange={handleUserDetailChange} className="w-full px-5 py-3 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
                            <input type="email" name="email" placeholder="Email (Required)" value={userDetails.email} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
                            <button type="submit" disabled={!isCurrentSectionAnswered()} className="w-full mt-4 px-8 py-4 bg-sky-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-sky-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Start Assessment
                            </button>
                        </form>
                    </div>
                 </div>
                 <div className="hidden md:block bg-gradient-to-br from-sky-100 to-slate-200 order-1 md:order-2">
                    {/* Visual element placeholder */}
                 </div>
            </div>
        );
    }

    const currentSectionIndex = step - 1;
    const currentVisibleSection = visibleSections[currentSectionIndex];
    const visibleQuestions = getVisibleQuestionsForSection(currentVisibleSection);

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-100 p-4 font-inter">
            <div className="max-w-4xl w-full bg-white p-8 sm:p-12 my-8 rounded-2xl shadow-lg border border-slate-200">
                <ProgressTracker current={currentSectionIndex} total={visibleSections.length} sections={visibleSections} />
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{currentVisibleSection.title}</h2>
                <p className="text-slate-600 mb-8 text-lg italic">{currentVisibleSection.timeframe}</p>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    {visibleQuestions.map((q) => {
                        const options = q.answerOptions;
                        return (
                            <fieldset key={q.id}>
                                <legend className="text-lg font-semibold text-slate-800 whitespace-pre-wrap">{q.text}</legend>
                                <div className="mt-4 space-y-3">
                                    {options.map(opt => (
                                        <label key={opt.value} className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${answers[q.id] === opt.value ? 'bg-sky-50 border-sky-500 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={opt.value}
                                                checked={answers[q.id] === opt.value}
                                                onChange={() => handleAnswerChange(q.id, opt.value)}
                                                className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-slate-300"
                                                required={q.mandatory}
                                            />
                                            <span className={`ml-4 text-base ${answers[q.id] === opt.value ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>{opt.text}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        );
                    })}
                    <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-200">
                        <button type="button" onClick={prevStep} className="px-6 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Back</button>
                        {currentSectionIndex < visibleSections.length - 1 ? (
                            <button type="button" onClick={nextStep} disabled={!isCurrentSectionAnswered()} className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                        ) : (
                            <button type="submit" disabled={isSubmitting || !isCurrentSectionAnswered()} className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Submitting...' : 'Submit & View Report'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssessmentForm;