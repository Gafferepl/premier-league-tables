import React, { useState } from 'react';

interface AnalyticsExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsExplainer: React.FC<AnalyticsExplainerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'examples' | 'fpl'>('basics');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Advanced Analytics Explained
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The Gaffer's guide to xG, xA, and why they matter
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <i className="fas fa-times text-slate-500 dark:text-slate-400"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab('basics')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'basics'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            The Basics
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'examples'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Real Examples
          </button>
          <button
            onClick={() => setActiveTab('fpl')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'fpl'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            >
            FPL Tips
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'basics' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/50">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
                  <i className="fas fa-lightbulb text-emerald-600"></i>
                  What's the Big Deal?
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  "Traditional stats tell you what happened. Advanced stats tell you what <strong>should have</strong> happened. 
                  It's the difference between 'He scored' and 'He should have scored three times but fluffed two.'"
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">xG</span>
                    Expected Goals
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    "Quality of chances created. A tap-in from 2 yards = 0.9 xG. A 30-yard screamer = 0.1 xG."
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>Simple:</strong> How many goals should they have scored?
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-cyan-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">xA</span>
                    Expected Assists
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    "Quality of chances created for others. A simple pass to put someone through = 0.8 xA. 
                    A hopeful cross into the box = 0.1 xA."
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>Simple:</strong> How many assists should they have made?
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">xGI</span>
                    xG + xA
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    "Overall attacking contribution. The complete package of creating and finishing chances."
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>Simple:</strong> How involved were they in goals?
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-800/50">
                <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-600"></i>
                  The Gaffer's Golden Rule
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  "High xG + Low Goals = Bad finishing. Low xG + High Goals = Lucky. 
                  High xG + High Goals = Proper striker. Low xG + Low Goals = Sunday league."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50">
                <h3 className="font-bold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                  <i className="fas fa-arrow-up text-green-600"></i>
                  Overperforming xG (Lucky/Good)
                </h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-900 dark:text-white">Haaland vs Arsenal</span>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">Overperforming</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white">3</div>
                        <div className="text-xs text-slate-500">Goals</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white">1.2</div>
                        <div className="text-xs text-slate-500">xG</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">+1.8</div>
                        <div className="text-xs text-slate-500">Difference</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      "Took his chances like a proper striker. Clinical finishing."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/50">
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                  <i className="fas fa-arrow-down text-red-600"></i>
                  Underperforming xG (Unlucky/Bad)
                </h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-900 dark:text-white">Werner vs Chelsea</span>
                      <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded">Underperforming</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white">0</div>
                        <div className="text-xs text-slate-500">Goals</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white">2.8</div>
                        <div className="text-xs text-slate-500">xG</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-red-600">-2.8</div>
                        <div className="text-xs text-slate-500">Difference</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      "Should have had a hat-trick. Couldn't hit a barn door with a banjo."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <i className="fas fa-balance-scale text-blue-600"></i>
                  Team Performance
                </h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-medium text-slate-900 dark:text-white mb-2">Man City 3-0 Liverpool</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Man City</div>
                        <div className="flex gap-2">
                          <span className="font-bold">2.1</span>
                          <span className="text-slate-500">xG</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Liverpool</div>
                        <div className="flex gap-2">
                          <span className="font-bold">0.8</span>
                          <span className="text-slate-500">xG</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      "City dominated chances, Liverpool were lucky to keep it clean."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fpl' && (
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                  <i className="fas fa-star text-purple-600"></i>
                  FPL Strategy Tips
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  "Use xG/xA to spot differentials before they become expensive. It's like having insider info."
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <i className="fas fa-chart-line text-emerald-500"></i>
                    Pick High xG Players
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    "Players with consistently high xG are getting chances. Goals will follow eventually."
                  </p>
                  <div className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-2 rounded">
                    <strong>Example:</strong> Player A: 0.8 xG per game, 1 goal = Good future investment
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <i className="fas fa-exchange-alt text-cyan-500"></i>
                    Spot Underperformers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    "High xG, low goals = due a haul. Buy before everyone else notices."
                  </p>
                  <div className="text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400 p-2 rounded">
                    <strong>Example:</strong> Player B: 2.5 xG, 0 goals = Buy now, thank me later
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <i className="fas fa-users text-purple-500"></i>
                    Creative Midfielders
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    "High xA players create chances for strikers. Double points potential."
                  </p>
                  <div className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 p-2 rounded">
                    <strong>Example:</strong> De Bruyne: 0.6 xA per game = Assist machine
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <i className="fas fa-bell text-yellow-500"></i>
                    Captain Picks
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    "Look at team xG vs opponent. High xG team = captain their main striker."
                  </p>
                  <div className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 p-2 rounded">
                    <strong>Example:</strong> Man City vs Norwich = Captain Haaland (obviously)
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/50">
                <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle text-orange-600"></i>
                  The Gaffer's Warning
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  "xG tells you about chances, not form. A player could have high xG but be dropped, injured, or taking penalties. 
                  Use your head, not just the numbers. The stats help, they don't think for you."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-700/30 p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <i className="fas fa-info-circle mr-1"></i>
              Analytics powered by StatsBomb data
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsExplainer;


