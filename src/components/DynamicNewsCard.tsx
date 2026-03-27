
import React, { useMemo } from 'react';

interface DynamicNewsCardProps {
  title: string;
  source?: string;
  className?: string;
  size?: 'large' | 'small';
}

// --- CONFIGURATION ---

const TEAM_THEMES: Record<string, { primary: string; secondary: string; accent: string }> = {
  "Arsenal": { primary: "#EF0107", secondary: "#9C0509", accent: "#FFFFFF" },
  "Aston Villa": { primary: "#670E36", secondary: "#3A051C", accent: "#95BFE5" },
  "Bournemouth": { primary: "#DA291C", secondary: "#000000", accent: "#FFFFFF" },
  "Brentford": { primary: "#E30613", secondary: "#B3000C", accent: "#FFFFFF" },
  "Brighton": { primary: "#0057B8", secondary: "#003572", accent: "#FFFFFF" },
  "Chelsea": { primary: "#034694", secondary: "#022856", accent: "#FFFFFF" },
  "Crystal Palace": { primary: "#1B458F", secondary: "#C4122E", accent: "#FFFFFF" },
  "Everton": { primary: "#003399", secondary: "#001F5C", accent: "#FFFFFF" },
  "Fulham": { primary: "#000000", secondary: "#333333", accent: "#FFFFFF" },
  "Ipswich": { primary: "#3A64A3", secondary: "#1F385E", accent: "#FFFFFF" },
  "Leicester": { primary: "#0053A0", secondary: "#003366", accent: "#FFFFFF" },
  "Liverpool": { primary: "#C8102E", secondary: "#8A091E", accent: "#F6EB61" },
  "Luton": { primary: "#F78F1E", secondary: "#2D2D2D", accent: "#FFFFFF" },
  "Man City": { primary: "#6CABDD", secondary: "#1C2C5B", accent: "#FFFFFF" },
  "Man Utd": { primary: "#DA291C", secondary: "#000000", accent: "#FFE500" },
  "Newcastle": { primary: "#000000", secondary: "#222222", accent: "#FFFFFF" },
  "Nottingham Forest": { primary: "#DD0000", secondary: "#8B0000", accent: "#FFFFFF" },
  "Southampton": { primary: "#D71920", secondary: "#000000", accent: "#FFFFFF" },
  "Spurs": { primary: "#132257", secondary: "#080F29", accent: "#FFFFFF" },
  "West Ham": { primary: "#7A263A", secondary: "#521625", accent: "#1BB1E7" },
  "Wolves": { primary: "#FDB913", secondary: "#231F20", accent: "#FFFFFF" },
  "Default": { primary: "#0f172a", secondary: "#020617", accent: "#38bdf8" }
};

const KEYWORDS = [
  { words: ['injury', 'injured', 'knock', 'scan', 'surgery', 'ruled out'], text: 'INJURY', icon: 'fa-user-injured', color: 'text-red-500' },
  { words: ['transfer', 'sign', 'bid', 'deal', 'agreement', 'loan', 'target'], text: 'TRANSFER', icon: 'fa-file-signature', color: 'text-yellow-400' },
  { words: ['sack', 'leave', 'depart', 'exit', 'fired'], text: 'SACKED', icon: 'fa-door-open', color: 'text-red-600' },
  { words: ['var', 'referee', 'decision', 'offside', 'penalty', 'foul'], text: 'VAR CHECK', icon: 'fa-tv', color: 'text-purple-400' },
  { words: ['goal', 'score', 'hat-trick', 'brace', 'net'], text: 'GOAL', icon: 'fa-futbol', color: 'text-green-400' },
  { words: ['win', 'victory', 'beat', 'thrash', 'hammer'], text: 'VICTORY', icon: 'fa-trophy', color: 'text-yellow-500' },
  { words: ['loss', 'defeat', 'lose', 'crash'], text: 'DEFEAT', icon: 'fa-heart-broken', color: 'text-slate-400' },
  { words: ['contract', 'extend', 'new deal'], text: 'CONTRACT', icon: 'fa-pen-nib', color: 'text-emerald-400' },
];

// --- HELPERS ---

const detectTeam = (text: string): string => {
  const t = text.toLowerCase();
  if (t.includes('man city') || t.includes('city')) return 'Man City';
  if (t.includes('man utd') || t.includes('united') || t.includes('devils')) return 'Man Utd';
  if (t.includes('forest')) return 'Nottingham Forest';
  if (t.includes('spurs') || t.includes('tottenham')) return 'Spurs';
  if (t.includes('wolves')) return 'Wolves';
  if (t.includes('villa')) return 'Aston Villa';
  
  const found = Object.keys(TEAM_THEMES).find(team => t.includes(team.toLowerCase()));
  return found || 'Default';
};

const analyzeContent = (title: string) => {
  const lowerTitle = title.toLowerCase();
  const match = KEYWORDS.find(k => k.words.some(w => lowerTitle.includes(w)));
  
  if (match) return match;
  
  return { text: 'BREAKING', icon: 'fa-newspaper', color: 'text-white' };
};

const DynamicNewsCard: React.FC<DynamicNewsCardProps> = ({ title, source, className = "", size = 'large' }) => {
  
  // 1. Determine Theme
  const teamName = useMemo(() => detectTeam((title + " " + source)), [title, source]);
  const theme = TEAM_THEMES[teamName];

  // 2. Determine Content
  const { text: bgText, icon, color: iconColor } = useMemo(() => analyzeContent(title), [title]);

  // Small Variant (List View)
  if (size === 'small') {
    return (
      <div 
        className={`w-full h-full relative overflow-hidden flex items-center justify-center ${className}`}
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
        }}
      >
        <i className={`fas ${icon} text-xl text-white/80 drop-shadow-md`}></i>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
    );
  }

  // Large Variant (Slider)
  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}
      style={{
        background: `radial-gradient(circle at 70% 20%, ${theme.primary}, ${theme.secondary})`
      }}
    >
      {/* Texture: Scanlines */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)' }}
      ></div>

      {/* Texture: Noise */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

      {/* Background Text (Massive, Hollow) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden"
        style={{ transform: 'translate(-50%, -50%) rotate(-10deg) scale(1.5)' }}
      >
        <span 
          className="font-black text-[120px] md:text-[180px] leading-none text-transparent uppercase opacity-10 whitespace-nowrap"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}
        >
          {bgText}
        </span>
      </div>

      {/* Foreground Icon (Hero) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform scale-150 md:scale-100 flex flex-col items-center justify-center z-10">
         <div className={`text-8xl md:text-9xl drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] ${iconColor} filter brightness-110`}>
            <i className={`fas ${icon}`}></i>
         </div>
      </div>

      {/* Breaking News Strip (Bottom Left) */}
      <div className="absolute bottom-8 left-0 z-20">
         <div className="bg-[#facc15] text-black px-4 py-2 font-black uppercase text-xs md:text-sm tracking-widest shadow-lg flex items-center gap-3 transform -skew-x-12 -ml-2 border-r-4 border-black">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse ml-2"></div>
             Gaffer Update
         </div>
      </div>

      {/* Gaffer Reaction Badge (Top Right) */}
      <div className="absolute top-6 right-6 z-20 hidden md:block">
         <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center shadow-xl relative group">
            <img src="/says.svg" alt="Gaffer" className="w-12 h-12 object-contain rounded-full" />
            <div className="absolute -bottom-1 -right-1 bg-white text-base rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
               {['VICTORY', 'GOAL', 'CONTRACT', 'TRANSFER'].includes(bgText) ? '👍' : 
                ['DEFEAT', 'INJURY', 'SACKED'].includes(bgText) ? '🤬' : '🤔'}
            </div>
         </div>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none"></div>
    </div>
  );
};

export default DynamicNewsCard;


