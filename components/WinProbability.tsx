import React, { useMemo, useRef } from 'react';
import { Fixture, LeagueTableEntry, Player } from '../types';
import { getTeamLogo } from '../constants';
import ScreenshotButton from './ScreenshotButton';
import LogoWithFallback from './LogoWithFallback';

interface WinProbabilityProps {
  fixtures: Fixture[];
  table: LeagueTableEntry[];
  scorers: Player[];
}

const WinProbability: React.FC<WinProbabilityProps> = ({ fixtures, table, scorers }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const predictions = useMemo(() => {
    const relevantFixtures = fixtures.filter(f => f.status === 'upcoming' || f.status === 'live').slice(0, 5);

    return relevantFixtures.map(match => {
      let homeProb = 35;
      let awayProb = 30;
      let drawProb = 35;
      let keyFactor = "Squeaky Bum Time";

      const homeStats = table.find(t => t.team === match.homeTeam);
      const awayStats = table.find(t => t.team === match.awayTeam);

      if (homeStats && awayStats) {
        const posDiff = awayStats.position - homeStats.position; 
        if (posDiff > 5) { homeProb += 15; awayProb -= 10; drawProb -= 5; keyFactor = "Men vs Boys"; }
        if (posDiff < -5) { awayProb += 15; homeProb -= 10; drawProb -= 5; keyFactor = "Banana Skin"; }
      }

      const getFormPoints = (form: string[] = []) => form.reduce((acc, r) => acc + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
      const homeFormPts = homeStats ? getFormPoints(homeStats.form) : 5;
      const awayFormPts = awayStats ? getFormPoints(awayStats.form) : 5;

      if (homeFormPts > awayFormPts + 5) { homeProb += 10; awayProb -= 5; drawProb -= 5; keyFactor = "Fortress"; }
      if (awayFormPts > homeFormPts + 5) { awayProb += 10; homeProb -= 5; drawProb -= 5; keyFactor = "On the March"; }

      const homeStar = scorers.find(p => p.team === match.homeTeam);
      const awayStar = scorers.find(p => p.team === match.awayTeam);

      if (homeStar && !awayStar) { homeProb += 5; keyFactor = `${homeStar.name} Magic`; }
      if (awayStar && !homeStar) { awayProb += 5; keyFactor = `${awayStar.name} Threat`; }

      const total = homeProb + awayProb + drawProb;
      const h = Math.round((homeProb / total) * 100);
      const a = Math.round((awayProb / total) * 100);
      const d = 100 - h - a;

      return { ...match, probs: { h, d, a }, keyFactor };
    });
  }, [fixtures, table, scorers]);

  if (predictions.length === 0) return null;

  return (
    <div className="container mx-auto px-4 mb-16 relative z-10">
        
      <div className="w-1 h-8 bg-slate-200 dark:bg-slate-700 mx-auto mb-4"></div>

      <div className="text-center mb-8">
         <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary dark:text-white inline-block relative pb-2">
           The 'Squeaky Bum' Index
           <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-accent rounded-full"></span>
         </h2>
      </div>

      <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
        <ScreenshotButton targetRef={containerRef} label="Snap Predictions" className="absolute top-4 right-48 z-30" />

        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
           <h3 className="font-heading font-bold text-primary dark:text-white uppercase tracking-widest text-sm flex items-center gap-2">
             <i className="fas fa-utensils text-accent"></i> The Gaffer's Gut
           </h3>
           <span className="text-[10px] font-mono text-slate-400 uppercase border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
             Pie Index V1.2
           </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {predictions.map((match, idx) => {
            const homeLogo = getTeamLogo(match.homeTeam);
            const awayLogo = getTeamLogo(match.awayTeam);

            return (
              <div key={idx} className="p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-3 w-1/3">
                      <div className="w-8 h-8 md:w-10 md:h-10 shrink-0">
                         <LogoWithFallback src={homeLogo} teamName={match.homeTeam} size="w-full h-full" />
                      </div>
                      <span className="font-bold text-sm md:text-base text-slate-700 dark:text-slate-200 truncate hidden sm:block">{match.homeTeam}</span>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200 sm:hidden">{match.homeTeam.substring(0,3).toUpperCase()}</span>
                   </div>

                   <div className="text-center w-1/3">
                      <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-2 py-1 rounded-full whitespace-nowrap">
                        {match.keyFactor}
                      </span>
                   </div>

                   <div className="flex items-center justify-end gap-3 w-1/3">
                      <span className="font-bold text-sm md:text-base text-slate-700 dark:text-slate-200 truncate hidden sm:block">{match.awayTeam}</span>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200 sm:hidden">{match.awayTeam.substring(0,3).toUpperCase()}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 shrink-0">
                         <LogoWithFallback src={awayLogo} teamName={match.awayTeam} size="w-full h-full" />
                      </div>
                   </div>
                </div>

                <div className="relative h-8 w-full rounded-lg overflow-hidden flex font-mono text-xs font-bold text-white shadow-inner">
                   
                   <div 
                     className="bg-primary flex items-center justify-start pl-3 transition-all duration-1000 relative group/segment"
                     style={{ width: `${match.probs.h}%` }}
                   >
                      <span>{match.probs.h}%</span>
                      <div className="absolute top-full left-0 mt-1 bg-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/segment:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                        Home Win
                      </div>
                   </div>

                   <div 
                     className="bg-slate-400 dark:bg-slate-600 flex items-center justify-center transition-all duration-1000 relative group/segment"
                     style={{ width: `${match.probs.d}%` }}
                   >
                      <span className="text-slate-100">{match.probs.d}%</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/segment:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                        Draw
                      </div>
                   </div>

                   <div 
                     className="bg-accent flex items-center justify-end pr-3 transition-all duration-1000 relative group/segment"
                     style={{ width: `${match.probs.a}%` }}
                   >
                      <span>{match.probs.a}%</span>
                      <div className="absolute top-full right-0 mt-1 bg-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/segment:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                        Away Win
                      </div>
                   </div>

                   <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1 font-bold uppercase tracking-wider">
                   <span>Home Win</span>
                   <span>Draw</span>
                   <span>Away Win</span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WinProbability;