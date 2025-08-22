import React, { useState, useMemo, useEffect } from 'react';
import { assessmentSections } from '../data/assessmentQuestions';
import { FeatherIcon } from './icons';

const answerOptions = [
    'Not at all',
    'Less than a day or two',
    'Several days',
    'More than half the days',
    'Nearly every day'
];

interface AssessmentFormProps {
    // No props needed for live version
}

const ProgressTracker = ({ current, total }: { current: number, total: number }) => {
    const percentage = ((current + 1) / total) * 100;
    return (
        <div className="w-full bg-stone-200 rounded-full h-2.5 mb-8">
            <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
    );
};

const AssessmentForm: React.FC<AssessmentFormProps> = () => {
    const [step, setStep] = useState(0); // 0 = user details, 1+ = assessment sections
    const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', email: '' });
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUserDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const visibleSections = useMemo(() => {
        return assessmentSections.filter(section => {
            const hasVisibleQuestions = section.questions.some(q => {
                 if (!q.condition) return true;
                 const { triggerIds, requiredValues } = q.condition;
                 return triggerIds.some(id => requiredValues.includes(answers[id]));
            });
            return hasVisibleQuestions;
       });
    }, [answers]);
    
    const getVisibleQuestionsForSection = (section: (typeof assessmentSections)[0]) => {
        if (!section) return [];
        return section.questions.filter(q => {
            if (!q.condition) return true;
            const { triggerIds, requiredValues } = q.condition;
            return triggerIds.some(id => requiredValues.includes(answers[id]));
        });
    };
    
    useEffect(() => {
        if (step > 0 && step > visibleSections.length) {
            setStep(visibleSections.length);
        }
    }, [visibleSections, step]);


    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => {
       setStep(s => Math.max(0, s - 1));
    };

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
                let errorMessage = `Server error: ${response.status} ${response.statusText}`;
                const errorBody = await response.text(); // Read the body ONCE as text.
                try {
                    // Try to parse the text as JSON.
                    const errorData = JSON.parse(errorBody);
                    errorMessage = errorData.error || errorData.details || errorData.message || 'An unknown error occurred.';
                } catch (parseError) {
                    // If parsing fails, the body was not JSON.
                    console.error("Could not parse error response as JSON, using raw text.", parseError);
                    if (errorBody && errorBody.trim().startsWith('<')) { // Check for HTML
                        errorMessage = `An error occurred. The server returned an HTML error page. Please check the Network tab in your browser's developer tools for details.`;
                    } else if (errorBody) {
                        errorMessage += `\n\nDetails: ${errorBody.substring(0, 500)}`;
                    }
                }
                throw new Error(errorMessage);
            }
    
            const result = await response.json();
            
            // Redirect to the report page with the new submission ID
            window.location.href = `/?submissionId=${result.submissionId}`;
    
        } catch (error: any) {
            console.error("Submission failed:", error);
            alert(`An error occurred during submission. Please try again.\n\nDetails: ${error.message}`);
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
        return visibleQuestions.every(q => answers[q.id] !== undefined);
    };


    if (step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-4 font-inter">
                <div className="max-w-2xl w-full text-center bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-stone-200">
                     <FeatherIcon className="h-16 w-16 mx-auto text-sky-600 mb-4" />
                     <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-800 mb-3 tracking-tight">Mental Wellness Assessment</h1>
                     <p className="text-lg text-stone-600 font-light mb-8">Begin your confidential self-assessment. Your personalized report will be generated upon completion.</p>

                    <form onSubmit={e => { e.preventDefault(); nextStep(); }} className="space-y-6">
                        <input type="text" name="firstName" placeholder="First Name (Required)" value={userDetails.firstName} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg border-2 border-stone-300 rounded-full focus:ring-sky-500 focus:border-sky-500"/>
                        <input type="text" name="lastName" placeholder="Last Name" value={userDetails.lastName} onChange={handleUserDetailChange} className="w-full px-5 py-3 text-lg border-2 border-stone-300 rounded-full focus:ring-sky-500 focus:border-sky-500"/>
                        <input type="email" name="email" placeholder="Email (Required)" value={userDetails.email} onChange={handleUserDetailChange} required className="w-full px-5 py-3 text-lg border-2 border-stone-300 rounded-full focus:ring-sky-500 focus:border-sky-500"/>
                        <button type="submit" disabled={!isCurrentSectionAnswered()} className="px-8 py-4 bg-sky-600 text-white font-bold rounded-full shadow-lg hover:bg-sky-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            Start Assessment
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const currentSectionIndex = step - 1;
    const currentVisibleSection = visibleSections[currentSectionIndex];
    const visibleQuestions = getVisibleQuestionsForSection(currentVisibleSection);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
            <div className="max-w-4xl w-full bg-white p-8 sm:p-12 my-8 rounded-3xl shadow-2xl border border-stone-200">
                <ProgressTracker current={currentSectionIndex} total={visibleSections.length} />
                <p className="text-stone-600 mb-8 text-lg">{currentVisibleSection.description}</p>
                <form onSubmit={handleSubmit} className="space-y-10">
                    {visibleQuestions.map((q, index) => (
                        <fieldset key={q.id} className="p-4 border-l-4 border-stone-200">
                            <legend className="text-lg font-semibold text-stone-800">{`${index + 1}. ${q.text}`}</legend>
                            <div className="mt-4 space-y-3">
                                {answerOptions.map(opt => (
                                    <label key={opt} className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${answers[q.id] === opt ? 'bg-sky-50 border-sky-500 shadow-sm' : 'border-stone-200 hover:border-stone-400'}`}>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={opt}
                                            checked={answers[q.id] === opt}
                                            onChange={() => handleAnswerChange(q.id, opt)}
                                            className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-gray-300"
                                            required={q.mandatory}
                                        />
                                        <span className={`ml-4 text-base ${answers[q.id] === opt ? 'font-semibold text-stone-800' : 'text-stone-700'}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    ))}
                    <div className="flex justify-between mt-12 pt-6 border-t border-stone-200">
                        <button type="button" onClick={prevStep} className="px-6 py-3 bg-stone-200 text-stone-800 font-semibold rounded-full hover:bg-stone-300 transition-colors">Back</button>
                        {currentSectionIndex < visibleSections.length - 1 ? (
                            <button type="button" onClick={nextStep} disabled={!isCurrentSectionAnswered()} className="px-6 py-3 bg-sky-600 text-white font-bold rounded-full shadow-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                        ) : (
                            <button type="submit" disabled={isSubmitting || !isCurrentSectionAnswered()} className="px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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