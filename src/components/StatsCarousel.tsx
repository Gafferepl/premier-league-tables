import React, { useState, useRef } from 'react';
import { getTeamLogo, GAFFER_VERDICTS } from '../constants';
import { MatchStats } from '../../types';
import ShareSnapshot from './ShareSnapshot';
import LogoWithFallback from './LogoWithFallback';
import AnalyticsExplainer from './AnalyticsExplainer';

interface StatsCarouselProps {
  data: MatchStats[];
}

const StatsCarousel: React.FC<StatsCarouselProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showExplainer, setShowExplainer] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) {
    return (
       // Skeleton
       <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative h-[500px] animate-pulse">
         <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between">
           <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
           <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
           <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
         </div>
         <div className="p-8 bg-slate-200 dark:bg-slate-800 h-48 flex justify-center items-center">
            <div className="w-16 h-16 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
         </div>
         <div className="p-6 space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
         </div>
       </div>
    );
  }

  const nextMatch = () => {
    setActiveIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevMatch = () => {
    setActiveIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const match = data[activeIndex];
  const homeLogo = getTeamLogo(match.homeTeam);
  const awayLogo = getTeamLogo(match.awayTeam);

  const calcPercentage = (val: number, total: number) => {
    if (total === 0) return 50;
    return Math.round((val / total) * 100);
  };

  const possessionHome = match.possession?.home || 50;
  const possessionAway = match.possession?.away || 50;
  
  const shotsTotal = (match.shots?.home || 0) + (match.shots?.away || 0);
  const shotsHomePct = calcPercentage(match.shots?.home || 0, shotsTotal);
  const shotsAwayPct = calcPercentage(match.shots?.away || 0, shotsTotal);

  const getGafferSummary = (m: MatchStats) => {
    const scoreParts = m.score.split('-').map(s => parseInt(s.trim()));
    const homeGoals = isNaN(scoreParts[0]) ? 0 : scoreParts[0];
    const awayGoals = isNaN(scoreParts[1]) ? 0 : scoreParts[1];
    const totalGoals = homeGoals + awayGoals;
    
    const hPoss = m.possession?.home || 50;
    const aPoss = m.possession?.away || 50;
    
    const totalShots = (m.shots?.home || 0) + (m.shots?.away || 0);

    const hashStr = `${m.homeTeam}${m.awayTeam}${m.score}`;
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
        hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const safeHash = Math.abs(hash);

    let category: string[] = GAFFER_VERDICTS.GENERIC;

    if (totalGoals === 0) {
        category = GAFFER_VERDICTS.BORE_DRAW;
    }
    else if (totalGoals >= 5) {
        category = GAFFER_VERDICTS.GOAL_FEST;
    }
    else if ((hPoss < 35 && homeGoals > awayGoals) || (aPoss < 35 && awayGoals > homeGoals)) {
        category = GAFFER_VERDICTS.SMASH_GRAB;
    }
    else if ((hPoss > 65 && homeGoals <= awayGoals) || (aPoss > 65 && awayGoals <= homeGoals)) {
        category = GAFFER_VERDICTS.TIPPY_TAPPY;
    }
    else if (totalShots > 25 && totalGoals <= 1) {
        category = GAFFER_VERDICTS.WASTEFUL;
    }
    
    return category[safeHash % category.length];
  };

  return (
    <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 md:p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <i className="fas fa-chart-bar text-white text-lg md:text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">The Gaffer's Roundup</h2>
                <p className="text-xs text-slate-400 font-medium">Match stats, scorers & the Gaffer's verdict</p>
              </div>
            </div>
            <ShareSnapshot targetRef={containerRef} className="relative z-30" />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevMatch}
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-all"
              data-html2canvas-ignore
            >
              <i className="fas fa-chevron-left text-sm"></i>
            </button>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Premier League</span>
              <span className="text-sm font-black text-white">{match.date}</span>
              <span className="text-[10px] font-bold text-slate-500">{activeIndex + 1}/{data.length}</span>
            </div>

            <button
              onClick={nextMatch}
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-all"
              data-html2canvas-ignore
            >
              <i className="fas fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

        <div className="relative z-10">
          {/* Teams + Score */}
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            {/* Home Team */}
            <div className="text-center flex-1 flex flex-col items-center group">
              <div className="w-20 h-20 md:w-28 md:h-28 mx-auto flex items-center justify-center mb-3 bg-white/10 backdrop-blur-sm rounded-full p-2 border-2 border-white/20 shadow-xl group-hover:scale-105 transition-transform">
                <LogoWithFallback src={homeLogo} teamName={match.homeTeam} size="w-14 h-14 md:w-20 md:h-20" className="text-3xl" />
              </div>
              <h2 className="font-black text-lg md:text-2xl text-white drop-shadow-lg mb-0.5">{match.homeTeam}</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Home</span>
            </div>

            {/* Score */}
            <div className="text-center px-4 md:px-8 shrink-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Full Time</div>
              <div className="text-6xl md:text-8xl font-black font-mono tracking-wider text-white bg-white/15 backdrop-blur-sm px-6 md:px-10 py-4 md:py-6 rounded-2xl shadow-2xl border border-white/20">
                {match.score}
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center flex-1 flex flex-col items-center group">
              <div className="w-20 h-20 md:w-28 md:h-28 mx-auto flex items-center justify-center mb-3 bg-white/10 backdrop-blur-sm rounded-full p-2 border-2 border-white/20 shadow-xl group-hover:scale-105 transition-transform">
                <LogoWithFallback src={awayLogo} teamName={match.awayTeam} size="w-14 h-14 md:w-20 md:h-20" className="text-3xl" />
              </div>
              <h2 className="font-black text-lg md:text-2xl text-white drop-shadow-lg mb-0.5">{match.awayTeam}</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Away</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scorers */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-700/50 p-5 md:p-6">
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <i className="fas fa-futbol text-primary text-[9px]"></i> Home Scorers
            </div>
            {match.homeScorers && match.homeScorers.length > 0 ? (
              <div className="space-y-1">
                {match.homeScorers.map((scorer, idx) => (
                  <div key={idx} className="text-sm font-medium text-slate-900 dark:text-white">
                    ⚽ {scorer}
                  </div>
                ))}
              </div>
            ) : <span className="text-xs text-slate-400 italic">No goals</span>}
          </div>

          <div className="w-px bg-slate-200 dark:bg-slate-700 self-stretch"></div>

          <div className="flex-1 min-w-0 text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-end gap-1.5">
              Away Scorers <i className="fas fa-futbol text-accent text-[9px]"></i>
            </div>
            {match.awayScorers && match.awayScorers.length > 0 ? (
              <div className="space-y-1">
                {match.awayScorers.map((scorer, idx) => (
                  <div key={idx} className="text-sm font-medium text-slate-900 dark:text-white">
                    ⚽ {scorer}
                  </div>
                ))}
              </div>
            ) : <span className="text-xs text-slate-400 italic">No goals</span>}
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-700/50 p-5 md:p-6">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-chart-line text-emerald-500 text-[9px]"></i>
            Advanced Analytics (xG/xA)
          </div>
          <button
            onClick={() => setShowExplainer(true)}
            className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors group"
            title="Learn about xG/xA analytics"
          >
            <i className="fas fa-book-open text-[10px]"></i>
            <span className="text-[10px] font-medium">Guide</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500">xG (Expected Goals)</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: match.xg ? `${calcPercentage(match.xg.home, match.xg.home + match.xg.away)}%` : '50%' }} />
              </div>
              <span className="font-bold text-xs w-8 text-right">{match.xg ? match.xg.home.toFixed(1) : '-'}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500">xA (Expected Assists)</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: match.xa ? `${calcPercentage(match.xa.home, match.xa.home + match.xa.away)}%` : '50%' }} />
              </div>
              <span className="font-bold text-xs w-8 text-right">{match.xa ? match.xa.home.toFixed(1) : '-'}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500">Big Chances</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: match.big_chances_created ? `${calcPercentage(match.big_chances_created.home, match.big_chances_created.home + match.big_chances_created.away)}%` : '50%' }} />
              </div>
              <span className="font-bold text-xs w-8 text-right">{match.big_chances_created ? match.big_chances_created.home : '-'}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500">Total xG</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full" style={{ width: match.xg_total ? `${Math.min(match.xg_total * 20, 100)}%` : '50%' }} />
              </div>
              <span className="font-bold text-xs w-8 text-right">{match.xg_total ? match.xg_total.toFixed(1) : '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 md:p-6 space-y-4">

        {/* Stat bars */}
        {[
          { label: 'Possession', homeVal: possessionHome, awayVal: possessionAway, homePct: possessionHome, awayPct: possessionAway, suffix: '%', homeColor: 'from-primary to-primary/80', awayColor: 'from-accent to-accent/80' },
          { label: 'Total Shots', homeVal: match.shots?.home || 0, awayVal: match.shots?.away || 0, homePct: shotsHomePct, awayPct: shotsAwayPct, suffix: '', homeColor: 'from-blue-500 to-blue-400', awayColor: 'from-pink-500 to-pink-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-slate-800 dark:text-white">{stat.homeVal}{stat.suffix}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              <span className="text-sm font-black text-slate-800 dark:text-white">{stat.awayVal}{stat.suffix}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div className={`bg-gradient-to-r ${stat.homeColor} h-full rounded-l-full transition-all duration-700`} style={{ width: `${stat.homePct}%` }}></div>
              <div className={`bg-gradient-to-l ${stat.awayColor} h-full rounded-r-full transition-all duration-700`} style={{ width: `${stat.awayPct}%` }}></div>
            </div>
          </div>
        ))}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-primary dark:text-white">{match.shotsOnTarget?.home || 0}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Home On Target</div>
          </div>
          <div className="bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-slate-600 dark:text-slate-300">
              {(match.shots?.home || 0) + (match.shots?.away || 0)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Total Shots</div>
          </div>
          <div className="bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-accent">{match.shotsOnTarget?.away || 0}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Away On Target</div>
          </div>
        </div>

        {/* Gaffer's Verdict */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-yellow-500/20">
              <i className="fas fa-quote-left text-white text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500/80 mb-1.5">The Gaffer's Verdict</div>
              <p className="text-sm md:text-base font-bold text-white/90 italic leading-relaxed">
                "{getGafferSummary(match)}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 px-5 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
          <i className="fas fa-chart-line mr-1.5 text-accent"></i>
          "Statistics are like mini-skirts. They show a lot, but hide the vital parts." — The Gaffer
        </p>
      </div>

      {/* Analytics Explainer Modal */}
      <AnalyticsExplainer 
        isOpen={showExplainer} 
        onClose={() => setShowExplainer(false)} 
      />
    </div>
  );
};

export default StatsCarousel;


