
import React from 'react';
import { ExclamationTriangleIcon } from './icons';

const GeneralDisclaimer: React.FC = () => (
    <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-base">
        <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-bold mb-1">Important Note:</p>
                <p className="leading-relaxed text-sm">This report is based on self-assessment data and is intended for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. The scoring methodologies used in this assessment are derived from established clinical frameworks, including the DSM-5-TR Level 1 measures, PROMIS® (Patient-Reported Outcomes Measurement Information System), the Altman Self-Rating Mania Scale (ASRM), the Patient Health Questionnaire (PHQ-15), and the Florida Obsessive-Compulsive Inventory (FOCI). If you have concerns about your mental health, please consult with a qualified healthcare professional.</p>
            </div>
        </div>
    </div>
);

const IndividualsDisclaimer: React.FC = () => (
    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-sm italic">
        <p className="font-semibold mb-1">Note on "Notable Figures' Experiences":</p>
        <p>The individuals listed are public figures who have openly discussed their experiences or are widely associated with the respective domains based on public information. This is for general awareness and to show that these experiences are common. It is not a comprehensive list, and mental health journeys are unique to each individual.</p>
    </div>
);

export { GeneralDisclaimer, IndividualsDisclaimer };
