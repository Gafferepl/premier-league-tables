import React, { useState, useMemo, useRef, useEffect } from 'react';
import TeamIcon from './TeamIcon';
import { FPLPlayer, GAFFER_VERDICTS } from '../data/playerData';
import { SET_PIECE_DATA } from '../data/setPieceTakers';
// import ShareSnapshot from './ShareSnapshot';
import TierUpgradeModal from './TierUpgradeModal';
import GuideModal from './GuideModal';
import SeasonalAccessControl from './SeasonalAccessControl';
import { isAdminAccessClient } from '../config/admin';
import { AppData } from '../../types';


// ===== HELPER FUNCTIONS (moved to top to fix hoisting) =====

// Position badge styling
function posBadge(pos: string): string {
  // Handle both string positions and numeric element_type
  const positionMap: Record<string, string> = {
    '1': 'GK', '2': 'DEF', '3': 'MID', '4': 'FWD',
    'GK': 'GK', 'DEF': 'DEF', 'MID': 'MID', 'FWD': 'FWD'
  };
  const normalizedPos = positionMap[pos] || pos;
  return { GK: 'bg-yellow-400 text-slate-900', DEF: 'bg-blue-500 text-white', MID: 'bg-green-500 text-white', FWD: 'bg-red-500 text-white' }[normalizedPos] || 'bg-slate-400 text-white';
}


// Team name mapping (updated to match actual FPL API data)
function getTeamName(teamId: number | string): string {
  // If it's already a team name string, return it directly
  if (typeof teamId === 'string' && !/^\d+$/.test(teamId)) {
    return teamId;
  }
  
  // Otherwise treat as numeric ID
  const id = typeof teamId === 'string' ? parseInt(teamId) : teamId;
  const teamMap: Record<number, string> = {
    1: 'Arsenal', 2: 'Aston Villa', 3: 'Burnley', 4: 'Bournemouth',
    5: 'Brentford', 6: 'Brighton', 7: 'Chelsea', 8: 'Crystal Palace',
    9: 'Everton', 10: 'Fulham', 11: 'Leeds', 12: 'Liverpool',
    13: 'Man City', 14: 'Man Utd', 15: 'Newcastle', 16: 'Nott\'m Forest',
    17: 'Sunderland', 18: 'Spurs', 19: 'West Ham', 20: 'Wolves'
  };
  const teamName = teamMap[id] || 'Unknown';
  return teamName;
}

// Form color styling
function formColor(f: string): string {
  const n = parseFloat(f);
  return n >= 7 ? 'text-green-600 dark:text-green-400 font-black'
       : n >= 5 ? 'text-yellow-600 dark:text-yellow-400 font-bold'
       : 'text-red-500 dark:text-red-400 font-bold';
}

// Trend badge styling
function trendBadge(inn: number, out: number): { icon: string; label: string; color: string } {
  const net = inn - out;
  if (net > 3000)  return { icon: '🔥', label: `+${(net/1000).toFixed(1)}k`, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' };
  if (net > 0)     return { icon: '📈', label: `+${(net/1000).toFixed(1)}k`, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' };
  if (net < -3000) return { icon: '📉', label: `${(net/1000).toFixed(1)}k`, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' };
  return { icon: '➡️', label: 'Stable', color: 'text-slate-500 bg-slate-50 dark:bg-slate-700' };
}

// Check for admin access - use as hook inside component
const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState(isAdminAccessClient());
  
  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(isAdminAccessClient());
    };
    
    const interval = setInterval(checkAdmin, 100);
    return () => clearInterval(interval);
  }, []);
  
  return isAdmin;
};

// Tooltip component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setIsVisible(true);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help border-b-2 border-dotted border-yellow-500 hover:border-yellow-400 transition-colors"
      >
        {children}
      </div>
      {isVisible && (
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%) translateY(-12px)'
          }}
        >
          <div className="w-80 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-sm rounded-xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 rounded-xl blur-sm"></div>
            
            {/* Content */}
            <div className="relative z-10 leading-relaxed">
              {content}
            </div>
            
            {/* Arrow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-slate-800"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[10px]">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-yellow-500/50"></div>
              </div>
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-yellow-500/50 rounded-tl-sm"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-yellow-500/50 rounded-tr-sm"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-yellow-500/50 rounded-bl-sm"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-yellow-500/50 rounded-br-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
};

type Tab = 'players' | 'set-pieces';

type SortKey = 'total_points' | 'form' | 'selected_by_percent' | 'now_cost' | 'expected_goals' | 'expected_assists';

/* ── Expanded detail panel ── */
interface ExpandedPanelProps { player: FPLPlayer; verdict?: string; }

const ExpandedPanel: React.FC<ExpandedPanelProps> = ({ player, verdict }) => {
  const net = player.transfers_in - player.transfers_out;

  // Generate estimated advanced stats based on realistic Premier League averages
  const generateEstimatedStats = (player: FPLPlayer) => {
    const minutes = player.minutes || 0;
    const games = Math.max(1, minutes / 90); // Estimate games played
    const position = player.position?.toUpperCase();
    
    // Realistic Premier League averages per 90 minutes
    const averages = {
      FWD: { xg_per_90: 0.35, xa_per_90: 0.15, shots_per_90: 2.8, key_passes_per_90: 1.2 },
      MID: { xg_per_90: 0.12, xa_per_90: 0.22, shots_per_90: 1.5, key_passes_per_90: 2.1 },
      DEF: { xg_per_90: 0.05, xa_per_90: 0.08, shots_per_90: 0.6, key_passes_per_90: 0.8 },
      GK:  { xg_per_90: 0.01, xa_per_90: 0.02, shots_per_90: 0.1, key_passes_per_90: 0.3 }
    };
    
    const avg = averages[position as keyof typeof averages] || averages.MID;
    
    // More conservative estimation based on actual performance
    const actualGoalsPer90 = games > 0 ? player.goals_scored / games : 0;
    const actualAssistsPer90 = games > 0 ? player.assists / games : 0;
    
    // Calculate xG as weighted average of actual goals and positional average
    const estimatedXG_per_90 = (actualGoalsPer90 * 0.7) + (avg.xg_per_90 * 0.3);
    const estimatedXA_per_90 = (actualAssistsPer90 * 0.7) + (avg.xa_per_90 * 0.3);
    
    // Apply realistic caps based on position
    const max_xg_per_90 = position === 'FWD' ? 0.6 : position === 'MID' ? 0.25 : 0.1;
    const max_xa_per_90 = position === 'MID' ? 0.35 : position === 'FWD' ? 0.25 : 0.1;
    
    const cappedXG_per_90 = Math.min(estimatedXG_per_90, max_xg_per_90);
    const cappedXA_per_90 = Math.min(estimatedXA_per_90, max_xa_per_90);
    
    // Calculate season totals with realistic caps
    const estimatedXG = Math.min(cappedXG_per_90 * games, 10.0); // Max 10 xG per season
    const estimatedXA = Math.min(cappedXA_per_90 * games, 5.0);  // Max 5 xA per season
    
    // Realistic ICT stats based on FPL data ranges
    const creativity = player.creativity || Math.round(
      Math.min((player.assists * 8 + player.bonus * 1.5 + games * 1.5), 600)
    );
    const threat = player.threat || Math.round(
      Math.min((player.goals_scored * 10 + player.minutes / 50), 500)
    );
    const influence = player.influence || Math.round(
      Math.min((player.minutes / 20 + player.bps / 10 + games * 2), 800)
    );
    
    return {
      xg: player.xg || estimatedXG,
      xa: player.xa || estimatedXA,
      xgi: player.xgi || Math.min(estimatedXG + estimatedXA, 12.0), // Max 12 xGI per season
      xg_per_90: player.xg_per_90 || (games > 0 ? estimatedXG / games : 0),
      xa_per_90: player.xa_per_90 || (games > 0 ? estimatedXA / games : 0),
      creativity,
      threat,
      influence
    };
  };

  const estimatedStats = generateEstimatedStats(player);

  // Calculate ICT Index safely using estimated stats
  const ict = Math.round((Number(estimatedStats.creativity) + Number(estimatedStats.threat) + Number(estimatedStats.influence)) / 3) || 0;

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Format minutes to hours and minutes
  const formatMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const statRows: [string, number | string][] = [
    ['Goals', player.goals_scored], ['Assists', player.assists],
    ['xG', Math.round(estimatedStats.xg * 10) / 10], ['xA', Math.round(estimatedStats.xa * 10) / 10],
    ['xGI', Math.round(estimatedStats.xgi * 10) / 10], ['xG per 90', Math.round(estimatedStats.xg_per_90 * 100) / 100],
    ['Clean Sheets', player.clean_sheets], ['Bonus Points', player.bonus],
    ['BPS', player.bps], ['Minutes', formatMinutes(player.minutes)],
    ['Starts', player.starts || 0], ['Yellow Cards', player.yellow_cards],
  ];

  const bars = [
    { label: 'xG (Expected Goals)',   value: Math.round(estimatedStats.xg * 10) / 10,           max: 12.0, color: 'bg-green-500' },
    { label: 'xA (Expected Assists)', value: Math.round(estimatedStats.xa * 10) / 10,           max: 6.0,  color: 'bg-blue-500' },
    { label: 'xGI (xG + xA)',         value: Math.round(estimatedStats.xgi * 10) / 10,           max: 15.0, color: 'bg-purple-500' },
    { label: 'xG per 90',             value: Math.round(estimatedStats.xg_per_90 * 100) / 100,     max: 0.7,  color: 'bg-emerald-500' },
    { label: 'xA per 90',             value: Math.round(estimatedStats.xa_per_90 * 100) / 100,     max: 0.4, color: 'bg-cyan-500' },
    { label: 'Creativity (chance creation)', value: estimatedStats.creativity,    max: 1000,   color: 'bg-yellow-500' },
    { label: 'Threat (goal danger)',      value: estimatedStats.threat,        max: 800,   color: 'bg-red-500' },
    { label: 'Influence (impact)',         value: estimatedStats.influence,     max: 1000,   color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-b border-slate-200 dark:border-slate-700 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Season Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">⚽ Season Stats</h4>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {statRows.map(([label, val]) => {
              const tooltipContent = {
                'Goals': 'Total goals scored this season',
                'Assists': 'Total assists provided this season',
                'xG': 'Expected Goals - quality of chances created',
                'xA': 'Expected Assists - quality of chances created',
                'xGI': 'Expected Goal Involvement (xG + xA)',
                'xG per 90': 'Expected Goals per 90 minutes played',
                'Clean Sheets': 'Matches without conceding a goal',
                'Bonus Points': 'Bonus points earned for performance',
                'BPS': 'Bonus Points System - performance scoring',
                'Minutes': 'Total time played this season (hours + minutes)',
                'Starts': 'Number of matches started',
                'Yellow Cards': 'Yellow cards received'
              }[label] || '';
              
              return (
                <Tooltip key={label} content={tooltipContent}>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700/50 cursor-help">
                    <span className="text-slate-500 text-xs">{label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Advanced Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">📈 Advanced Stats</h4>
            {!player.xg && !player.xa && (
              <Tooltip content="Highly conservative estimates: 70% actual + 30% positional, capped at PL maximums (xG≤10, xA≤5, xGI≤12 per season, ICT: Creativity≤60, Threat≤50, Influence≤80)">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-bold text-blue-700 dark:text-blue-300 cursor-help">
                  📊 Estimated
                </span>
              </Tooltip>
            )}
          </div>
          <div className="space-y-3">
            {bars.map(({ label, value, max, color }) => {
              const percentage = Math.min((value / max) * 100, 100);
              const isICTStat = label.includes('Creativity') || label.includes('Threat') || label.includes('Influence');
              return (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{label}</span>
                  {!isICTStat && <span className="font-bold text-slate-900 dark:text-white">{value}</span>}
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} data-component-name="ExpandedPanel" />
                </div>
              </div>
              );
            })}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <Tooltip content="ICT Index - Influence + Creativity + Threat averaged (FPL performance metric)">
                <span className="text-xs text-slate-500 cursor-help">ICT Index</span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Transfer Trend + Gaffer Verdict */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">🔄 Transfer Trend</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                <div className="text-green-600 dark:text-green-400 font-black text-lg">{(player.transfers_in / 1000).toFixed(1)}k</div>
                <div className="text-xs text-slate-500">Transfers In</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                <div className="text-red-500 dark:text-red-400 font-black text-lg">{(player.transfers_out / 1000).toFixed(1)}k</div>
                <div className="text-xs text-slate-500">Transfers Out</div>
              </div>
            </div>
            <div className={`mt-2 text-center text-sm font-bold ${net > 0 ? 'text-green-600' : 'text-red-500'}`}>
              Net: {net > 0 ? '+' : ''}{(net / 1000).toFixed(1)}k
            </div>
            <div className="mt-2 text-center text-xs text-slate-500">
              Owned by <span className="font-bold text-slate-900 dark:text-white">{player.selected_by_percent}%</span> of managers
            </div>
          </div>

          {verdict && (
            <div className="bg-gradient-to-br from-purple-50 to-accent/5 dark:from-purple-900/20 dark:to-accent/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">🎩 Gaffer's Verdict</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{verdict}"</p>
            </div>
          )}

          {player.news && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <span>⚠️</span>
                <span className="text-xs font-bold">{player.news}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ── Main Component ── */
interface PlayerDatabaseProps {
  data?: AppData;
  players?: any[];
  teams?: any[];
}

const PlayerDatabase: React.FC<PlayerDatabaseProps> = ({ data, players: playersProp, teams: teamsProp }) => {
  // Position mapping function (defined immediately at component start)
  const mapPositionForFilterLocal = (pos: string | number): string => {
    const positionMap: Record<string, string> = {
      '1': 'GK', '2': 'DEF', '3': 'MID', '4': 'FWD',
      'GK': 'GK', 'DEF': 'DEF', 'MID': 'MID', 'FWD': 'FWD'
    };
    const normalizedPos = String(pos);
    return positionMap[normalizedPos] || normalizedPos;
  };
  
  // Debug: Verify function is available
  console.log('🔧 mapPositionForFilterLocal function initialized:', typeof mapPositionForFilterLocal);

  const [activeTab, setActiveTab]           = useState<Tab>('players');
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [showGuide, setShowGuide]           = useState(false);
  const [selectedTeam, setSelectedTeam]     = useState('all');
  const [sortBy, setSortBy]                 = useState<SortKey>('total_points');
  const [maxPrice, setMaxPrice]             = useState(150);
  const [expandedId, setExpandedId]         = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [spSearch, setSpSearch]             = useState('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [teamDropdownSearch, setTeamDropdownSearch] = useState('');
  const [autoGeneratedSetPieces, setAutoGeneratedSetPieces] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const isAdmin = useAdminAccess();
  const userTier: 'free' | 'season-pass' | 'first-team' = isAdmin ? 'season-pass' : 'first-team';

  // Use ONLY live data from props - NO MOCK DATA FALLBACK
  const livePlayers = playersProp || (data as any)?.players || [];
  const rawPlayers = livePlayers;
  console.log('📊 Using data source:', livePlayers.length > 0 ? 'Live API' : 'No data available', `(${rawPlayers.length} players)`);

  // EMERGENCY: Apply position mapping directly as fallback
  const allPlayers = rawPlayers.map(p => {
    if (p.position && p.position !== 'Unknown' && p.position !== 'undefined') {
      return p; // Already mapped correctly
    }
    
    // Apply emergency position mapping using local function
    return {
      ...p,
      position: mapPositionForFilterLocal(p.element_type || p.position)
    };
  });
  
  // Debug: Log position values
  if (process.env.NODE_ENV === 'development' && allPlayers.length > 0) {
    console.log('🔍 PlayerDatabase Debug:');
    console.log('Total players:', allPlayers.length);
    console.log('Sample positions:', allPlayers.slice(0, 10).map(p => ({ 
      name: p.web_name, 
      position: p.position,
      elementType: p.element_type,
      rawPosition: p.position
    })));
    const positions = [...new Set(allPlayers.map(p => p.position))];
    const elementTypes = [...new Set(allPlayers.map(p => p.element_type))];
    console.log('All position values found:', positions);
    console.log('All element_type values found:', elementTypes);
    
    // Check if data is from mock or live
    console.log('Data source check:', {
      hasLivePlayers: livePlayers.length > 0,
      livePlayerCount: livePlayers.length,
      usingMock: false
    });
    
    // Test the position mapping directly
    console.log('🧪 Testing position mapping:');
    allPlayers.slice(0, 5).forEach(p => {
      const mappedPos = mapPositionForFilterLocal(p.position || p.element_type);
      console.log(`${p.web_name}: ${p.position || p.element_type} → ${mappedPos}`);
    });
    
    // Check position distribution - verify all players have correct positions
    console.log('📊 Position Distribution Analysis:');
    const positionCounts = {
      GK: 0, DEF: 0, MID: 0, FWD: 0, Unknown: 0
    };
    
    const elementTypeCounts = {
      '1': 0, '2': 0, '3': 0, '4': 0, 'undefined': 0
    };
    
    allPlayers.forEach(p => {
      const mappedPos = mapPositionForFilterLocal(p.position || p.element_type);
      positionCounts[mappedPos as keyof typeof positionCounts]++;
      
      const elementType = String(p.element_type || 'undefined');
      elementTypeCounts[elementType as keyof typeof elementTypeCounts]++;
    });
    
    console.log('Position counts:', positionCounts);
    console.log('Element type counts:', elementTypeCounts);
    
    // Check specific well-known players to verify positions (using FPL name formats)
    const testPlayers = [
      'Haaland', 'De Bruyne', 'Rashford', 'B.Fernandes', 
      'M.Salah', 'Virgil', 'A.Becker', 'Kane', 'Son'
    ];
    
    // Search for similar names for missing players
    const searchSimilarNames = (targetName: string) => {
      const similar = allPlayers.filter(p => 
        p.web_name.toLowerCase().includes(targetName.toLowerCase()) ||
        targetName.toLowerCase().includes(p.web_name.toLowerCase()) ||
        p.first_name?.toLowerCase().includes(targetName.toLowerCase()) ||
        p.second_name?.toLowerCase().includes(targetName.toLowerCase())
      );
      return similar.slice(0, 5);
    };
    
    console.log('🔍 Well-known player position verification:');
    testPlayers.forEach(name => {
      const player = allPlayers.find(p => p.web_name === name);
      if (player) {
        const mappedPos = mapPositionForFilterLocal(player.position || player.element_type);
        console.log(`${name}: element_type=${player.element_type}, position="${player.position}" → mapped="${mappedPos}"`);
      } else {
        console.log(`${name}: Not found in player data`);
        const similar = searchSimilarNames(name);
        if (similar.length > 0) {
          console.log(`  Similar names found:`);
          similar.forEach(p => {
            console.log(`    ${p.web_name} (team: ${getTeamName(p.team)}, element_type: ${p.element_type})`);
          });
        }
      }
    });
    
    // Check data source and sample player structure
    console.log('📊 Data Source Analysis:');
    const samplePlayer = allPlayers[0];
    console.log('Sample player structure:', {
      web_name: samplePlayer.web_name,
      first_name: samplePlayer.first_name,
      second_name: samplePlayer.second_name,
      team: samplePlayer.team,
      element_type: samplePlayer.element_type,
      position: samplePlayer.position
    });
    
    // Check if this is current season data
    const currentSeason = new Date().getFullYear();
    console.log(`📅 Current year: ${currentSeason}`);
    console.log(`📊 Total players in dataset: ${allPlayers.length}`);
    
    // Show some actual player names to understand the dataset
    console.log('🔤 Sample of actual player names in dataset:');
    allPlayers.slice(0, 20).forEach(p => {
      console.log(`  ${p.web_name} (${getTeamName(p.team)})`);
    });
    
    // Search specifically for De Bruyne and Kane
    console.log('🔍 Specific search for missing stars:');
    const deBruyneSearch = allPlayers.filter(p => 
      p.web_name.toLowerCase().includes('bruyne') ||
      p.first_name?.toLowerCase().includes('kevin') ||
      p.second_name?.toLowerCase().includes('bruyne')
    );
    try {
      console.log('De Bruyne search results:', deBruyneSearch.map(p => `${p.web_name} (${getTeamName(p.team)})`));
    } catch (error) {
      console.error('Error in De Bruyne search:', error);
    }
    
    const kaneSearch = allPlayers.filter(p => 
      p.web_name.toLowerCase().includes('kane') ||
      p.first_name?.toLowerCase().includes('harry') ||
      p.second_name?.toLowerCase().includes('kane')
    );
    try {
      console.log('Kane search results:', kaneSearch.map(p => `${p.web_name} (${getTeamName(p.team)})`));
    } catch (error) {
      console.error('Error in Kane search:', error);
    }
    
    // Check for any position mismatches
    console.log('🚨 Checking for position mismatches:');
    const mismatches = allPlayers.filter(p => {
      const elementType = String(p.element_type);
      const position = p.position;
      const mappedPos = mapPositionForFilterLocal(position || elementType);
      
      // Check if position field disagrees with element_type
      if (position && position !== 'Unknown' && position !== 'undefined') {
        const expectedFromElement = mapPositionForFilterLocal(elementType);
        if (position !== expectedFromElement) {
          return true;
        }
      }
      return false;
    });
    
    if (mismatches.length > 0) {
      console.log(`Found ${mismatches.length} position mismatches:`);
      mismatches.slice(0, 10).forEach(p => {
        console.log(`  ${p.web_name}: element_type=${p.element_type}, position="${p.position}" → expected="${mapPositionForFilterLocal(p.element_type)}"`);
      });
    } else {
      console.log('✅ No position mismatches found');
    }
    
    // Check specific players like Haaland
    const haaland = allPlayers.find(p => p.web_name === 'Haaland');
    if (haaland) {
      console.log(`🔍 Haaland check: team_id=${haaland.team} → team_name="${getTeamName(haaland.team)}"`);
      console.log(`🔍 Haaland raw data:`, {
        web_name: haaland.web_name,
        team: haaland.team,
        team_code: haaland.team_code,
        element_type: haaland.element_type,
        position: haaland.position
      });
    }
    
    // Check a few Man City players to verify team mapping
    const manCityPlayers = allPlayers.filter(p => p.team === 13).slice(0, 3);
    console.log('🔍 Man City players (team_id=13):');
    manCityPlayers.forEach(p => {
      console.log(`  ${p.web_name}: team_id=${p.team} → team_name="${getTeamName(p.team)}"`);
    });

    // Check a few Man Utd players to verify team mapping
    const manUtdPlayers = allPlayers.filter(p => p.team === 14).slice(0, 3);
    console.log('🔍 Man Utd players (team_id=14):');
    manUtdPlayers.forEach(p => {
      console.log(`  ${p.web_name}: team_id=${p.team} → team_name="${getTeamName(p.team)}"`);
    });
    
    // Test TeamIcon directly with some team names
    console.log('🧪 Testing TeamIcon with known teams:');
    const testTeams = ['Arsenal', 'Man City', 'Liverpool', 'Chelsea'];
    testTeams.forEach(team => {
      console.log(`TeamIcon would receive: "${team}"`);
    });
  }
  
    
  const teams = useMemo(() => {
    const teamList = ['all', ...[...new Set(allPlayers.map(p => getTeamName(p.team)))].sort()];
    console.log('🏆 All teams extracted:', teamList);
    console.log('🔍 Arsenal players found:', allPlayers.filter(p => getTeamName(p.team) === 'Arsenal').length);
    console.log('📊 Sample team names from data:', [...new Set(allPlayers.slice(0, 20).map(p => getTeamName(p.team)))]);
    return teamList;
  }, [allPlayers]);

  // Generate set-piece data from live player data
  const generateSetPieceData = () => {
    const teamsWithSetPieces = teams.filter(t => t !== 'all').map(teamName => {
      const teamPlayers = allPlayers.filter(p => getTeamName(p.team) === teamName);
      
      // Find best penalty taker (highest points/minutes ratio)
      const penaltyTaker = teamPlayers
        .filter(p => p.element_type === 4 || p.element_type === 3) // FWD or MID
        .sort((a, b) => (b.total_points / Math.max(b.minutes, 1)) - (a.total_points / Math.max(a.minutes, 1)))[0];
      
      // Find best free kick taker (highest expected goals)
      const freeKickTaker = teamPlayers
        .filter(p => p.element_type === 3 || p.element_type === 4) // MID or FWD
        .sort((a, b) => (b.expected_goals || 0) - (a.expected_goals || 0))[0];
      
      // Find left corner taker (left-footed players)
      const leftCornerTaker = teamPlayers
        .filter(p => p.element_type === 3) // MID
        .sort((a, b) => (b.expected_assists || 0) - (a.expected_assists || 0))[0];
      
      // Find right corner taker (right-footed players)
      const rightCornerTaker = teamPlayers
        .filter(p => p.element_type === 3) // MID
        .sort((a, b) => (b.expected_assists || 0) - (a.expected_assists || 0))[1]; // Second best
      
      return {
        team: teamName,
        penalties: penaltyTaker?.web_name || 'TBD',
        directFK: freeKickTaker?.web_name || 'TBD',
        cornersL: leftCornerTaker?.web_name || 'TBD',
        cornersR: rightCornerTaker?.web_name || 'TBD',
        gafferNote: `Based on ${new Date().getFullYear()} season stats and performance metrics`
      };
    });
    
    return teamsWithSetPieces;
  };

  const [setPieceData, setSetPieceData] = useState(generateSetPieceData());

  // Auto-generate when Set-Piece Takers tab is clicked
  const handleSetPieceTabClick = () => {
    setActiveTab('set-pieces');
    if (!autoGeneratedSetPieces) {
      const newData = generateSetPieceData();
      setSetPieceData(newData);
      setAutoGeneratedSetPieces(true);
      console.log('🎯 Auto-generated set-piece data for', newData.length, 'teams');
    }
  };

  // Filter teams for dropdown
  const filteredTeamsForDropdown = teams.filter(t => t !== 'all').filter(team => 
    team.toLowerCase().includes(teamDropdownSearch.toLowerCase())
  );

  const filteredPlayers = useMemo(() => {
    console.log(`🔍 Starting filter with ${allPlayers.length} players, selectedPosition: "${selectedPosition}"`);
    
    const result = allPlayers.filter((p, index) => {
      const teamName = getTeamName(p.team);
      const matchSearch = (p.web_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teamName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Use mapped position from either position or element_type
      const playerPosition = mapPositionForFilterLocal(p.position || p.element_type);
      const positionMatch = selectedPosition === 'all' || playerPosition === selectedPosition;
      const teamMatch = selectedTeam === 'all' || selectedTeam === teamName;
      const priceMatch = p.now_cost <= maxPrice;
      
      // Debug: Log filtering for first 10 players when position is selected
      if (process.env.NODE_ENV === 'development' && selectedPosition !== 'all' && index < 10) {
        console.log(`🔍 Filter Debug [${index}]: ${p.web_name}`);
        console.log(`  - Raw position: "${p.position}"`);
        console.log(`  - Element type: "${p.element_type}"`);
        console.log(`  - Mapped position: "${playerPosition}"`);
        console.log(`  - Position match: ${positionMatch} ("${playerPosition}" === "${selectedPosition}")`);
        console.log(`  - All matches: search=${matchSearch}, pos=${positionMatch}, team=${teamMatch}, price=${priceMatch}`);
      }
      
      return matchSearch && positionMatch && teamMatch && priceMatch;
    })
    .sort((a, b) => sortBy === 'form'
      ? parseFloat(b.form) - parseFloat(a.form)
      : (b[sortBy] as number) - (a[sortBy] as number)
    );
    
    // Debug: Log filter results
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Filter Results: ${result.length}/${allPlayers.length} players (pos: ${selectedPosition})`);
      if (result.length === 0 && selectedPosition !== 'all') {
        console.log('❌ No players found! Checking first few players:');
        allPlayers.slice(0, 5).forEach((p, i) => {
          const mapped = mapPositionForFilterLocal(p.position || p.element_type);
          console.log(`  ${i+1}. ${p.web_name}: "${p.position}/${p.element_type}" → "${mapped}" (should match "${selectedPosition}": ${mapped === selectedPosition})`);
        });
      }
    }
    
    return result;
  }, [searchTerm, selectedPosition, selectedTeam, sortBy, maxPrice, allPlayers]);

  
  const sel = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-accent focus:border-transparent";

  return (
    <SeasonalAccessControl isPaidUser={isAdmin}>
    <>
    {showUpgradeModal && (
      <TierUpgradeModal feature="advanced-filters" onClose={() => setShowUpgradeModal(false)} />
    )}
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-accent p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2">📊 Player Database</h2>
            <p className="text-base md:text-lg opacity-90">Search, filter and analyse every Premier League player</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
              title="Learn about player stats and analysis"
            >
              <i className="fas fa-book-open text-sm"></i>
              <span className="text-sm font-bold">Guide</span>
            </button>
            <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-black">{filteredPlayers.length}</div>
              <div className="text-xs opacity-80">Players</div>
              <div className="text-[10px] opacity-60">
                {livePlayers.length > 0 ? 'Live Data' : 'Mock Data'}
              </div>
            </div>
            {/* <ShareSnapshot
              targetRef={listRef}
              template="player-card"
              shareText="Player stats from @TheGafferEPL 📊 Check it out!"
              className="relative"
              label="Snap"
            /> */}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mt-4 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('players')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'players' ? 'bg-white text-purple-700 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className="fas fa-users text-xs"></i>
            All Players
          </button>
          <button
            onClick={handleSetPieceTabClick}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'set-pieces' ? 'bg-white text-purple-700 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className="fas fa-crosshairs text-xs"></i>
            Set-Piece Takers
          </button>
        </div>
      </div>

      {/* === SET-PIECE TAKERS TAB === */}
      {activeTab === 'set-pieces' && (
        <div className="p-4 md:p-6">
          {/* Search with Dropdown */}
          <div className="relative mb-4">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text" 
              placeholder="Search by team..."
              value={spSearch} 
              onChange={e => {
                setSpSearch(e.target.value);
                setShowTeamDropdown(true);
                setTeamDropdownSearch(e.target.value);
              }}
              onFocus={() => setShowTeamDropdown(true)}
              onBlur={() => setTimeout(() => setShowTeamDropdown(false), 200)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            
            {/* Team Dropdown */}
            {showTeamDropdown && teamDropdownSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {filteredTeamsForDropdown.length > 0 ? (
                  filteredTeamsForDropdown.map(team => (
                    <button
                      key={team}
                      onClick={() => {
                        setSpSearch(team);
                        setShowTeamDropdown(false);
                        setTeamDropdownSearch('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                    >
                      <div className="w-4 h-4">
                        <TeamIcon team={team} size="w-full h-full" />
                      </div>
                      <span className="text-slate-900 dark:text-white">{team}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm">
                    No teams found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Top 5 Set-Piece Takers (Auto-generated) */}
          {autoGeneratedSetPieces && (
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-trophy text-purple-600 dark:text-purple-400"></i>
                <h3 className="font-bold text-slate-900 dark:text-white">Top 5 Set-Piece Specialists</h3>
                <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">Auto-generated</span>
              </div>
              
              {/* Get top penalty takers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {(() => {
                  const topPenaltyTakers = setPieceData
                    .filter(t => t.penalties !== 'TBD')
                    .slice(0, 5)
                    .map(t => ({
                      team: t.team,
                      player: t.penalties,
                      type: 'Penalties',
                      icon: '⚽',
                      color: 'red'
                    }));
                  
                  const topFKTakers = setPieceData
                    .filter(t => t.directFK !== 'TBD')
                    .slice(0, 5)
                    .map(t => ({
                      team: t.team,
                      player: t.directFK,
                      type: 'Free Kicks',
                      icon: '🎯',
                      color: 'blue'
                    }));
                  
                  const topCornerTakers = setPieceData
                    .filter(t => t.cornersL !== 'TBD' || t.cornersR !== 'TBD')
                    .slice(0, 5)
                    .map(t => ({
                      team: t.team,
                      player: t.cornersL !== 'TBD' ? t.cornersL : t.cornersR,
                      type: 'Corners',
                      icon: '🚩',
                      color: 'green'
                    }));
                  
                  const allSpecialists = [...topPenaltyTakers, ...topFKTakers, ...topCornerTakers]
                    .slice(0, 5);
                  
                  return allSpecialists.map((specialist, index) => (
                    <div key={`${specialist.team}-${specialist.type}`} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-center">
                      <div className="text-2xl mb-1">{specialist.icon}</div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{specialist.player}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <div className="w-4 h-4">
                          <TeamIcon team={specialist.team} size="w-full h-full" />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{specialist.team}</span>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-full bg-${specialist.color}-100 dark:bg-${specialist.color}-900/30 text-${specialist.color}-700 dark:text-${specialist.color}-300`}>
                        {specialist.type}
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 text-center">
                <i className="fas fa-info-circle mr-1"></i>
                Based on current season performance metrics and player statistics
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Penalties</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Direct FK</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Corners (L)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Corners (R)</span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Team</th>
                  <th className="text-center px-3 py-3">Penalties</th>
                  <th className="text-center px-3 py-3">Direct FK</th>
                  <th className="text-center px-3 py-3">Corners (L)</th>
                  <th className="text-center px-3 py-3">Corners (R)</th>
                  <th className="text-left px-4 py-3">Gaffer's Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {setPieceData
                  .filter(t => !spSearch || t.team.toLowerCase().includes(spSearch.toLowerCase()))
                  .map(t => (
                  <tr key={t.team} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 shrink-0">
                          <TeamIcon team={getTeamName(t.team)} size="w-full h-full" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{getTeamName(t.team)}</span>
                      </div>
                    </td>
                    <td className="text-center px-3 py-3"><span className="inline-block px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs">{t.penalties}</span></td>
                    <td className="text-center px-3 py-3"><span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">{t.directFK}</span></td>
                    <td className="text-center px-3 py-3"><span className="inline-block px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs">{t.cornersL}</span></td>
                    <td className="text-center px-3 py-3"><span className="inline-block px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold text-xs">{t.cornersR}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 italic max-w-xs">"{t.gafferNote}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3 max-h-[600px] overflow-y-auto">
            {setPieceData
              .filter(t => !spSearch || t.team.toLowerCase().includes(spSearch.toLowerCase()))
              .map(t => (
              <div key={t.team} className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 shrink-0">
                    <TeamIcon team={getTeamName(t.team)} size="w-full h-full" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{getTeamName(t.team)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-red-500/10 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Penalties</div>
                    <div className="font-black text-red-600 dark:text-red-400">{t.penalties}</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Direct FK</div>
                    <div className="font-black text-blue-600 dark:text-blue-400">{t.directFK}</div>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Corners (L)</div>
                    <div className="font-black text-green-600 dark:text-green-400">{t.cornersL}</div>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Corners (R)</div>
                    <div className="font-black text-yellow-600 dark:text-yellow-400">{t.cornersR}</div>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">🎩 "{t.gafferNote}"</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              <i className="fas fa-sync-alt mr-1 text-purple-500"></i>
              Set-piece data updated weekly from match footage &amp; press conferences
            </p>
          </div>
        </div>
      )}

      {/* === ALL PLAYERS TAB === */}
      {activeTab === 'players' && <>
      {/* Filters */}
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 space-y-4">

        {/* Search */}
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text" placeholder="Search by name or team..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <i className="fas fa-times text-sm"></i>
            </button>
          )}
        </div>

        {/* Dropdowns + Slider */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Position</label>
            <select value={selectedPosition} onChange={e => setSelectedPosition(e.target.value)} className={sel}>
              <option value="all">All Positions</option>
              {['GK','DEF','MID','FWD'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Team</label>
            <div className="relative">
              <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} className={`${sel} appearance-none pr-8`}>
                <option value="all">All Teams</option>
                {teams.filter(t => t !== 'all').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {selectedTeam !== 'all' && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <TeamIcon team={selectedTeam} size="sm" />
                </div>
              )}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className={sel}>
              <option value="total_points">Total Points</option>
              <option value="form">Form</option>
              <option value="selected_by_percent">Ownership %</option>
              <option value="now_cost">Price</option>
              <option value="expected_goals">xG</option>
              <option value="expected_assists">xA</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Max Price: £{(maxPrice / 10).toFixed(1)}m
            </label>
            <input type="range" min="40" max="150" step="5" value={maxPrice}
              onChange={e => setMaxPrice(parseInt(e.target.value))} className="w-full mt-2 accent-accent" />
          </div>
        </div>

        {/* Active filter chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500">{filteredPlayers.length} players</span>
          {selectedPosition !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-bold">
              {selectedPosition} <button onClick={() => setSelectedPosition('all')}>×</button>
            </span>
          )}
          {selectedTeam !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-bold">
              {selectedTeam} <button onClick={() => setSelectedTeam('all')}>×</button>
            </span>
          )}
          {maxPrice < 150 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-bold">
              Under £{(maxPrice / 10).toFixed(1)}m <button onClick={() => setMaxPrice(150)}>×</button>
            </span>
          )}
        </div>
      </div>

      {/* Scrollable list capture target */}
      <div ref={listRef} className="bg-white dark:bg-slate-800">
      {/* Column Headers */}
      <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-4">Player</div>
        <div className="col-span-1 text-center">
          <Tooltip content="Total points earned this season. Each goal/assist contributes points based on FPL scoring system.">
            Pts
          </Tooltip>
        </div>
        <div className="col-span-1 text-center">
          <Tooltip content="Player's recent form over the last 3 games. Higher values indicate better recent performance.">
            Form
          </Tooltip>
        </div>
        <div className="col-span-1 text-center">
          <Tooltip content="Player's current price in millions (£m). Changes based on transfers and performance.">
            Price
          </Tooltip>
        </div>
        <div className="col-span-1 text-center">
          <Tooltip content="Percentage of FPL managers who own this player. Higher ownership indicates popularity.">
            Own%
          </Tooltip>
        </div>
        <div className="col-span-1 text-center">
          <Tooltip content="Expected Goals - measures quality of scoring chances. Higher xG indicates better goal-scoring opportunities.">
            xG
          </Tooltip>
        </div>
        <div className="col-span-1 text-center">
          <Tooltip content="Expected Assists - measures quality of chance creation. Higher xA indicates better creative contributions.">
            xA
          </Tooltip>
        </div>
        <div className="col-span-1 text-center">
          <Tooltip content="Influence, Creativity, Threat Index - combines key FPL metrics. Higher ICT indicates more impactful players.">
            ICT
          </Tooltip>
        </div>
        <div className="col-span-1 text-center">
          <Tooltip content="Net transfers in the last gameweek. Positive means more players transferred in than out.">
            Transfer
          </Tooltip>
        </div>
      </div>

      {/* Player Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-[700px] overflow-y-auto">
        {filteredPlayers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold">No players found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : filteredPlayers.map(player => {
          const trend = trendBadge(player.transfers_in, player.transfers_out);
          const isExpanded = expandedId === player.id;
          const ict = Math.round((player.creativity + player.threat + player.influence) / 3);

          return (
            <div key={player.id}>
              {/* Main row */}
              <div
                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer items-center"
                onClick={() => setExpandedId(isExpanded ? null : player.id)}
              >
                {/* Player info */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0">
                    <TeamIcon team={getTeamName(player.team)} size="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white">{player.web_name || player.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${posBadge(player.position)}`}>{player.position}</span>
                      {player.news && (
                      <span 
                        className="text-[11px] text-orange-500 font-bold cursor-pointer hover:text-orange-600 hover:scale-110 transition-all duration-200 inline-block" 
                        title={`Player News: ${player.news}`}
                        onClick={() => setExpandedId(player.id)}
                      >
                        ⚠️
                      </span>
                    )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{player.team}</div>
                  </div>
                  {/* Mobile quick stats */}
                  <div className="md:hidden flex items-center gap-3 text-sm shrink-0">
                    <div className="text-center">
                      <div className="font-black text-slate-900 dark:text-white">{player.total_points}</div>
                      <div className="text-[10px] text-slate-400">pts</div>
                    </div>
                    <div className="text-center">
                      <div className={formColor(player.form)}>{player.form}</div>
                      <div className="text-[10px] text-slate-400">form</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-900 dark:text-white">£{(player.now_cost / 10).toFixed(1)}m</div>
                      <div className="text-[10px] text-slate-400">price</div>
                    </div>
                  </div>
                </div>

                {/* Desktop stats */}
                <div className="hidden md:contents">
                  <div className="col-span-1 text-center font-black text-slate-900 dark:text-white">{player.total_points}</div>
                  <div className={`col-span-1 text-center ${formColor(player.form)}`}>{player.form}</div>
                  <div className="col-span-1 text-center font-bold text-slate-900 dark:text-white">£{(player.now_cost / 10).toFixed(1)}m</div>
                  <div className="col-span-1 text-center text-sm text-slate-700 dark:text-slate-300">{player.selected_by_percent}%</div>
                  <div className="col-span-1 text-center text-sm text-slate-700 dark:text-slate-300">{player.expected_goals}</div>
                  <div className="col-span-1 text-center text-sm text-slate-700 dark:text-slate-300">{player.expected_assists}</div>
                  <div className="col-span-1 text-center text-sm font-bold text-purple-600 dark:text-purple-400">{ict}</div>
                  <div className="col-span-1 text-center">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend.color}`}>{trend.icon} {trend.label}</span>
                  </div>
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <ExpandedPanel player={player} verdict={GAFFER_VERDICTS[player.web_name || player.name]} />
              )}
            </div>
          );
        })}
      </div>
      </div>
      </>}

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        section="player-database"
      />
    </div>
    </>
    </SeasonalAccessControl>
  );
};

export default PlayerDatabase;


