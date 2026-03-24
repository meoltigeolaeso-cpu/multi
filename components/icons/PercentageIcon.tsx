import React from 'react';

const PercentageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 18a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default PercentageIcon;
