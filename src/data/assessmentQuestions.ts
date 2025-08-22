
import { AnswerOption, AssessmentSection } from '../types';

const positiveScreenerThreshold = 2; // "Mild or several days" or greater

// Default answer options aligned with DSM-5 Level 1 Cross-Cutting Symptom Measure
export const defaultAnswerOptions: AnswerOption[] = [
    { text: 'Not at all', value: 0 },
    { text: 'Slight or rare, less than a day or two', value: 1 },
    { text: 'Mild or several days', value: 2 },
    { text: 'Moderate or more than half the days', value: 3 },
    { text: 'Severe or nearly every day', value: 4 },
];

export const assessmentSections: AssessmentSection[] = [
    {
        title: 'Depression',
        description: 'These questions ask about feelings related to mood and interest in activities.',
        questions: [
            { id: 'dep_1', text: 'Little interest or pleasure in doing things?', mandatory: true },
            { id: 'dep_2', text: 'Feeling down, depressed, or hopeless?', mandatory: true },
            { id: 'dep_3', text: 'I felt worthless.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
            { id: 'dep_4', text: 'I felt that I had nothing to look forward to.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
            { id: 'dep_5', text: 'I felt helpless.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
            { id: 'dep_6', text: 'I felt sad.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
            { id: 'dep_7', text: 'I felt like a failure.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
            { id: 'dep_8', text: 'I felt depressed.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
            { id: 'dep_9', text: 'I felt unhappy.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
            { id: 'dep_10', text: 'I felt hopeless.', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], threshold: positiveScreenerThreshold }},
        ]
    },
    {
        title: 'Anger',
        description: 'These questions relate to feelings of irritability and anger.',
        questions: [
            { id: 'ang_1', text: 'Feeling more irritated, grouchy, or angry than usual?', mandatory: true },
            { id: 'ang_2', text: 'I was irritated more than people knew.', mandatory: false, condition: { triggerIds: ['ang_1'], threshold: positiveScreenerThreshold }},
            { id: 'ang_3', text: 'I felt angry.', mandatory: false, condition: { triggerIds: ['ang_1'], threshold: positiveScreenerThreshold }},
            { id: 'ang_4', text: 'I felt like I was ready to explode.', mandatory: false, condition: { triggerIds: ['ang_1'], threshold: positiveScreenerThreshold }},
            { id: 'ang_5', text: 'I was grouchy.', mandatory: false, condition: { triggerIds: ['ang_1'], threshold: positiveScreenerThreshold }},
            { id: 'ang_6', text: 'I felt annoyed.', mandatory: false, condition: { triggerIds: ['ang_1'], threshold: positiveScreenerThreshold }},
        ]
    },
    {
        title: 'Mania',
        description: 'These questions ask about periods of high energy, elevated mood, and increased activity.',
        questions: [
            { id: 'man_1', text: 'Sleeping less than usual, but still have a lot of energy?', mandatory: true },
            { id: 'man_2', text: 'Starting lots more projects than usual or doing more risky things than usual?', mandatory: true },
            { id: 'man_3', text: 'How have you been feeling in terms of being happier or more cheerful?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], threshold: positiveScreenerThreshold }, answerOptions: [
                { value: 0, text: "I do not feel happier or more cheerful than usual." },
                { value: 1, text: "I occasionally feel happier or more cheerful than usual." },
                { value: 2, text: "I often feel happier or more cheerful than usual." },
                { value: 3, text: "I feel happier or more cheerful than usual most of the time." },
                { value: 4, text: "I feel happier or more cheerful than usual all of the time." },
            ]},
            { id: 'man_4', text: 'How have you been feeling in terms of self-confidence?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], threshold: positiveScreenerThreshold }, answerOptions: [
                { value: 0, text: "I do not feel more self-confident than usual." },
                { value: 1, text: "I occasionally feel more self-confident than usual." },
                { value: 2, text: "I often feel more self-confident than usual." },
                { value: 3, text: "I frequently feel more self-confident than usual." },
                { value: 4, text: "I feel extremely self-confident all of the time." },
            ]},
            { id: 'man_5', text: 'How has your sleep been?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], threshold: positiveScreenerThreshold }, answerOptions: [
                { value: 0, text: "I do not need less sleep than usual." },
                { value: 1, text: "I occasionally need less sleep than usual." },
                { value: 2, text: "I often need less sleep than usual." },
                { value: 3, text: "I frequently need less sleep than usual." },
                { value: 4, text: "I can go all day and all night without any sleep and still not feel tired." },
            ]},
            { id: 'man_6', text: 'How has your talking been?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], threshold: positiveScreenerThreshold }, answerOptions: [
                { value: 0, text: "I do not talk more than usual." },
                { value: 1, text: "I occasionally talk more than usual." },
                { value: 2, text: "I often talk more than usual." },
                { value: 3, text: "I frequently talk more than usual." },
                { value: 4, text: "I talk constantly and cannot be interrupted." },
            ]},
            { id: 'man_7', text: 'How have your activity levels been (either socially, sexually, at work, home, or school)?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], threshold: positiveScreenerThreshold }, answerOptions: [
                { value: 0, text: "I have not been more active than usual." },
                { value: 1, text: "I have occasionally been more active than usual." },
                { value: 2, text: "I have often been more active than usual." },
                { value: 3, text: "I have frequently been more active than usual." },
                { value: 4, text: "I am constantly more active or on the go all the time." },
            ]},
        ]
    },
    {
        title: 'Anxiety',
        description: 'These questions ask about feelings of nervousness, worry, and fear.',
        questions: [
            { id: 'anx_1', text: 'Feeling nervous, anxious, frightened, worried, or on edge?', mandatory: true },
            { id: 'anx_2', text: 'Feeling panic or being frightened?', mandatory: true },
            { id: 'anx_3', text: 'Avoiding situations that make you anxious?', mandatory: true },
            { id: 'anx_4', text: 'I felt fearful.', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], threshold: positiveScreenerThreshold }},
            { id: 'anx_5', text: 'I felt anxious.', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], threshold: positiveScreenerThreshold }},
            { id: 'anx_6', text: 'I felt worried.', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], threshold: positiveScreenerThreshold }},
            { id: 'anx_7', text: 'I found it hard to focus on anything other than my anxiety.', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], threshold: positiveScreenerThreshold }},
            { id: 'anx_8', text: 'I felt nervous.', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], threshold: positiveScreenerThreshold }},
            { id: 'anx_9', text: 'I felt uneasy.', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], threshold: positiveScreenerThreshold }},
            { id: 'anx_10', text: 'I felt tense.', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], threshold: positiveScreenerThreshold }},
        ]
    },
    {
        title: 'Somatic Symptoms',
        description: 'These questions are about physical feelings and symptoms.',
        questions: [
            { id: 'som_1', text: 'Unexplained aches and pains (e.g., head, back, joints, abdomen, legs)?', mandatory: true },
            { id: 'som_2', text: 'Feeling that your illnesses are not being taken seriously enough?', mandatory: true },
            { id: 'som_3', text: 'Stomach pain?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_4', text: 'Back pain?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_5', text: 'Pain in your arms, legs, or joints (knees, hips, etc.)?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_6', text: 'Menstrual cramps or other problems with your periods (WOMEN ONLY)?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_7', text: 'Headaches?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_8', text: 'Chest pain?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_9', text: 'Dizziness?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_10', text: 'Fainting spells?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_11', text: 'Feeling your heart pound or race?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_12', text: 'Shortness of breath?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_13', text: 'Pain or problems during sexual intercourse?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_14', text: 'Constipation, loose bowels, or diarrhea?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_15', text: 'Nausea, gas, or indigestion?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_16', text: 'Feeling tired or having low energy?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
            { id: 'som_17', text: 'Trouble sleeping?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Not bothered at all' }, { value: 1, text: 'Bothered a little' }, { value: 2, text: 'Bothered a lot' } ]},
        ]
    },
    {
        title: 'Suicidal Ideation',
        description: 'This section asks about thoughts of self-harm.',
        questions: [
            { id: 'sui_1', text: 'Thoughts of actually hurting yourself?', mandatory: true },
        ]
    },
    {
        title: 'Psychosis',
        description: 'This section asks about unusual experiences or thoughts.',
        questions: [
            { id: 'psy_1', text: 'Hearing things other people couldn’t hear, such as voices even when no one was around?', mandatory: true },
            { id: 'psy_2', text: 'Feeling that someone could hear your thoughts, or that you could hear what another person was thinking?', mandatory: true },
        ]
    },
    {
        title: 'Sleep Problems',
        description: 'These questions are about your sleep quality.',
        questions: [
            { id: 'slp_1', text: 'Problems with sleep that affected your sleep quality over all?', mandatory: true },
            { id: 'slp_2', text: 'My sleep was restless.', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: false }, answerOptions: [ { value: 1, text: 'Not at all' }, { value: 2, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 4, text: 'Quite a bit' }, { value: 5, text: 'Very much' } ]},
            { id: 'slp_3', text: 'I was satisfied with my sleep.', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: true }, answerOptions: [ { value: 5, text: 'Not at all' }, { value: 4, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 2, text: 'Quite a bit' }, { value: 1, text: 'Very much' } ]},
            { id: 'slp_4', text: 'My sleep was refreshing.', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: true }, answerOptions: [ { value: 5, text: 'Not at all' }, { value: 4, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 2, text: 'Quite a bit' }, { value: 1, text: 'Very much' } ]},
            { id: 'slp_5', text: 'I had difficulty falling asleep.', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: false }, answerOptions: [ { value: 1, text: 'Not at all' }, { value: 2, text: 'A little bit' }, { value: 3, text: 'Somewhat' }, { value: 4, text: 'Quite a bit' }, { value: 5, text: 'Very much' } ]},
            { id: 'slp_6', text: 'I had trouble staying asleep.', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: false }, answerOptions: [ { value: 1, text: 'Never' }, { value: 2, text: 'Rarely' }, { value: 3, text: 'Sometimes' }, { value: 4, text: 'Often' }, { value: 5, text: 'Always' } ]},
            { id: 'slp_7', text: 'I had trouble sleeping.', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: false }, answerOptions: [ { value: 1, text: 'Never' }, { value: 2, text: 'Rarely' }, { value: 3, text: 'Sometimes' }, { value: 4, text: 'Often' }, { value: 5, text: 'Always' } ]},
            { id: 'slp_8', text: 'I got enough sleep.', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: true }, answerOptions: [ { value: 5, text: 'Never' }, { value: 4, text: 'Rarely' }, { value: 3, text: 'Sometimes' }, { value: 2, text: 'Often' }, { value: 1, text: 'Always' } ]},
            { id: 'slp_9', text: 'My sleep quality was...', mandatory: false, condition: { triggerIds: ['slp_1'], threshold: positiveScreenerThreshold }, customAnswers: { isReversed: true }, answerOptions: [ { value: 5, text: 'Very Poor' }, { value: 4, text: 'Poor' }, { value: 3, text: 'Fair' }, { value: 2, text: 'Good' }, { value: 1, text: 'Very Good' } ]},
        ]
    },
    {
        title: 'Memory',
        description: 'This question asks about problems with memory.',
        questions: [
            { id: 'mem_1', text: 'Problems with memory (e.g., learning new information) or with location (e.g., finding your way home)?', mandatory: true },
        ]
    },
    {
        title: 'Repetitive Thoughts & Behaviors',
        description: 'This section asks about repetitive thoughts or actions.',
        questions: [
            { id: 'rep_1', text: 'Unpleasant thoughts, urges, or images that repeatedly enter your mind?', mandatory: true },
            { id: 'rep_2', text: 'Feeling driven to perform certain behaviors or mental acts over and over again?', mandatory: true },
            { id: 'rep_3', text: 'On average, how much time is occupied by these thoughts or behaviors each day?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'None' }, { value: 1, text: 'Mild (Less than an hour a day)' }, { value: 2, text: 'Moderate (1 to 3 hours a day)' }, { value: 3, text: 'Severe (3 to 8 hours a day)' }, { value: 4, text: 'Extreme (more than 8 hours a day)' } ]},
            { id: 'rep_4', text: 'How much distress do these thoughts or behaviors cause you?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'None' }, { value: 1, text: 'Mild (slightly disturbing)' }, { value: 2, text: 'Moderate (disturbing but still manageable)' }, { value: 3, text: 'Severe (very disturbing)' }, { value: 4, text: 'Extreme (overwhelming distress)' } ]},
            { id: 'rep_5', text: 'How hard is it for you to control these thoughts or behaviors?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'Complete control' }, { value: 1, text: 'Much control' }, { value: 2, text: 'Moderate control' }, { value: 3, text: 'Little control' }, { value: 4, text: 'No control' } ]},
            { id: 'rep_6', text: 'How much do these thoughts or behaviors cause you to avoid doing anything, going anyplace, or being with anyone?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'No avoidance' }, { value: 1, text: 'Mild (occasional avoidance)' }, { value: 2, text: 'Moderate (regularly avoid)' }, { value: 3, text: 'Severe (frequent avoidance)' }, { value: 4, text: 'Extreme (nearly complete avoidance)' } ]},
            { id: 'rep_7', text: 'How much do these thoughts or behaviors interfere with school, work, or your social or family life?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], threshold: positiveScreenerThreshold }, answerOptions: [ { value: 0, text: 'None' }, { value: 1, text: 'Mild (slight interference)' }, { value: 2, text: 'Moderate (definite interference)' }, { value: 3, text: 'Severe (substantial interference)' }, { value: 4, text: 'Extreme (near-total interference)' } ]},
        ]
    },
    {
        title: 'Dissociation',
        description: 'This question asks about feelings of detachment.',
        questions: [
            { id: 'dis_1', text: 'Feeling detached or distant from yourself, your body, your physical surroundings, or your memories?', mandatory: true },
        ]
    },
    {
        title: 'Personality Functioning',
        description: 'This section asks about your sense of self and relationships.',
        questions: [
            { id: 'per_1', text: 'Not knowing who you really are or what you want out of life?', mandatory: true },
            { id: 'per_2', text: 'Not feeling close to other people or enjoying your relationships with them?', mandatory: true },
        ]
    }
];
