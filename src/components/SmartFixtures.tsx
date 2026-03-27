import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Fixture } from '../../types';
import { getTeamLogo } from '../constants';
import ShareSnapshot from './ShareSnapshot';
import LogoWithFallback from './LogoWithFallback';
import SkeletonFixtures from './skeletons/SkeletonFixtures';
import LastFiveGamesHover from './LastFiveGamesHover';
import { INJURY_DATA, InjuredPlayer } from '../data/injuryData';

type FixtureTab = 'fixtures' | 'injuries';

// STADIUM COORDINATES
const STADIUMS: Record<string, { lat: number; lng: number }> = {
  "Arsenal": { lat: 51.5549, lng: -0.1084 },
  "Aston Villa": { lat: 52.5091, lng: -1.8848 },
  "Bournemouth": { lat: 50.7352, lng: -1.8385 },
  "Brentford": { lat: 51.4907, lng: -0.2891 },
  "Brighton": { lat: 50.8616, lng: -0.0837 },
  "Chelsea": { lat: 51.4816, lng: -0.1909 },
  "Crystal Palace": { lat: 51.3982, lng: -0.0855 },
  "Everton": { lat: 53.4388, lng: -2.9663 },
  "Fulham": { lat: 51.4749, lng: -0.2216 },
  "Liverpool": { lat: 53.4308, lng: -2.9608 },
  "Luton Town": { lat: 51.8841, lng: -0.4316 },
  "Man City": { lat: 53.4831, lng: -2.2004 },
  "Man Utd": { lat: 53.4631, lng: -2.2913 },
  "Newcastle": { lat: 54.9756, lng: -1.6218 },
  "Nott'm Forest": { lat: 52.9400, lng: -1.1329 },
  "Sheffield Utd": { lat: 53.3704, lng: -1.4709 },
  "Spurs": { lat: 51.6042, lng: -0.0662 },
  "West Ham": { lat: 51.5387, lng: -0.0166 },
  "Wolves": { lat: 52.5902, lng: -2.1304 },
  "Burnley": { lat: 53.789, lng: -2.230 },
  "Ipswich": { lat: 52.055, lng: 1.145 },
  "Leicester": { lat: 52.620, lng: -1.142 },
  "Southampton": { lat: 50.905, lng: -1.391 },
};

interface WeatherData {
  temperature_2m: number;
  wind_speed_10m: number;
  precipitation: number;
  cloud_cover: number;
}

interface SmartFixturesProps {
  data: Fixture[];
  fallbackEmbedId: string;
}

const STATUS_CONFIG: Record<InjuredPlayer['status'], { label: string; color: string; icon: string }> = {
  'out':      { label: 'Out',      color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',          icon: '🔴' },
  'doubtful': { label: 'Doubtful', color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30', icon: '🟠' },
  '75%':      { label: '75%',      color: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30', icon: '🟡' },
  '25%':      { label: '25%',      color: 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/30',            icon: '🔴' },
};

const SmartFixtures: React.FC<SmartFixturesProps> = ({ data, fallbackEmbedId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [weatherLoading, setWeatherLoading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<FixtureTab>('fixtures');
  const [injuryFilter, setInjuryFilter] = useState<'all' | InjuredPlayer['status']>('all');
  const [injuryTeamFilter, setInjuryTeamFilter] = useState('all');
  const [injurySearch, setInjurySearch] = useState('');

  const injuryTeams = useMemo(() => ['all', ...[...new Set(INJURY_DATA.map(p => p.team))].sort()], []);

  const filteredInjuries = useMemo(() => INJURY_DATA.filter(p => {
    const matchStatus = injuryFilter === 'all' || p.status === injuryFilter;
    const matchTeam = injuryTeamFilter === 'all' || p.team === injuryTeamFilter;
    const matchSearch = !injurySearch || p.name.toLowerCase().includes(injurySearch.toLowerCase()) || p.team.toLowerCase().includes(injurySearch.toLowerCase());
    return matchStatus && matchTeam && matchSearch;
  }), [injuryFilter, injuryTeamFilter, injurySearch]);

  if (!data || data.length === 0) {
    return <SkeletonFixtures />;
  }

  const getFDRColor = (rating?: number) => {
    switch(rating) {
      case 1: return 'bg-emerald-500 text-white';
      case 2: return 'bg-emerald-300 text-emerald-900';
      case 3: return 'bg-slate-300 text-slate-800';
      case 4: return 'bg-orange-400 text-white';
      case 5: return 'bg-red-600 text-white';
      default: return 'bg-slate-200 text-slate-500';
    }
  };

  const getWeatherIcon = (weather: WeatherData) => {
    if (weather.precipitation > 0.5) return 'fa-cloud-rain';
    if (weather.cloud_cover > 70) return 'fa-cloud';
    if (weather.cloud_cover > 30) return 'fa-cloud-sun';
    return 'fa-sun';
  };

  const getWeatherVerdict = (weather: WeatherData) => {
    if (weather.precipitation > 0.5) return { text: 'Slick', color: 'text-blue-500' };
    if (weather.wind_speed_10m > 15) return { text: 'Windy', color: 'text-gray-500' };
    if (weather.temperature_2m > 20) return { text: 'Hot', color: 'text-orange-500' };
    if (weather.temperature_2m < 5) return { text: 'Cold', color: 'text-cyan-500' };
    return { text: 'Perfect', color: 'text-green-500' };
  };

  const fetchWeatherForStadium = async (homeTeam: string) => {
    if (weatherData[homeTeam] || weatherLoading[homeTeam]) return;
    
    setWeatherLoading(prev => ({ ...prev, [homeTeam]: true }));
    
    const stadiumKey = Object.keys(STADIUMS).find(k => homeTeam.includes(k) || k.includes(homeTeam));
    
    if (stadiumKey) {
      const { lat, lng } = STADIUMS[stadiumKey];
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,wind_speed_10m,cloud_cover&wind_speed_unit=mph`);
        const data = await res.json();
        if (data.current) {
          setWeatherData(prev => ({ ...prev, [homeTeam]: data.current }));
        }
      } catch (e) {
        // console.error(`Weather error for ${homeTeam}`, e);
        setWeatherData(prev => ({ ...prev, [homeTeam]: { temperature_2m: 12, wind_speed_10m: 10, precipitation: 0, cloud_cover: 50 } }));
      }
    }
    
    setWeatherLoading(prev => ({ ...prev, [homeTeam]: false }));
  };

  useEffect(() => {
    const upcomingMatches = data?.filter(f => f.status !== 'finished') || [];
    upcomingMatches.slice(0, 5).forEach(match => {
      fetchWeatherForStadium(match.homeTeam);
    });
  }, [data]);

  return (
    <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
      <ShareSnapshot targetRef={containerRef} className="absolute top-3 right-3 z-30" />

      {/* Tab bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'fixtures' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <i className="fas fa-calendar-alt text-xs"></i>
            Upcoming Fixtures
          </button>
          <button
            onClick={() => setActiveTab('injuries')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'injuries' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <i className="fas fa-briefcase-medical text-xs"></i>
            Injuries &amp; Bans
            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-black">{INJURY_DATA.length}</span>
          </button>
        </div>
      </div>

      {/* === INJURY TRACKER TAB === */}
      {activeTab === 'injuries' && (
        <div className="p-4 md:p-6">
          {/* Filters row */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text" placeholder="Search player or team..."
                value={injurySearch} onChange={e => setInjurySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-accent"
              />
            </div>
            <select
              value={injuryTeamFilter}
              onChange={e => setInjuryTeamFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              {injuryTeams.map(t => <option key={t} value={t}>{t === 'all' ? 'All Teams' : t}</option>)}
            </select>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['all', 'out', 'doubtful', '75%', '25%'] as const).map(s => (
              <button
                key={s}
                onClick={() => setInjuryFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  injuryFilter === s
                    ? s === 'all'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : STATUS_CONFIG[s as InjuredPlayer['status']].color + ' border'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {s === 'all' ? `All (${INJURY_DATA.length})` : `${STATUS_CONFIG[s].icon} ${STATUS_CONFIG[s].label} (${INJURY_DATA.filter(p => p.status === s).length})`}
              </button>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Player</th>
                  <th className="text-center px-3 py-3">Pos</th>
                  <th className="text-center px-3 py-3">Status</th>
                  <th className="text-left px-3 py-3">Injury / Reason</th>
                  <th className="text-center px-3 py-3">Return</th>
                  <th className="text-center px-3 py-3">Own%</th>
                  <th className="text-left px-4 py-3">Gaffer Says</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredInjuries.map(p => {
                  const cfg = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 shrink-0">
                            <LogoWithFallback src={getTeamLogo(p.team)} teamName={p.team} size="w-full h-full" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                            <div className="text-[10px] text-slate-400">{p.team}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-3 py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          { GK: 'bg-yellow-400 text-slate-900', DEF: 'bg-blue-500 text-white', MID: 'bg-green-500 text-white', FWD: 'bg-red-500 text-white' }[p.position]
                        }`}>{p.position}</span>
                      </td>
                      <td className="text-center px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">{p.injury}</td>
                      <td className="text-center px-3 py-3 text-xs font-bold text-slate-700 dark:text-slate-300">{p.expectedReturn}</td>
                      <td className="text-center px-3 py-3">
                        <span className={`text-xs font-bold ${p.ownership > 20 ? 'text-red-500' : p.ownership > 10 ? 'text-orange-500' : 'text-slate-500'}`}>
                          {p.ownership}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 italic max-w-xs">"{p.gafferNote}"</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3 max-h-[600px] overflow-y-auto">
            {filteredInjuries.map(p => {
              const cfg = STATUS_CONFIG[p.status];
              return (
                <div key={p.id} className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 shrink-0">
                        <LogoWithFallback src={getTeamLogo(p.team)} teamName={p.team} size="w-full h-full" />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.team} · {p.position}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Injury</div>
                      <div className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{p.injury.split(' — ')[0]}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Return</div>
                      <div className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{p.expectedReturn}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Owned</div>
                      <div className={`font-bold mt-0.5 ${p.ownership > 20 ? 'text-red-500' : p.ownership > 10 ? 'text-orange-500' : 'text-slate-500'}`}>{p.ownership}%</div>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">🎩 "{p.gafferNote}"</p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredInjuries.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <div className="text-4xl mb-3">💪</div>
              <p className="font-bold">No injuries matching your filters</p>
              <p className="text-sm mt-1">Try adjusting your search</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              <i className="fas fa-sync-alt mr-1 text-purple-500"></i>
              Injury data from FPL API · Updated before each Gameweek deadline
            </p>
          </div>
        </div>
      )}

      {/* === FIXTURES TAB === */}
      {activeTab === 'fixtures' && <>
      {/* Split Difficulty Key Explanation */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 space-y-3 pr-16">
         <div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-primary dark:text-white mr-1 block sm:inline">Attacking Difficulty (ATT):</strong> 
              Rates the opponent's defense on a scale of <span className="font-bold text-success">1 (Green - Easy)</span> to <span className="font-bold text-highlight">5 (Red - Hard)</span>.
            </p>
         </div>
         <div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-primary dark:text-white mr-1 block sm:inline">Defensive Difficulty (DEF):</strong> 
              Rates the opponent's attack on a scale of <span className="font-bold text-success">1 (Green - Easy)</span> to <span className="font-bold text-highlight">5 (Red - Hard)</span>.
            </p>
         </div>
         <div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-primary dark:text-white mr-1 block sm:inline">🌤️ Pitch Conditions:</strong> 
              Click weather icons for detailed conditions. <span className="font-bold text-green-500">Perfect</span> = Ideal, <span className="font-bold text-blue-500">Slick</span> = Rainy, <span className="font-bold text-gray-500">Windy</span> = Strong winds.
            </p>
         </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {data.map((match, idx) => {
          const homeLogo = getTeamLogo(match.homeTeam);
          const awayLogo = getTeamLogo(match.awayTeam);
          const overallRating = match.difficulty?.overall || match.fdrRating;
          const attRating = match.difficulty?.att;
          const defRating = match.difficulty?.def;

          return (
            <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex flex-col md:flex-row items-center justify-between gap-4 group">
              
              <div className="flex flex-col md:w-28 text-center md:text-left shrink-0">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {match.date}
                </div>
                {match.gameweek && (
                   <span className="text-[9px] text-slate-300 font-mono mt-1">GW {match.gameweek}</span>
                )}
                
                {attRating && defRating ? (
                   <div className="hidden md:flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-1 justify-between bg-slate-100 dark:bg-slate-900/50 rounded px-1.5 py-0.5">
                         <span className="text-[8px] font-bold text-slate-500">ATT</span>
                         <span className={`text-[8px] font-black w-4 text-center rounded ${getFDRColor(attRating)}`}>{attRating}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-between bg-slate-100 dark:bg-slate-900/50 rounded px-1.5 py-0.5">
                         <span className="text-[8px] font-bold text-slate-500">DEF</span>
                         <span className={`text-[8px] font-black w-4 text-center rounded ${getFDRColor(defRating)}`}>{defRating}</span>
                      </div>
                   </div>
                ) : overallRating && (
                  <div className="hidden md:flex items-center gap-1 mt-2">
                     <span className={`text-[9px] font-black px-1.5 rounded ${getFDRColor(overallRating)}`}>FDR {overallRating}</span>
                  </div>
                )}
              </div>

              <div className="flex-grow flex items-center justify-center gap-2 md:gap-4 w-full">
                
                {/* Home Team */}
                <div className="flex-1 flex items-center justify-end gap-3 text-right">
                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate hidden sm:block">
                    {match.homeTeam}
                  </span>
                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate sm:hidden">
                    {match.homeTeam.substring(0, 3).toUpperCase()}
                  </span>
                  
                  {/* Logo With Fallback */}
                  <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 transition-transform group-hover:scale-110">
                    <LogoWithFallback src={homeLogo} teamName={match.homeTeam} size="w-full h-full" className="drop-shadow-sm" />
                  </div>
                </div>
                
                {/* Score / VS */}
                <div className="shrink-0 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 min-w-[70px] md:min-w-[80px] text-center border border-slate-200 dark:border-slate-700 z-10 flex flex-col items-center justify-center">
                  {match.status === 'live' || match.status === 'finished' ? (
                    <span className={`font-mono font-bold text-lg ${match.status === 'live' ? 'text-accent animate-pulse' : 'text-dark dark:text-white'}`}>
                      {match.score}
                    </span>
                  ) : (
                    <div className="flex flex-col items-center justify-center px-2 md:px-4">
                      {match.status === 'upcoming' && (
                        <LastFiveGamesHover 
                          homeTeam={match.homeTeam} 
                          awayTeam={match.awayTeam}
                        >
                          <span className="font-mono font-bold text-lg text-slate-500 hover:text-slate-700 cursor-help transition-colors">
                            VS
                          </span>
                        </LastFiveGamesHover>
                      )}
                      {overallRating && (
                        <span className={`md:hidden text-[8px] font-black px-1 rounded mt-1 ${getFDRColor(overallRating)}`}>
                           {attRating ? `ATT ${attRating} / DEF ${defRating}` : `FDR ${overallRating}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center justify-start gap-3 text-left">
                  <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 transition-transform group-hover:scale-110">
                    <LogoWithFallback src={awayLogo} teamName={match.awayTeam} size="w-full h-full" className="drop-shadow-sm" />
                  </div>

                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate hidden sm:block">
                    {match.awayTeam}
                  </span>
                  <span className="font-heading font-bold text-primary dark:text-white text-sm md:text-base truncate sm:hidden">
                    {match.awayTeam.substring(0, 3).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status / Time */}
              <div className="md:w-24 text-center md:text-right">
                {match.status === 'live' ? (
                  <span className="inline-block px-2 py-1 bg-accent text-white text-xs font-bold rounded animate-pulse">LIVE</span>
                ) : match.status === 'finished' ? (
                  <span className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded">FT</span>
                ) : (
                  <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded border border-slate-300 dark:border-slate-600">
                    {match.time}
                  </span>
                )}
              </div>

              {/* Match Info Bar — Venue, Referee, Matchweek (upcoming only) */}
              {match.status === 'upcoming' && (match.venue || match.referee || match.gameweek) && (
                <div className="w-full flex items-center justify-center gap-2 flex-wrap mt-1 md:mt-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    {match.gameweek && (
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-bold">
                        Matchweek {match.gameweek}
                      </span>
                    )}
                    {match.venue && (
                      <>
                        <span className="opacity-40">•</span>
                        <span>📍 {match.venue}</span>
                      </>
                    )}
                    {match.referee && (
                      <>
                        <span className="opacity-40">•</span>
                        <span>⚖️ {match.referee}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Weather Widget - Only for upcoming matches */}
              {match.status !== 'finished' && (
                <div className="weather-widget">
                  {weatherLoading[match.homeTeam] ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-slate-400">Loading</span>
                    </div>
                  ) : weatherData[match.homeTeam] ? (
                    <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => fetchWeatherForStadium(match.homeTeam)}>
                      <div className="relative">
                        <i className={`fas ${getWeatherIcon(weatherData[match.homeTeam])} weather-icon ${getWeatherVerdict(weatherData[match.homeTeam]).color}`}></i>
                        <span className="temp-badge">
                          {Math.round(weatherData[match.homeTeam].temperature_2m)}°
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className={`font-bold ${getWeatherVerdict(weatherData[match.homeTeam]).color}`}>
                          {getWeatherVerdict(weatherData[match.homeTeam]).text}
                        </span>
                      </div>
                      <div className="weather-tooltip">
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          <div className="flex justify-between gap-2">
                            <span>Wind:</span>
                            <span>{weatherData[match.homeTeam].wind_speed_10m} mph</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span>Rain:</span>
                            <span>{weatherData[match.homeTeam].precipitation} mm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={() => fetchWeatherForStadium(match.homeTeam)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        title="Get weather"
                      >
                        <i className="fas fa-cloud text-xs text-slate-400"></i>
                      </button>
                      <span className="text-xs text-slate-400">Weather</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
      
      </>}

      {/* Manager's Notes */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-yellow-500/20">
            <i className="fas fa-clipboard text-white text-sm"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500/80 mb-1">Manager's Notes</div>
            <p className="text-xs font-bold text-white/70 italic leading-relaxed">
              "Powered by Half-Time Pie Juice — finds fixtures faster than a VAR decision on a penalty"
            </p>
            <a
              href="https://ko-fi.com/thegaffer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 text-[10px] font-black uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors group"
            >
              <span className="group-hover:animate-bounce">🥧</span>
              Fuel the Gaffer's pie habit
              <i className="fas fa-arrow-right text-[8px] group-hover:translate-x-0.5 transition-transform"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFixtures;


