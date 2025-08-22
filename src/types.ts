
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
  score: number | null;
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

// This interface represents the data structure needed for the scoring logic.
// It's used to bundle form answers and user details for processing.
export interface JotformSubmission {
  submissionId: string;
  firstName: string;
  lastName: string;
  email: string;
  assessmentDate: string;
  answers: { [questionId: string]: any };
}
