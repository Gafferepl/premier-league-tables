import React, { useState, useEffect } from 'react';
import { generateGafferInsight, generateWeeklyGafferAnalysis, generateWeeklyTheme } from '../services/gafferInsights';

interface GafferStatsAnalysisProps {
  matchStats: any[];
}

const GafferStatsAnalysis: React.FC<GafferStatsAnalysisProps> = ({ matchStats }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [weeklyTheme, setWeeklyTheme] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (matchStats && matchStats.length > 0) {
      // Generate insights for all matches
      const generatedInsights = generateWeeklyGafferAnalysis(matchStats);
      const theme = generateWeeklyTheme(generatedInsights);
      
      setInsights(generatedInsights);
      setWeeklyTheme(theme);
      setLoading(false);
    }
  }, [matchStats]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative backdrop-blur-sm p-6 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative backdrop-blur-sm">
      {/* Weekly Theme Header */}
      <div className="bg-gradient-to-r from-red-600 to-accent p-6 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="fas fa-whistle text-white text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white">The Gaffer's Tactical Breakdown</h3>
          </div>
          <p className="text-white/90 text-sm font-medium">{weeklyTheme}</p>
        </div>
      </div>

      {/* Match Insights */}
      <div className="p-6 space-y-6">
        {insights.slice(0, 3).map((insight, index) => (
          <div key={index} className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0 pb-6 last:pb-0">
            {/* Match Result */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-xl text-slate-800 dark:text-white">
                {insight.analysis}
              </h4>
              <span className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-600 dark:text-slate-300 text-sm rounded-full font-medium border border-slate-200/50 dark:border-slate-600/50">
                {insight.pattern.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Gaffer's Tactical Insight */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-5 mb-4 rounded-xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-3xl mt-1 text-red-500"><i className="fas fa-chess-board"></i></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-trophy text-red-600 dark:text-red-500"></i>
                    <p className="font-heading font-black text-xs text-red-700 dark:text-red-500 uppercase tracking-wider">Tactical Analysis</p>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 italic leading-relaxed">
                    "{insight.headline}"
                  </p>
                </div>
              </div>
            </div>

            {/* Fantasy Impact */}
            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl p-5 mb-4 border border-slate-200/50 dark:border-slate-700/50">
              <h5 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center">
                <span className="text-lg mr-3 text-primary">🎯</span>
                Fantasy Impact
              </h5>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {insight.fantasyImpact}
              </p>
            </div>

            {/* Next Week Advice */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">📅</span>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-slate-800 dark:text-white mb-2">Next Week</h5>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {insight.nextWeekAdvice}
                </p>
              </div>
            </div>

            {/* Key Players */}
            {insight.keyPlayers.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">⭐</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 dark:text-white mb-2">Key Players</h5>
                  <div className="flex flex-wrap gap-2">
                    {insight.keyPlayers.map((player: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-gradient-to-r from-accent/20 to-accent/10 text-accent text-sm rounded-full font-medium border border-accent/30">
                        {player}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
          <i className="fas fa-chart-line mr-2 text-accent"></i>
          Tactical analysis based on actual match data. Proper football wisdom, not fancy algorithms.
        </p>
      </div>
    </div>
  );
};

export default GafferStatsAnalysis;


