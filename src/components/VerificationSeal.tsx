
import React from 'react';
import { ShieldCheckIcon } from './icons';

const VerificationSeal: React.FC = () => (
    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 w-full sm:max-w-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
            <ShieldCheckIcon className="h-6 w-6 mr-2 text-teal-600" />
            Verified By
        </h3>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Name:</span>
                <span className="text-right font-medium">Dr. Evelyn Reed</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Qualification:</span>
                <span className="text-right font-medium">Clinical Psychologist</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Date:</span>
                <span className="text-right font-medium">July 26, 2024</span>
            </div>
        </div>
    </div>
);

export default VerificationSeal;