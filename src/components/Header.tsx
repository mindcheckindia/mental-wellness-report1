
import React from 'react';
import Logo from './Logo';

interface HeaderProps {
    firstName: string;
    lastName: string;
}

const Header: React.FC<HeaderProps> = ({ firstName, lastName }) => {
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    return (
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-12 border-b border-slate-200 pb-8">
            <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 font-lora tracking-tight">
                    {fullName}'s Mental Wellness Blueprint
                </h1>
            </div>
            <div className="transform scale-[1.32] origin-top-right self-end sm:self-start sm:mt-1">
                <Logo variant="light" />
            </div>
        </div>
    );
};


export default Header;
