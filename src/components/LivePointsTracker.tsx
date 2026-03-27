import React, { useState, useEffect, useRef } from 'react';
import { getTeamLogo } from '../constants';
import LogoWithFallback from './LogoWithFallback';
import ShareSnapshot from './ShareSnapshot';

/* ── Mock live match data ── */
interface LiveMatch {
  id: number;
  homeTeam: string; awayTeam: string;
  homeScore: number; awayScore: number;
  minute: number; status: 'live' | 'ft' | 'upcoming';
  kickoff: string;
}

interface LivePlayer {
  id: number; name: string; team: string; position: string;
  gw_points: number; goals: number; assists: number;
  bonus: number; minutes: number; yellow: boolean; red: boolean;
  cs: boolean; saves: number; matchId: number;
}

const LIVE_MATCHES: LiveMatch[] = [
  { id: 1, homeTeam: 'Arsenal',   awayTeam: 'Man City',   homeScore: 2, awayScore: 1, minute: 67, status: 'live',     kickoff: '12:30' },
  { id: 2, homeTeam: 'Liverpool', awayTeam: 'Chelsea',    homeScore: 1, awayScore: 1, minute: 45, status: 'live',     kickoff: '15:00' },
  { id: 3, homeTeam: 'Spurs',     awayTeam: 'Newcastle',  homeScore: 0, awayScore: 2, minute: 90, status: 'ft',       kickoff: '15:00' },
  { id: 4, homeTeam: 'Aston Villa', awayTeam: 'Man Utd',  homeScore: 0, awayScore: 0, minute: 0,  status: 'upcoming', kickoff: '17:30' },
  { id: 5, homeTeam: 'Brentford', awayTeam: 'Wolves',     homeScore: 1, awayScore: 0, minute: 90, status: 'ft',       kickoff: '15:00' },
];

const LIVE_PLAYERS: LivePlayer[] = [
  { id: 1,  name: 'Salah',             team: 'Liverpool',  position: 'FWD', gw_points: 15, goals: 1, assists: 1, bonus: 3, minutes: 45, yellow: false, red: false, cs: false, saves: 0, matchId: 2 },
  { id: 2,  name: 'Saka',              team: 'Arsenal',    position: 'FWD', gw_points: 12, goals: 1, assists: 0, bonus: 2, minutes: 67, yellow: false, red: false, cs: false, saves: 0, matchId: 1 },
  { id: 3,  name: 'Haaland',           team: 'Man City',   position: 'FWD', gw_points: 6,  goals: 0, assists: 1, bonus: 0, minutes: 67, yellow: true,  red: false, cs: false, saves: 0, matchId: 1 },
  { id: 4,  name: 'Palmer',            team: 'Chelsea',    position: 'MID', gw_points: 9,  goals: 1, assists: 0, bonus: 1, minutes: 45, yellow: false, red: false, cs: false, saves: 0, matchId: 2 },
  { id: 5,  name: 'Alexander-Arnold',  team: 'Liverpool',  position: 'DEF', gw_points: 6,  goals: 0, assists: 1, bonus: 0, minutes: 45, yellow: false, red: false, cs: false, saves: 0, matchId: 2 },
  { id: 6,  name: 'Saliba',            team: 'Arsenal',    position: 'DEF', gw_points: 9,  goals: 0, assists: 0, bonus: 1, minutes: 67, yellow: false, red: false, cs: true,  saves: 0, matchId: 1 },
  { id: 7,  name: 'Raya',              team: 'Arsenal',    position: 'GK',  gw_points: 6,  goals: 0, assists: 0, bonus: 0, minutes: 67, yellow: false, red: false, cs: true,  saves: 3, matchId: 1 },
  { id: 8,  name: 'Isak',              team: 'Newcastle',  position: 'FWD', gw_points: 18, goals: 2, assists: 0, bonus: 3, minutes: 90, yellow: false, red: false, cs: false, saves: 0, matchId: 3 },
  { id: 9,  name: 'Watkins',           team: 'Aston Villa',position: 'FWD', gw_points: 2,  goals: 0, assists: 0, bonus: 0, minutes: 0,  yellow: false, red: false, cs: false, saves: 0, matchId: 4 },
  { id: 10, name: 'Odegaard',          team: 'Arsenal',    position: 'MID', gw_points: 8,  goals: 1, assists: 0, bonus: 0, minutes: 67, yellow: false, red: false, cs: false, saves: 0, matchId: 1 },
  { id: 11, name: 'Flekken',           team: 'Brentford',  position: 'GK',  gw_points: 9,  goals: 0, assists: 0, bonus: 1, minutes: 90, yellow: false, red: false, cs: true,  saves: 4, matchId: 5 },
  { id: 12, name: 'Pedro Porro',       team: 'Spurs',      position: 'DEF', gw_points: 1,  goals: 0, assists: 0, bonus: 0, minutes: 90, yellow: false, red: false, cs: false, saves: 0, matchId: 3 },
];

/* ── Helpers ── */
const pointsBadge = (pts: number) => {
  if (pts >= 15) return 'bg-green-500 text-white';
  if (pts >= 9)  return 'bg-green-400 text-white';
  if (pts >= 6)  return 'bg-yellow-400 text-slate-900';
  if (pts >= 3)  return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
  return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
};

const posBadge: Record<string, string> = {
  GK: 'bg-yellow-400 text-slate-900', DEF: 'bg-blue-500 text-white',
  MID: 'bg-green-500 text-white', FWD: 'bg-red-500 text-white'
};

/* ── Ticker item ── */
const TickerItem: React.FC<{ match: LiveMatch }> = ({ match }) => (
  <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap
    ${match.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
    : match.status === 'ft'   ? 'bg-slate-700 text-slate-300'
    : 'bg-slate-800 text-slate-400'}`}>
    {match.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
    <span>{match.homeTeam}</span>
    <span className="font-black text-white">{match.homeScore}–{match.awayScore}</span>
    <span>{match.awayTeam}</span>
    {match.status === 'live' && <span className="text-red-400">{match.minute}'</span>}
    {match.status === 'ft'   && <span className="text-slate-500">FT</span>}
    {match.status === 'upcoming' && <span className="text-slate-500">{match.kickoff}</span>}
  </div>
);

/* ── Match card ── */
const MatchCard: React.FC<{ match: LiveMatch; selected: boolean; onClick: () => void }> = ({ match, selected, onClick }) => {
  const isLive = match.status === 'live';
  const isFT   = match.status === 'ft';
  return (
    <button onClick={onClick}
      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${selected
        ? 'border-accent bg-accent/10 dark:bg-accent/20 shadow-lg'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
          isLive ? 'bg-red-500 text-white animate-pulse' : isFT ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
          {isLive ? `LIVE ${match.minute}'` : isFT ? 'FT' : match.kickoff}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="w-6 h-6 shrink-0">
            <LogoWithFallback src={getTeamLogo(match.homeTeam)} teamName={match.homeTeam} size="w-full h-full" className="rounded-full" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{match.homeTeam}</span>
        </div>
        <div className="text-lg font-black text-slate-900 dark:text-white shrink-0 px-1">
          {match.status === 'upcoming' ? 'vs' : `${match.homeScore}–${match.awayScore}`}
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate text-right">{match.awayTeam}</span>
          <div className="w-6 h-6 shrink-0">
            <LogoWithFallback src={getTeamLogo(match.awayTeam)} teamName={match.awayTeam} size="w-full h-full" className="rounded-full" />
          </div>
        </div>
      </div>
    </button>
  );
};

/* ── Player row ── */
const PlayerRow: React.FC<{ player: LivePlayer; isCaptain?: boolean }> = ({ player, isCaptain }) => {
  const match = LIVE_MATCHES.find(m => m.id === player.matchId);
  const displayPts = isCaptain ? player.gw_points * 2 : player.gw_points;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="w-9 h-9 shrink-0">
        <LogoWithFallback src={getTeamLogo(player.team)} teamName={player.team} size="w-full h-full" className="rounded-full" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm text-slate-900 dark:text-white">{player.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${posBadge[player.position]}`}>{player.position}</span>
          {isCaptain && <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-yellow-400 text-slate-900">C</span>}
          {player.yellow && <span title="Yellow card">🟨</span>}
          {player.red    && <span title="Red card">🟥</span>}
          {player.cs     && <span title="Clean sheet" className="text-[10px] text-blue-500 font-bold">CS</span>}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
          <span>{player.team}</span>
          {match && (
            <span className={`${match.status === 'live' ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
              {match.status === 'live' ? `${match.minute}'` : match.status === 'ft' ? 'FT' : match.kickoff}
            </span>
          )}
          <span>{player.minutes}'</span>
        </div>
      </div>

      {/* Stat chips */}
      <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold shrink-0">
        {player.goals > 0   && <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">⚽ {player.goals}</span>}
        {player.assists > 0 && <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">🅰️ {player.assists}</span>}
        {player.saves > 0   && <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">🧤 {player.saves}</span>}
        {player.bonus > 0   && <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">⭐ {player.bonus}</span>}
      </div>

      {/* Points */}
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${pointsBadge(displayPts)}`}>
        {displayPts}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const LivePointsTracker: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [captainId] = useState(1); // Salah as captain for demo
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'ft' | 'upcoming'>('all');
  const trackerRef = useRef<HTMLDivElement>(null);

  /* Simulate live refresh every 60s */
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = LIVE_MATCHES.filter(m =>
    activeTab === 'all' ? true : m.status === activeTab
  );

  const displayedPlayers = selectedMatch
    ? LIVE_PLAYERS.filter(p => p.matchId === selectedMatch)
    : LIVE_PLAYERS;

  const displayedSorted = [...displayedPlayers].sort((a, b) => b.gw_points - a.gw_points);

  const totalGwPoints = LIVE_PLAYERS.reduce((sum, p) => {
    return sum + (p.id === captainId ? p.gw_points * 2 : p.gw_points);
  }, 0);

  const liveCount  = LIVE_MATCHES.filter(m => m.status === 'live').length;
  const ftCount    = LIVE_MATCHES.filter(m => m.status === 'ft').length;
  const upcomCount = LIVE_MATCHES.filter(m => m.status === 'upcoming').length;

  const topScorer = [...LIVE_PLAYERS].sort((a, b) => b.gw_points - a.gw_points)[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2">🔴 Live Points Tracker</h2>
            </div>
            <p className="text-base md:text-lg opacity-90">Gameweek 28 · Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-black">{totalGwPoints}</div>
              <div className="text-xs opacity-80">GW Points</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-black text-red-200">{liveCount}</div>
              <div className="text-xs opacity-80">Live Now</div>
            </div>
            <ShareSnapshot
              targetRef={trackerRef}
              template="gw-points"
              userTier="first-team"
              shareText={`GW28 haul: ${totalGwPoints} points 🔥 via @TheGafferEPL`}
              className="relative"
              label="Snap"
            />
          </div>
        </div>
      </div>

      {/* Live ticker */}
      <div className="bg-slate-900 px-4 py-2 overflow-x-auto">
        <div className="flex gap-3 items-center min-w-max">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 shrink-0">GW28</span>
          {LIVE_MATCHES.map(m => <TickerItem key={m.id} match={m} />)}
        </div>
      </div>

      <div ref={trackerRef} className="p-4 md:p-6 space-y-6">

        {/* Match filter tabs */}
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {([['all', 'All Matches', LIVE_MATCHES.length], ['live', '🔴 Live', liveCount], ['ft', 'FT', ftCount], ['upcoming', 'Upcoming', upcomCount]] as const).map(([tab, label, count]) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSelectedMatch(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${activeTab === tab ? 'bg-accent text-white shadow' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                {label} <span className="opacity-70">({count})</span>
              </button>
            ))}
          </div>

          {/* Match cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMatches.map(match => (
              <MatchCard key={match.id} match={match}
                selected={selectedMatch === match.id}
                onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)} />
            ))}
          </div>
          {selectedMatch && (
            <button onClick={() => setSelectedMatch(null)} className="mt-2 text-xs text-accent hover:underline">
              ← Show all players
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Top Scorer', value: topScorer.name, sub: `${topScorer.gw_points} pts`, icon: '🏆', color: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800' },
            { label: 'Goals This GW', value: LIVE_PLAYERS.reduce((s, p) => s + p.goals, 0), sub: 'across all matches', icon: '⚽', color: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800' },
            { label: 'Assists This GW', value: LIVE_PLAYERS.reduce((s, p) => s + p.assists, 0), sub: 'across all matches', icon: '🅰️', color: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800' },
            { label: 'Clean Sheets', value: LIVE_PLAYERS.filter(p => p.cs).length, sub: 'players with CS', icon: '🧱', color: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800' },
          ].map(({ label, value, sub, icon, color }) => (
            <div key={label} className={`bg-gradient-to-br ${color} border rounded-xl p-3`}>
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-black text-xl text-slate-900 dark:text-white">{value}</div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</div>
              <div className="text-[10px] text-slate-500">{sub}</div>
            </div>
          ))}
        </div>

        {/* Player list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
              {selectedMatch
                ? `Players in ${LIVE_MATCHES.find(m => m.id === selectedMatch)?.homeTeam} vs ${LIVE_MATCHES.find(m => m.id === selectedMatch)?.awayTeam}`
                : 'All Player Points'}
            </h3>
            <span className="text-xs text-slate-400">{displayedSorted.length} players</span>
          </div>
          <div className="space-y-2">
            {displayedSorted.map(player => (
              <PlayerRow key={player.id} player={player} isCaptain={player.id === captainId} />
            ))}
          </div>
        </div>

        {/* Gaffer commentary */}
        <div className="bg-gradient-to-r from-purple-50 to-accent/5 dark:from-purple-900/20 dark:to-accent/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎩</span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">Gaffer's Live Commentary</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                {totalGwPoints >= 60
                  ? `"${totalGwPoints} points and counting — that's a proper haul! Salah with the captain's armband doing the business as usual. Keep it going lads."`
                  : totalGwPoints >= 40
                  ? `"${totalGwPoints} points so far — decent but not spectacular. A couple of your players are still to play, so don't panic just yet."`
                  : `"${totalGwPoints} points? I've seen better scores from a Sunday league reserve team. Pray for some late goals, son."`}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600">
          ⚡ Live data updates every 60 seconds · Points shown are provisional and may change with bonus point allocations
        </p>
      </div>
    </div>
  );
};

export default LivePointsTracker;


