
import { AnswerOption, AssessmentSection } from '../types';

// Thresholds for showing Level 2 questions based on Level 1 answers
const LEVEL_2_THRESHOLD = 2; // "Mild" or greater

// --- Standard Answer Sets ---
const LEVEL_1_ANSWERS: AnswerOption[] = [
    { text: 'Not at all', value: 0 },
    { text: 'Rarely (less than a day or two)', value: 1 },
    { text: 'Sometimes (several days)', value: 2 },
    { text: 'Often (more than half the days)', value: 3 },
    { text: 'Nearly every day', value: 4 },
];

const PROMIS_ANSWERS: AnswerOption[] = [
    { value: 1, text: "Never" },
    { value: 2, text: "Rarely" },
    { value: 3, text: "Sometimes" },
    { value: 4, text: "Often" },
    { value: 5, text: "Always" },
];

const PHQ15_ANSWERS: AnswerOption[] = [
    { value: 0, text: "Not bothered at all" },
    { value: 1, text: "Bothered a little" },
    { value: 2, text: "Bothered a lot" }
];

// --- Clinically-Accurate Assessment Structure with User-Friendly Language ---
export const assessmentSections: AssessmentSection[] = [
    {
        title: 'Your Mood & Interest',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'dep_l1_1', text: 'How often have you found it hard to get excited about things you usually enjoy?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'dep_l1_2', text: 'How often have you felt down, hopeless, or noticed a persistent low mood?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            
            { id: 'dep_l2_1', text: 'Over the last 7 days, how often have you felt like you are not good enough?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_2', text: 'Over the last 7 days, how often have you felt like there was nothing to look forward to?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_3', text: 'Over the last 7 days, how often have you felt helpless?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_4', text: 'Over the last 7 days, how often have you felt sad?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_5', text: 'Over the last 7 days, how often have you felt like a failure?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_6', text: 'Over the last 7 days, how often have you felt depressed?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_7', text: 'Over the last 7 days, how often have you felt unhappy?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_8', text: 'Over the last 7 days, how often have you felt hopeless?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
        ]
    },
    {
        title: 'Feelings of Frustration',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'ang_l1_1', text: 'Have you been feeling more irritable, easily annoyed, or angry than usual?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },

            { id: 'ang_l2_1', text: 'Over the last 7 days, how often have you been more irritable than people around you might have known?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_2', text: 'Over the last 7 days, how often have you felt angry?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_3', text: 'Over the last 7 days, how often have you felt like you were ready to explode?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_4', text: 'Over the last 7 days, how often have you felt grouchy?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_5', text: 'Over the last 7 days, how often have you felt annoyed?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
        ]
    },
    {
        title: 'Your Energy & Drive',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the past week...',
        questions: [
            { id: 'man_l1_1', text: 'Have you been sleeping less but still feeling full of energy?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'man_l1_2', text: 'Have you been starting more new projects or taking more risks than you typically would?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            
            { id: 'man_l2_1', text: 'Thinking about the past week, how would you describe your mood?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't felt unusually happy or cheerful." }, { value: 1, text: "I've occasionally felt happier than usual." }, { value: 2, text: "I've often felt happier than usual." }, { value: 3, text: "I've felt happier most of the time." }, { value: 4, text: "I've felt happier and more cheerful constantly." },
            ]},
            { id: 'man_l2_2', text: 'Thinking about the past week, how has your self-confidence been?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't felt more self-confident than usual." }, { value: 1, text: "I've occasionally felt more self-confident." }, { value: 2, text: "I've often felt more self-confident." }, { value: 3, text: "I've frequently felt more self-confident." }, { value: 4, text: "I've felt extremely self-confident all the time." },
            ]},
            { id: 'man_l2_3', text: 'Thinking about the past week, how would you describe your need for sleep?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't needed less sleep than usual." }, { value: 1, text: "I've occasionally needed less sleep." }, { value: 2, text: "I've often needed less sleep." }, { value: 3, text: "I've frequently needed less sleep." }, { value: 4, text: "I can go without sleep and still not feel tired." },
            ]},
            { id: 'man_l2_4', text: 'Thinking about the past week, how much have you been talking?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't been talking more than usual." }, { value: 1, text: "I've occasionally talked more than usual." }, { value: 2, text: "I've often talked more than usual." }, { value: 3, text: "I've frequently talked more than usual." }, { value: 4, text: "I've been talking constantly and can't be interrupted." },
            ]},
            { id: 'man_l2_5', text: 'Thinking about the past week, how would you describe your activity level (socially, at work, etc.)?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't been more active than usual." }, { value: 1, text: "I've occasionally been more active." }, { value: 2, text: "I've often been more active." }, { value: 3, text: "I've frequently been more active." }, { value: 4, text: "I'm constantly active or on the go." },
            ]},
        ]
    },
    {
        title: 'Feelings of Worry',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'anx_l1_1', text: 'Have you been feeling nervous, anxious, worried, or on edge?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'anx_l1_2', text: 'Have you experienced moments of panic or intense fear?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'anx_l1_3', text: 'Have you found yourself actively avoiding situations that make you anxious?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },

            { id: 'anx_l2_1', text: 'Over the last 7 days, how often have you felt fearful?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_2', text: 'Over the last 7 days, how often have you felt anxious?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_3', text: 'Over the last 7 days, how often have you felt worried?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_4', text: 'Over the last 7 days, how often have you found it hard to focus on anything other than your anxiety?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_5', text: 'Over the last 7 days, how often have you felt nervous?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_6', text: 'Over the last 7 days, how often have you felt uneasy?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_7', text: 'Over the last 7 days, how often have you felt tense?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
        ]
    },
    {
        title: 'Body & Mind Connection',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'som_l1_1', text: 'Have you been bothered by physical aches and pains (like headaches or backaches) that you couldn\'t quite explain?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'som_l1_2', text: 'Have you felt that your physical health concerns weren\'t being taken seriously by others?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            
            { id: 'som_l2_1', text: 'During the past 7 days, how much have you been bothered by stomach pain?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_2', text: 'During the past 7 days, how much have you been bothered by back pain?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_3', text: 'During the past 7 days, how much have you been bothered by pain in your arms, legs, or joints?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_4', text: 'During the past 7 days, how much have you been bothered by menstrual cramps or other period-related issues? (If not applicable, please select "Not bothered")', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_5', text: 'During the past 7 days, how much have you been bothered by headaches?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_6', text: 'During the past 7 days, how much have you been bothered by chest pain?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_7', text: 'During the past 7 days, how much have you been bothered by dizziness?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_8', text: 'During the past 7 days, how much have you been bothered by fainting spells?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_9', text: 'During the past 7 days, how much have you been bothered by feeling your heart pound or race?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_10', text: 'During the past 7 days, how much have you been bothered by shortness of breath?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_11', text: 'During the past 7 days, how much have you been bothered by pain or problems during sexual intercourse?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_12', text: 'During the past 7 days, how much have you been bothered by constipation, loose bowels, or diarrhea?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_13', text: 'During the past 7 days, how much have you been bothered by nausea, gas, or indigestion?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_14', text: 'During the past 7 days, how much have you been bothered by feeling tired or having low energy?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_15', text: 'During the past 7 days, how much have you been bothered by trouble sleeping?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
        ]
    },
    {
        title: 'Thoughts of Self-Harm',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'sui_l1_1', text: 'Have you had any thoughts of hurting yourself?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
        ]
    },
    {
        title: 'Your Perceptions',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'psy_l1_1', text: 'Have you heard things other people couldn’t hear, like voices, when no one was around?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'psy_l1_2', text: 'Have you ever felt that people could hear your thoughts, or that you could hear what they were thinking?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
        ]
    },
    {
        title: 'Your Sleep Quality',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'slp_l1_1', text: 'How much have problems with sleep affected your overall quality of life?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            
            { id: 'slp_l2_1', text: 'Over the last 7 days, was your sleep restless?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 1, text: 'Not at all' }, { value: 2, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 4, text: 'Quite a bit' }, { value: 5, text: 'Very much' } ]},
            { id: 'slp_l2_2', text: 'Over the last 7 days, were you satisfied with your sleep?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 5, text: 'Not at all' }, { value: 4, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 2, text: 'Quite a bit' }, { value: 1, text: 'Very much' } ]},
            { id: 'slp_l2_3', text: 'Over the last 7 days, was your sleep refreshing?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 5, text: 'Not at all' }, { value: 4, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 2, text: 'Quite a bit' }, { value: 1, text: 'Very much' } ]},
            { id: 'slp_l2_4', text: 'Over the last 7 days, did you have difficulty falling asleep?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 1, text: 'Not at all' }, { value: 2, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 4, text: 'Quite a bit' }, { value: 5, text: 'Very much' } ]},
            { id: 'slp_l2_5', text: 'Over the last 7 days, how often did you have trouble staying asleep?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'slp_l2_6', text: 'Over the last 7 days, how often did you have trouble sleeping?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'slp_l2_7', text: 'Over the last 7 days, how often did you get enough sleep?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 5, text: "Never" }, { value: 4, text: 'Rarely' }, { value: 3, text: 'Sometimes' }, { value: 2, text: 'Often' }, { value: 1, text: 'Always' } ]},
            { id: 'slp_l2_8', text: 'Over the last 7 days, how would you rate your sleep quality overall?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 5, text: 'Very Poor' }, { value: 4, text: 'Poor' }, { value: 3, text: 'Fair' }, { value: 2, text: 'Good' }, { value: 1, text: 'Very Good' } ]},
        ]
    },
    {
        title: 'Your Focus & Memory',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'mem_l1_1', text: 'Have you had problems with your memory or with figuring out where you are?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
        ]
    },
    {
        title: 'Repetitive Patterns',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'rep_l1_1', text: 'Have you been bothered by unpleasant thoughts, urges, or images that repeatedly enter your mind?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'rep_l1_2', text: 'Have you felt driven to do certain things over and over again?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            
            { id: 'rep_l2_1', text: 'Over the last 7 days, how much of your day was occupied by unwanted repetitive thoughts or the urge to perform certain behaviors?', mandatory: false, condition: { triggerIds: ['rep_l1_1', 'rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 0, text: 'No time at all' }, { value: 1, text: 'A little (less than 1 hr/day)' }, { value: 2, text: 'A moderate amount (1-3 hrs/day)' }, { value: 3, text: 'A lot (3-8 hrs/day)' }, { value: 4, text: 'An extreme amount (over 8 hrs/day)' } ]},
            { id: 'rep_l2_2', text: 'How much emotional distress have these repetitive thoughts or behaviors caused you?', mandatory: false, condition: { triggerIds: ['rep_l1_1', 'rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 0, text: 'None' }, { value: 1, text: 'Mild (a little disturbing)' }, { value: 2, text: 'Moderate (disturbing but manageable)' }, { value: 3, text: 'Severe (very disturbing)' }, { value: 4, text: 'Extreme (overwhelmingly distressing)' } ]},
            { id: 'rep_l2_3', text: 'How difficult has it been to control these thoughts or behaviors?', mandatory: false, condition: { triggerIds: ['rep_l1_1', 'rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 0, text: 'Easy (complete control)' }, { value: 1, text: 'Fairly easy (much control)' }, { value: 2, text: 'Somewhat hard (moderate control)' }, { value: 3, text: 'Very hard (little control)' }, { value: 4, text: 'Impossible (no control)' } ]},
            { id: 'rep_l2_4', text: 'How often have these thoughts or behaviors caused you to avoid certain things (e.g., situations, places, people)?', mandatory: false, condition: { triggerIds: ['rep_l1_1', 'rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 0, text: 'Not at all' }, { value: 1, text: 'Mildly (occasional avoidance)' }, { value: 2, text: 'Moderately (regular avoidance)' }, { value: 3, text: 'Severely (frequent avoidance)' }, { value: 4, text: 'Extremely (nearly complete avoidance)' } ]},
            { id: 'rep_l2_5', text: 'How much have these repetitive thoughts or behaviors interfered with your daily life (e.g., school, work, social life)?', mandatory: false, condition: { triggerIds: ['rep_l1_1', 'rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [ { value: 0, text: 'No interference' }, { value: 1, text: 'Mild (slight interference)' }, { value: 2, text: 'Moderate (definite interference)' }, { value: 3, text: 'Severe (substantial interference)' }, { value: 4, text: 'Extreme (near-total interference)' } ]},
        ]
    },
    {
        title: 'Feeling Grounded',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'dis_l1_1', text: 'Have you had moments where you felt detached or distant from yourself, your body, or your surroundings?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
        ]
    },
    {
        title: 'Self & Relationships',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'per_l1_1', text: 'Have you felt unsure about who you really are or what you want out of life?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'per_l1_2', text: 'Have you felt distant from other people or found it hard to enjoy your relationships?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
        ]
    }
];
