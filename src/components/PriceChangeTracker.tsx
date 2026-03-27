import React, { useState, useRef, useEffect } from 'react';
import ShareSnapshot from './ShareSnapshot';
import LogoWithFallback from './LogoWithFallback';
import { getTeamLogo } from '../constants';

interface PriceChange {
  id: string;
  player: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  oldPrice: number;
  newPrice: number;
  change: number;
  netTransfers: number;
  ownership: number;
  form: number;
  gafferTake: string;
}

const PRICE_RISERS: PriceChange[] = [
  {
    id: '1',
    player: 'Bukayo Saka',
    team: 'Arsenal',
    position: 'MID',
    oldPrice: 9.1,
    newPrice: 9.2,
    change: 0.1,
    netTransfers: 245000,
    ownership: 34.7,
    form: 8.5,
    gafferTake: "Told you to get him last week. Now you're paying extra, you muppet."
  },
  {
    id: '2',
    player: 'Alexander Isak',
    team: 'Newcastle',
    position: 'FWD',
    oldPrice: 7.8,
    newPrice: 7.9,
    change: 0.1,
    netTransfers: 189000,
    ownership: 18.2,
    form: 7.8,
    gafferTake: "Swedish sniper on the rise. Get in before he hits 8.5m."
  }
];

const PRICE_FALLERS: PriceChange[] = [
  {
    id: '3',
    player: 'Raheem Sterling',
    team: 'Chelsea',
    position: 'MID',
    oldPrice: 7.5,
    newPrice: 7.4,
    change: -0.1,
    netTransfers: -156000,
    ownership: 8.4,
    form: 3.2,
    gafferTake: "Pep's wheel of rotation strikes again. Ship him out."
  },
  {
    id: '4',
    player: 'Harry Maguire',
    team: 'Man Utd',
    position: 'DEF',
    oldPrice: 4.8,
    newPrice: 4.7,
    change: -0.1,
    netTransfers: -98000,
    ownership: 2.1,
    form: 2.5,
    gafferTake: "Still overpriced at 4.7m. Avoid like a dodgy pie."
  }
];

const PREDICTED_CHANGES = [
  { player: 'Cole Palmer', team: 'Chelsea', change: 0.1, probability: 95, icon: '📈' },
  { player: 'Ollie Watkins', team: 'Aston Villa', change: 0.1, probability: 78, icon: '📈' },
  { player: 'Marcus Rashford', team: 'Man Utd', change: -0.1, probability: 82, icon: '📉' }
];

const PriceChangeTracker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'risers' | 'fallers' | 'predicted'>('risers');
  const [timeUntilUpdate, setTimeUntilUpdate] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(1, 30, 0, 0); // 1:30 AM GMT
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilUpdate(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return 'bg-yellow-400 text-slate-900';
      case 'DEF': return 'bg-blue-500 text-white';
      case 'MID': return 'bg-green-500 text-white';
      case 'FWD': return 'bg-red-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  const renderPriceCard = (change: PriceChange, isRiser: boolean) => (
    <div key={change.id} className="bg-white dark:bg-slate-900/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all p-4 group">
      <div className="flex items-start gap-4">
        {/* Team Logo */}
        <div className="w-12 h-12 shrink-0">
          <LogoWithFallback src={getTeamLogo(change.team)} teamName={change.team} size="w-full h-full" />
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                {change.player}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {change.team}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${getPositionColor(change.position)}`}>
                  {change.position}
                </span>
              </div>
            </div>

            {/* Price Change Badge */}
            <div className={`px-3 py-2 rounded-xl ${
              isRiser 
                ? 'bg-green-500/10 border-2 border-green-500/30' 
                : 'bg-red-500/10 border-2 border-red-500/30'
            }`}>
              <div className="text-xs font-bold text-slate-500 text-center mb-0.5">CHANGE</div>
              <div className={`text-xl font-black ${isRiser ? 'text-green-500' : 'text-red-500'}`}>
                {isRiser ? '+' : ''}{change.change}m
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
              <div className="text-[9px] font-bold text-slate-500 uppercase">Old</div>
              <div className="text-sm font-black text-slate-700 dark:text-slate-300">£{change.oldPrice}m</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
              <div className="text-[9px] font-bold text-slate-500 uppercase">New</div>
              <div className="text-sm font-black text-purple-600 dark:text-purple-400">£{change.newPrice}m</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
              <div className="text-[9px] font-bold text-slate-500 uppercase">Own%</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">{change.ownership}%</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
              <div className="text-[9px] font-bold text-slate-500 uppercase">Form</div>
              <div className={`text-sm font-black ${change.form >= 7 ? 'text-green-500' : change.form >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                {change.form}
              </div>
            </div>
          </div>

          {/* Net Transfers */}
          <div className="flex items-center gap-2 mb-3">
            <i className={`fas fa-exchange-alt text-xs ${isRiser ? 'text-green-500' : 'text-red-500'}`}></i>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {Math.abs(change.netTransfers).toLocaleString()} net transfers
            </span>
          </div>

          {/* Gaffer Take */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <span className="text-lg">🎩</span>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 italic flex-1">
                "{change.gafferTake}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
      <ShareSnapshot targetRef={containerRef} className="absolute top-3 right-3 z-30" />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Price Change Tracker</h2>
                <p className="text-sm text-green-200">Live monitoring • Updated hourly</p>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-xs font-bold text-green-100 mb-0.5">Next Update</div>
              <div className="text-xl font-black text-white">{timeUntilUpdate}</div>
            </div>
          </div>
          <p className="text-green-100 text-sm italic">
            "Price changes happen at 1:30 AM GMT. Don't get caught sleeping!"
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('risers')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'risers' ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <i className="fas fa-arrow-up text-xs"></i>
            Risers
            <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-black">{PRICE_RISERS.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('fallers')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'fallers' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <i className="fas fa-arrow-down text-xs"></i>
            Fallers
            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-black">{PRICE_FALLERS.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('predicted')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'predicted' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <i className="fas fa-crystal-ball text-xs"></i>
            Predicted
            <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-black">{PREDICTED_CHANGES.length}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {activeTab === 'risers' && PRICE_RISERS.map(change => renderPriceCard(change, true))}
        {activeTab === 'fallers' && PRICE_FALLERS.map(change => renderPriceCard(change, false))}
        
        {activeTab === 'predicted' && (
          <div className="space-y-3">
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2 mb-3">
                <i className="fas fa-info-circle text-purple-500 text-lg"></i>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-purple-700 dark:text-purple-400 mb-1">
                    Predicted Price Changes
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Based on net transfers and historical patterns. Higher probability = more likely to change tonight.
                  </p>
                </div>
              </div>
            </div>

            {PREDICTED_CHANGES.map((pred, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pred.icon}</span>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white">{pred.player}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{pred.team}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black ${pred.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {pred.change > 0 ? '+' : ''}{pred.change}m
                    </div>
                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {pred.probability}% likely
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Guide */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            <span className="flex items-center gap-2">
              <i className="fas fa-question-circle text-green-500"></i>
              How Price Changes Work
            </span>
            <i className="fas fa-chevron-down group-open:rotate-180 transition-transform text-xs"></i>
          </summary>
          <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p><strong className="text-green-600 dark:text-green-400">When:</strong> Price changes happen at 1:30 AM GMT every day.</p>
            <p><strong className="text-green-600 dark:text-green-400">Why:</strong> Based on net transfers (transfers in minus transfers out).</p>
            <p><strong className="text-green-600 dark:text-green-400">Rise:</strong> Player needs ~200k+ net transfers to rise £0.1m.</p>
            <p><strong className="text-green-600 dark:text-green-400">Fall:</strong> Player needs ~100k+ net transfers out to fall £0.1m.</p>
            <p><strong className="text-green-600 dark:text-green-400">Strategy:</strong> Buy before rises, sell before falls to maximize team value!</p>
          </div>
        </details>
      </div>

      {/* Gaffer's Tip */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
            <i className="fas fa-lightbulb text-white text-lg"></i>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500/80 mb-1">Pro Tip</div>
            <p className="text-xs font-bold text-white/70 italic leading-relaxed">
              "Set an alarm for 1:20 AM if you're serious about team value. Or just check this page daily like a normal person. Your call, chief."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChangeTracker;


