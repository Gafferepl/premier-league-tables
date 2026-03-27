import React from 'react';

interface CountryIconProps {
  country: string;
  size?: string;
  className?: string;
}

const COUNTRY_COLORS: Record<string, { primary: string; secondary: string; text: 'white' | 'black'; style: 'solid' | 'stripes' | 'sleeves' | 'halves' | 'cross' | 'diagonal' }> = {
  // UK Nations
  "England": { primary: "#CF142B", secondary: "#FFFFFF", text: "white", style: "cross" },
  "Wales": { primary: "#DC143C", secondary: "#FFFFFF", text: "black", style: "halves" },
  "Scotland": { primary: "#0065BD", secondary: "#FFFFFF", text: "white", style: "diagonal" },
  "Northern Ireland": { primary: "#FF7900", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Ireland": { primary: "#169B62", secondary: "#FFFFFF", text: "white", style: "solid" },
  
  // Western Europe
  "Germany": { primary: "#000000", secondary: "#DD0000", text: "white", style: "stripes" },
  "France": { primary: "#002395", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Spain": { primary: "#AA151B", secondary: "#FFC400", text: "black", style: "stripes" },
  "Portugal": { primary: "#006847", secondary: "#FF0000", text: "white", style: "solid" },
  "Belgium": { primary: "#000000", secondary: "#ED2939", text: "white", style: "stripes" },
  "Netherlands": { primary: "#AE1C28", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Switzerland": { primary: "#FF0000", secondary: "#FFFFFF", text: "white", style: "cross" },
  "Austria": { primary: "#ED2939", secondary: "#FFFFFF", text: "white", style: "stripes" },
  
  // Southern Europe
  "Italy": { primary: "#009246", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Croatia": { primary: "#FF0000", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Slovenia": { primary: "#005DA4", secondary: "#FFFFFF", text: "white", style: "stripes" },
  
  // Eastern Europe
  "Poland": { primary: "#FFFFFF", secondary: "#DC143C", text: "white", style: "stripes" },
  "Czech Republic": { primary: "#D7141A", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Slovakia": { primary: "#EE1C25", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Hungary": { primary: "#436F4D", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Romania": { primary: "#002B7F", secondary: "#FFDE00", text: "white", style: "stripes" },
  "Bulgaria": { primary: "#FFFFFF", secondary: "#00966E", text: "white", style: "stripes" },
  "Serbia": { primary: "#C6363C", secondary: "#0C4076", text: "white", style: "stripes" },
  "Ukraine": { primary: "#005BBB", secondary: "#FFD500", text: "white", style: "stripes" },
  "Denmark": { primary: "#C60C30", secondary: "#FFFFFF", text: "white", style: "cross" },
  
  // Scandinavia
  "Sweden": { primary: "#006AA7", secondary: "#FECC00", text: "white", style: "cross" },
  "Norway": { primary: "#BA0C2F", secondary: "#00205B", text: "white", style: "cross" },
  "Finland": { primary: "#FFFFFF", secondary: "#003580", text: "white", style: "cross" },
  "Iceland": { primary: "#003897", secondary: "#FFFFFF", text: "white", style: "cross" },
  
  // Americas
  "USA": { primary: "#B22234", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Canada": { primary: "#FF0000", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Mexico": { primary: "#006847", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Argentina": { primary: "#74ACDF", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Brazil": { primary: "#009739", secondary: "#FFDF00", text: "white", style: "solid" },
  "Uruguay": { primary: "#0038A8", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Colombia": { primary: "#003893", secondary: "#FCE300", text: "white", style: "stripes" },
  "Chile": { primary: "#0038A8", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Peru": { primary: "#D91023", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Ecuador": { primary: "#FFDD00", secondary: "#ED1C24", text: "white", style: "stripes" },
  "Bolivia": { primary: "#DA291C", secondary: "#FCD116", text: "white", style: "stripes" },
  "Paraguay": { primary: "#0038A8", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Venezuela": { primary: "#003893", secondary: "#FFCC00", text: "white", style: "stripes" },
  "Costa Rica": { primary: "#002B7F", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Panama": { primary: "#DA121A", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Jamaica": { primary: "#000000", secondary: "#FFDF00", text: "white", style: "stripes" },
  "Trinidad & Tobago": { primary: "#E00000", secondary: "#000000", text: "white", style: "stripes" },
  "Haiti": { primary: "#D52B1E", secondary: "#002395", text: "white", style: "stripes" },
  "Guatemala": { primary: "#0047A0", secondary: "#FFFFFF", text: "white", style: "stripes" },
  
  // Africa
  "Egypt": { primary: "#000000", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Ghana": { primary: "#006B3F", secondary: "#FFD90F", text: "white", style: "stripes" },
  "Nigeria": { primary: "#008751", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "South Africa": { primary: "#007A4D", secondary: "#000000", text: "white", style: "stripes" },
  "Morocco": { primary: "#C1272D", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Tunisia": { primary: "#E70013", secondary: "#FFFFFF", text: "white", style: "solid" },
  "Algeria": { primary: "#006633", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Cameroon": { primary: "#007A5E", secondary: "#FFD90F", text: "white", style: "stripes" },
  "Ivory Coast": { primary: "#F77F00", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "Senegal": { primary: "#0053A0", secondary: "#FFD90F", text: "white", style: "stripes" },
  
  // Asia
  "Japan": { primary: "#BC002D", secondary: "#FFFFFF", text: "white", style: "solid" },
  "South Korea": { primary: "#003478", secondary: "#FFFFFF", text: "white", style: "stripes" },
  "China": { primary: "#DE2910", secondary: "#FFDE00", text: "white", style: "solid" },
  "India": { primary: "#FF9933", secondary: "#FFFFFF", text: "black", style: "stripes" },
  "Australia": { primary: "#012169", secondary: "#FFFFFF", text: "white", style: "cross" },
  "New Zealand": { primary: "#000000", secondary: "#FFFFFF", text: "white", style: "cross" },
  
  // Default
  "Default": { primary: "#333333", secondary: "#666666", text: "white", style: "solid" }
};

const getAbbr = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('united') && n.includes('states')) return 'USA';
  if (n.includes('united') && n.includes('kingdom')) return 'UK';
  if (n.includes('south') && n.includes('korea')) return 'KOR';
  if (n.includes('north') && n.includes('korea')) return 'PRK';
  if (n.includes('costa') && n.includes('rica')) return 'CRC';
  if (n.includes('trinidad') || n.includes('tobago')) return 'TTO';
  if (n.includes('new') && n.includes('zealand')) return 'NZL';
  if (n.includes('south') && n.includes('africa')) return 'RSA';
  if (n.includes('saudi') && n.includes('arabia')) return 'KSA';
  if (n.includes('united') && n.includes('arab')) return 'UAE';
  if (n.includes('czech') || n.includes('republic')) return 'CZE';
  if (n.includes('northern') && n.includes('ireland')) return 'NIR';
  return name.substring(0, 3).toUpperCase();
};

const normalizeKey = (t: string) => {
    const lower = t.toLowerCase();
    if (lower.includes('united') && lower.includes('states')) return 'USA';
    if (lower.includes('united') && lower.includes('kingdom')) return 'England';
    if (lower.includes('south') && lower.includes('korea')) return 'South Korea';
    if (lower.includes('north') && lower.includes('korea')) return 'North Korea';
    if (lower.includes('costa') && lower.includes('rica')) return 'Costa Rica';
    if (lower.includes('trinidad') || lower.includes('tobago')) return 'Trinidad & Tobago';
    if (lower.includes('new') && lower.includes('zealand')) return 'New Zealand';
    if (lower.includes('south') && lower.includes('africa')) return 'South Africa';
    if (lower.includes('saudi') && lower.includes('arabia')) return 'Saudi Arabia';
    if (lower.includes('united') && lower.includes('arab')) return 'United Arab Emirates';
    if (lower.includes('czech') || lower.includes('republic')) return 'Czech Republic';
    if (lower.includes('northern') && lower.includes('ireland')) return 'Northern Ireland';
    const found = Object.keys(COUNTRY_COLORS).find(k => t.includes(k));
    return found || 'Default';
};

const CountryIcon: React.FC<CountryIconProps> = ({ country, size = "w-8 h-8", className = "" }) => {
  const countryKey = normalizeKey(country);
  const colors = COUNTRY_COLORS[countryKey];
  const abbr = getAbbr(country);

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

    if (colors.style === 'cross') {
      return {
        ...base,
        background: `linear-gradient(to right, ${colors.secondary} 35%, ${colors.primary} 35%, ${colors.primary} 65%, ${colors.secondary} 65%), linear-gradient(to bottom, ${colors.secondary} 35%, ${colors.primary} 35%, ${colors.primary} 65%, ${colors.secondary} 65%)`,
        borderWidth: '2px'
      };
    }

    if (colors.style === 'diagonal') {
      return {
        ...base,
        background: `linear-gradient(to bottom right, ${colors.primary} 45%, ${colors.secondary} 45%, ${colors.secondary} 55%, ${colors.primary} 55%)`,
        borderWidth: '2px'
      };
    }

    if (colors.style === 'halves') {
      return {
        ...base,
        background: `linear-gradient(to right, ${colors.primary} 50%, ${colors.secondary} 50%)`,
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
      title={country}
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

export default CountryIcon;


