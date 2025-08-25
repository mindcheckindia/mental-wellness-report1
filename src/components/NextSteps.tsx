
import React from 'react';
import { LightbulbIcon, UsersIcon, BookOpenIcon } from './icons';

const NextSteps: React.FC = () => (
  <div className="mt-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
    <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">What's Next?</h2>
    <div className="grid md:grid-cols-3 gap-8">
      
      <div className="flex flex-col items-center text-center p-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 mb-4">
            <LightbulbIcon className="h-8 w-8 text-sky-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">1. Review & Reflect</h3>
        <p className="text-slate-600">Take time to read through your insights. Consider how they align with your recent experiences and feelings.</p>
      </div>
      
      <div className="flex flex-col items-center text-center p-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
            <UsersIcon className="h-8 w-8 text-teal-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">2. Share & Discuss</h3>
        <p className="text-slate-600">If you feel comfortable, consider sharing this report with a healthcare professional or a trusted friend to start a conversation.</p>
      </div>
      
      <div className="flex flex-col items-center text-center p-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
            <BookOpenIcon className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">3. Explore Resources</h3>
        <p className="text-slate-600">Use the global resources listed in this report to learn more and find additional support if needed on your wellness journey.</p>
      </div>

    </div>
  </div>
);

export default NextSteps;