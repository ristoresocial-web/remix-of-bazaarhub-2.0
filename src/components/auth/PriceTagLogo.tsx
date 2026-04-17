import React from "react";

interface PriceTagLogoProps {
  className?: string;
  size?: number;
}

const PriceTagLogo: React.FC<PriceTagLogoProps> = ({ className, size = 56 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ptg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="hsl(var(--primary))" />
        <stop offset="1" stopColor="#FF8A33" />
      </linearGradient>
    </defs>
    <path
      d="M34.5 6H54a4 4 0 0 1 4 4v19.5a4 4 0 0 1-1.17 2.83L31.66 57.49a4 4 0 0 1-5.66 0L6.51 38a4 4 0 0 1 0-5.66L31.67 7.17A4 4 0 0 1 34.5 6Z"
      fill="url(#ptg)"
    />
    <circle cx="46" cy="18" r="4.5" fill="white" />
    <text
      x="30"
      y="40"
      fontFamily="Poppins, system-ui, sans-serif"
      fontSize="14"
      fontWeight="700"
      fill="white"
      textAnchor="middle"
      transform="rotate(-45 30 40)"
    >
      ₹
    </text>
  </svg>
);

export default PriceTagLogo;
