import React from 'react';

const Logo: React.FC = () => {
  return (
    <div aria-label="Mind Path Lab: Mental wellness, simplified.">
      {/* 
        You can copy the SVG code below to use this logo in other applications.
        This is a complete logotype, combining the icon, brand name, and tagline into a single, versatile SVG.
        The icon uses a vibrant lime green with subtle gradients for a 3D effect. The text uses standard light colors.
        The font 'Outfit' is used for a modern, professional look. Ensure it's linked in your HTML.
      */}
      <svg
        width="240"
        height="42"
        viewBox="0 0 240 42"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <title>Mind Path Lab Logotype</title>
        
        <defs>
          {/* A vertical gradient for the "bowl" shape, now in blue */}
          <linearGradient id="logoFillGradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#38BDF8" /> {/* Sky 400 */}
            <stop offset="100%" stopColor="#0284C7" /> {/* Sky 600 */}
          </linearGradient>

          {/* A gradient for the strokes to make them look like shiny tubes */}
          <linearGradient id="logoStrokeGradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#BEF264" /> {/* Lime 300 */}
            <stop offset="100%" stopColor="#84CC16" /> {/* Lime 500 */}
          </linearGradient>
        </defs>
        
        {/* Icon */}
        <g transform="translate(-12.4, -11.4) scale(1.8)">
          {/* Top paths are strokes only, using the stroke gradient */}
          <path 
            d="M16 24V12C16 12 16 8 20 8C24 8 24 12 24 12" 
            stroke="url(#logoStrokeGradient)"
            strokeWidth="1.4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          <path 
            d="M16 12C16 12 16 8 12 8C8 8 8 12 8 12" 
            stroke="url(#logoStrokeGradient)"
            strokeWidth="1.4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          {/* Bottom path is filled with the blue fill gradient */}
          <path 
            d="M24 24H8C8 24 10 28 16 28C22 28 24 24 24 24Z"
            fill="url(#logoFillGradient)"
          />
        </g>
        
        {/* Logotype Text */}
        <text 
          x="42" 
          y="18" 
          fontFamily="Outfit, sans-serif" 
          fontSize="18" 
          fontWeight="700"
          fill="#E2E8F0" /* textPrimary */
        >
          Mind Path Lab
        </text>
        <text 
          x="42" 
          y="35" 
          fontFamily="Outfit, sans-serif" 
          fontSize="11" 
          fontWeight="400"
          fill="#94A3B8" /* textSecondary */
        >
          Mental wellness, simplified.
        </text>
      </svg>
    </div>
  );
};

export default Logo;
