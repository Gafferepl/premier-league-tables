import React, { useState } from 'react';

interface GuideSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: {
    intro: string;
    tips: string[];
    example?: string;
  };
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'captain-picks',
    title: 'Captain Picks Guide',
    icon: 'fa-crown',
    color: 'purple',
    content: {
      intro: 'Your captain scores double points, so choosing wisely is crucial. Here\'s how to maximize your armband decisions.',
      tips: [
        'Check confidence ratings - 85%+ are banker captains with safe fixtures',
        'Consider ownership - high ownership = template pick, low = differential',
        'Form matters - look for players with 8.0+ form scores',
        'Fixture difficulty - green fixtures (1-2) are ideal for captaincy',
        'Read the Gaffer\'s wisdom - click any pick to reveal expert insights'
      ],
      example: 'Haaland at home vs. Burnley with 92% confidence? That\'s a no-brainer captain pick!'
    }
  },
  {
    id: 'price-changes',
    title: 'Price Changes Explained',
    icon: 'fa-chart-line',
    color: 'green',
    content: {
      intro: 'Understanding price changes helps you build team value and afford premium players.',
      tips: [
        'Price changes happen at 1:30 AM GMT every single day',
        'Based on net transfers (transfers in minus transfers out)',
        'Players need ~200k net transfers IN to rise £0.1m',
        'Players need ~100k net transfers OUT to fall £0.1m',
        'Check predicted changes to plan your transfers ahead',
        'Buy before rises, sell before falls to maximize team value'
      ],
      example: 'If Saka has 245k net transfers in, he\'ll likely rise tonight. Get him before 1:30 AM!'
    }
  },
  {
    id: 'player-comparison',
    title: 'Player Comparison Tips',
    icon: 'fa-balance-scale',
    color: 'blue',
    content: {
      intro: 'Compare players head-to-head to make informed transfer decisions.',
      tips: [
        'Basic Stats - goals, assists, clean sheets, bonus points',
        'Advanced Stats - xG, xA, ICT Index for deeper analysis',
        'Value Metrics - points per million, value form, ownership',
        'Green numbers = better stat, use this to spot the winner',
        'Don\'t just look at total points - check points per game',
        'Consider upcoming fixtures alongside current stats'
      ],
      example: 'Salah vs Haaland? Check xG, value, and next 5 fixtures to decide!'
    }
  },
  {
    id: 'fixtures',
    title: 'Fixture Difficulty Ratings',
    icon: 'fa-calendar-alt',
    color: 'orange',
    content: {
      intro: 'FDR helps you identify easy and tough fixtures for your players.',
      tips: [
        'Green (1-2) = Easy fixtures, great for captains and differentials',
        'Yellow (3) = Medium difficulty, proceed with caution',
        'Red (4-5) = Tough fixtures, consider benching or selling',
        'ATT rating = opponent\'s defensive strength',
        'DEF rating = opponent\'s attacking threat',
        'Plan transfers around fixture swings (easy to hard)'
      ],
      example: 'Arsenal have 5 green fixtures? Time to triple up on their attack!'
    }
  },
  {
    id: 'injuries',
    title: 'Injury Tracker Usage',
    icon: 'fa-briefcase-medical',
    color: 'red',
    content: {
      intro: 'Stay ahead of team news to avoid benching disasters and price drops.',
      tips: [
        'Red (Out) = Definitely missing, sell or bench immediately',
        'Orange (Doubtful) = 50/50 chance, risky to start',
        'Yellow (75%) = Likely to play but monitor closely',
        'Check ownership % - high ownership injuries cause price drops',
        'Read Gaffer notes for context and transfer advice',
        'Filter by team to check your squad quickly'
      ],
      example: 'Salah marked doubtful with 52% ownership? Expect a price drop if he\'s ruled out!'
    }
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics Guide',
    icon: 'fa-chart-bar',
    color: 'indigo',
    content: {
      intro: 'Go beyond basic stats with xG, xA, and advanced metrics to gain a competitive edge.',
      tips: [
        'Expected Goals (xG) - quality of chances created, not just goals scored',
        'Expected Assists (xA) - quality of chances created for teammates',
        'ICT Index - Influence, Creativity, Threat combined score',
        'xG90 - expected goals per 90 minutes (normalized for playing time)',
        'xA90 - expected assists per 90 minutes (normalized)',
        'Green xG but low goals? Due for a positive regression',
        'High xG + high ownership = template pick worth considering',
        'Use advanced stats to identify differentials and hidden gems'
      ],
      example: 'Toney has 2.4 xG but only 1 goal? He\'s due for a scoring spree - buy before price rise!'
    }
  },
  {
    id: 'live-scores',
    title: 'Live Scores & Updates',
    icon: 'fa-futbol',
    color: 'accent',
    content: {
      intro: 'Follow matches in real-time to track your team\'s performance.',
      tips: [
        'Live badge = match in progress with live score updates',
        'Goal events show scorer and minute',
        'Weather conditions affect gameplay (rain = slick, wind = unpredictable)',
        'FDR ratings help predict match outcomes',
        'Use live scores to plan your next gameweek transfers',
        'Check injury tab for late team news updates'
      ],
      example: 'Your captain Haaland scores in the 12th minute? Time to celebrate those double points!'
    }
  }
];

const FPLGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500', hover: 'hover:bg-purple-50' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', hover: 'hover:bg-green-50' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', hover: 'hover:bg-blue-50' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500', hover: 'hover:bg-orange-50' },
      red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-500', hover: 'hover:bg-red-50' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-500', hover: 'hover:bg-indigo-50' },
      accent: { bg: 'bg-accent', text: 'text-accent', border: 'border-accent', hover: 'hover:bg-orange-50' }
    };
    return colors[color] || colors.purple;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform group"
      >
        <i className="fas fa-question-circle text-2xl group-hover:rotate-12 transition-transform"></i>
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-black animate-pulse">
          ?
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fas fa-book-open text-3xl text-white"></i>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-1">FPL Feature Guide</h2>
                <p className="text-purple-200 text-sm">Everything you need to dominate your mini-league</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-4 border-2 border-yellow-300 dark:border-yellow-700 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-4xl">🎩</span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  Welcome to the Gaffer's Guide!
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  "Right then, listen up! This guide will teach you everything you need to know about using these features. 
                  No excuses for finishing bottom of your league after reading this. Click any section below to get started."
                </p>
              </div>
            </div>
          </div>

          {/* Guide Sections */}
          <div className="space-y-3">
            {GUIDE_SECTIONS.map((section) => {
              const colors = getColorClasses(section.color);
              const isActive = activeSection === section.id;

              return (
                <div key={section.id} className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveSection(isActive ? null : section.id)}
                    className={`w-full p-4 flex items-center justify-between ${colors.hover} dark:hover:bg-slate-700/30 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center text-white`}>
                        <i className={`fas ${section.icon} text-lg`}></i>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white text-left">
                        {section.title}
                      </h3>
                    </div>
                    <i className={`fas fa-chevron-down text-slate-400 transition-transform ${isActive ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isActive && (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t-2 border-slate-200 dark:border-slate-700 animate-fadeIn">
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 font-bold">
                        {section.content.intro}
                      </p>

                      <div className="space-y-2 mb-4">
                        {section.content.tips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className={`w-6 h-6 ${colors.bg} rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5`}>
                              {idx + 1}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>

                      {section.content.example && (
                        <div className={`bg-white dark:bg-slate-800 rounded-lg p-4 border-2 ${colors.border}/30`}>
                          <div className="flex items-start gap-2">
                            <i className="fas fa-lightbulb text-yellow-500 text-lg mt-0.5"></i>
                            <div>
                              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                Example
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {section.content.example}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Tips */}
          <div className="mt-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">
                <i className="fas fa-bolt text-yellow-400"></i>
                Quick Tips for Success
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Check price changes daily to maximize team value</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Use captain picks for safe, high-confidence choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Monitor injuries before the deadline to avoid benching disasters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Compare players before transfers to make data-driven decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Plan transfers around fixture swings (easy to hard)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              <i className="fas fa-info-circle mr-1"></i>
              Click the <i className="fas fa-question-circle mx-1"></i> button anytime to reopen this guide
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPLGuide;


