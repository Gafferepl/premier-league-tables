
import React, { useMemo, useRef } from 'react';
import { Fixture, LeagueTableEntry, Player } from '../../types';
import { getTeamLogo } from '../constants';
import ShareSnapshot from './ShareSnapshot';
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

      // Advanced Analytics: xG factors
      const homeXG = homeStats?.xg_per_game || 1.5;
      const awayXG = awayStats?.xg_per_game || 1.5;
      const homeXGA = homeStats?.xga_per_game || 1.5;
      const awayXGA = awayStats?.xga_per_game || 1.5;

      // xG advantage
      if (homeXG > awayXG + 0.3) { 
        homeProb += 8; 
        keyFactor = "Expected Goals Advantage"; 
      } else if (awayXG > homeXG + 0.3) { 
        awayProb += 8; 
        keyFactor = "Expected Goals Advantage"; 
      }

      // xG defense (lower xGA is better)
      if (homeXGA < awayXGA - 0.3) { 
        homeProb += 5; 
        keyFactor = "Defensive xG Supremacy"; 
      } else if (awayXGA < homeXGA - 0.3) { 
        awayProb += 5; 
        keyFactor = "Defensive xG Supremacy"; 
      }

      // xG difference (xGD)
      const homeXGD = (homeXG - homeXGA);
      const awayXGD = (awayXG - awayXGA);
      if (homeXGD > awayXGD + 0.5) { 
        homeProb += 6; 
        keyFactor = "xG Difference Dominance"; 
      } else if (awayXGD > homeXGD + 0.5) { 
        awayProb += 6; 
        keyFactor = "xG Difference Dominance"; 
      }

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

      <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 md:p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <i className="fas fa-brain text-white text-lg md:text-xl"></i>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">🧠 The Gaffer's Gut</h2>
                  <p className="text-base md:text-lg text-slate-400 font-medium">Match predictions powered by form, position & star players</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg hidden sm:inline-block">
                  Pie Index V1.2
                </span>
                <ShareSnapshot targetRef={containerRef} className="relative z-30" />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 mt-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl md:text-3xl font-black text-white leading-none">{predictions.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Matches</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl md:text-3xl font-black text-orange-400 leading-none">
                  {Math.round(predictions.reduce((sum, m) => sum + Math.max(m.probs.h, m.probs.a, m.probs.d), 0) / predictions.length)}%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Avg Confidence</div>
              </div>
            </div>

            {/* Sponsored by "Buy Me a Pie" */}
            <a
              href="https://ko-fi.com/thegaffer"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/30 rounded-xl px-4 py-2.5 transition-all hover:scale-[1.02] group"
            >
              <span className="text-lg group-hover:animate-bounce">😉</span>
              <span className="text-sm font-black text-orange-400 group-hover:text-orange-300 transition-colors">
                Sponsored by "Buy Me a Pie"
              </span>
              <span className="text-lg group-hover:animate-bounce">🥧</span>
            </a>
          </div>
        </div>

        {/* Legend bar */}
        <div className="bg-slate-50 dark:bg-slate-900/80 px-5 py-2.5 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Home</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-slate-600"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Draw</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-accent"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Away</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 hidden sm:block">Hover bars for details</span>
        </div>

        {/* Match predictions */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {predictions.map((match, idx) => {
            const homeLogo = getTeamLogo(match.homeTeam);
            const awayLogo = getTeamLogo(match.awayTeam);
            const favourite = match.probs.h > match.probs.a ? 'home' : match.probs.a > match.probs.h ? 'away' : 'draw';

            return (
              <div key={idx} className="p-4 md:px-6 md:py-5 hover:bg-slate-50/50 dark:hover:bg-slate-700/10 transition-colors group">

                {/* Teams row */}
                <div className="flex items-center mb-3">
                  {/* Home team */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={`w-9 h-9 md:w-11 md:h-11 shrink-0 rounded-full bg-white dark:bg-slate-700 p-1 shadow-sm border-2 transition-all ${favourite === 'home' ? 'border-green-400 shadow-green-400/20' : 'border-slate-200 dark:border-slate-600'}`}>
                      <LogoWithFallback src={homeLogo} teamName={match.homeTeam} size="w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-black text-sm md:text-base text-slate-800 dark:text-white truncate block">{match.homeTeam}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Home</span>
                    </div>
                  </div>

                  {/* Key factor badge */}
                  <div className="shrink-0 mx-2">
                    <span className="text-[10px] md:text-xs font-black uppercase text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-orange-800/30 whitespace-nowrap">
                      {match.keyFactor}
                    </span>
                  </div>

                  {/* Away team */}
                  <div className="flex items-center justify-end gap-2.5 flex-1 min-w-0">
                    <div className="min-w-0 text-right">
                      <span className="font-black text-sm md:text-base text-slate-800 dark:text-white truncate block">{match.awayTeam}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Away</span>
                    </div>
                    <div className={`w-9 h-9 md:w-11 md:h-11 shrink-0 rounded-full bg-white dark:bg-slate-700 p-1 shadow-sm border-2 transition-all ${favourite === 'away' ? 'border-green-400 shadow-green-400/20' : 'border-slate-200 dark:border-slate-600'}`}>
                      <LogoWithFallback src={awayLogo} teamName={match.awayTeam} size="w-full h-full" />
                    </div>
                  </div>
                </div>

                {/* Probability bar */}
                <div className="relative h-10 md:h-11 w-full rounded-xl overflow-hidden flex font-mono text-sm font-black text-white shadow-inner">
                  <div
                    className="bg-gradient-to-b from-primary to-primary/90 flex items-center justify-start transition-all duration-700 relative group/segment"
                    style={{ width: `${match.probs.h}%`, minWidth: '2.5rem', paddingLeft: '0.75rem', paddingRight: '0.25rem' }}
                  >
                    <span className="whitespace-nowrap drop-shadow-sm">{match.probs.h}%</span>
                    <div className="absolute top-full left-0 mt-1.5 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover/segment:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap shadow-lg">
                      Home Win
                    </div>
                  </div>

                  <div
                    className="bg-gradient-to-b from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600 flex items-center justify-center transition-all duration-700 relative group/segment"
                    style={{ width: `${match.probs.d}%`, minWidth: '2.5rem', paddingLeft: '0.25rem', paddingRight: '0.25rem' }}
                  >
                    <span className="whitespace-nowrap text-white/90 drop-shadow-sm">{match.probs.d}%</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover/segment:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap shadow-lg">
                      Draw
                    </div>
                  </div>

                  <div
                    className="bg-gradient-to-b from-accent to-accent/90 flex items-center justify-end transition-all duration-700 relative group/segment"
                    style={{ width: `${match.probs.a}%`, minWidth: '2.5rem', paddingLeft: '0.25rem', paddingRight: '0.75rem' }}
                  >
                    <span className="whitespace-nowrap drop-shadow-sm">{match.probs.a}%</span>
                    <div className="absolute top-full right-0 mt-1.5 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover/segment:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap shadow-lg">
                      Away Win
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-xl"></div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 px-5 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
            <i className="fas fa-utensils mr-1.5 text-orange-400"></i>
            Predictions based on league position, recent form & key players. Not financial advice — just the Gaffer's gut.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinProbability;


