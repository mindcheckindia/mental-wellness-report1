

import { IndividualData } from '../types';

export const mockReportData: IndividualData = {
  individualId: 'MOCK_12345',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  assessmentDate: new Date().toISOString(),
  domains: [
    {
      name: 'Your Mood & Interest',
      about: 'This area explores your emotional state, including feelings of sadness and your ability to find pleasure in daily life. The score is a standardized T-Score based on the PROMIS framework for clinical accuracy.',
      aboutLink: 'https://www.who.int/news-room/fact-sheets/detail/depression',
      result: 'Moderate',
      score: 60.7, 
      rawScore: 23,
      tScore: 60.7,
      userInterpretation: 'Moderate',
      referenceIntervals: [
        { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' },
        { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
        { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' },
        { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
      ],
      insightsAndSupport: "John, it appears you're dealing with a noticeable level of depressive symptoms. This can sometimes make it challenging to find motivation or enjoy things as you used to. It may be beneficial to explore these feelings with a professional; a therapist can provide tools and strategies tailored specifically to you.",
      individualsExperienced: [
        { name: 'Deepika Padukone', link: 'https://www.onlymyhealth.com/deepika-padukone-on-depression-and-tips-to-overcome-suicidal-thoughts-12977825587' },
        { name: 'Abraham Lincoln', link: 'https://en.wikipedia.org/wiki/Health_of_Abraham_Lincoln#Depression' },
      ],
    },
    { 
      name: 'Feelings of Frustration', 
      about: 'This reflects how often you may feel annoyed, grouchy, or angry. The score is a standardized T-Score from the PROMIS framework to provide a reliable measure.', 
      aboutLink: 'https://www.apa.org/topics/anger/control', 
      result: 'Mild',
      score: 55.0,
      rawScore: 16,
      tScore: 55.0,
      userInterpretation: 'Mild',
      referenceIntervals: [
          { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' },
          { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
          { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' },
          { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, your results suggest you're navigating some mild feelings of irritability. This might show up as finding yourself more easily frustrated than usual. Exploring practices like taking a brief walk to cool down or noting your triggers can be a helpful next step.",
      individualsExperienced: [
          { name: 'Russell Brand', link: 'https://www.healthline.com/health/celebrities-with-bipolar-disorder' },
          { name: 'Kanye West', link: 'https://www.biography.com/musicians/kanye-west-mental-health' }
      ],
    },
    { 
      name: 'Your Energy & Drive', 
      about: 'This section looks at your energy levels, confidence, and drive, based on the Altman Self-Rating Mania Scale (ASRM). A score of 6 or higher suggests a high probability of experiencing manic or hypomanic symptoms.',
      aboutLink: 'https://www.nimh.nih.gov/health/topics/bipolar-disorder', 
      result: 'Low Probability',
      score: 5, 
      rawScore: 5,
      userInterpretation: 'Low Probability',
      referenceIntervals: [
          { label: 'Low Probability', min: 0, max: 5, color: 'bg-green-500' },
          { label: 'High Probability', min: 6, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, it's great that your mood and energy levels seem to be steady. Maintaining a stable routine, especially around sleep, is an excellent way to continue supporting this balance.",
      individualsExperienced: [
          { name: 'Mariah Carey', link: 'https://www.webmd.com/bipolar-disorder/ss/slideshow-celebrities-bipolar-disorder' },
          { name: 'Demi Lovato', link: 'https://people.com/health/demi-lovato-relieved-to-be-diagnosed-bipolar/' }
      ], 
    },
    {
      name: 'Feelings of Worry',
      about: 'This evaluates common symptoms of anxiety, such as feeling nervous, worried, or on edge. The score is a standardized T-Score based on the PROMIS framework.',
      aboutLink: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
      result: 'Moderate',
      score: 60.0,
      rawScore: 20,
      tScore: 60.0,
      userInterpretation: 'Moderate',
      referenceIntervals: [
        { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' },
        { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
        { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' },
        { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
      ],
      insightsAndSupport: "John, it appears you're managing a moderate degree of anxiety. This can manifest as persistent worry that's hard to control. A therapist can help you understand these patterns and develop effective coping strategies.",
      individualsExperienced: [
        { name: 'Adele', link: 'https://www.gmanetwork.com/news/lifestyle/healthandwellness/806235/adele-says-working-out-helped-with-her-anxiety-it-was-never-about-losing-weight/story/' },
        { name: 'Karan Johar', link: 'https://yourdost.com/blog/2016/09/celebrity-depression-karan-johar.html' },
      ],
    },
    { 
      name: 'Body & Mind Connection', 
      about: 'This explores the connection between your mind and body by looking at physical symptoms that can sometimes be related to emotional distress, based on the Patient Health Questionnaire 15 (PHQ-15).',
      aboutLink: 'https://www.psychiatry.org/patients-families/somatic-symptom-disorder/what-is-somatic-symptom-disorder', 
      result: 'High',
      score: 18,
      rawScore: 18,
      userInterpretation: 'High',
      referenceIntervals: [
          { label: 'Minimal', min: 0, max: 4, color: 'bg-green-500' },
          { label: 'Low', min: 5, max: 9, color: 'bg-yellow-500' },
          { label: 'Medium', min: 10, max: 14, color: 'bg-orange-500' },
          { label: 'High', min: 15, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, the high level of physical symptoms you're reporting can be very challenging. Since these feelings can be tough to manage alone, we encourage you to connect with a doctor to discuss these results and rule out any other causes.",
      individualsExperienced: [
          { name: 'Lady Gaga', link: 'https://ukfibromyalgia.com/blog/celebrities-with-fibromyalgia-lady-gaga' },
          { name: 'Oprah Winfrey', link: 'https://www.cbsnews.com/news/oprah-reports-on-childhood-traumas-long-term-effects/' }
      ], 
    },
    { 
      name: 'Thoughts of Self-Harm', 
      about: 'This is a safety check for thoughts of self-harm. A response of "Slight" or greater indicates a need for further inquiry and support.',
      aboutLink: 'https://988lifeline.org/', 
      result: 'Within normal limits',
      score: 0,
      rawScore: 0,
      userInterpretation: 'Within normal limits',
      referenceIntervals: [
          { label: 'Within normal limits', min: 0, max: 0, color: 'bg-green-500' },
          { label: 'Further inquiry indicated', min: 1, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, we're glad to see your responses indicate a low risk in this area. Remember, if you ever need support, help is always available through crisis hotlines and mental health professionals.",
      individualsExperienced: [
          { name: 'J.K. Rowling', link: 'https://www.cbsnews.com/news/potter-creator-once-contemplated-suicide/' },
          { name: 'Jon Hamm', link: 'https://sunlightrecovery.com/jon-hamm-chronic-depression/' }
      ],
    },
    { 
      name: 'Your Perceptions', 
      about: 'This section identifies unusual thoughts or perceptions that might differ from those of others. A response of "Slight" or greater suggests a need for further conversation.',
      aboutLink: 'https://www.nimh.nih.gov/health/topics/schizophrenia/raise/what-is-psychosis', 
      result: 'Within normal limits',
      score: 0,
      rawScore: 0,
      userInterpretation: 'Within normal limits',
      referenceIntervals: [
          { label: 'Within normal limits', min: 0, max: 0, color: 'bg-green-500' },
          { label: 'Further inquiry indicated', min: 1, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, your results suggest that unusual thoughts or perceptions are not a current concern. Staying grounded and connected to your support system is always a good practice for overall well-being.",
      individualsExperienced: [
          { name: 'John Nash', link: 'https://livingwithschizophreniauk.org/john-nash/' },
          { name: 'Brian Wilson', link: 'https://www.biography.com/musicians/brian-wilson-mental-health-illness' }
      ], 
    },
    { 
      name: 'Your Sleep Quality', 
      about: 'This evaluates your overall sleep experience based on the PROMIS Sleep Disturbance scale. The score is a standardized T-Score for clinical accuracy.',
      aboutLink: 'https://www.sleepfoundation.org/insomnia', 
      result: 'Severe',
      score: 70.8,
      rawScore: 38,
      tScore: 70.8,
      userInterpretation: 'Severe',
      referenceIntervals: [
          { label: 'None to slight', min: 0, max: 54.9, color: 'bg-green-500' }, 
          { label: 'Mild', min: 55, max: 59.9, color: 'bg-yellow-500' },
          { label: 'Moderate', min: 60, max: 69.9, color: 'bg-orange-500' }, 
          { label: 'Severe', min: 70, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, it seems you are facing severe challenges with your sleep, which can impact all areas of life. We strongly encourage you to discuss this with a doctor; they can help find the best path forward to achieve restful sleep.",
      individualsExperienced: [
          { name: 'Jimmy Kimmel', link: 'https://www.rxwiki.com/slideshow/celebrities-who-have-trouble-sleeping/jimmy-kimmel' },
      ],
    },
    { 
      name: 'Your Focus & Memory', 
      about: 'This assesses challenges with memory or concentration. A response of "Mild" or greater suggests it may be helpful to look into this further.',
      aboutLink: 'https://www.nia.nih.gov/health/memory-forgetfulness-and-aging-whats-normal-and-whats-not', 
      result: 'Within normal limits',
      score: 1,
      rawScore: 1,
      userInterpretation: 'Within normal limits',
      referenceIntervals: [
          { label: 'Within normal limits', min: 0, max: 1, color: 'bg-green-500' },
          { label: 'Further inquiry indicated', min: 2, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, you've noted that memory is not a significant concern. Stress and poor sleep can sometimes impact cognition, so continuing to manage those areas will help maintain your focus.",
      individualsExperienced: [
          { name: 'Ronald Reagan', link: 'https://optoceutics.com/famous-people-celebrities-singers-with-alzheimers/' },
      ], 
    },
    { 
      name: 'Repetitive Patterns', 
      about: 'This measures the impact of repetitive thoughts and behaviors based on the Florida Obsessive-Compulsive Inventory (FOCI) Severity Scale.',
      aboutLink: 'https://iocdf.org/about-ocd/', 
      result: 'Moderate',
      score: 2.5,
      rawScore: 2.5,
      userInterpretation: 'Moderate',
      referenceIntervals: [
          { label: 'None', min: 0, max: 0.9, color: 'bg-green-500' },
          { label: 'Mild', min: 1, max: 1.9, color: 'bg-yellow-500' },
          { label: 'Moderate', min: 2, max: 2.9, color: 'bg-orange-500' },
          { label: 'Severe', min: 3, max: 3.9, color: 'bg-red-500' },
          { label: 'Extreme', min: 4, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, your results suggest a moderate level of repetitive thoughts or behaviors. These patterns can be disruptive, and it may be beneficial to explore this with a therapist who can introduce effective strategies like CBT.",
      individualsExperienced: [
          { name: 'Howie Mandel', link: 'https://en.wikipedia.org/wiki/Here%27s_the_Deal:_Don%27t_Touch_Me' },
      ],
    },
    { 
      name: 'Feeling Grounded', 
      about: 'This explores experiences of feeling detached from yourself, your body, or your surroundings. A response of "Mild" or greater suggests a need for further discussion.',
      aboutLink: 'https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Dissociative-Disorders', 
      result: 'Further inquiry indicated',
      score: 3,
      rawScore: 3,
      userInterpretation: 'Further inquiry indicated',
      referenceIntervals: [
          { label: 'Within normal limits', min: 0, max: 1, color: 'bg-green-500' },
          { label: 'Further inquiry indicated', min: 2, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, experiencing feelings of detachment can be unsettling and are challenging to manage alone. We strongly encourage you to connect with a mental health professional to discuss these results and find the best support for you.",
      individualsExperienced: [
          { name: 'Jim Carrey', link: 'https://psychprofessionals.com.au/jim-carrey-on-overcoming-depression/' },
      ], 
    },
    { 
      name: 'Self & Relationships', 
      about: 'This area examines long-term patterns in how you see yourself and connect with others. A response of "Mild" or greater suggests it may be beneficial to explore further.',
      aboutLink: 'https://www.nimh.nih.gov/health/topics/borderline-personality-disorder', 
      result: 'Further inquiry indicated',
      score: 2,
      rawScore: 2,
      userInterpretation: 'Further inquiry indicated',
      referenceIntervals: [
          { label: 'Within normal limits', min: 0, max: 1, color: 'bg-green-500' },
          { label: 'Further inquiry indicated', min: 2, max: null, color: 'bg-red-500' }
      ], 
      insightsAndSupport: "John, it seems there are some significant challenges in how you see yourself or relate to others, which can be difficult. We recommend talking to a therapist, as they can help you explore these patterns and build healthier relationships and self-esteem.",
      individualsExperienced: [
          { name: 'Pete Davidson', link: 'https://en.wikipedia.org/wiki/Pete_Davidson#Health' },
      ], 
    }
  ]
};