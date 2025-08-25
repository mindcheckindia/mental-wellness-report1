import React from 'react';
import { IndividualData } from '../types';
import { formatAssessmentDate } from '../utils/helpers';

interface IndividualInfoProps {
  data: Pick<IndividualData, 'firstName' | 'lastName' | 'individualId' | 'email' | 'assessmentDate'>;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-800">{value}</p>
    </div>
);

const IndividualInfo: React.FC<IndividualInfoProps> = ({ data }) => (
  <div className="mb-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-4">Assessment Details</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
      <InfoItem label="Name" value={`${data.firstName} ${data.lastName}`} />
      <InfoItem label="Individual ID" value={data.individualId} />
      <InfoItem label="Email" value={data.email} />
      <InfoItem label="Assessment Date" value={formatAssessmentDate(data.assessmentDate)} />
    </div>
  </div>
);

export default IndividualInfo;