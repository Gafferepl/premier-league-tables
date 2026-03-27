import React, { useState, useEffect } from 'react';
import { LeagueTableEntry } from '../../types';
import advancedAnalyticsService from '../services/advancedAnalyticsService';
import ShareSnapshot from './ShareSnapshot';
import SeasonalAccessControl from './SeasonalAccessControl';
import { isAdminAccessClient } from '../config/admin';

// Check for admin access
const isAdminAccess = () => {
  return isAdminAccessClient();
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setIsVisible(true);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help border-b-2 border-dotted border-yellow-500 hover:border-yellow-400 transition-colors"
      >
        {children}
      </div>
      {isVisible && (
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%) translateY(-12px)'
          }}
        >
          <div className="w-80 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-sm rounded-xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 rounded-xl blur-sm"></div>
            
            {/* Content */}
            <div className="relative z-10 leading-relaxed">
              {content}
            </div>
            
            {/* Arrow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-slate-800"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[10px]">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-yellow-500/50"></div>
              </div>
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-yellow-500/50 rounded-tl-sm"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-yellow-500/50 rounded-tr-sm"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-yellow-500/50 rounded-bl-sm"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-yellow-500/50 rounded-br-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AdvancedStatsProps {
  data?: LeagueTableEntry[];
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({ data }) => {
  const [advancedData, setAdvancedData] = useState<Partial<LeagueTableEntry>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvancedData = async () => {
      try {
        setLoading(true);
        const teamStats = await advancedAnalyticsService.fetchTeamAdvancedStats();
        setAdvancedData(teamStats);
      } catch (error) {
        // console.error('Failed to fetch advanced stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvancedData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Merge advanced data with existing table data
  const enrichedData = data?.map(team => {
    const advanced = advancedData.find(a => a.team === team.team);
    return { ...team, ...advanced };
  }) || advancedData;

  const getXGDiffColor = (xgd: number | undefined) => {
    if (!xgd) return 'text-slate-500';
    if (xgd > 5) return 'text-green-600 font-bold';
    if (xgd > 0) return 'text-green-500';
    if (xgd < -5) return 'text-red-600 font-bold';
    if (xgd < 0) return 'text-red-500';
    return 'text-slate-500';
  };

  const getPPDAColor = (ppda: number | undefined) => {
    if (!ppda) return 'text-slate-500';
    if (ppda < 8) return 'text-green-600 font-bold'; // More aggressive
    if (ppda < 10) return 'text-green-500';
    if (ppda > 15) return 'text-red-600 font-bold'; // More passive
    if (ppda > 12) return 'text-red-500';
    return 'text-slate-500';
  };

  return (
    <SeasonalAccessControl isPaidUser={isAdminAccess()}>
    <div className="container mx-auto px-4 mb-16 relative z-10">
      <div id="advanced-stats-card" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        
        <ShareSnapshot targetId="advanced-stats-card" className="absolute top-4 right-4 z-30" />

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-2">
                <i className="fas fa-chart-line text-emerald-600 dark:text-emerald-400"></i>
                Advanced Analytics
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
                Expected Goals (xG), Expected Assists (xA), and advanced metrics
              </p>
            </div>
            <div className="text-right pr-20">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                ⚽ Powered by The Gaffer's Tactical Board
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                "Unlike your formation, this actually works!"
              </div>
            </div>
          </div>
        </div>

        {/* Stats Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-bold text-slate-700 dark:text-slate-300">Team</th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="Expected Goals (xG): Measures the quality of scoring chances. A shot from 6 yards might be 0.8xG, while a 30-yard shot could be 0.1xG. Higher xG = better attacking performance.">
                      xG
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="Expected Goals Against (xGA): Quality of chances conceded to opponents. Lower xGA = better defensive performance. Shows how many goals a team should have conceded based on shot quality.">
                      xGA
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="Expected Goal Difference (xGD): xG minus xGA. Positive xGD = team creating better chances than conceding. Better indicator of true performance than actual goal difference.">
                      xGD
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="Expected Goals per Game: Average xG accumulated per match. Shows offensive efficiency and consistency. Higher values indicate teams that create quality chances regularly.">
                      xG/Game
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="Expected Goals Against per Game: Average xGA conceded per match. Shows defensive stability. Lower values indicate teams that consistently limit opponent chances.">
                      xGA/Game
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="Passes Per Defensive Action: How many passes a team allows before attempting a defensive action (tackle, interception, challenge). Lower PPDA = more aggressive pressing. Values below 10 = high press, above 12 = more passive.">
                      PPDA
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="PPDA Allowed: Average PPDA that opponents achieve against this team. Higher values = team allows opponents to play more passes before being pressed. Shows defensive pressing intensity.">
                      PPDA Allowed
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-2 font-bold text-slate-700 dark:text-slate-300">
                    <Tooltip content="xG Performance: Compares actual goals scored to expected goals. 'Overperforming' = scoring more than expected, 'Underperforming' = scoring less. Shows finishing efficiency and luck factor.">
                      xG Performance
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrichedData.slice(0, 10).map((team, index) => {
                  const actualGoals = team.played * (team.won * 3 + team.drawn) / team.played; // Simplified
                  const xgPerformance = advancedAnalyticsService.getXGPerformance(
                    actualGoals,
                    team.xg || 0
                  );
                  
                  return (
                    <tr key={team.team} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 w-6">{index + 1}</span>
                          <span className="font-medium text-slate-900 dark:text-white">{team.team}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-900 dark:text-white">
                        {team.xg?.toFixed(1) || '-'}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-900 dark:text-white">
                        {team.xga?.toFixed(1) || '-'}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold">
                        <span className={getXGDiffColor(team.xgd)}>
                          {team.xgd ? `${team.xgd > 0 ? '+' : ''}${team.xgd.toFixed(1)}` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-900 dark:text-white">
                        {team.xg_per_game?.toFixed(2) || '-'}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-900 dark:text-white">
                        {team.xga_per_game?.toFixed(2) || '-'}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        <span className={getPPDAColor(team.ppda)}>
                          {team.ppda?.toFixed(1) || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-900 dark:text-white">
                        {team.ppda_allowed?.toFixed(1) || '-'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          xgPerformance.rating === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          xgPerformance.rating === 'good' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          xgPerformance.rating === 'average' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {xgPerformance.rating.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">📊 Metric Explanations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">xG:</span>
                <span className="text-slate-600 dark:text-slate-400">Expected Goals - quality of chances created</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-cyan-600">xGA:</span>
                <span className="text-slate-600 dark:text-slate-400">Expected Goals Against - defensive performance</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-600">xGD:</span>
                <span className="text-slate-600 dark:text-slate-400">Expected Goal Difference (xG - xGA)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-orange-600">PPDA:</span>
                <span className="text-slate-600 dark:text-slate-400">Passes Per Defensive Action (lower = more aggressive)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SeasonalAccessControl>
  );
};

export default AdvancedStats;


