import React, { useState, useRef } from 'react';
import ShareSnapshot from './ShareSnapshot';

interface CaptainPick {
  rank: number;
  player: string;
  team: string;
  fixture: string;
  reason: string;
  confidence: number;
  price: number;
  ownership: number;
  form: number;
  gafferQuote: string;
}

const WEEKLY_CAPTAIN_PICKS: CaptainPick[] = [
  {
    rank: 1,
    player: "Erling Haaland",
    team: "Man City",
    fixture: "vs. Burnley (H)",
    reason: "Home banker against leaky defense. Hat-trick incoming.",
    confidence: 92,
    price: 14.2,
    ownership: 68.5,
    form: 9.2,
    gafferQuote: "If you don't captain him, you're braver than me at a VAR review."
  },
  {
    rank: 2,
    player: "Mohamed Salah",
    team: "Liverpool",
    fixture: "vs. Sheffield Utd (H)",
    reason: "On fire. Sheffield's defense is Swiss cheese.",
    confidence: 88,
    price: 12.8,
    ownership: 52.3,
    form: 8.8,
    gafferQuote: "Egyptian King vs. Championship defense? Take my armband."
  },
  {
    rank: 3,
    player: "Bukayo Saka",
    team: "Arsenal",
    fixture: "vs. Luton (H)",
    reason: "Fixture run is golden. Differential captain shout.",
    confidence: 75,
    price: 9.2,
    ownership: 34.7,
    form: 7.5,
    gafferQuote: "Low ownership, high ceiling. This is how you climb leagues, son."
  }
];

const AVOID_LIST = [
  { player: "Raheem Sterling", reason: "Rotation risk with Pep's wheel", icon: "🎡" },
  { player: "Harry Maguire", reason: "Still a defensive liability", icon: "🚨" },
  { player: "Richarlison", reason: "Couldn't hit a barn door", icon: "🎯" }
];

const GAFFER_RANT = {
  title: "This Week's Rant",
  content: "VAR strikes again! How is that not a penalty? I've seen softer challenges in a pillow fight. The ref needs new glasses, the VAR official needs a new job, and I need a new pie to calm down. Absolute shambles. But hey, at least we can still captain Haaland and watch him bang in goals like it's Sunday league.",
  emoji: "😤"
};

const CaptainPicks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPick, setSelectedPick] = useState<number | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-500';
    if (confidence >= 70) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-500/10 border-green-500/30';
    if (confidence >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-orange-500/10 border-orange-500/30';
  };

  return (
    <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
      <ShareSnapshot targetRef={containerRef} className="absolute top-3 right-3 z-30" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <i className="fas fa-crown text-2xl text-yellow-300"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Gaffer's Captain Picks</h2>
              <p className="text-sm text-purple-200">Gameweek 15 • Updated 2 hours ago</p>
            </div>
          </div>
          <p className="text-purple-100 text-sm italic">
            "Listen up! These are my top armband choices. Don't come crying to me if you captain Maguire."
          </p>
        </div>
      </div>

      {/* Captain Picks */}
      <div className="p-6 space-y-4">
        {WEEKLY_CAPTAIN_PICKS.map((pick) => (
          <div
            key={pick.rank}
            onClick={() => setSelectedPick(selectedPick === pick.rank ? null : pick.rank)}
            className={`group cursor-pointer transition-all duration-300 ${
              selectedPick === pick.rank ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`}
          >
            <div className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 transition-all ${
              selectedPick === pick.rank 
                ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
            }`}>
              {/* Main Pick Card */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl ${
                    pick.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30' :
                    pick.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg shadow-slate-500/30' :
                    'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  }`}>
                    #{pick.rank}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                          {pick.player}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            {pick.team}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {pick.fixture}
                          </span>
                        </div>
                      </div>
                      
                      {/* Confidence Badge */}
                      <div className={`px-3 py-1.5 rounded-full border ${getConfidenceBg(pick.confidence)}`}>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">CONFIDENCE</div>
                        <div className={`text-2xl font-black ${getConfidenceColor(pick.confidence)}`}>
                          {pick.confidence}%
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Price</div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">£{pick.price}m</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Owned</div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">{pick.ownership}%</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Form</div>
                        <div className="text-lg font-black text-green-500">{pick.form}</div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {pick.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gaffer Quote - Expandable */}
              {selectedPick === pick.rank && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg p-4 border-2 border-yellow-300 dark:border-yellow-700">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">🎩</div>
                      <div className="flex-1">
                        <div className="text-xs font-black uppercase tracking-wider text-yellow-700 dark:text-yellow-500 mb-1">
                          Gaffer Says
                        </div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">
                          "{pick.gafferQuote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Avoid List */}
      <div className="px-6 pb-6">
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border-2 border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
            <h3 className="text-lg font-black text-red-700 dark:text-red-400">Avoid List</h3>
          </div>
          <div className="space-y-2">
            {AVOID_LIST.map((avoid, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <span className="text-2xl">{avoid.icon}</span>
                <div className="flex-1">
                  <div className="font-black text-slate-900 dark:text-white">{avoid.player}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{avoid.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gaffer's Rant */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{GAFFER_RANT.emoji}</div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-white mb-2">{GAFFER_RANT.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{GAFFER_RANT.content}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Guide */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            <span className="flex items-center gap-2">
              <i className="fas fa-question-circle text-purple-500"></i>
              How to use Captain Picks
            </span>
            <i className="fas fa-chevron-down group-open:rotate-180 transition-transform text-xs"></i>
          </summary>
          <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p><strong className="text-purple-600 dark:text-purple-400">Confidence %:</strong> Higher = safer pick. 85%+ are banker captains.</p>
            <p><strong className="text-purple-600 dark:text-purple-400">Ownership:</strong> High ownership = template pick. Low ownership = differential.</p>
            <p><strong className="text-purple-600 dark:text-purple-400">Form:</strong> Recent performance score. 8.0+ is excellent form.</p>
            <p><strong className="text-purple-600 dark:text-purple-400">Gaffer Says:</strong> Click any pick to reveal the Gaffer's wisdom!</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default CaptainPicks;


