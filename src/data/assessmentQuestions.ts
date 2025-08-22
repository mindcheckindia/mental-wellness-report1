
interface Question {
    id: string;
    text: string;
    mandatory: boolean;
    condition?: {
        triggerIds: string[];
        requiredValues: string[];
    };
}

interface AssessmentSection {
    title: string;
    description: string;
    questions: Question[];
}

const positiveAnswers = ['Several days', 'More than half the days', 'Nearly every day'];

export const assessmentSections: AssessmentSection[] = [
    {
        title: 'Depression',
        description: 'These questions ask about feelings related to mood and interest in activities.',
        questions: [
            { id: 'dep_1', text: 'In the LAST TWO WEEKS, have you experienced little interest or pleasure in doing things?', mandatory: true },
            { id: 'dep_2', text: 'In the LAST TWO WEEKS, have you felt down, depressed or hopeless?', mandatory: true },
            { id: 'dep_3', text: 'In the LAST 7 DAYS, did you feel, "I am worthless"?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
            { id: 'dep_4', text: 'In the LAST 7 DAYS, did you feel that you had nothing to look forward to?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
            { id: 'dep_5', text: 'In the LAST 7 DAYS, did you feel helpless?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
            { id: 'dep_6', text: 'In the LAST 7 DAYS, did you feel sad?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
            { id: 'dep_7', text: 'In the LAST 7 DAYS, did you feel like a failure?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
            { id: 'dep_8', text: 'In the LAST 7 DAYS, did you feel like depressed?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
            { id: 'dep_9', text: 'In the LAST 7 DAYS, did you feel unhappy?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
            { id: 'dep_10', text: 'In the LAST 7 DAYS, did you feel hopeless?', mandatory: false, condition: { triggerIds: ['dep_1', 'dep_2'], requiredValues: positiveAnswers }},
        ]
    },
    {
        title: 'Anger',
        description: 'These questions relate to feelings of irritability and anger.',
        questions: [
            { id: 'ang_1', text: 'In the LAST TWO WEEKS, did you feel more irritated, grouchy or angry than usual?', mandatory: true },
            { id: 'ang_2', text: 'In the LAST 7 DAYS, "I was irritated more than people knew"', mandatory: false, condition: { triggerIds: ['ang_1'], requiredValues: positiveAnswers }},
            { id: 'ang_3', text: 'In the LAST 7 DAYS, "I felt angry"', mandatory: false, condition: { triggerIds: ['ang_1'], requiredValues: positiveAnswers }},
            { id: 'ang_4', text: 'In the LAST 7 DAYS, "I felt like I was ready to explode"', mandatory: false, condition: { triggerIds: ['ang_1'], requiredValues: positiveAnswers }},
            { id: 'ang_5', text: 'In the LAST 7 DAYS, "I was grouchy"', mandatory: false, condition: { triggerIds: ['ang_1'], requiredValues: positiveAnswers }},
            { id: 'ang_6', text: 'In the LAST 7 DAYS, "I felt annoyed"', mandatory: false, condition: { triggerIds: ['ang_1'], requiredValues: positiveAnswers }},
        ]
    },
    {
        title: 'Mania',
        description: 'These questions ask about periods of high energy, elevated mood, and increased activity.',
        questions: [
            { id: 'man_1', text: 'In the LAST TWO WEEKS, have you been sleeping less than usual, but still had a lot of energy?', mandatory: true },
            { id: 'man_2', text: 'In the LAST TWO WEEKS, did you start more projects or did more risky things than usual?', mandatory: true },
            { id: 'man_3', text: 'In the LAST 7 DAYS, did you feel happier or more cheerful than usual?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], requiredValues: positiveAnswers }},
            { id: 'man_4', text: 'In the LAST 7 DAYS, did you feel more self-confident than usual?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], requiredValues: positiveAnswers }},
            { id: 'man_5', text: 'In the LAST 7 DAYS, did you need less sleep than usual?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], requiredValues: positiveAnswers }},
            { id: 'man_6', text: 'In the LAST 7 DAYS, did you talk more than usual?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], requiredValues: positiveAnswers }},
            { id: 'man_7', text: 'In the LAST 7 DAYS, have you been more active (either socially, sexually, at work, home, or school) than usual ?', mandatory: false, condition: { triggerIds: ['man_1', 'man_2'], requiredValues: positiveAnswers }},
        ]
    },
    {
        title: 'Anxiety',
        description: 'These questions ask about feelings of nervousness, worry, and fear.',
        questions: [
            { id: 'anx_1', text: 'In the LAST TWO WEEKS, did you feel nervous, anxious, frightened, worried, or on edge ?', mandatory: true },
            { id: 'anx_2', text: 'In the LAST TWO WEEKS, did you get a feeling of panic or being frightened?', mandatory: true },
            { id: 'anx_3', text: 'In the LAST TWO WEEKS, did you consciously avoid situations that make you anxious?', mandatory: true },
            { id: 'anx_4', text: 'In the LAST 7 DAYS, "I felt fearful"', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], requiredValues: positiveAnswers }},
            { id: 'anx_5', text: 'In the LAST 7 DAYS, "I felt anxious"', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], requiredValues: positiveAnswers }},
            { id: 'anx_6', text: 'In the LAST 7 DAYS, "I felt worried"', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], requiredValues: positiveAnswers }},
            { id: 'anx_7', text: 'In the LAST 7 DAYS, "I found it hard to focus on anything other than my anxiety"', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], requiredValues: positiveAnswers }},
            { id: 'anx_8', text: 'In the LAST 7 DAYS, "I felt nervous"', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], requiredValues: positiveAnswers }},
            { id: 'anx_9', text: 'In the LAST 7 DAYS, "I felt uneasy"', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], requiredValues: positiveAnswers }},
            { id: 'anx_10', text: 'In the LAST 7 DAYS, "I felt tense"', mandatory: false, condition: { triggerIds: ['anx_1', 'anx_2', 'anx_3'], requiredValues: positiveAnswers }},
        ]
    },
    {
        title: 'Somatic Symptoms',
        description: 'These questions are about physical feelings and symptoms.',
        questions: [
            { id: 'som_1', text: 'In the LAST TWO WEEKS, did you get unexplained aches and pains (e.g. head, back, joints, abdomen, legs)?', mandatory: true },
            { id: 'som_2', text: 'In the LAST TWO WEEKS, did you feel that your illness was not being taken seriously enough?', mandatory: true },
            { id: 'som_3', text: 'In the LAST 7 DAYS, were you bothered by \'stomach pain\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_4', text: 'In the LAST 7 DAYS, were you bothered by \'back pain\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_5', text: 'In the LAST 7 DAYS, were you bothered by \'pain in your arms, legs, or joints (knees, hips, etc.)\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_6', text: 'In the LAST 7 DAYS, were you bothered by \'menstrual cramps or problems with your periods\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_7', text: 'In the LAST 7 DAYS, were you bothered by \'headaches\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_8', text: 'In the LAST 7 DAYS, were you bothered by \'chest pain\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_9', text: 'In the LAST 7 DAYS, were you bothered by \'dizziness\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_10', text: 'In the LAST 7 DAYS, were you bothered by \'fainting spells\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_11', text: 'In the LAST 7 DAYS, were you bothered by \'feeling that your heart was pounding or racing\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_12', text: 'In the LAST 7 DAYS, were you bothered by \'shortness of breath\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_13', text: 'In the LAST 7 DAYS, were you bothered by \'pain or problems during sexual intercourse\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_14', text: 'In the LAST 7 DAYS, were you bothered by \'constipation, loose bowels, or diarrhea\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_15', text: 'In the LAST 7 DAYS, were you bothered by \'nausea, gas, or indigestion\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_16', text: 'In the LAST 7 DAYS, were you bothered by \'feeling tired or having low energy\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
            { id: 'som_17', text: 'In the LAST 7 DAYS, were you bothered by \'trouble in sleeping\'?', mandatory: false, condition: { triggerIds: ['som_1', 'som_2'], requiredValues: positiveAnswers }},
        ]
    },
    {
        title: 'Suicidal Intention',
        description: 'This section asks about thoughts of self-harm.',
        questions: [
            { id: 'sui_1', text: 'In the LAST TWO WEEKS, did you get thoughts of actually hurting yourself?', mandatory: true },
        ]
    },
    {
        title: 'Psychosis',
        description: 'This section asks about unusual experiences or thoughts.',
        questions: [
            { id: 'psy_1', text: 'In the LAST TWO WEEKS, did you experience hearing things other people couldn\'t hear, such as voices even when no one was around?', mandatory: true },
            { id: 'psy_2', text: 'In the LAST TWO WEEKS, did you experience feelings that someone could hear your thoughts, or that you could hear what they were thinking?', mandatory: true },
        ]
    },
    {
        title: 'Sleep Problems',
        description: 'These questions are about your sleep quality.',
        questions: [
            { id: 'slp_1', text: 'In the LAST TWO WEEKS, did you have problems with sleep that affected your sleep quality over all?', mandatory: true },
            { id: 'slp_2', text: 'In the LAST 7 DAYS, "my sleep was restless"', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
            { id: 'slp_3', text: 'In the LAST 7 DAYS, "I was satisfied with my sleep"', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
            { id: 'slp_4', text: 'In the LAST 7 DAYS, "my sleep was refreshing"', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
            { id: 'slp_5', text: 'In the LAST 7 DAYS, "I had difficulty falling asleep"', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
            { id: 'slp_6', text: 'In the LAST 7 DAYS, "I had trouble staying asleep"', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
            { id: 'slp_7', text: 'In the LAST 7 DAYS, "I had trouble falling asleep"', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
            { id: 'slp_8', text: 'In the LAST 7 DAYS, "I got enough sleep"', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
            { id: 'slp_9', text: 'In the LAST 7 DAYS, how was your sleep quality?', mandatory: false, condition: { triggerIds: ['slp_1'], requiredValues: positiveAnswers }},
        ]
    },
    {
        title: 'Memory',
        description: 'This question asks about problems with memory.',
        questions: [
            { id: 'mem_1', text: 'In the LAST TWO WEEKS, did you have problems with memory (e.g., learning new information) or with location (e.g., finding your way home)?', mandatory: true },
        ]
    },
    {
        title: 'Repetitive Thoughts & Behaviors',
        description: 'This section asks about repetitive thoughts or actions.',
        questions: [
            { id: 'rep_1', text: 'In the LAST TWO WEEKS, did you get unpleasant thoughts, urges, or images that repeatedly enter your mind?', mandatory: true },
            { id: 'rep_2', text: 'In the LAST TWO WEEKS, did you feel driven to perform certain behaviors or mental acts over and over again?', mandatory: true },
            { id: 'rep_3', text: 'In the LAST 7 DAYS, to what extent did unwanted, repetitive thoughts, images, or urges take up your time?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], requiredValues: positiveAnswers }},
            { id: 'rep_4', text: 'In the LAST 7 DAYS, how much distress did you experience from unwanted, repetitive thoughts, images, urges ?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], requiredValues: positiveAnswers }},
            { id: 'rep_5', text: 'In the LAST 7 DAYS, to what extent did you experience difficulty controlling these unwanted, repetitive thoughts?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], requiredValues: positiveAnswers }},
            { id: 'rep_6', text: 'In the LAST 7 DAYS, how much did these unwanted, repetitive thoughts or behaviors cause you to avoid doing anything, going anywhere, or being with anyone?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], requiredValues: positiveAnswers }},
            { id: 'rep_7', text: 'In the LAST 7 DAYS, how much did these repetitive and unwanted thoughts or behaviors interfere with school, work, or your social or family life?', mandatory: false, condition: { triggerIds: ['rep_1', 'rep_2'], requiredValues: positiveAnswers }},
        ]
    },
    {
        title: 'Dissociation',
        description: 'This question asks about feelings of detachment.',
        questions: [
            { id: 'dis_1', text: 'In the LAST TWO WEEKS, did you feel detached or distant from yourself, your body, your physical surroundings, or your memories?', mandatory: true },
        ]
    },
    {
        title: 'Personality Functioning',
        description: 'This section asks about your sense of self and relationships.',
        questions: [
            { id: 'per_1', text: 'In the LAST TWO WEEKS, did you get a feeling of not knowing who you really are or what you want out of life ?', mandatory: true },
            { id: 'per_2', text: 'In the LAST TWO WEEKS, did you get a sense of not feeling close to other people or enjoying your relationships with them?', mandatory: true },
        ]
    }
];
