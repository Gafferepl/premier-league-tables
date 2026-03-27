
import React from 'react';

interface TeamIconProps {
  team: string;
  size?: string;
  className?: string;
}

const TEAM_COLORS: Record<string, { primary: string; secondary: string; text: 'white' | 'black'; style: 'solid' | 'stripes' | 'sleeves' | 'halves' }> = {
  "Arsenal": { primary: "#EF0107", secondary: "#FFFFFF", text: "white", style: "sleeves" },
  "Aston Villa": { primary: "#670E36", secondary: "#95BFE5", text: "white", style: "sleeves" },
  "Bournemouth": { primary: "#DA291C", secondary: "#000000", text: "white", style: "stripes" },
  "Brentford": { primary: "#E30613", secondary: "#FFFFFF", text: "black", style: "stripes" },
  "Brighton": { primary: "#0057B8", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Burnley": { primary: "#6C1D45", secondary: "#99D6EA", text: "white", style: "sleeves" },
  "Chelsea": { primary: "#034694", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Crystal Palace": { primary: "#1B458F", secondary: "#C4122E", text: "white", style: "stripes" },
  "Everton": { primary: "#003399", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Fulham": { primary: "#FFFFFF", secondary: "#000000", text: "black", style: "solid" },
  "Ipswich": { primary: "#3A64A3", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Leicester": { primary: "#0053A0", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Liverpool": { primary: "#C8102E", secondary: "#F6EB61", text: "white", style: "solid" },
  "Luton": { primary: "#F78F1E", secondary: "#FFFFFF", text: "black", style: "solid" },
  "Man City": { primary: "#6CABDD", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Man Utd": { primary: "#DA291C", secondary: "#000000", text: "white", style: "solid" },
  "Newcastle": { primary: "#241F20", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Nottingham Forest": { primary: "#DD0000", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Sheffield United": { primary: "#EE2737", secondary: "#000000", text: "white", style: "stripes" },
  "Southampton": { primary: "#D71920", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Spurs": { primary: "#FFFFFF", secondary: "#132257", text: "black", style: "solid" },
  "West Ham": { primary: "#7A263A", secondary: "#1BB1E7", text: "white", style: "sleeves" },
  "Wolves": { primary: "#FDB913", secondary: "#231F20", text: "black", style: "solid" },
  // Default
  "Default": { primary: "#333333", secondary: "#666666", text: "white", style: "solid" }
};

const getAbbr = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('man') && n.includes('city')) return 'MCI';
  if (n.includes('man') && (n.includes('utd') || n.includes('united'))) return 'MUN';
  if (n.includes('tottenham') || n.includes('spurs')) return 'TOT';
  if (n.includes('forest')) return 'NFO';
  if (n.includes('villa')) return 'AVL';
  if (n.includes('palace')) return 'CRY';
  if (n.includes('brighton')) return 'BHA';
  if (n.includes('wolves')) return 'WOL';
  if (n.includes('sheffield')) return 'SHU';
  if (n.includes('luton')) return 'LUT';
  if (n.includes('west ham')) return 'WHU';
  if (n.includes('bournemouth')) return 'BOU';
  return name.substring(0, 3).toUpperCase();
};

const normalizeKey = (t: string) => {
    const lower = t.toLowerCase();
    if (lower.includes('man') && lower.includes('city')) return 'Man City';
    if (lower.includes('man') && (lower.includes('utd') || lower.includes('united'))) return 'Man Utd';
    if (lower.includes('forest')) return 'Nottingham Forest';
    if (lower.includes('spurs') || lower.includes('tottenham')) return 'Spurs';
    if (lower.includes('wolves')) return 'Wolves';
    if (lower.includes('sheffield')) return 'Sheffield United';
    const found = Object.keys(TEAM_COLORS).find(k => t.includes(k));
    return found || 'Default';
};

const TeamIcon: React.FC<TeamIconProps> = ({ team, size = "w-8 h-8", className = "" }) => {
  const teamKey = normalizeKey(team);
  const colors = TEAM_COLORS[teamKey];
  const abbr = getAbbr(team);

  // Generate CSS based on style
  const getStyle = () => {
    const base = {
      backgroundColor: colors.primary,
      borderColor: colors.secondary,
      color: colors.text === 'white' ? '#fff' : '#000',
    };

    if (colors.style === 'stripes') {
      return {
        ...base,
        background: `repeating-linear-gradient(to right, ${colors.primary}, ${colors.primary} 7px, ${colors.secondary} 7px, ${colors.secondary} 14px)`,
        borderWidth: '2px'
      };
    }

    if (colors.style === 'sleeves') {
      return {
        ...base,
        borderWidth: '4px' // Thick border mimics sleeves/trim
      };
    }

    // Solid
    return {
      ...base,
      borderWidth: '2px'
    };
  };

  const styleObj = getStyle();

  return (
    <div 
      className={`${size} ${className} rounded-full flex items-center justify-center shadow-inner relative overflow-hidden shrink-0 border-solid`}
      style={styleObj}
      title={team}
    >
      {/* Texture Overlay for Fabric Feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10 pointer-events-none"></div>
      
      {/* Text Shadow for readability on stripes */}
      <span className="relative z-10 text-[10px] font-black tracking-tighter leading-none" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}>
        {abbr}
      </span>
    </div>
  );
};

export default TeamIcon;


