import React, { useState, useMemo, useRef } from 'react';
import { LeagueTableEntry } from '../types';
import { getTeamLogo } from '../constants';
import ShareSnapshot from './ShareSnapshot';
import LogoWithFallback from './LogoWithFallback';

interface SmartTableProps {
  data: LeagueTableEntry[];
  fallbackEmbedId: string;
}

interface GafferTableEntry extends LeagueTableEntry {
  gafferPoints: number;
  simulatedGoalsFor: number;
  position: number;
}

// Optimization: Moved outside component to avoid re-creation on every render
const enrichData = (entries: LeagueTableEntry[]): GafferTableEntry[] => {
  return entries.map(entry => {
    let hash = 0;
    for (let i = 0; i < entry.team.length; i++) {
      hash = entry.team.charCodeAt(i) + ((hash << 5) - hash);
    }
    const positiveHash = Math.abs(hash);

    const isTippyTappy = ['Arsenal', 'Man City', 'Liverpool', 'Brighton', 'Spurs', 'Chelsea'].some(t => entry.team.includes(t));
    const isProper = ['Everton', 'Leeds', 'Wolves', 'Nottingham Forest', 'Burnley', 'Sheffield United', 'Luton', 'Newcastle'].some(t => entry.team.includes(t));

    let yc = (positiveHash % 25) + 20; 
    if (isProper) yc += 15;
    if (isTippyTappy) yc -= 5;

    let rc = (positiveHash % 3);
    if (isProper && rc === 0) rc = 1;

    let cs = (positiveHash % 8) + 2;
    const simGoals = Math.max(10, 50 - entry.position * 1.5 + (positiveHash % 10));

    let gPoints = 0;
    gPoints += yc * 3;
    gPoints += rc * 10;
    gPoints += Math.floor(simGoals) * 1;
    gPoints += cs * 5;
    if (isTippyTappy) gPoints -= 10;

    return {
      ...entry,
      yellowCards: yc,
      redCards: rc,
      cleanSheets: cs,
      simulatedGoalsFor: Math.floor(simGoals),
      gafferPoints: gPoints
    };
  });
};

const SmartTable: React.FC<SmartTableProps> = ({ data, fallbackEmbedId }) => {
  const [isGafferMode, setIsGafferMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const enriched = enrichData(data);

    if (isGafferMode) {
      return enriched.sort((a, b) => b.gafferPoints - a.gafferPoints);
    } else {
      return enriched.sort((a, b) => a.position - b.position);
    }
  }, [data, isGafferMode]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-4 md:p-6 min-h-[400px]">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full mb-6"></div>
          {[...Array(12)].map((_, i) => (
             <div key={i} className="flex gap-4 items-center">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0"></div>
                <div className="h-8 bg-slate-100 dark:bg-slate-700/50 rounded w-full"></div>
             </div>
          ))}
        </div>
        <div className="text-center text-slate-400 text-sm mt-8 animate-pulse">
           Fetching live table data...
        </div>
      </div>
    );
  }

  const getRowBackground = (pos: number) => {
    if (isGafferMode) return 'bg-white dark:bg-slate-800'; 
    if (pos <= 4) return 'bg-emerald-50/50 dark:bg-emerald-900/20'; 
    if (pos === 5) return 'bg-orange-50/50 dark:bg-orange-900/20'; 
    if (pos >= 18) return 'bg-red-50/50 dark:bg-red-900/20'; 
    return 'bg-white dark:bg-slate-800'; 
  };

  const getBorderIndicator = (pos: number) => {
    if (isGafferMode) return 'border-l-4 border-transparent pl-1';
    if (pos <= 4) return 'border-l-4 border-emerald-500';
    if (pos === 5) return 'border-l-4 border-orange-500';
    if (pos >= 18) return 'border-l-4 border-red-500';
    return 'border-l-4 border-transparent pl-1'; 
  };

  return (
    <div ref={tableRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 ring-1 ring-black/5 transition-colors duration-500 relative">
      
      {/* 
        Viral Snapshot Integration:
        cropHeight={650} roughly captures the header + top 8-10 teams.
        This fixes the issue of capturing a huge long table that looks bad on social media.
      */}
      <ShareSnapshot 
        targetRef={tableRef} 
        cropHeight={650} 
        className="absolute top-4 right-4 sm:top-5 sm:right-[380px] z-30" 
      />

      <div className={`p-4 md:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-500 ${isGafferMode ? 'bg-[#1a472a] text-white' : 'bg-slate-50 dark:bg-[#0b1120]'}`}>
         
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isGafferMode ? 'bg-[#d4af37] text-[#1a472a]' : 'bg-primary text-white'}`}>
               <i className={`fas ${isGafferMode ? 'fa-beer' : 'fa-list-ol'}`}></i>
            </div>
            <h3 className={`font-heading font-bold uppercase tracking-widest text-lg ${isGafferMode ? 'text-[#d4af37]' : 'text-slate-700 dark:text-white'}`}>
               {isGafferMode ? "The Proper Table" : "League Standings"}
            </h3>
         </div>

         <div className="flex items-center gap-3 bg-black/10 dark:bg-black/30 p-1.5 rounded-full backdrop-blur-sm" data-html2canvas-ignore>
            <span className={`text-[10px] font-bold uppercase px-2 ${!isGafferMode ? 'text-primary dark:text-white' : 'text-white/50'}`}>The Unofficial / Official</span>
            
            <button 
               onClick={() => setIsGafferMode(!isGafferMode)}
               className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative focus:outline-none shadow-inner ${isGafferMode ? 'bg-[#d4af37]' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
               <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isGafferMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            
            <span className={`text-[10px] font-bold uppercase px-2 ${isGafferMode ? 'text-[#d4af37]' : 'text-slate-400'}`}>Gaffer's Proper Table</span>
         </div>
      </div>

      {isGafferMode && (
         <div className="bg-[#1a472a] border-y-4 border-[#d4af37] p-6 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/blackboard.png')]" data-html2canvas-ignore></div>
            
            <div className="relative z-10 flex items-start gap-4">
               <img src="/says.svg" alt="The Gaffer" className="w-16 h-16 object-contain bg-white rounded-full p-1 border-2 border-[#d4af37] shadow-lg shrink-0 transform -rotate-6" data-html2canvas-ignore />
               <div>
                  <h4 className="font-heading font-black text-[#d4af37] text-xl uppercase italic mb-1">
                     "Points for Passion, Not Passing."
                  </h4>
                  <p className="font-mono text-sm text-green-100 leading-relaxed max-w-2xl">
                     I've fixed the table. Official points are boring. In my table, you get <span className="text-white font-bold">+3 for a Yellow</span>, <span className="text-white font-bold">+10 for a Red</span>, and docked points for passing it sideways. Proper football.
                  </p>
               </div>
            </div>
         </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className={`uppercase font-heading text-[10px] md:text-xs tracking-widest border-b border-slate-200 dark:border-slate-700 backdrop-blur-sm transition-colors duration-300 ${isGafferMode ? 'bg-[#153822] text-green-100' : 'bg-slate-100/80 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400'}`}>
              <th className="px-4 py-4 text-center w-16 font-bold">Pos</th>
              <th className="px-4 py-4 font-bold">Club</th>
              <th className="px-4 py-4 text-center font-semibold opacity-70">Pl</th>
              <th className="px-2 py-4 text-center hidden sm:table-cell font-semibold opacity-70">W</th>
              <th className="px-2 py-4 text-center hidden sm:table-cell font-semibold opacity-70">D</th>
              <th className="px-2 py-4 text-center hidden sm:table-cell font-semibold opacity-70">L</th>
              <th className="px-4 py-4 text-center font-semibold opacity-70">GD</th>
              <th className="px-4 py-4 text-center font-semibold opacity-70">{isGafferMode ? 'Grit' : 'Form'}</th>
              <th className={`px-6 py-4 text-center font-black ${isGafferMode ? 'text-[#d4af37] text-base' : 'text-primary dark:text-white'}`}>
                {isGafferMode ? 'Proper Pts' : 'Pts'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {processedData.map((row, idx) => {
              const logo = getTeamLogo(row.team);
              const rank = isGafferMode ? idx + 1 : row.position;
              
              const bgStyle = getRowBackground(row.position);
              const borderStyle = getBorderIndicator(row.position);
              
              return (
              <tr key={row.team} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200 group ${bgStyle}`}>
                <td className={`px-4 py-3 text-center font-mono font-bold ${borderStyle} ${isGafferMode ? 'text-[#d4af37] text-lg' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-white'}`}>
                  {rank}
                </td>
                
                <td className="px-4 py-3">
                   <div className="flex items-center gap-4">
                      {/* Use LogoWithFallback here */}
                      <LogoWithFallback src={logo} teamName={row.team} size="w-10 h-10 md:w-12 md:h-12" className="transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm group-hover:drop-shadow-md" />
                      
                      <span className="text-sm md:text-base font-heading font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors">
                        {row.team}
                      </span>
                   </div>
                </td>

                <td className="px-4 py-3 text-center font-mono text-slate-500 dark:text-slate-400 font-medium">
                  {row.played}
                </td>
                
                <td className="px-2 py-3 text-center hidden sm:table-cell font-mono text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50/50 dark:bg-emerald-900/10 rounded-sm">
                  {row.won}
                </td>
                <td className="px-2 py-3 text-center hidden sm:table-cell font-mono text-slate-400 font-medium">
                  {row.drawn}
                </td>
                <td className="px-2 py-3 text-center hidden sm:table-cell font-mono text-red-500 dark:text-red-400 font-medium bg-red-50/50 dark:bg-red-900/10 rounded-sm">
                  {row.lost}
                </td>
                
                <td className="px-4 py-3 text-center font-mono font-bold text-slate-600 dark:text-slate-300">
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {isGafferMode ? (
                        <div className="flex gap-2">
                           <span className="bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm" title="Yellow Cards">
                              {row.yellowCards} YC
                           </span>
                           {row.redCards && row.redCards > 0 && (
                              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm" title="Red Cards">
                                 {row.redCards} RC
                              </span>
                           )}
                        </div>
                    ) : (
                        row.form && row.form.length > 0 ? (
                        row.form.map((result, idx) => (
                            <span 
                            key={idx} 
                            title={result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}
                            className={`w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-110 cursor-default ${
                                result === 'W' ? 'bg-emerald-500' : 
                                result === 'D' ? 'bg-slate-400' : 
                                'bg-red-500'
                            }`}
                            >
                            {result}
                            </span>
                        ))
                        ) : (
                        <span className="text-xs text-slate-400 italic">N/A</span>
                        )
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-3 text-center">
                  <span className={`inline-block min-w-[3rem] py-1 rounded-md font-black text-sm transition-all duration-300 transform group-hover:scale-110 ${isGafferMode ? 'bg-[#d4af37] text-black shadow-[0_0_10px_#d4af37]' : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-primary'}`}>
                    {isGafferMode ? row.gafferPoints : row.points}
                  </span>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 dark:bg-[#0b1120] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
           {!isGafferMode && (
             <>
                <span className="flex items-center gap-2 font-medium"><span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-dark shadow-sm"></span>Champions League</span>
                <span className="flex items-center gap-2 font-medium"><span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white dark:border-dark shadow-sm"></span>Europa League</span>
                <span className="flex items-center gap-2 font-medium"><span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-dark shadow-sm"></span>Relegation</span>
             </>
           )}
           {isGafferMode && (
             <span className="font-mono text-[#d4af37] font-bold">
               *Gaffer's Algorithm v1.0: +3 YC, +10 RC, +5 CS, -10 Tippy Tappy
             </span>
           )}
        </div>
        <div className="font-mono opacity-70 hidden md:block">
          {isGafferMode ? "Data Source: The Gaffer's Notebook" : "Updated via Gemini AI Live Grounding"}
        </div>
      </div>
    </div>
  );
};

export default SmartTable;