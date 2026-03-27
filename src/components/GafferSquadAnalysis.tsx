import React, { useState, useEffect } from 'react';
import { FPLPlayer } from '../data/playerData';
import { usageTracker } from '../services/usageTracker';

interface GafferSquadAnalysisProps {
  squad: (FPLPlayer | null)[];
  captainSlot: number | null;
  vcSlot: number | null;
  userTier: 'free' | 'firstTeam' | 'seasonPass';
  userEmail: string;
  onUpgrade: () => void;
}

interface AnalysisReport {
  tier: 'basic' | 'preview' | 'full';
  teamOverview: {
    formation: string;
    totalValue: number;
    budgetRemaining: number;
    overallStrength: number;
  };
  basicTips: string[];
  playerAnalysis?: Array<{
    name: string;
    rating: number;
    insight: string;
  }>;
  transferRecommendations?: string[];
  captainSuggestions?: Array<{
    player: string;
    reasoning: string;
    probability: number;
  }>;
  fixtureAnalysis?: string[];
  tacticalRecommendations?: string[];
}

const GafferSquadAnalysis: React.FC<GafferSquadAnalysisProps> = ({
  squad,
  captainSlot,
  vcSlot,
  userTier,
  userEmail,
  onUpgrade
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [canGenerate, setCanGenerate] = useState(true);
  const [remainingAnalyses, setRemainingAnalyses] = useState<number | string>(0);

  // Check usage limits on mount
  useEffect(() => {
    checkUsageLimits();
  }, [userEmail, userTier]);

  const checkUsageLimits = async () => {
    const result = await usageTracker.canUseFeature(userEmail, 'squad_analysis', userTier);
    setCanGenerate(result.allowed);
    setRemainingAnalyses(result.remaining === -1 ? 'Unlimited' : result.remaining);
  };

  const generateReport = async () => {
    if (!canGenerate) {
      return;
    }

    setIsGenerating(true);
    
    // Track usage
    await usageTracker.trackUsage(userEmail, 'squad_analysis', userTier);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const filledSquad = squad.filter(Boolean) as FPLPlayer[];
    const totalValue = filledSquad.reduce((sum, p) => sum + p.now_cost, 0);
    const budgetRemaining = 1000 - totalValue;

    // Calculate formation
    const positions = filledSquad.slice(0, 11).reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const formation = `${positions.DEF || 0}-${positions.MID || 0}-${positions.FWD || 0}`;

    // Calculate overall strength
    const avgPoints = filledSquad.reduce((sum, p) => sum + p.total_points, 0) / filledSquad.length;
    const overallStrength = Math.min(10, Math.round((avgPoints / 100) * 10));

    const basicReport: AnalysisReport = {
      tier: 'basic',
      teamOverview: {
        formation,
        totalValue: totalValue / 10,
        budgetRemaining: budgetRemaining / 10,
        overallStrength
      },
      basicTips: [
        budgetRemaining > 50 ? `You have £${(budgetRemaining / 10).toFixed(1)}m remaining - consider upgrading a key position` : 'Budget well managed',
        positions.MID < 3 ? 'Consider adding more midfield coverage' : 'Good midfield balance',
        filledSquad.length < 15 ? 'Complete your squad for full analysis' : 'Full squad selected - excellent!'
      ]
    };

    // Generate preview or full report based on tier
    if (userTier === 'free') {
      // Preview with blurred sections
      setReport({
        ...basicReport,
        tier: 'preview',
        playerAnalysis: filledSquad.slice(0, 3).map(p => ({
          name: p.web_name,
          rating: Math.min(10, Math.round((p.total_points / 100) * 10)),
          insight: `${p.web_name} has scored ${p.total_points} points this season`
        })),
        transferRecommendations: ['Upgrade to see detailed transfer recommendations'],
        captainSuggestions: [{
          player: filledSquad[0]?.web_name || 'Select players',
          reasoning: 'Upgrade to see AI-powered captain analysis',
          probability: 0
        }]
      });
    } else {
      // Full report for paid tiers
      setReport({
        ...basicReport,
        tier: 'full',
        playerAnalysis: filledSquad.map(p => ({
          name: p.web_name,
          rating: Math.min(10, Math.round((p.total_points / 100) * 10)),
          insight: `${p.web_name} (${p.team}) - ${p.total_points} pts, Form: ${p.form}, £${p.now_cost}m. ${
            parseFloat(p.form) > 5 ? 'Excellent form, keep.' : 'Consider alternatives.'
          }`
        })),
        transferRecommendations: [
          budgetRemaining > 50 ? `Priority: Upgrade with £${(budgetRemaining / 10).toFixed(1)}m budget` : 'Budget optimized',
          'Consider fixture difficulty for next 3 gameweeks',
          'Monitor injury news before deadline'
        ],
        captainSuggestions: filledSquad.slice(0, 3).map(p => ({
          player: p.web_name,
          reasoning: `Strong form (${p.form}), ${p.total_points} total points`,
          probability: Math.min(95, 60 + parseFloat(p.form) * 5)
        })),
        fixtureAnalysis: [
          'Next 3 GWs: Medium difficulty (2.8/5 avg)',
          'Favorable fixtures in GW7-9',
          'Plan transfers around tough fixtures'
        ],
        tacticalRecommendations: [
          `Current ${formation} formation suits your squad`,
          'Consider rotation for double gameweeks',
          'Bench strength needs improvement'
        ]
      });
    }

    // Update limits after generation
    await checkUsageLimits();
    setIsGenerating(false);
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Generate Button */}
      {!report && (
        <div className="text-center">
          <button
            onClick={generateReport}
            disabled={!canGenerate || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                The Gaffer is analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="fas fa-brain"></i>
                Get The Gaffer's Analysis
              </span>
            )}
          </button>
          
          <p className="text-xs text-slate-500 mt-2">
            {userTier === 'free' 
              ? `${remainingAnalyses} analysis remaining this month`
              : 'Unlimited analyses with your premium tier'
            }
          </p>
        </div>
      )}

      {/* Report Display */}
      {report && (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl p-6 border-2 border-purple-500/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎩</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">The Gaffer's Tactical Report</h3>
              <p className="text-sm text-purple-300">
                {report.tier === 'full' ? 'Complete Analysis' : report.tier === 'preview' ? 'Preview Report' : 'Basic Analysis'}
              </p>
            </div>
          </div>

          {/* Team Overview */}
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-sm font-black text-purple-300 uppercase tracking-wider mb-3">📊 Team Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="text-xs text-slate-400">Formation</div>
                <div className="text-lg font-black text-white">{report.teamOverview.formation}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Total Value</div>
                <div className="text-lg font-black text-white">£{report.teamOverview.totalValue.toFixed(1)}m</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Budget Left</div>
                <div className="text-lg font-black text-green-400">£{report.teamOverview.budgetRemaining.toFixed(1)}m</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Strength</div>
                <div className="text-lg font-black text-yellow-400">{report.teamOverview.overallStrength}/10</div>
              </div>
            </div>
          </div>

          {/* Basic Tips */}
          <div className="mb-6">
            <h4 className="text-sm font-black text-purple-300 uppercase tracking-wider mb-3">💡 Quick Tips</h4>
            <ul className="space-y-2">
              {report.basicTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-400 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Player Analysis - Blurred for preview */}
          {report.playerAnalysis && (
            <div className="mb-6 relative">
              <h4 className="text-sm font-black text-purple-300 uppercase tracking-wider mb-3">🔍 Player Performance Analysis</h4>
              <div className={report.tier === 'preview' ? 'blur-sm select-none' : ''}>
                <div className="space-y-2">
                  {report.playerAnalysis.map((analysis, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{analysis.name}</span>
                        <span className="text-sm font-black text-yellow-400">{analysis.rating}/10</span>
                      </div>
                      <p className="text-xs text-slate-400">{analysis.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
              {report.tier === 'preview' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
                  <button
                    onClick={onUpgrade}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-crown"></i>
                      Upgrade to See Full Analysis
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transfer Recommendations - Blurred for preview */}
          {report.transferRecommendations && (
            <div className="mb-6 relative">
              <h4 className="text-sm font-black text-purple-300 uppercase tracking-wider mb-3">💰 Transfer Recommendations</h4>
              <div className={report.tier === 'preview' ? 'blur-sm select-none' : ''}>
                <ul className="space-y-2">
                  {report.transferRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300 p-2 bg-white/5 rounded">
                      <span className="text-purple-400 mt-0.5">{i + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              {report.tier === 'preview' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
                  <button
                    onClick={onUpgrade}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-sm"
                  >
                    Unlock Transfer Tips
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Captain Suggestions - Blurred for preview */}
          {report.captainSuggestions && (
            <div className="mb-6 relative">
              <h4 className="text-sm font-black text-purple-300 uppercase tracking-wider mb-3">🎯 Captain Selection</h4>
              <div className={report.tier === 'preview' ? 'blur-sm select-none' : ''}>
                <div className="space-y-2">
                  {report.captainSuggestions.map((suggestion, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{suggestion.player}</span>
                        {report.tier === 'full' && (
                          <span className="text-sm font-black text-green-400">{suggestion.probability}%</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{suggestion.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
              {report.tier === 'preview' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
                  <button
                    onClick={onUpgrade}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-sm"
                  >
                    See Captain Recommendations
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Full Report Only Sections */}
          {report.tier === 'full' && (
            <>
              {/* Fixture Analysis */}
              {report.fixtureAnalysis && (
                <div className="mb-6">
                  <h4 className="text-sm font-black text-purple-300 uppercase tracking-wider mb-3">📈 Fixture Difficulty</h4>
                  <ul className="space-y-2">
                    {report.fixtureAnalysis.map((fixture, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-blue-400 mt-0.5">•</span>
                        {fixture}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tactical Recommendations */}
              {report.tacticalRecommendations && (
                <div>
                  <h4 className="text-sm font-black text-purple-300 uppercase tracking-wider mb-3">🎪 Tactical Advice</h4>
                  <ul className="space-y-2">
                    {report.tacticalRecommendations.map((tactic, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-yellow-400 mt-0.5">•</span>
                        {tactic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Upgrade CTA for free users */}
          {report.tier !== 'full' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl border-2 border-purple-500/50">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👑</span>
                <div className="flex-1">
                  <h5 className="font-black text-white mb-1">Upgrade to First Team</h5>
                  <p className="text-xs text-purple-200">
                    Get unlimited squad analyses, complete player insights, transfer recommendations, and weekly captain picks
                  </p>
                </div>
                <button
                  onClick={onUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:scale-105 transition-all whitespace-nowrap"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          {/* New Analysis Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setReport(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-redo"></i>
                Generate New Analysis
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Usage Limit Reached */}
      {!canGenerate && !report && (
        <div className="p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl border-2 border-red-500/50 text-center">
          <span className="text-4xl mb-3 block">🔒</span>
          <h4 className="font-black text-white text-lg mb-2">Monthly Limit Reached</h4>
          <p className="text-sm text-red-200 mb-4">
            You've used your free analysis for this month. Upgrade to get unlimited squad analyses!
          </p>
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            <span className="flex items-center gap-2 justify-center">
              <i className="fas fa-crown"></i>
              Upgrade to First Team
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GafferSquadAnalysis;


