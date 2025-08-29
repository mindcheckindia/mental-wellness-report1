

export interface AnswerOption {
    text: string;
    value: number;
}

export interface Question {
    id: string;
    text: string;
    description?: string;
    mandatory: boolean;
    condition?: {
        triggerIds: string[];
        threshold: number;
    };
    answerOptions: AnswerOption[];
}

export interface AssessmentSection {
    title: string;
    timeframe: string;
    timeframeL2?: string;
    questions: Question[];
}

export interface ReferenceInterval {
  label: string;
  min: number;
  max: number | null;
  color: string;
}

export interface IndividualExperienced {
  name: string;
  link: string;
}

export interface Domain {
  name: string;
  about: string;
  aboutLink: string;
  result: string;
  score: number | null; // This will be the T-Score for PROMIS domains, raw score for others
  rawScore?: number | null;
  tScore?: number | null;
  userInterpretation: string;
  referenceIntervals: ReferenceInterval[];
  insightsAndSupport: string;
  individualsExperienced: IndividualExperienced[];
}

export interface IndividualData {
  individualId: string;
  firstName: string;
  lastName: string;
  email: string;
  assessmentDate: string;
  domains: Domain[];
}

export interface GlobalResource {
    text: string;
    link: string;
}
