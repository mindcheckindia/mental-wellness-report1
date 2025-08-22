
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

export interface AssessmentSubmission {
  submissionId: string;
  firstName: string;
  lastName: string;
  email: string;
  assessmentDate: string;
  answers: { [questionId: string]: any };
}


// --- SCORING AND INTERPRETATION LOGIC ---

// --- T-Score conversion tables (from PROMIS PDFs) ---
const depressionTScoreMap: { [raw: number]: number } = { 8: 37.1, 9: 43.3, 10: 46.2, 11: 48.2, 12: 49.8, 13: 51.2, 14: 52.3, 15: 53.4, 16: 54.3, 17: 55.3, 18: 56.2, 19: 57.1, 20: 57.9, 21: 58.8, 22: 59.7, 23: 60.7, 24: 61.6, 25: 62.5, 26: 63.5, 27: 64.4, 28: 65.4, 29: 66.4, 30: 67.4, 31: 68.3, 32: 69.3, 33: 70.4, 34: 71.4, 35: 72.5, 36: 73.6, 37: 74.8, 38: 76.2, 39: 77.9, 40: 81.1 };
const angerTScoreMap: { [raw: number]: number } = { 5: 32.9, 6: 38.1, 7: 41.3, 8: 44.0, 9: 46.3, 10: 48.4, 11: 50.5, 12: 52.6, 13: 54.7, 14: 56.7, 15: 58.8, 16: 60.8, 17: 62.9, 18: 65.0, 19: 67.2, 20: 69.4, 21: 71.7, 22: 74.1, 23: 76.8, 24: 79.7, 25: 83.3 };
const anxietyTScoreMap: { [raw: number]: number } = { 7: 36.3, 8: 42.1, 9: 44.7, 10: 46.7, 11: 48.4, 12: 49.9, 13: 51.3, 14: 52.6, 15: 53.8, 16: 55.1, 17: 56.3, 18: 57.6, 19: 58.8, 20: 60.0, 21: 61.3, 22: 62.6, 23: 63.8, 24: 65.1, 25: 66.4, 26: 67.7, 27: 68.9, 28: 70.2, 29: 71.5, 30: 72.9, 31: 74.3, 32: 75.8, 33: 77.4, 34: 79.5, 35: 82.7 };
const sleepTScoreMap: { [raw: number]: number } = { 8: 28.9, 9: 33.1, 10: 35.9, 11: 38.0, 12: 39.8, 13: 41.4, 14: 42.9, 15: 44.2, 16: 45.5, 17: 46.7, 18: 47.9, 19: 49.0, 20: 50.1, 21: 51.2, 22: 52.2, 23: 53.3, 24: 54.3, 25: 55.3, 26: 56.3, 27: 57.3, 28: 58.3, 29: 59.4, 30: 60.4, 31: 61.5, 32: 62.6, 33: 63.7, 34: 64.9, 35: 66.1, 36: 67.5, 37: 69.0, 38: 70.8, 39: 73.0, 40: 76.5 };

const convertRawToTScore = (rawScore: number, tScoreMap: { [key: number]: number }): number | null => {
    return tScoreMap[rawScore] ?? null;
};


// --- Answer to Value Conversion ---
const getBaseValue = (answer: any): number | null => {
    if (answer === null || answer === undefined || answer === '') return null;
    const directNumber = parseInt(answer, 10);
    if (!isNaN(directNumber)) return directNumber;

    // Fallback for text-based answers (less common with new form structure but good for robustness)
    const lowerAnswer = String(answer).toLowerCase();
    const valueMap: { [key: string]: number } = {
        'not at all': 0, 'none': 0,
        'slight or rare': 1, 'less than a day or two': 1, 'rarely': 1, 'a little bit': 1, 'mild': 1,
        'mild or several days': 2, 'several days': 2, 'sometimes': 2, 'fair': 2,
        'moderate': 3, 'more than half the days': 3, 'often': 3, 'quite a bit': 3,
        'severe': 4, 'nearly every day': 4, 'always': 4, 'very much': 4, 'extreme': 4
    };
    for (const key in valueMap) {
        if (lowerAnswer.includes(key)) {
            return valueMap[key];
        }
    }
    return null;
};

const answerToPROMISValue = (answer: any, isReversed: boolean = false): number | null => {
    const baseValue = getBaseValue(answer);
    if (baseValue === null) return null;
    // PROMIS Short forms use 1-5 scale. Our questions are aligned with 0-4 base values.
    const score = baseValue + 1;
    return isReversed ? 6 - score : score;
};

const answerToPHQ15Value = (answer: any): number | null => {
    // PHQ-15 uses a 0-2 scale
    const baseValue = getBaseValue(answer);
    if (baseValue === null) return null;
    if (baseValue === 0) return 0; // Not bothered at all
    if (baseValue === 1) return 1; // Bothered a little
    return 2; // Bothered a lot (maps from base values 2, 3, 4)
};

const answerToDefaultValue = (answer: any): number | null => {
    return getBaseValue(answer);
};

// --- Scoring Methodologies ---
type ScoringMethod = 'SUM' | 'MAX_THRESHOLD' | 'AVERAGE';
type AnswerMapping = 'PROMIS' | 'PHQ15' | 'DEFAULT';
type TScoreType = 'DEPRESSION' | 'ANGER' | 'ANXIETY' | 'SLEEP' | 'NONE';

interface QuestionConfig {
  id: string;
  isCore?: boolean; // Mark questions that are part of the official short form for T-Scoring
}

interface DomainConfig {
  name: string;
  about: string;
  aboutLink: string;
  questionIds: QuestionConfig[];
  scoringMethod: ScoringMethod;
  answerMapping: AnswerMapping;
  tScoreType: TScoreType;
  referenceIntervals: ReferenceInterval[];
  individualsExperienced: { name: string; link: string; }[];
  intendedQuestionCount: number; 
}

// --- DOMAIN CONFIGURATION ---
const domainConfigs: DomainConfig[] = [
    { 
        name: 'Depression',
        scoringMethod: 'SUM',
        answerMapping: 'PROMIS',
        tScoreType: 'DEPRESSION',
        intendedQuestionCount: 8, // Based on the 8-item PROMIS Short Form
        questionIds: [
            { id: 'dep_1' }, { id: 'dep_2' },
            // Level 2 Questions map to the PROMIS 8b form
            { id: 'dep_3', isCore: true }, { id: 'dep_4', isCore: true }, { id: 'dep_5', isCore: true }, 
            { id: 'dep_6', isCore: true }, { id: 'dep_7', isCore: true }, { id: 'dep_8', isCore: true }, 
            { id: 'dep_9', isCore: true }, { id: 'dep_10', isCore: true }
        ],
        referenceIntervals: [ // Based on T-Scores
            { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' },
            { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
            { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' },
            { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
        ],
        about: 'Assesses core symptoms of depression based on the PROMIS Emotional Distress–Depression–Short Form. The score is a standardized T-Score for clinical accuracy.',
        aboutLink: 'https://www.who.int/news-room/fact-sheets/detail/depression',
        individualsExperienced: [
            { name: 'Deepika Padukone', link: 'https://www.onlymyhealth.com/deepika-padukone-on-depression-and-tips-to-overcome-suicidal-thoughts-12977825587' },
            { name: 'Abraham Lincoln', link: 'https://en.wikipedia.org/wiki/Health_of_Abraham_Lincoln#Depression' },
        ],
    },
    { 
        name: 'Anger',
        scoringMethod: 'SUM',
        answerMapping: 'PROMIS',
        tScoreType: 'ANGER',
        intendedQuestionCount: 5, // Based on the 5-item PROMIS Short Form
        questionIds: [
            { id: 'ang_1' },
            { id: 'ang_2', isCore: true }, { id: 'ang_3', isCore: true }, { id: 'ang_4', isCore: true }, 
            { id: 'ang_5', isCore: true }, { id: 'ang_6', isCore: true }
        ],
        referenceIntervals: [ // Based on T-Scores
            { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' },
            { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
            { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' },
            { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
        ],
        about: 'Measures feelings of anger based on the PROMIS Emotional Distress–Anger–Short Form. The score is a standardized T-Score for clinical accuracy.',
        aboutLink: 'https://www.apa.org/topics/anger/control',
        individualsExperienced: [
            { name: 'Russell Brand', link: 'https://www.healthline.com/health/celebrities-with-bipolar-disorder' },
            { name: 'Kanye West', link: 'https://www.biography.com/musicians/kanye-west-mental-health' }
        ],
    },
    { 
        name: 'Mania',
        scoringMethod: 'SUM',
        answerMapping: 'DEFAULT',
        tScoreType: 'NONE',
        intendedQuestionCount: 5, // Based on the 5-item ASRM
        questionIds: [
            { id: 'man_1' }, { id: 'man_2' },
            { id: 'man_3', isCore: true }, { id: 'man_4', isCore: true }, { id: 'man_5', isCore: true }, 
            { id: 'man_6', isCore: true }, { id: 'man_7', isCore: true }
        ],
        referenceIntervals: [ // Corrected based on ASRM PDF
            { label: 'Low Probability', min: 0, max: 5, color: 'bg-green-500' },
            { label: 'High Probability', min: 6, max: null, color: 'bg-red-500' }
        ],
        about: 'Assesses symptoms of mania or hypomania using the Altman Self-Rating Mania Scale (ASRM). A score of 6 or higher suggests a high probability of a manic or hypomanic condition.',
        aboutLink: 'https://www.nimh.nih.gov/health/topics/bipolar-disorder',
        individualsExperienced: [
            { name: 'Mariah Carey', link: 'https://www.webmd.com/bipolar-disorder/ss/slideshow-celebrities-bipolar-disorder' },
            { name: 'Demi Lovato', link: 'https://people.com/health/demi-lovato-relieved-to-be-diagnosed-bipolar/' }
        ],
    },
    { 
        name: 'Anxiety',
        scoringMethod: 'SUM',
        answerMapping: 'PROMIS',
        tScoreType: 'ANXIETY',
        intendedQuestionCount: 7, // Based on the 7-item PROMIS Short Form
        questionIds: [
            { id: 'anx_1' }, { id: 'anx_2' }, { id: 'anx_3' },
            { id: 'anx_4', isCore: true }, { id: 'anx_5', isCore: true }, { id: 'anx_6', isCore: true }, 
            { id: 'anx_7', isCore: true }, { id: 'anx_8', isCore: true }, { id: 'anx_9', isCore: true }, 
            { id: 'anx_10', isCore: true }
        ],
        referenceIntervals: [ // Based on T-Scores
            { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' },
            { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
            { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' },
            { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
        ],
        about: 'Evaluates common symptoms of anxiety based on the PROMIS Emotional Distress–Anxiety–Short Form. The score is a standardized T-Score for clinical accuracy.',
        aboutLink: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
        individualsExperienced: [
            { name: 'Adele', link: 'https://www.gmanetwork.com/news/lifestyle/healthandwellness/806235/adele-says-working-out-helped-with-her-anxiety-it-was-never-about-losing-weight/story/' },
            { name: 'Karan Johar', link: 'https://yourdost.com/blog/2016/09/celebrity-depression-karan-johar.html' },
        ],
    },
    { 
        name: 'Somatic Symptoms',
        scoringMethod: 'SUM',
        answerMapping: 'PHQ15',
        tScoreType: 'NONE',
        intendedQuestionCount: 15, // Based on PHQ-15
        questionIds: [
            { id: 'som_1' }, { id: 'som_2' },
            { id: 'som_3', isCore: true }, { id: 'som_4', isCore: true }, { id: 'som_5', isCore: true },
            { id: 'som_6', isCore: true }, { id: 'som_7', isCore: true }, { id: 'som_8', isCore: true },
            { id: 'som_9', isCore: true }, { id: 'som_10', isCore: true }, { id: 'som_11', isCore: true },
            { id: 'som_12', isCore: true }, { id: 'som_13', isCore: true }, { id: 'som_14', isCore: true },
            { id: 'som_15', isCore: true }, { id: 'som_16', isCore: true }, { id: 'som_17', isCore: true }
        ],
        referenceIntervals: [ // Corrected based on PHQ-15 PDF
            { label: 'Minimal', min: 0, max: 4, color: 'bg-green-500' },
            { label: 'Low', min: 5, max: 9, color: 'bg-yellow-500' },
            { label: 'Medium', min: 10, max: 14, color: 'bg-orange-500' },
            { label: 'High', min: 15, max: null, color: 'bg-red-500' }
        ],
        about: 'Focuses on physical symptoms that may be related to psychological distress, based on the Patient Health Questionnaire 15 (PHQ-15).',
        aboutLink: 'https://www.psychiatry.org/patients-families/somatic-symptom-disorder/what-is-somatic-symptom-disorder',
        individualsExperienced: [
            { name: 'Lady Gaga', link: 'https://ukfibromyalgia.com/blog/celebrities-with-fibromyalgia-lady-gaga' },
            { name: 'Oprah Winfrey', link: 'https://www.cbsnews.com/news/oprah-reports-on-childhood-traumas-long-term-effects/' }
        ],
    },
    { 
        name: 'Suicidal Ideation',
        scoringMethod: 'MAX_THRESHOLD',
        answerMapping: 'DEFAULT',
        tScoreType: 'NONE',
        intendedQuestionCount: 1,
        questionIds: [{ id: 'sui_1', isCore: true }],
        referenceIntervals: [
            { label: 'Within normal limits', min: 0, max: 0, color: 'bg-green-500' },
            { label: 'Further inquiry indicated', min: 1, max: null, color: 'bg-red-500' }
        ],
        about: 'Screens for thoughts of self-harm. A score of "Slight" or greater indicates need for further inquiry.',
        aboutLink: 'https://988lifeline.org/',
        individualsExperienced: [
            { name: 'J.K. Rowling', link: 'https://www.cbsnews.com/news/potter-creator-once-contemplated-suicide/' },
            { name: 'Jon Hamm', link: 'https://sunlightrecovery.com/jon-hamm-chronic-depression/' }
        ],
    },
    { 
        name: 'Psychosis',
        scoringMethod: 'MAX_THRESHOLD',
        answerMapping: 'DEFAULT',
        tScoreType: 'NONE',
        intendedQuestionCount: 2,
        questionIds: [{ id: 'psy_1', isCore: true }, { id: 'psy_2', isCore: true }],
        referenceIntervals: [
            { label: 'Within normal limits', min: 0, max: 0, color: 'bg-green-500' },
            { label: 'Further inquiry indicated', min: 1, max: null, color: 'bg-red-500' }
        ],
        about: 'Identifies unusual thoughts or perceptions. A score of "Slight" or greater indicates need for further inquiry.',
        aboutLink: 'https://www.nimh.nih.gov/health/topics/schizophrenia/raise/what-is-psychosis',
        individualsExperienced: [
            { name: 'John Nash', link: 'https://livingwithschizophreniauk.org/john-nash/' },
            { name: 'Brian Wilson', link: 'https://www.biography.com/musicians/brian-wilson-mental-health-illness' }
        ],
    },
    { 
        name: 'Sleep Problems',
        scoringMethod: 'SUM',
        answerMapping: 'PROMIS',
        tScoreType: 'SLEEP',
        intendedQuestionCount: 8, // Based on the 8-item PROMIS Short Form
        questionIds: [
            { id: 'slp_1' },
            { id: 'slp_2', isCore: true }, { id: 'slp_3', isCore: true }, { id: 'slp_4', isCore: true },
            { id: 'slp_5', isCore: true }, { id: 'slp_6', isCore: true }, { id: 'slp_7', isCore: true },
            { id: 'slp_8', isCore: true }, { id: 'slp_9', isCore: true }
        ],
        referenceIntervals: [ // Based on T-Scores
            { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' },
            { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
            { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' },
            { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
        ],
        about: 'Evaluates sleep quality based on the 8-item PROMIS Sleep Disturbance scale. The score is a standardized T-Score for clinical accuracy.',
        aboutLink: 'https://www.sleepfoundation.org/insomnia',
        individualsExperienced: [
            { name: 'Jimmy Kimmel', link: 'https://www.rxwiki.com/slideshow/celebrities-who-have-trouble-sleeping/jimmy-kimmel' },
        ],
    },
    { 
        name: 'Memory',
        scoringMethod: 'MAX_THRESHOLD',
        answerMapping: 'DEFAULT',
        tScoreType: 'NONE',
        intendedQuestionCount: 1,
        questionIds: [{ id: 'mem_1', isCore: true }],
        referenceIntervals: [
            { label: 'Within normal limits', min: 0, max: 1, color: 'bg-green-500' },
            { label: 'Further inquiry indicated', min: 2, max: null, color: 'bg-red-500' }
        ],
        about: 'Assesses memory problems. A score of "Mild" or greater indicates need for further inquiry.',
        aboutLink: 'https://www.nia.nih.gov/health/memory-forgetfulness-and-aging-whats-normal-and-whats-not',
        individualsExperienced: [
            { name: 'Ronald Reagan', link: 'https://optoceutics.com/famous-people-celebrities-singers-with-alzheimers/' },
        ],
    },
    { 
        name: 'Repetitive Thoughts and Behaviours',
        scoringMethod: 'AVERAGE',
        answerMapping: 'DEFAULT',
        tScoreType: 'NONE',
        intendedQuestionCount: 5, // Based on 5-item FOCI scale
        questionIds: [
            { id: 'rep_1' }, { id: 'rep_2' },
            { id: 'rep_3', isCore: true }, { id: 'rep_4', isCore: true }, { id: 'rep_5', isCore: true }, 
            { id: 'rep_6', isCore: true }, { id: 'rep_7', isCore: true }
        ],
        referenceIntervals: [ // Based on average of 0-4 scores
            { label: 'None', min: 0, max: 0.9, color: 'bg-green-500' },
            { label: 'Mild', min: 1, max: 1.9, color: 'bg-yellow-500' },
            { label: 'Moderate', min: 2, max: 2.9, color: 'bg-orange-500' },
            { label: 'Severe', min: 3, max: 3.9, color: 'bg-red-500' },
            { label: 'Extreme', min: 4, max: 4, color: 'bg-red-500' }
        ],
        about: 'Measures severity of repetitive thoughts and behaviors based on the Florida Obsessive-Compulsive Inventory (FOCI) Severity Scale.',
        aboutLink: 'https://iocdf.org/about-ocd/',
        individualsExperienced: [
            { name: 'Howie Mandel', link: 'https://en.wikipedia.org/wiki/Here%27s_the_Deal:_Don%27t_Touch_Me' },
        ],
    },
    { 
        name: 'Dissociation',
        scoringMethod: 'MAX_THRESHOLD',
        answerMapping: 'DEFAULT',
        tScoreType: 'NONE',
        intendedQuestionCount: 1,
        questionIds: [{ id: 'dis_1', isCore: true }],
        referenceIntervals: [
            { label: 'Within normal limits', min: 0, max: 1, color: 'bg-green-500' },
            { label: 'Further inquiry indicated', min: 2, max: null, color: 'bg-red-500' }
        ],
        about: 'Measures experiences of detachment from reality. A score of "Mild" or greater indicates need for further inquiry.',
        aboutLink: 'https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Dissociative-Disorders',
        individualsExperienced: [
            { name: 'Jim Carrey', link: 'https://psychprofessionals.com.au/jim-carrey-on-overcoming-depression/' },
        ],
    },
    { 
        name: 'Personality Functioning',
        scoringMethod: 'MAX_THRESHOLD',
        answerMapping: 'DEFAULT',
        tScoreType: 'NONE',
        intendedQuestionCount: 2,
        questionIds: [{ id: 'per_1', isCore: true }, { id: 'per_2', isCore: true }],
        referenceIntervals: [
            { label: 'Within normal limits', min: 0, max: 1, color: 'bg-green-500' },
            { label: 'Further inquiry indicated', min: 2, max: null, color: 'bg-red-500' }
        ],
        about: 'Examines long-term patterns in self-perception and relationships. A score of "Mild" or greater indicates need for further inquiry.',
        aboutLink: 'https://www.nimh.nih.gov/health/topics/borderline-personality-disorder',
        individualsExperienced: [
            { name: 'Pete Davidson', link: 'https://en.wikipedia.org/wiki/Pete_Davidson#Health' },
        ],
    },
];

const getAnswerValue = (answer: any, mapping: AnswerMapping, questionDetails: any): number | null => {
    // For sleep questions, some are reverse-scored
    if (mapping === 'PROMIS' && (questionDetails.reverse || (questionDetails.customAnswers && questionDetails.customAnswers.isReversed))) {
        return answerToPROMISValue(answer, true);
    }

    switch (mapping) {
        case 'PROMIS': return answerToPROMISValue(answer);
        case 'PHQ15': return answerToPHQ15Value(answer);
        default: return answerToDefaultValue(answer);
    }
};

const MINIMUM_COMPLETION_RATIO = 0.75;

function calculateDomainResult(config: DomainConfig, allAnswers: { [questionId: string]: any }): { rawScore: number | null, finalScore: number | null, tScore: number | null } {
    const coreQuestionIds = config.questionIds.filter(q => q.isCore);

    const numericAnswers = coreQuestionIds
        .map(q => getAnswerValue(allAnswers[q.id], config.answerMapping, q))
        .filter((val): val is number => val !== null);

    if ((numericAnswers.length / config.intendedQuestionCount) < MINIMUM_COMPLETION_RATIO) {
        return { rawScore: null, finalScore: null, tScore: null };
    }

    let rawScore: number | null = null;
    let tScore: number | null = null;
    let finalScore: number | null = null;

    if (config.scoringMethod === 'MAX_THRESHOLD') {
        rawScore = numericAnswers.length > 0 ? Math.max(...numericAnswers) : 0;
        finalScore = rawScore;
    } else {
        const sum = numericAnswers.reduce((acc, val) => acc + val, 0);
        
        if (config.scoringMethod === 'AVERAGE') {
            rawScore = parseFloat((sum / numericAnswers.length).toFixed(1));
            finalScore = rawScore;
        } else { // SUM
            const proratedRawScore = Math.round((sum / numericAnswers.length) * config.intendedQuestionCount);
            rawScore = proratedRawScore;
            
            if (config.tScoreType !== 'NONE') {
                const tMap = {
                    'DEPRESSION': depressionTScoreMap,
                    'ANGER': angerTScoreMap,
                    'ANXIETY': anxietyTScoreMap,
                    'SLEEP': sleepTScoreMap
                }[config.tScoreType];
                tScore = convertRawToTScore(proratedRawScore, tMap);
                finalScore = tScore;
            } else {
                finalScore = rawScore;
            }
        }
    }

    return { rawScore, finalScore, tScore };
}

function getInterpretation(score: number | null, intervals: ReferenceInterval[]): string {
    if (score === null) {
        return "Incomplete Assessment";
    }
    for (const interval of intervals) {
        if (score >= interval.min && (interval.max === null || score <= interval.max)) {
            return interval.label;
        }
    }
    return "Not Classified";
}

export function generateReportFromSubmission(submission: AssessmentSubmission): IndividualData {
    const calculatedDomains: Domain[] = domainConfigs.map(config => {
        const { rawScore, finalScore, tScore } = calculateDomainResult(config, submission.answers);
        const interpretation = getInterpretation(finalScore, config.referenceIntervals);

        return {
            name: config.name,
            about: config.about,
            aboutLink: config.aboutLink,
            score: finalScore,
            rawScore: rawScore,
            tScore: tScore,
            userInterpretation: interpretation,
            result: interpretation,
            referenceIntervals: config.referenceIntervals,
            individualsExperienced: config.individualsExperienced,
            insightsAndSupport: '',
        };
    });

    return {
        individualId: submission.submissionId,
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        assessmentDate: submission.assessmentDate,
        domains: calculatedDomains,
    };
}
