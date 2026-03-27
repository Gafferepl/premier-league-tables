import React from 'react';

interface Feature {
  name: string;
  icon: string;
  category: string;
  free: 'included' | 'limited' | 'none';
  firstTeam: 'included' | 'limited' | 'none';
  seasonPass: 'included' | 'limited' | 'none';
  description?: string;
}

const PremiumComparisonTable: React.FC = () => {
  const features: Feature[] = [
    // Core Features
    {
      name: 'Weekly Captain Picks',
      icon: '👑',
      category: 'Core Tools',
      free: 'limited',
      firstTeam: 'included',
      seasonPass: 'included',
      description: 'Saturday 9 AM delivery'
    },
    {
      name: 'Live Price Updates',
      icon: '📈',
      category: 'Core Tools',
      free: 'included',
      firstTeam: 'included',
      seasonPass: 'included',
      description: 'Real-time market data'
    },
    {
      name: 'Injury News & Updates',
      icon: '🏥',
      category: 'Core Tools',
      free: 'included',
      firstTeam: 'included',
      seasonPass: 'included',
      description: 'Team fitness updates'
    },
    {
      name: 'Live Match Scores',
      icon: '⚽',
      category: 'Core Tools',
      free: 'included',
      firstTeam: 'included',
      seasonPass: 'included',
      description: 'Goal events & results'
    },

    // Premium Analysis
    {
      name: 'Elite Captain Picks',
      icon: '🚨',
      category: 'Premium Analysis',
      free: 'none',
      firstTeam: 'included',
      seasonPass: 'included',
      description: 'Thursday 6 PM (48h advantage)'
    },
    {
      name: 'Advanced Price Intelligence',
      icon: '🧠',
      category: 'Premium Analysis',
      free: 'none',
      firstTeam: 'limited',
      seasonPass: 'included',
      description: 'Elite market analysis'
    },
    {
      name: 'Player Comparison Tools',
      icon: '⚖️',
      category: 'Premium Analysis',
      free: 'limited',
      firstTeam: 'included',
      seasonPass: 'included',
      description: '50 vs unlimited per month'
    },
    {
      name: 'Personalized Team Analysis',
      icon: '🎯',
      category: 'Premium Analysis',
      free: 'none',
      firstTeam: 'limited',
      seasonPass: 'included',
      description: 'FPL team insights'
    },

    // Elite Features
    {
      name: 'Advanced Analytics (xG, xA, ICT)',
      icon: '📊',
      category: 'Elite Access',
      free: 'none',
      firstTeam: 'limited',
      seasonPass: 'included',
      description: 'Pro-level statistics'
    },
    {
      name: 'Custom Algorithm Access',
      icon: '🔮',
      category: 'Elite Access',
      free: 'none',
      firstTeam: 'limited',
      seasonPass: 'included',
      description: 'Personalized tools'
    },
    {
      name: 'Historical Database (5 years)',
      icon: '📚',
      category: 'Elite Access',
      free: 'none',
      firstTeam: 'limited',
      seasonPass: 'included',
      description: 'Performance trends'
    },
    {
      name: 'Differential Detectives',
      icon: '🔍',
      category: 'Elite Access',
      free: 'none',
      firstTeam: 'included',
      seasonPass: 'included',
      description: 'Low ownership gems'
    },

    // Community & Exclusive
    {
      name: 'Gaffer\'s Community League',
      icon: '🏆',
      category: 'Exclusive',
      free: 'limited',
      firstTeam: 'included',
      seasonPass: 'included',
      description: '50 exclusive spots'
    },
    {
      name: 'Weekly Email Digest',
      icon: '📧',
      category: 'Exclusive',
      free: 'limited',
      firstTeam: 'included',
      seasonPass: 'included',
      description: '1 vs 2 premium emails'
    },
    {
      name: 'Early Captain Access',
      icon: '⏰',
      category: 'Exclusive',
      free: 'none',
      firstTeam: 'none',
      seasonPass: 'included',
      description: '48-hour early access'
    }
  ];

  const getFeatureIcon = (access: 'included' | 'limited' | 'none') => {
    switch (access) {
      case 'included':
        return '✅';
      case 'limited':
        return '⚡';
      case 'none':
        return '❌';
    }
  };

  const getFeatureColor = (access: 'included' | 'limited' | 'none') => {
    switch (access) {
      case 'included':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'limited':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'none':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
    }
  };

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          The Gaffer's Premium Features
        </h3>
        <p className="text-slate-400">
          Compare all tiers and choose your path to FPL domination
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto mt-12">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left p-4">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Tactical Edge</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <img src="/gaffer-icon.png" alt="The Gaffer" className="w-4 h-4 rounded-full" />
                          <span className="text-yellow-400 text-xs font-semibold">THE GAFFER</span>
                        </div>
                        <span className="text-slate-500 text-xs">•</span>
                        <p className="text-yellow-300 text-sm font-medium italic">Play like a champ, not a chump!</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    <span>Premium Features</span>
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    <span>Winning Tools</span>
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    <span>Champion's Advantage</span>
                  </div>
                </div>
              </th>
              <th className="text-center p-4 relative pt-12">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-1 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/25">
                      📧
                    </div>
                    <span className="text-white font-bold text-sm">Free</span>
                    <span className="text-blue-300 text-xs font-semibold">£0</span>
                    <span className="text-blue-400 text-xs">Basic Access</span>
                  </div>
                </div>
              </th>
              <th className="text-center p-4 relative pt-12">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-1 backdrop-blur-sm relative">
                  {/* MOST POPULAR Badge - Positioned above the header container */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-2xl shadow-yellow-500/30 border border-yellow-300/20 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>🔥</span>
                        <span>MOST POPULAR</span>
                        <span>🔥</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-green-500/25">
                      ⚡
                    </div>
                    <span className="text-white font-bold text-sm">First Team</span>
                    <span className="text-green-300 text-xs font-semibold">£2.99/week</span>
                    <span className="text-green-400 text-xs">Premium Access</span>
                  </div>
                </div>
              </th>
              <th className="text-center p-4 relative pt-12">
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-1 backdrop-blur-sm relative">
                  {/* BEST VALUE Badge - Positioned above the header container */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl shadow-purple-500/30 border border-purple-400/30 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>💎</span>
                        <span>BEST VALUE</span>
                        <span>💎</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-slate-900 text-sm font-bold shadow-lg shadow-yellow-500/25">
                      👑
                    </div>
                    <span className="text-yellow-400 font-bold text-sm flex items-center gap-2">
                      Season Pass
                    </span>
                    <span className="text-yellow-300 text-xs font-semibold">£49.99/year</span>
                    <span className="text-yellow-400 text-xs">Elite Access</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {categories.map((category, categoryIndex) => (
              <React.Fragment key={category}>
                {/* Category Header */}
                <tr className="bg-slate-800/30">
                  <td colSpan={4} className="p-3">
                    <h4 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                      {category}
                    </h4>
                  </td>
                </tr>

                {/* Features in Category */}
                {features
                  .filter(feature => feature.category === category)
                  .map((feature, featureIndex) => (
                    <tr 
                      key={featureIndex}
                      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-all duration-200 group"
                    >
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          {feature.name === 'Gaffer\'s Community League' ? (
                            <div>
                              <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-lg group-hover:bg-slate-700 transition-colors">�</div>
                              <div>
                                <div className="text-white font-medium group-hover:text-slate-200 transition-colors">{feature.name}</div>
                                <div className="text-xs text-slate-400 mt-1 group-hover:text-slate-300 transition-colors">{feature.description}</div>
                                <div className="text-xs text-blue-400 mt-2 italic">
                                  ⚡ Random selection for next season - equal chance for all tiers!
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-lg group-hover:bg-slate-700 transition-colors">{feature.icon}</div>
                              <div>
                                <div className="text-white font-medium group-hover:text-slate-200 transition-colors">{feature.name}</div>
                                <div className="text-xs text-slate-400 mt-1 group-hover:text-slate-300 transition-colors">{feature.description}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 ${getFeatureColor(feature.free)} group-hover:scale-110 transition-transform duration-200`}>
                          <span className="text-lg font-bold">
                            {feature.name === 'Gaffer\'s Community League' ? '🎲' : getFeatureIcon(feature.free)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 ${getFeatureColor(feature.firstTeam)} group-hover:scale-110 transition-transform duration-200`}>
                          <span className="text-lg font-bold">
                            {feature.name === 'Gaffer\'s Community League' ? '🎲' : getFeatureIcon(feature.firstTeam)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 ${getFeatureColor(feature.seasonPass)} group-hover:scale-110 transition-transform duration-200`}>
                          <span className="text-lg font-bold">
                            {feature.name === 'Gaffer\'s Community League' ? '🎲' : getFeatureIcon(feature.seasonPass)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 p-6 border-t border-slate-700/50">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg border-2 bg-green-400/20 border-green-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-green-400/10">
              <span className="text-green-400 font-bold text-sm">✅</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Included</div>
              <div className="text-green-400 text-xs">Full access</div>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg border-2 bg-yellow-400/20 border-yellow-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-yellow-400/10">
              <span className="text-yellow-400 font-bold text-sm">⚡</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Limited</div>
              <div className="text-yellow-400 text-xs">Partial access</div>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg border-2 bg-red-400/20 border-red-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-red-400/10">
              <span className="text-red-400 font-bold text-sm">❌</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Not Available</div>
              <div className="text-red-400 text-xs">Upgrade required</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumComparisonTable;


