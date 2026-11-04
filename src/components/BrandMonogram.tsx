import React from 'react';

interface BrandMonogramProps {
  className?: string;
  size?: number;
  dark?: boolean;
}

export const BrandMonogram: React.FC<BrandMonogramProps> = ({
  className = '',
  size = 28,
  dark = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      {/* Precision architectural geometric A monogram */}
      <rect
        width="32"
        height="32"
        rx="6"
        fill={dark ? '#FFFFFF' : '#17191D'}
      />
      {/* Outer chevron apex */}
      <polygon
        points="16,5.5 25,25.5 20.8,25.5 16,14.5 11.2,25.5 7,25.5"
        fill={dark ? '#17191D' : '#F7F6F2'}
      />
      {/* Precision horizontal crossbar in signature eucalyptus sage #91A99B */}
      <rect
        x="10.5"
        y="18.5"
        width="11"
        height="2.75"
        fill="#91A99B"
      />
    </svg>
  );
};
