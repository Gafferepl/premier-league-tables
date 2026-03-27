import React, { useRef } from 'react';
import { Fixture } from '../types';
import { getTeamLogo } from '../constants';
import ScreenshotButton from './ScreenshotButton';
import LogoWithFallback from './LogoWithFallback';

interface SmartFixturesProps {
  data: Fixture[];
  fallbackEmbedId: string;
}

const SmartFixtures: React.FC<SmartFixturesProps> = ({ data, fallbackEmbedId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 p-4 min-h-[300px]">
        {/* Loading Skeleton */}
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex gap-4 items-center p-4 border-b border-slate-100 dark:border-slate-700">
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="flex-1 flex justify-between items-center px-4">
                   <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                   <div className="h-8 w-12 bg-slate-100 dark:bg-slate-600 rounded"></div>
                   <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
             </div>
          ))}
        </div>
        <div className="text-center text-slate-400 text-sm mt-6 animate-pulse">
           Checking the fixture list...
        </div>
      </div>
    );
  }

  const getFDRColor = (rating?: number) => {
    switch(rating) {
      case 1: return 'bg-emerald-500 text-white';
      case 2: return 'bg-emerald-300 text-emerald-900';
      case 3: return 'bg-slate-300 text-slate-800';
      case 4: return 'bg-orange-400 text-white';
      case 5: return 'bg-red-600 text-white';
      default: return 'bg-slate-200 text-slate-500';
    }
  };

  return (
    <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
      <ScreenshotButton targetRef={containerRef} label="Snap Fixtures" />

      {/* New Split Difficulty Key Explanation */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 space-y-3">
         <div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-primary dark:text-white mr-1 block sm:inline">Attacking Difficulty (ATT):</strong> 
              Rates the opponent's defense on a scale of <span className="font-bold text-success">1 (Green - Easiest to score against)</span> to <span className="font-bold text-highlight">5 (Red - Hardest to score against)</span>. Use this to choose your forwards and midfielders.
            </p>
         </div>
         <div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-primary dark:text-white mr-1 block sm:inline">Defensive Difficulty (DEF):</strong> 
              Rates the opponent's attack on a scale of <span className="font-bold text-success">1 (Green - Easiest to keep a clean sheet)</span> to <span className="font-bold text-highlight">5 (Red - Hardest to keep a clean sheet)</span>. Use this to choose your defenders and goalkeeper.
            </p>
         </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {data.map((match, idx) => {
          const homeLogo = getTeamLogo(match.homeTeam);
          const awayLogo = getTeamLogo(match.awayTeam);
          const overallRating = match.difficulty?.overall || match.fdrRating;
          const attRating = match.difficulty?.att;
          const defRating = match.difficulty?.def;

          return (
            <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex flex-col md:flex-row items-center justify-between gap-4 group">
              
              <div className="flex flex-col md:w-28 text-center md:text-left shrink-0">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {match.date}
                </div>
                {match.gameweek && (
                   <span className="text-[9px] text-slate-300 font-mono mt-1">GW {match.gameweek}</span>
                )}
                
                {attRating && defRating ? (
                   <div className="hidden md:flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-1 justify-between bg-slate-100 dark:bg-slate-900/50 rounded px-1.5 py-0.5">
                         <span className="text-[8px] font-bold text-slate-500">ATT</span>
                         <span className={`text-[8px] font-black w-4 text-center rounded ${getFDRColor(attRating)}`}>{attRating}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-between bg-slate-100 dark:bg-slate-900/50 rounded px-1.5 py-0.5">
                         <span className="text-[8px] font-bold text-slate-500">DEF</span>
                         <span className={`text-[8px] font-black w-4 text-center rounded ${getFDRColor(defRating)}`}>{defRating}</span>
                      </div>
                   </div>
                ) : overallRating && (
                  <div className="hidden md:flex items-center gap-1 mt-2">
                     <span className={`text-[9px] font-black px-1.5 rounded ${getFDRColor(overallRating)}`}>FDR {overallRating}</span>
                  </div>
                )}
              </div>

              <div className="flex-grow flex items-center justify-center gap-2 md:gap-4 w-full">
                
                {/* Home Team */}
                <div className="flex-1 flex items-center justify-end gap-3 text-right">
                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate hidden sm:block">
                    {match.homeTeam}
                  </span>
                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate sm:hidden">
                    {match.homeTeam.substring(0, 3).toUpperCase()}
                  </span>
                  
                  {/* Logo With Fallback */}
                  <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 transition-transform group-hover:scale-110">
                    <LogoWithFallback src={homeLogo} teamName={match.homeTeam} size="w-full h-full" className="drop-shadow-sm" />
                  </div>
                </div>
                
                {/* Score / VS */}
                <div className="shrink-0 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 min-w-[70px] md:min-w-[80px] text-center border border-slate-200 dark:border-slate-700 z-10 flex flex-col items-center justify-center">
                  {match.status === 'live' || match.status === 'finished' ? (
                    <span className={`font-mono font-bold text-lg ${match.status === 'live' ? 'text-accent animate-pulse' : 'text-dark dark:text-white'}`}>
                      {match.score}
                    </span>
                  ) : (
                    <span className="font-mono font-bold text-lg text-slate-500">VS</span>
                  )}
                  {overallRating && (
                    <span className={`md:hidden text-[8px] font-black px-1 rounded mt-1 ${getFDRColor(overallRating)}`}>
                       {attRating ? `ATT ${attRating} / DEF ${defRating}` : `FDR ${overallRating}`}
                    </span>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center justify-start gap-3 text-left">
                  {/* Logo With Fallback */}
                  <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 transition-transform group-hover:scale-110">
                    <LogoWithFallback src={awayLogo} teamName={match.awayTeam} size="w-full h-full" className="drop-shadow-sm" />
                  </div>

                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate hidden sm:block">
                    {match.awayTeam}
                  </span>
                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate sm:hidden">
                    {match.awayTeam.substring(0, 3).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status / Time */}
              <div className="md:w-24 text-center md:text-right">
                {match.status === 'live' ? (
                  <span className="inline-block px-2 py-1 bg-accent text-white text-xs font-bold rounded animate-pulse">LIVE</span>
                ) : match.status === 'finished' ? (
                  <span className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded">FT</span>
                ) : (
                  <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded border border-slate-300 dark:border-slate-600">
                    {match.time}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center px-6">
        <span>Powered by Gemini Search Grounding</span>
        <span className="text-[9px] font-bold uppercase text-slate-400">Ratings based on Opponent Difficulty</span>
      </div>
    </div>
  );
};

export default SmartFixtures;