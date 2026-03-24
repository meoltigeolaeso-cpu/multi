import React from 'react';

const BedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 9.5V18a2 2 0 01-2 2H6a2 2 0 01-2-2V9.5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 14h16" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V6a2 2 0 012-2h6a2 2 0 012 2v5" />
  </svg>
);

export default BedIcon;