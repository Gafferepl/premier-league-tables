import React, { useState, useMemo, useRef } from 'react';
import { getTeamLogo } from '../constants';
import LogoWithFallback from './LogoWithFallback';
import { FPLPlayer, MOCK_PLAYERS } from '../data/playerData';
import ShareSnapshot from './ShareSnapshot';
import TierUpgradeModal from './TierUpgradeModal';
import GuideModal from './GuideModal';
import SeasonalAccessControl from './SeasonalAccessControl';
import GafferSquadAnalysis from './GafferSquadAnalysis';
import { isAdminAccessClient } from '../config/admin';

// Check for admin access
const isAdminAccess = () => {
  return isAdminAccessClient();
};

/* ── Types ── */
type Position = 'GK' | 'DEF' | 'MID' | 'FWD';
type Formation = '4-4-2' | '4-3-3' | '3-5-2' | '4-5-1' | '3-4-3' | '5-3-2' | '5-4-1';

interface SquadSlot { position: Position; index: number; }

const FORMATIONS: Record<Formation, { GK: number; DEF: number; MID: number; FWD: number }> = {
  '4-4-2': { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  '4-3-3': { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  '3-5-2': { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  '4-5-1': { GK: 1, DEF: 4, MID: 5, FWD: 1 },
  '3-4-3': { GK: 1, DEF: 3, MID: 4, FWD: 3 },
  '5-3-2': { GK: 1, DEF: 5, MID: 3, FWD: 2 },
  '5-4-1': { GK: 1, DEF: 5, MID: 4, FWD: 1 },
};

const BUDGET = 1000; // £100.0m in tenths

/* ── Pitch slot component ── */
interface PitchSlotProps {
  player: FPLPlayer | null;
  slot: SquadSlot;
  isCaptain: boolean;
  isViceCaptain: boolean;
  onSelect: (slot: SquadSlot) => void;
  onRemove: (slot: SquadSlot) => void;
  onCaptain: (slot: SquadSlot) => void;
  onViceCaptain: (slot: SquadSlot) => void;
  isActive: boolean;
}

const POS_COLORS: Record<Position, string> = {
  GK: 'from-yellow-500 to-yellow-600',
  DEF: 'from-blue-500 to-blue-600',
  MID: 'from-green-500 to-green-600',
  FWD: 'from-red-500 to-red-600',
};

const PitchSlot: React.FC<PitchSlotProps> = ({
  player, slot, isCaptain, isViceCaptain, onSelect, onRemove, onCaptain, onViceCaptain, isActive
}) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!player) {
    return (
      <button
        onClick={() => onSelect(slot)}
        className={`flex flex-col items-center gap-1 group transition-all ${isActive ? 'scale-105' : ''}`}
      >
        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-all
          ${isActive ? 'border-accent bg-accent/20 shadow-lg shadow-accent/30' : 'border-white/40 bg-white/10 hover:border-white/70 hover:bg-white/20'}`}>
          <i className="fas fa-plus text-white/60 group-hover:text-white text-lg"></i>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${POS_COLORS[slot.position]} text-white`}>
          {slot.position}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-transform bg-white"
        >
          <LogoWithFallback src={getTeamLogo(player.team)} teamName={player.team} size="w-full h-full" className="rounded-full" />
        </button>
        {isCaptain && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[9px] font-black text-slate-900 shadow">C</div>
        )}
        {isViceCaptain && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-[9px] font-black text-slate-900 shadow">V</div>
        )}

        {/* Context menu */}
        {showMenu && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 text-xs whitespace-nowrap overflow-hidden">
            {!isCaptain && (
              <button onClick={() => { onCaptain(slot); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-slate-700 dark:text-slate-300">
                <span className="w-4 h-4 bg-yellow-400 rounded-full text-[8px] font-black text-slate-900 flex items-center justify-center">C</span> Make Captain
              </button>
            )}
            {!isViceCaptain && (
              <button onClick={() => { onViceCaptain(slot); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                <span className="w-4 h-4 bg-slate-300 rounded-full text-[8px] font-black text-slate-900 flex items-center justify-center">V</span> Vice Captain
              </button>
            )}
            <button onClick={() => { onRemove(slot); setShowMenu(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
              <i className="fas fa-times text-xs"></i> Remove
            </button>
          </div>
        )}
      </div>

      <div className="text-center max-w-[70px]">
        <div className="text-white text-[10px] font-bold truncate leading-tight drop-shadow">{player.web_name}</div>
        <div className="text-white/80 text-[9px]">£{player.now_cost}m</div>
      </div>
    </div>
  );
};

/* ── Player picker modal ── */
interface PickerProps {
  slot: SquadSlot;
  squad: (FPLPlayer | null)[];
  remainingBudget: number;
  onPick: (player: FPLPlayer) => void;
  onClose: () => void;
}

const PlayerPicker: React.FC<PickerProps> = ({ slot, squad, remainingBudget, onPick, onClose }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'total_points' | 'now_cost' | 'form'>('total_points');

  const squadIds = new Set(squad.filter(Boolean).map(p => p!.id));

  const available = useMemo(() => MOCK_PLAYERS
    .filter(p =>
      p.position === slot.position &&
      !squadIds.has(p.id) &&
      p.now_cost <= remainingBudget &&
      (p.web_name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => sortBy === 'form' ? parseFloat(b.form) - parseFloat(a.form) : (b[sortBy] as number) - (a[sortBy] as number)),
    [search, sortBy, remainingBudget]
  );

  const posBadge: Record<Position, string> = {
    GK: 'bg-yellow-400 text-slate-900', DEF: 'bg-blue-500 text-white',
    MID: 'bg-green-500 text-white', FWD: 'bg-red-500 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={`p-4 bg-gradient-to-r ${POS_COLORS[slot.position]} text-white flex items-center justify-between`}>
          <div>
            <h3 className="font-black text-lg">Pick {slot.position}</h3>
            <p className="text-xs opacity-80">Budget remaining: £{(remainingBudget / 10).toFixed(1)}m</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Search + Sort */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 space-y-2">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" placeholder="Search player or team..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent" />
          </div>
          <div className="flex gap-2">
            {(['total_points', 'now_cost', 'form'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${sortBy === s ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                {s === 'total_points' ? 'Points' : s === 'now_cost' ? 'Price' : 'Form'}
              </button>
            ))}
          </div>
        </div>

        {/* Player list */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-700/50">
          {available.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <div className="text-3xl mb-2">😬</div>
              <p className="font-bold text-sm">No players available</p>
              <p className="text-xs mt-1">Try adjusting your budget or search</p>
            </div>
          ) : available.map(player => (
            <button key={player.id} onClick={() => onPick(player)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left">
              <div className="w-9 h-9 shrink-0">
                <LogoWithFallback src={getTeamLogo(player.team)} teamName={player.team} size="w-full h-full" className="rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{player.web_name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${posBadge[slot.position]}`}>{player.position}</span>
                  {player.news && <span className="text-[10px] text-orange-500">⚠️</span>}
                </div>
                <div className="text-xs text-slate-500">{player.team}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-slate-900 dark:text-white text-sm">{player.total_points} pts</div>
                <div className="text-xs text-slate-500">£{player.now_cost}m · {player.form}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const SquadBuilder: React.FC = () => {
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [squad, setSquad] = useState<(FPLPlayer | null)[]>(Array(15).fill(null));
  const [captainSlot, setCaptainSlot] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [vcSlot, setVcSlot] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<SquadSlot | null>(null);
  const [teamName, setTeamName] = useState('My Dream XI');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const pitchRef = useRef<HTMLDivElement>(null);
  const userTier: 'free' | 'firstTeam' | 'seasonPass' = 'firstTeam';

  const counts = FORMATIONS[formation];

  /* Build ordered slot list: GK, DEF×n, MID×n, FWD×n, then 4 bench */
  const pitchSlots: SquadSlot[] = useMemo(() => {
    const slots: SquadSlot[] = [];
    (['GK', 'DEF', 'MID', 'FWD'] as Position[]).forEach(pos => {
      for (let i = 0; i < counts[pos]; i++) slots.push({ position: pos, index: slots.length });
    });
    return slots;
  }, [formation]);

  const benchSlots: SquadSlot[] = useMemo(() => {
    const start = pitchSlots.length;
    return [
      { position: 'GK', index: start },
      { position: 'DEF', index: start + 1 },
      { position: 'MID', index: start + 2 },
      { position: 'FWD', index: start + 3 },
    ];
  }, [pitchSlots]);

  const totalCost = useMemo(() => squad.reduce((sum, p) => sum + (p?.now_cost ?? 0), 0), [squad]);
  const remaining = BUDGET - totalCost;
  const totalPoints = useMemo(() => squad.reduce((sum, p, i) => {
    if (!p) return sum;
    let pts = p.total_points;
    if (i === captainSlot) pts *= 2;
    return sum + pts;
  }, 0), [squad, captainSlot]);

  const filledCount = squad.filter(Boolean).length;

  const handlePick = (player: FPLPlayer) => {
    if (!activeSlot) return;
    const newSquad = [...squad];
    newSquad[activeSlot.index] = player;
    setSquad(newSquad);
    setActiveSlot(null);
  };

  const handleRemove = (slot: SquadSlot) => {
    const newSquad = [...squad];
    newSquad[slot.index] = null;
    setSquad(newSquad);
    if (captainSlot === slot.index) setCaptainSlot(null);
    if (vcSlot === slot.index) setVcSlot(null);
  };

  const handleCaptain = (slot: SquadSlot) => {
    if (vcSlot === slot.index) setVcSlot(null);
    setCaptainSlot(slot.index);
  };

  const handleViceCaptain = (slot: SquadSlot) => {
    if (captainSlot === slot.index) setCaptainSlot(null);
    setVcSlot(slot.index);
  };

  const handleFormationChange = (f: Formation) => {
    setFormation(f);
    setSquad(Array(15).fill(null));
    setCaptainSlot(null);
    setVcSlot(null);
  };

  const handleReset = () => {
    setSquad(Array(15).fill(null));
    setCaptainSlot(null);
    setVcSlot(null);
  };

  /* Render a row of pitch slots */
  const renderRow = (slots: SquadSlot[]) => (
    <div className="flex justify-center items-end gap-2 md:gap-4 py-4">
      {slots.map(slot => (
        <PitchSlot
          key={`${slot.position}-${slot.index}`}
          player={squad[slot.index]}
          slot={slot}
          isCaptain={captainSlot === slot.index}
          isViceCaptain={vcSlot === slot.index}
          onSelect={setActiveSlot}
          onRemove={handleRemove}
          onCaptain={handleCaptain}
          onViceCaptain={handleViceCaptain}
          isActive={activeSlot?.index === slot.index}
        />
      ))}
    </div>
  );

  /* Split pitch slots into rows by position */
  const gkSlots   = pitchSlots.filter(s => s.position === 'GK');
  const defSlots  = pitchSlots.filter(s => s.position === 'DEF');
  const midSlots  = pitchSlots.filter(s => s.position === 'MID');
  const fwdSlots  = pitchSlots.filter(s => s.position === 'FWD');

  const budgetPct = Math.min((totalCost / BUDGET) * 100, 100);
  const budgetColor = remaining < 50 ? 'bg-red-500' : remaining < 150 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <SeasonalAccessControl isPaidUser={isAdminAccess()}>
    <>
    {showUpgradeModal && (
      <TierUpgradeModal feature="export-squad" onClose={() => setShowUpgradeModal(false)} />
    )}
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 md:p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10">
          {/* Top row: Title + Share */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <i className="fas fa-futbol text-white text-lg md:text-xl"></i>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">⚽ Squad Builder</h2>
                <p className="text-base md:text-lg text-slate-400 font-medium">Build your ultimate FPL dream team</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                title="Learn squad building strategies"
              >
                <i className="fas fa-book-open text-sm"></i>
                <span className="text-sm font-bold">Guide</span>
              </button>
              <ShareSnapshot
                targetRef={pitchRef}
                template="squad"
                userTier={userTier as 'free' | 'first-team' | 'season-pass'}
                shareText={`Rate my Dream XI — ${teamName} 👇 Built on @TheGafferEPL`}
                className="relative"
                label="Snap"
              />
            </div>
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl md:text-3xl font-black text-white leading-none">{filledCount}<span className="text-sm font-bold text-slate-500">/15</span></div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Players</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl md:text-3xl font-black text-white leading-none">{totalPoints}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Proj. Pts</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
              <div className={`text-2xl md:text-3xl font-black leading-none ${remaining < 50 ? 'text-red-400' : remaining < 150 ? 'text-yellow-400' : 'text-green-400'}`}>
                £{(remaining / 10).toFixed(1)}m
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Budget Left</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700/50">
        {/* Budget bar — full width, no padding gaps */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <span className="text-slate-400">£{(totalCost / 10).toFixed(1)}m spent</span>
            <span className={remaining < 50 ? 'text-red-500' : 'text-green-500'}>
              £{(remaining / 10).toFixed(1)}m remaining
            </span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                remaining < 50 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                remaining < 150 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                'bg-gradient-to-r from-green-500 to-emerald-400'
              }`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>

        {/* Team name + Formation + Reset */}
        <div className="px-5 pb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Team name */}
          <div className="relative">
            <i className="fas fa-pen text-[10px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input
              type="text" value={teamName} onChange={e => setTeamName(e.target.value)} maxLength={30}
              className="pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 w-44 transition-all"
            />
          </div>

          {/* Formation picker */}
          <div className="flex-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 hidden sm:inline">Formation</span>
            {(Object.keys(FORMATIONS) as Formation[]).map(f => (
              <button key={f} onClick={() => handleFormationChange(f)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  formation === f
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/20 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400'
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Reset */}
          <button onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all">
            <i className="fas fa-redo text-[10px]"></i> Reset
          </button>
        </div>
      </div>

      {/* Pitch */}
      <div className="flex justify-center bg-slate-100 dark:bg-slate-900 py-4 px-4">
        <div ref={pitchRef} className="relative overflow-hidden w-full max-w-md bg-gradient-to-b from-green-500 via-green-600 to-green-700 rounded-xl border-4 border-white/20 shadow-2xl">

          {/* Pitch Texture */}
          <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-green-800/20 to-transparent"></div>
          </div>

          {/* Pitch Lines */}
          <div className="absolute inset-0 rounded-xl pointer-events-none">
            {/* Outer Boundary */}
            <div className="absolute inset-4 border-2 border-white/50"></div>

            {/* Center Line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/50"></div>

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/50 rounded-full"></div>

            {/* Center Spot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div>

            {/* Top Penalty Area */}
            <div className="absolute top-4 left-1/4 right-1/4 h-24 border-2 border-white/50 border-t-0"></div>

            {/* Top Six-yard Box */}
            <div className="absolute top-4 left-1/3 right-1/3 h-12 border-2 border-white/50 border-t-0"></div>

            {/* Top Goal */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/60"></div>

            {/* Top Penalty Spot */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div>

            {/* Bottom Penalty Area */}
            <div className="absolute bottom-4 left-1/4 right-1/4 h-24 border-2 border-white/50 border-b-0"></div>

            {/* Bottom Six-yard Box */}
            <div className="absolute bottom-4 left-1/3 right-1/3 h-12 border-2 border-white/50 border-b-0"></div>

            {/* Bottom Goal */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/60"></div>

            {/* Bottom Penalty Spot */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div>

            {/* Corner Arcs */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-white/50 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-white/50 rounded-br-lg"></div>
          </div>

          <div className="relative z-10 py-8 px-2">
            {renderRow(fwdSlots)}
            {renderRow(midSlots)}
            {renderRow(defSlots)}
            {renderRow(gkSlots)}
          </div>
        </div>
      </div>

      {/* Bench */}
      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 p-5 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-600"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
              <i className="fas fa-chair text-[9px]"></i> Substitutes
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-600"></div>
          </div>
          <div className="flex justify-center gap-4 md:gap-8">
            {benchSlots.map(slot => (
              <PitchSlot
                key={`bench-${slot.index}`}
                player={squad[slot.index]}
                slot={slot}
                isCaptain={false}
                isViceCaptain={false}
                onSelect={setActiveSlot}
                onRemove={handleRemove}
                onCaptain={() => {}}
                onViceCaptain={() => {}}
                isActive={activeSlot?.index === slot.index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Squad list summary */}
      {filledCount > 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">📋 Squad Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {squad.map((player, i) => {
              if (!player) return null;
              const isBench = i >= pitchSlots.length;
              return (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isBench ? 'bg-slate-100 dark:bg-slate-700/50 opacity-70' : 'bg-slate-50 dark:bg-slate-700'}`}>
                  <div className="w-7 h-7 shrink-0">
                    <LogoWithFallback src={getTeamLogo(player.team)} teamName={player.team} size="w-full h-full" className="rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{player.web_name}</span>
                      {captainSlot === i && <span className="text-[9px] bg-yellow-400 text-slate-900 font-black px-1 rounded">C</span>}
                      {vcSlot === i && <span className="text-[9px] bg-slate-300 text-slate-900 font-black px-1 rounded">V</span>}
                      {isBench && <span className="text-[9px] bg-slate-400 text-white font-bold px-1 rounded">BENCH</span>}
                    </div>
                    <div className="text-xs text-slate-500">{player.team} · {player.position}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {captainSlot === i ? player.total_points * 2 : player.total_points} pts
                    </div>
                    <div className="text-xs text-slate-500">£{player.now_cost}m</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gaffer tip */}
          {filledCount >= 11 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-accent/5 dark:from-purple-900/20 dark:to-accent/10 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎩</span>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">Gaffer's Verdict</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                    {filledCount === 15
                      ? `"${teamName}" — Full squad, budget managed, captain chosen. That's how it's done, son. Now let's see if your players actually turn up on Saturday.`
                      : `Not bad, not bad. You've got ${filledCount} players in. Finish the squad and I'll give you my full verdict.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Squad Analysis */}
          {filledCount >= 11 && (
            <GafferSquadAnalysis
              squad={squad}
              captainSlot={captainSlot}
              vcSlot={vcSlot}
              userTier={userTier}
              userEmail="demo@thegafferEPL.com"
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          )}
        </div>
      )}

      {/* Player picker modal */}
      {activeSlot && (
        <PlayerPicker
          slot={activeSlot}
          squad={squad}
          remainingBudget={remaining}
          onPick={handlePick}
          onClose={() => setActiveSlot(null)}
        />
      )}

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        section="squad-builder"
      />
    </div>
    </>
    </SeasonalAccessControl>
  );
};

export default SquadBuilder;


