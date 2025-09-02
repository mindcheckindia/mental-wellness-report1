
import React from 'react';
import Logo from './Logo';

const Header: React.FC = () => (
  <div className="flex justify-end mb-12">
    <div className="transform scale-[1.32] origin-top-right">
      <Logo variant="light" />
    </div>
  </div>
);

export default Header;
