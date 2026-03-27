import React from 'react';

interface PlayerKitProps {
  team: string;
  name: string;
  number: number;
  className?: string;
}

const TEAM_COLORS: Record<string, { primary: string; secondary: string; text: 'white' | 'black' }> = {
  "Arsenal": { primary: "#EF0107", secondary: "#FFFFFF", text: "white" },
  "Aston Villa": { primary: "#670E36", secondary: "#95BFE5", text: "white" },
  "Bournemouth": { primary: "#DA291C", secondary: "#000000", text: "white" },
  "Brentford": { primary: "#E30613", secondary: "#FFFFFF", text: "white" },
  "Brighton": { primary: "#0057B8", secondary: "#FFFFFF", text: "white" },
  "Chelsea": { primary: "#034694", secondary: "#FFFFFF", text: "white" },
  "Crystal Palace": { primary: "#1B458F", secondary: "#C4122E", text: "white" },
  "Everton": { primary: "#003399", secondary: "#FFFFFF", text: "white" },
  "Fulham": { primary: "#FFFFFF", secondary: "#000000", text: "black" },
  "Ipswich": { primary: "#3A64A3", secondary: "#FFFFFF", text: "white" },
  "Leicester": { primary: "#0053A0", secondary: "#FFFFFF", text: "white" },
  "Liverpool": { primary: "#C8102E", secondary: "#8A091E", text: "white" },
  "Luton": { primary: "#F78F1E", secondary: "#FFFFFF", text: "black" },
  "Man City": { primary: "#6CABDD", secondary: "#FFFFFF", text: "white" },
  "Man Utd": { primary: "#DA291C", secondary: "#000000", text: "white" },
  "Newcastle": { primary: "#241F20", secondary: "#FFFFFF", text: "white" },
  "Nottingham Forest": { primary: "#DD0000", secondary: "#FFFFFF", text: "white" },
  "Southampton": { primary: "#D71920", secondary: "#FFFFFF", text: "white" },
  "Spurs": { primary: "#FFFFFF", secondary: "#132257", text: "black" },
  "West Ham": { primary: "#7A263A", secondary: "#1BB1E7", text: "white" },
  "Wolves": { primary: "#FDB913", secondary: "#231F20", text: "black" },
  // Fallback
  "Default": { primary: "#333333", secondary: "#666666", text: "white" }
};

const PlayerKit: React.FC<PlayerKitProps> = ({ team, name, number, className = "w-12 h-12" }) => {
  // Normalize team name to find colors
  const normalizeKey = (t: string) => {
    const lower = t.toLowerCase();
    if (lower.includes('man') && lower.includes('city')) return 'Man City';
    if (lower.includes('man') && (lower.includes('utd') || lower.includes('united'))) return 'Man Utd';
    if (lower.includes('forest')) return 'Nottingham Forest';
    if (lower.includes('spurs') || lower.includes('tottenham')) return 'Spurs';
    if (lower.includes('wolves')) return 'Wolves';
    return Object.keys(TEAM_COLORS).find(k => t.includes(k)) || 'Default';
  };

  const colors = TEAM_COLORS[normalizeKey(team)] || TEAM_COLORS['Default'];

  return (
    <div className={`relative flex flex-col items-center group ${className}`}>
      
      {/* Name Plaque (Wood Effect) */}
      <div className="w-full bg-[#5d4037] border border-[#3e2723] rounded-sm mb-[2px] shadow-sm relative overflow-hidden h-[14px] flex items-center justify-center">
        {/* CSS Wood Grain Substitute - Replaces external image to fix errors */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)' 
          }}
        ></div>
        {/* Brass Screws */}
        <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#d4af37] shadow-inner"></div>
        <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#d4af37] shadow-inner"></div>
        
        <span className="text-[6px] font-mono font-bold text-[#d4af37] uppercase tracking-tighter truncate max-w-[90%] text-center leading-none relative z-10">
          {name.split(' ').pop()}
        </span>
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md transform transition-transform group-hover:scale-105 duration-300 origin-top">
        <defs>
          <filter id="mud-splatter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0.4 0 0 0 0  0 0.3 0 0 0  0 0 0.2 0 0  0 0 0 0.6 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <linearGradient id="fold-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>

        {/* Peg / Hook */}
        <path d="M50 2 C 50 2, 55 2, 55 8 L 55 12" stroke="#94a3b8" strokeWidth="2" fill="none" />
        <circle cx="50" cy="12" r="2" fill="#64748b" />

        {/* Hanger */}
        <path d="M30 20 L 70 20 L 50 12 Z" fill="none" stroke="#94a3b8" strokeWidth="2" />

        {/* Shirt Body */}
        <path 
          d="M30 20 L 70 20 L 80 35 L 70 45 L 70 90 L 30 90 L 30 45 L 20 35 L 30 20 Z" 
          fill={colors.primary} 
          stroke="rgba(0,0,0,0.1)" 
          strokeWidth="1"
        />

        {/* Collar/Sleeves Detail */}
        <path d="M40 20 Q 50 30 60 20" fill="none" stroke={colors.secondary} strokeWidth="2" />
        <path d="M30 20 L 20 35 L 30 45" fill={colors.secondary} opacity="0.8" />
        <path d="M70 20 L 80 35 L 70 45" fill={colors.secondary} opacity="0.8" />

        {/* Shirt Number */}
        <text 
          x="50" 
          y="65" 
          fontFamily="monospace" 
          fontWeight="bold" 
          fontSize="35" 
          fill={colors.text === 'white' ? '#FFFFFF' : '#000000'} 
          textAnchor="middle"
          style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
        >
          {number}
        </text>

        {/* Mud Splatter Effect (Gaffer style) */}
        <path 
          d="M30 80 Q 35 75 40 85 T 50 80 T 60 85 T 70 80 L 70 90 L 30 90 Z" 
          fill="#4e342e" 
          opacity="0.3" 
          style={{ mixBlendMode: 'multiply' }}
        />
        
        {/* Fabric Fold Shadow */}
        <path d="M30 20 Q 50 90 70 20" fill="url(#fold-gradient)" opacity="0.2" />
      </svg>
    </div>
  );
};

export default PlayerKit;


