

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
            
            { id: 'dep_l2_1', text: 'How often have you felt like you are not good enough?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_2', text: 'How often have you felt like there was nothing to look forward to?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_3', text: 'How often have you felt helpless?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_4', text: 'How often have you felt sad?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_5', text: 'How often have you felt like a failure?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_6', text: 'How often have you felt depressed?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_7', text: 'How often have you felt unhappy?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'dep_l2_8', text: 'How often have you felt hopeless?', mandatory: false, condition: { triggerIds: ['dep_l1_1', 'dep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
        ]
    },
    {
        title: 'Feelings of Frustration',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'ang_l1_1', text: 'Have you been feeling more irritable, easily annoyed, or angry than usual?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },

            { id: 'ang_l2_1', text: 'How often have you been more irritable than people around you might have known?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_2', text: 'How often have you felt angry?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_3', text: 'How often have you felt like you were ready to explode?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_4', text: 'How often have you felt grouchy?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'ang_l2_5', text: 'How often have you felt annoyed?', mandatory: false, condition: { triggerIds: ['ang_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
        ]
    },
    {
        title: 'Your Energy & Drive',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the past week...',
        questions: [
            { id: 'man_l1_1', text: 'Have you been sleeping less but still feeling full of energy?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'man_l1_2', text: 'Have you been starting more new projects or taking more risks than you typically would?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            
            { id: 'man_l2_1', text: 'How would you describe your mood?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't felt unusually happy or cheerful." }, { value: 1, text: "I've occasionally felt happier than usual." }, { value: 2, text: "I've often felt happier than usual." }, { value: 3, text: "I've felt happier most of the time." }, { value: 4, text: "I've felt happier and more cheerful constantly." },
            ]},
            { id: 'man_l2_2', text: 'How has your self-confidence been?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't felt more self-confident than usual." }, { value: 1, text: "I've occasionally felt more self-confident." }, { value: 2, text: "I've often felt more self-confident." }, { value: 3, text: "I've frequently felt more self-confident." }, { value: 4, text: "I've felt extremely self-confident all the time." },
            ]},
            { id: 'man_l2_3', text: 'How would you describe your need for sleep?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't needed less sleep than usual." }, { value: 1, text: "I've occasionally needed less sleep." }, { value: 2, text: "I've often needed less sleep." }, { value: 3, text: "I've frequently needed less sleep." }, { value: 4, text: "I can go without sleep and still not feel tired." },
            ]},
            { id: 'man_l2_4', text: 'How much have you been talking?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "I haven't been talking more than usual." }, { value: 1, text: "I've occasionally talked more than usual." }, { value: 2, text: "I've often talked more than usual." }, { value: 3, text: "I've frequently talked more than usual." }, { value: 4, text: "I've been talking constantly and can't be interrupted." },
            ]},
            { id: 'man_l2_5', text: 'How would you describe your activity level (socially, at work, etc.)?', mandatory: false, condition: { triggerIds: ['man_l1_1', 'man_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
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

            { id: 'anx_l2_1', text: 'How often have you felt fearful?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_2', text: 'How often have you felt anxious?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_3', text: 'How often have you felt worried?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_4', text: 'How often have you found it hard to focus on anything other than your anxiety?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_5', text: 'How often have you felt nervous?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_6', text: 'How often have you felt uneasy?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'anx_l2_7', text: 'How often have you felt tense?', mandatory: false, condition: { triggerIds: ['anx_l1_1', 'anx_l1_2', 'anx_l1_3'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
        ]
    },
    {
        title: 'Body & Mind Connection',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 4 weeks...',
        questions: [
            { id: 'som_l1_1', text: 'Have you been troubled by physical symptoms like headaches, stomach issues, or unexplained aches and pains?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'som_l1_2', text: 'Have you been worrying a lot about your physical health?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },

            { id: 'som_l2_1', text: 'Stomach pain?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_2', text: 'Back pain?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_3', text: 'Pain in your arms, legs, or joints?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_4', text: 'Menstrual cramps or other problems with your periods? (For women only)', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_5', text: 'Headaches?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_6', text: 'Chest pain?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_7', text: 'Dizziness?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_8', text: 'Fainting spells?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_9', text: 'Feeling your heart pound or race?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_10', text: 'Shortness of breath?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_11', text: 'Pain or problems during sexual intercourse?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_12', text: 'Constipation, loose bowels, or diarrhea?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_13', text: 'Nausea, gas, or indigestion?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_14', text: 'Feeling tired or having low energy?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
            { id: 'som_l2_15', text: 'Trouble sleeping?', mandatory: false, condition: { triggerIds: ['som_l1_1', 'som_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PHQ15_ANSWERS },
        ]
    },
    {
        title: 'Thoughts of Self-Harm',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'sui_l1_1', text: 'Have you had thoughts that you would be better off dead or of hurting yourself in some way?', mandatory: true, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "Rarely (less than a day or two)" }, { value: 2, text: "Sometimes (several days)" }, { value: 3, text: "Often (more than half the days)" }, { value: 4, text: "Nearly every day" },
            ]},
        ]
    },
    {
        title: 'Your Perceptions',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'psy_l1_1', text: 'Have you ever had the feeling that people are plotting against you, or trying to hurt you?', mandatory: true, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "Once or twice" }, { value: 2, text: "Sometimes" }, { value: 3, text: "Often" }, { value: 4, text: "Constantly" }
            ]},
            { id: 'psy_l1_2', text: 'Have you ever heard or seen things that others cannot? Like hearing voices even when no one is around?', mandatory: true, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "Once or twice" }, { value: 2, text: "Sometimes" }, { value: 3, text: "Often" }, { value: 4, text: "Constantly" }
            ]},
        ]
    },
    {
        title: 'Your Sleep Quality',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Thinking about the last 7 days...',
        questions: [
            { id: 'slp_l1_1', text: 'Have you had trouble with your sleep, such as difficulty falling asleep, staying asleep, or sleeping too much?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            
            { id: 'slp_l2_1', text: 'Was your sleep refreshing?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 5, text: "Not at all" }, { value: 4, text: "A little" }, { value: 3, text: "Somewhat" }, { value: 2, text: "Quite a bit" }, { value: 1, text: "Very much" },
            ]},
            { id: 'slp_l2_2', text: 'Did you have difficulty falling asleep?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'slp_l2_3', text: 'How was the quality of your sleep?', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 5, text: "Very poor" }, { value: 4, text: "Poor" }, { value: 3, text: "Fair" }, { value: 2, text: "Good" }, { value: 1, text: "Very good" },
            ]},
            { id: 'slp_l2_4', text: 'My sleep was restless.', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'slp_l2_5', text: 'I was satisfied with my sleep.', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 5, text: "Not at all" }, { value: 4, text: "A little bit" }, { value: 3, text: "Somewhat" }, { value: 2, text: "Quite a bit" }, { value: 1, text: "Very much" },
            ]},
            { id: 'slp_l2_6', text: 'I had a problem with my sleep.', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 1, text: "Not at all" }, { value: 2, text: "A little bit" }, { value: 3, text: "Somewhat" }, { value: 4, text: "Quite a bit" }, { value: 5, text: "Very much" },
            ]},
            { id: 'slp_l2_7', text: 'I had trouble staying asleep.', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: PROMIS_ANSWERS },
            { id: 'slp_l2_8', text: 'I got enough sleep.', mandatory: false, condition: { triggerIds: ['slp_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 5, text: "Not at all" }, { value: 4, text: "A little" }, { value: 3, text: "Somewhat" }, { value: 2, text: "Quite a bit" }, { value: 1, text: "Very much" },
            ]},
        ]
    },
    {
        title: 'Your Focus & Memory',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'mem_l1_1', text: 'Have you had problems with your memory or concentration?', mandatory: true, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "Once or twice" }, { value: 2, text: "Mild difficulty" }, { value: 3, text: "Moderate difficulty" }, { value: 4, text: "Severe difficulty" }
            ]},
        ]
    },
    {
        title: 'Repetitive Patterns',
        timeframe: 'Thinking about the last two weeks...',
        timeframeL2: 'Over the past week...',
        questions: [
            { id: 'rep_l1_1', text: 'Have you been bothered by unpleasant thoughts that enter your mind that you can\'t get rid of?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },
            { id: 'rep_l1_2', text: 'Have you felt the need to check things repeatedly or perform certain routines over and over?', mandatory: true, answerOptions: LEVEL_1_ANSWERS },

            { id: 'rep_l2_1', text: 'How much have these thoughts bothered you?', mandatory: false, condition: { triggerIds: ['rep_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "A little" }, { value: 2, text: "Moderately" }, { value: 3, text: "A lot" }, { value: 4, text: "Extremely" },
            ]},
            { id: 'rep_l2_2', text: 'How much have these thoughts interfered with your work, school, social or family life?', mandatory: false, condition: { triggerIds: ['rep_l1_1'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "A little" }, { value: 2, text: "Moderately" }, { value: 3, text: "A lot" }, { value: 4, text: "Extremely" },
            ]},
            { id: 'rep_l2_3', text: 'How much time do your repetitive behaviors occupy?', mandatory: false, condition: { triggerIds: ['rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "None" }, { value: 1, text: "A little of my time" }, { value: 2, text: "Some of my time" }, { value: 3, text: "A lot of my time" }, { value: 4, text: "A great deal of my time" },
            ]},
            { id: 'rep_l2_4', text: 'How much do these behaviors interfere with your work, school, social or family life?', mandatory: false, condition: { triggerIds: ['rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "A little" }, { value: 2, text: "Moderately" }, { value: 3, text: "A lot" }, { value: 4, text: "Extremely" },
            ]},
            { id: 'rep_l2_5', text: 'How much distress do these behaviors cause you?', mandatory: false, condition: { triggerIds: ['rep_l1_2'], threshold: LEVEL_2_THRESHOLD }, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "A little" }, { value: 2, text: "Moderately" }, { value: 3, text: "A lot" }, { value: 4, text: "Extremely" },
            ]},
        ]
    },
    {
        title: 'Feeling Grounded',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'dis_l1_1', text: 'Have you had times when you feel "unreal" or "outside" of your own body, or that the world around you seems strange and distant?', mandatory: true, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "Once or twice" }, { value: 2, text: "Mildly" }, { value: 3, text: "Moderately" }, { value: 4, "text": "Severely" }
            ]},
        ]
    },
    {
        title: 'Self & Relationships',
        timeframe: 'Thinking about the last two weeks...',
        questions: [
            { id: 'per_l1_1', text: 'Have you had a lot of problems with how you see yourself, such as feeling like you don’t know who you are or that you are changing a lot?', mandatory: true, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "Once or twice" }, { value: 2, text: "Mildly" }, { value: 3, text: "Moderately" }, { value: 4, "text": "Severely" }
            ]},
            { id: 'per_l1_2', text: 'Have you had a lot of problems with relationships, such as feeling like you can’t trust people or that you are always in conflict?', mandatory: true, answerOptions: [
                { value: 0, text: "Not at all" }, { value: 1, text: "Once or twice" }, { value: 2, text: "Mildly" }, { value: 3, text: "Moderately" }, { value: 4, "text": "Severely" }
            ]},
        ]
    }
];
