
import React from 'react';
import { SackRaceEntry } from '../../types';
import { getTeamLogo } from '../constants';
import ShareSnapshot from './ShareSnapshot';
import LogoWithFallback from './LogoWithFallback';

interface SackZoneProps {
  data: SackRaceEntry[];
}

const SackZone: React.FC<SackZoneProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Sort by temperature descending so hottest seats are first
  const atRiskManagers = [...data].sort((a, b) => b.temperature - a.temperature).slice(0, 5);

  const getStatusLabel = (temp: number) => {
    if (temp >= 90) return 'TAXI WAITING';
    if (temp >= 75) return 'BOARDROOM MEETING';
    if (temp >= 60) return 'ON THIN ICE';
    if (temp >= 40) return 'MEDIA PRESSURE';
    return 'SAFE AS HOUSES';
  };

  return (
    <div className="container mx-auto px-4 mb-16 relative z-10">
      <div id="sack-zone-card" className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border-t-4 border-red-600 relative overflow-hidden group">
        
        <ShareSnapshot targetId="sack-zone-card" className="absolute top-3 right-3 z-30" />

        {/* Hazard Tape Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #eab308 10px, #eab308 20px)' }}></div>

        <div className="p-6 pb-2 relative z-10">
           <div className="flex items-center justify-between mb-2 pr-12">
              <h3 className="text-2xl font-black uppercase tracking-widest text-red-600 flex items-center gap-3">
                 <i className="fas fa-fire-extinguisher animate-pulse"></i> The Sack Race
              </h3>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-200 dark:border-red-800 uppercase tracking-wider hidden sm:inline-block">
                 P45 Index
              </span>
           </div>
           <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Who's clearing their desk? The Gaffer knows.
           </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
           {atRiskManagers.map((manager, idx) => {
              const logo = getTeamLogo(manager.team);
              const isTop = idx === 0;

              return (
                 <div key={manager.manager} className={`p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/20 relative ${isTop ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                    
                    <div className="absolute left-2 top-2 text-4xl font-black text-slate-100 dark:text-slate-700/30 z-0 pointer-events-none">
                       #{idx + 1}
                    </div>

                    <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
                       
                       {/* Manager Info */}
                       <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden border border-slate-300 shadow-sm relative flex items-center justify-center">
                             
                             <LogoWithFallback src={logo} teamName={manager.team} size="w-full h-full" className="p-1 opacity-60" />

                             <div className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow z-10 border border-slate-100">
                                {manager.temperature >= 80 ? (
                                   <i className="fas fa-fire text-xs text-red-600 animate-pulse"></i>
                                ) : manager.temperature >= 50 ? (
                                   <i className="fas fa-thermometer-half text-xs text-orange-500"></i>
                                ) : (
                                   <i className="fas fa-snowflake text-xs text-emerald-500"></i>
                                )}
                             </div>
                          </div>
                          <div>
                             <h4 className="font-bold text-dark dark:text-white text-sm md:text-base leading-tight">{manager.manager}</h4>
                             <div className="text-xs font-black uppercase text-slate-400">{manager.team}</div>
                          </div>
                       </div>

                       {/* Heat Meter */}
                       <div className="col-span-7 sm:col-span-5">
                          <div className="flex justify-between items-center mb-1.5">
                             <span className={`text-[9px] font-black uppercase tracking-wider ${manager.temperature >= 90 ? 'text-red-600 animate-pulse' : manager.temperature >= 60 ? 'text-orange-500' : 'text-slate-400'}`}>
                                {getStatusLabel(manager.temperature)}
                             </span>
                             <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{manager.temperature}% Pressure</span>
                          </div>
                          
                          {/* Gradient Bar Container */}
                          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner relative">
                             {/* The actual gradient bar */}
                             <div 
                                className="h-full absolute top-0 left-0 bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-600 transition-all duration-1000 ease-out rounded-full" 
                                style={{ width: `${manager.temperature}%` }}
                             >
                               {/* Shimmer effect for high heat */}
                               {manager.temperature > 70 && (
                                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-marquee"></div>
                               )}
                             </div>
                          </div>

                          <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-2 line-clamp-1 border-l-2 border-slate-300 dark:border-slate-600 pl-2">
                             "{manager.gafferVerdict}"
                          </p>
                       </div>

                       {/* Odds & Replacement */}
                       <div className="hidden sm:block sm:col-span-3 text-right pl-2 border-l border-slate-100 dark:border-slate-700/50">
                          <div className="text-xs uppercase font-bold text-slate-400 mb-0.5">Rumoured Replacement</div>
                          <div className="text-xs font-bold text-primary dark:text-accent truncate mb-1">{manager.nextManager}</div>
                          <span className="inline-block bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                              Odds: {manager.odds}
                          </span>
                       </div>
                    </div>
                 </div>
              );
           })}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center px-6">
           <div className="text-xs text-slate-400 italic">
              *Predictions based on media reports and recent form.
            </div>
           <a href="https://www.oddschecker.com/football/football-specials/manager-specials" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-primary dark:text-white hover:text-accent transition-colors">
              View All Odds <i className="fas fa-external-link-alt"></i>
           </a>
        </div>
      </div>
    </div>
  );
};

export default SackZone;


