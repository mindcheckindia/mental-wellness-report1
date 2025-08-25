import React from 'react';
import { BrandIcon } from './icons';

const Header: React.FC = () => (
  <div className="text-center mb-12">
    <BrandIcon className="h-16 w-16 mx-auto text-sky-600 mb-4" />
    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 tracking-tight">Mental Wellness Report</h1>
    <p className="text-lg sm:text-xl text-slate-600">A Confidential Self-Assessment Overview</p>
  </div>
);

export default Header;