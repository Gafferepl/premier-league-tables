import React, { useState, useEffect, useRef } from 'react';
import ShareSnapshot from './ShareSnapshot';
import LogoWithFallback from './LogoWithFallback';
import { getTeamLogo } from '../constants';
import { MOCK_PLAYERS, FPLPlayer } from '../data/playerData';
import SeasonalAccessControl from './SeasonalAccessControl';
import GuideModal from './GuideModal';
import { isAdminAccessClient } from '../config/admin';

// Check for admin access
const isAdminAccess = () => {
  return isAdminAccessClient();
};

interface PlayerStats {
  id: string;
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  price: number;
  ownership: number;
  form: number;
  points: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  bonus: number;
  bps: number;
  influence: number;
  creativity: number;
  threat: number;
  ictIndex: number;
  expectedGoals: number;
  expectedAssists: number;
  expectedGoalInvolvements: number;
  minutesPlayed: number;
  selectedBy: number;
  transfersIn: number;
  transfersOut: number;
  valueForm: number;
  valueSeasonPoints: number;
  pointsPerGame: number;
}

// Transform FPLPlayer to PlayerStats format
const transformPlayer = (player: FPLPlayer): PlayerStats => {
  const price = player.now_cost / 10;
  const pointsPerGame = player.minutes > 0 ? player.total_points / (player.minutes / 90) : 0;
  const ictIndex = (player.influence + player.creativity + player.threat) / 3;
  
  return {
    id: player.id.toString(),
    name: player.web_name,
    team: player.team,
    position: player.position as 'GK' | 'DEF' | 'MID' | 'FWD',
    price: price,
    ownership: player.selected_by_percent,
    form: parseFloat(player.form),
    points: player.total_points,
    goals: player.goals_scored,
    assists: player.assists,
    cleanSheets: player.clean_sheets,
    bonus: player.bonus,
    bps: player.bps,
    influence: player.influence,
    creativity: player.creativity,
    threat: player.threat,
    ictIndex: ictIndex,
    expectedGoals: player.xg || player.expected_goals,
    expectedAssists: player.xa || player.expected_assists,
    expectedGoalInvolvements: (player.xgi || (player.xg || player.expected_goals) + (player.xa || player.expected_assists)),
    minutesPlayed: player.minutes,
    selectedBy: player.selected_by_percent,
    transfersIn: player.transfers_in,
    transfersOut: player.transfers_out,
    valueForm: parseFloat(player.form) / price,
    valueSeasonPoints: player.total_points / price,
    pointsPerGame: pointsPerGame
  };
};

const PlayerComparison: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [player1, setPlayer1] = useState<PlayerStats | null>(null);
  const [player2, setPlayer2] = useState<PlayerStats | null>(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [comparisonView, setComparisonView] = useState<'basic' | 'advanced' | 'value'>('basic');

  // Usage tracking with tier-based limits
  const [usageCount, setUsageCount] = useState(0);
  const [weeklyUsageCount, setWeeklyUsageCount] = useState(0);
  const maxUsage = 50; // First Team: 50 per month
  const maxWeeklyUsage = 1; // Free: 1 per week
  const [showUsageLimit, setShowUsageLimit] = useState(false);
  const [showWeeklyLimit, setShowWeeklyLimit] = useState(false);

  // Check user tier
  const getUserTier = () => {
    // Check if admin
    if (isAdminAccess()) return 'admin';
    
    // Check if paid user (this would come from your auth/user context)
    // For now, we'll simulate based on localStorage or similar
    const userTier = localStorage.getItem('userTier') || 'free';
    return userTier;
  };

  const userTier = getUserTier();

  // Load existing usage counts on component mount
  useEffect(() => {
    // Load monthly usage
    const savedUsageCount = localStorage.getItem('usageCount');
    if (savedUsageCount) {
      setUsageCount(parseInt(savedUsageCount, 10));
    }
    
    // Load weekly usage and check if reset is needed
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);
    
    const lastReset = localStorage.getItem('weeklyUsageReset');
    if (!lastReset || new Date(lastReset) < weekStart) {
      setWeeklyUsageCount(0);
      localStorage.setItem('weeklyUsageReset', weekStart.toISOString());
      localStorage.setItem('weeklyUsageCount', '0');
    } else {
      const savedWeeklyCount = localStorage.getItem('weeklyUsageCount');
      if (savedWeeklyCount) {
        setWeeklyUsageCount(parseInt(savedWeeklyCount, 10));
      }
    }
  }, []);

  // Track usage when comparison is made
  const trackUsage = () => {
    if (isAdminAccess()) {
      // console.log('🔑 Admin access - Usage tracking bypassed');
      return true; // Allow unlimited usage for admin
    }

    // Get current week start (Monday)
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);
    
    // Check if weekly usage should reset
    const lastReset = localStorage.getItem('weeklyUsageReset');
    if (!lastReset || new Date(lastReset) < weekStart) {
      setWeeklyUsageCount(0);
      localStorage.setItem('weeklyUsageReset', weekStart.toISOString());
    }

    // Tier-based usage tracking
    if (userTier === 'free') {
      const newWeeklyCount = weeklyUsageCount + 1;
      setWeeklyUsageCount(newWeeklyCount);
      
      if (newWeeklyCount > maxWeeklyUsage) {
        setShowWeeklyLimit(true);
        return false; // Block usage for free users
      }
      
      // Store weekly usage
      localStorage.setItem('weeklyUsageCount', newWeeklyCount.toString());
      return true; // Allow usage
    }
    
    if (userTier === 'firstTeam' || userTier === 'seasonPass') {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      
      // Only limit First Team users
      if (userTier === 'firstTeam' && newCount > maxUsage) {
        setShowUsageLimit(true);
        return false; // Block usage
      }
      
      // Store monthly usage
      localStorage.setItem('usageCount', newCount.toString());
      return true; // Allow usage
    }
    
    return true; // Default allow
  };
  
  // Phase 2: Advanced Filters
  const [positionFilter1, setPositionFilter1] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');
  const [positionFilter2, setPositionFilter2] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');
  const [teamFilter1, setTeamFilter1] = useState<string>('ALL');
  const [teamFilter2, setTeamFilter2] = useState<string>('ALL');
  const [priceRange1, setPriceRange1] = useState<[number, number]>([4.0, 15.0]);
  const [priceRange2, setPriceRange2] = useState<[number, number]>([4.0, 15.0]);
  const [sortBy1, setSortBy1] = useState<'total_points' | 'form' | 'value' | 'ownership'>('total_points');
  const [sortBy2, setSortBy2] = useState<'total_points' | 'form' | 'value' | 'ownership'>('total_points');
  const [showFilters1, setShowFilters1] = useState(false);
  const [showFilters2, setShowFilters2] = useState(false);
  
  // Phase 3: Advanced Features
  const [comparisonHistory, setComparisonHistory] = useState<Array<{id: string; player1: PlayerStats; player2: PlayerStats; timestamp: number}>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  // Initialize with default players
  useEffect(() => {
    const haaland = MOCK_PLAYERS.find(p => p.web_name === 'Haaland');
    const salah = MOCK_PLAYERS.find(p => p.web_name === 'Salah');
    if (haaland) setPlayer1(transformPlayer(haaland));
    if (salah) setPlayer2(transformPlayer(salah));
  }, []);
  
  // Get unique teams from MOCK_PLAYERS
  const allTeams = Array.from(new Set(MOCK_PLAYERS.map(p => p.team))).sort();
  
  // Filter players for dropdown with advanced filters
  const getFilteredPlayers = (
    search: string, 
    excludeId?: string,
    positionFilter: 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD' = 'ALL',
    teamFilter: string = 'ALL',
    priceRange: [number, number] = [4.0, 15.0],
    sortBy: 'total_points' | 'form' | 'value' | 'ownership' = 'total_points'
  ) => {
    if (search.length < 1) return [];
    
    let filtered = MOCK_PLAYERS.filter(p => {
      const price = p.now_cost / 10;
      const matchesSearch = p.web_name.toLowerCase().includes(search.toLowerCase());
      const notExcluded = p.id.toString() !== excludeId;
      const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
      const matchesTeam = teamFilter === 'ALL' || p.team === teamFilter;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      return matchesSearch && notExcluded && matchesPosition && matchesTeam && matchesPrice;
    });
    
    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'total_points':
          return b.total_points - a.total_points;
        case 'form':
          return parseFloat(b.form) - parseFloat(a.form);
        case 'value':
          return (b.total_points / b.now_cost) - (a.total_points / a.now_cost);
        case 'ownership':
          return b.selected_by_percent - a.selected_by_percent;
        default:
          return 0;
      }
    });
    
    return filtered.slice(0, 10).map(transformPlayer);
  };
  
  const filteredPlayers1 = getFilteredPlayers(search1, player2?.id, positionFilter1, teamFilter1, priceRange1, sortBy1);
  const filteredPlayers2 = getFilteredPlayers(search2, player1?.id, positionFilter2, teamFilter2, priceRange2, sortBy2);
  
  // Get popular suggestions (top 5 by ownership)
  const popularPlayers = MOCK_PLAYERS
    .sort((a, b) => b.selected_by_percent - a.selected_by_percent)
    .slice(0, 5)
    .map(transformPlayer);
  
  // Phase 3: Smart Suggestions - Players similar to selected player
  const getSimilarPlayers = (player: PlayerStats | null) => {
    if (!player) return [];
    
    return MOCK_PLAYERS
      .filter(p => 
        p.id.toString() !== player.id &&
        p.position === player.position &&
        Math.abs((p.now_cost / 10) - player.price) <= 2.0 // Within £2m price range
      )
      .sort((a, b) => {
        // Sort by similarity in total points
        const diffA = Math.abs(a.total_points - player.points);
        const diffB = Math.abs(b.total_points - player.points);
        return diffA - diffB;
      })
      .slice(0, 5)
      .map(transformPlayer);
  };
  
  // Get in-form players (form > 6.0)
  const inFormPlayers = MOCK_PLAYERS
    .filter(p => parseFloat(p.form) >= 6.0)
    .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
    .slice(0, 5)
    .map(transformPlayer);
  
  // Get differential players (ownership < 10%)
  const differentialPlayers = MOCK_PLAYERS
    .filter(p => p.selected_by_percent < 10.0 && p.total_points > 60)
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 5)
    .map(transformPlayer);
  
  // Comparison Presets
  const comparisonPresets = [
    {
      id: 'premium-strikers',
      name: '⚡ Premium Strikers',
      description: 'Top expensive forwards',
      player1Name: 'Haaland',
      player2Name: 'Salah'
    },
    {
      id: 'budget-defenders',
      name: '💰 Budget Defenders',
      description: 'Best value defenders',
      player1Name: 'Dunk',
      player2Name: 'Mykolenko'
    },
    {
      id: 'template-mids',
      name: '📊 Template Midfielders',
      description: 'Most owned midfielders',
      player1Name: 'Palmer',
      player2Name: 'Foden'
    },
    {
      id: 'value-forwards',
      name: '🎯 Value Forwards',
      description: 'Best points per million',
      player1Name: 'Watkins',
      player2Name: 'Isak'
    },
    {
      id: 'differential-picks',
      name: '🔥 Differential Picks',
      description: 'Low ownership gems',
      player1Name: 'Mbeumo',
      player2Name: 'Gross'
    }
  ];
  
  const handleSelectPlayer1 = (player: PlayerStats) => {
    setPlayer1(player);
    setSearch1(player.name);
    setShowDropdown1(false);
    
    // Track usage when second player is selected (comparison complete)
    if (player2) {
      trackUsage();
    }
  };
  
  const handleSelectPlayer2 = (player: PlayerStats) => {
    setPlayer2(player);
    setSearch2(player.name);
    setShowDropdown2(false);
    
    // Track usage when first player is already selected (comparison complete)
    if (player1) {
      trackUsage();
    }
  };
  
  // Phase 3: Save comparison to history
  const saveComparison = () => {
    if (!player1 || !player2) return;
    
    const newComparison = {
      id: `${player1.id}-${player2.id}-${Date.now()}`,
      player1,
      player2,
      timestamp: Date.now()
    };
    
    setComparisonHistory(prev => [newComparison, ...prev].slice(0, 10)); // Keep last 10
  };
  
  // Load comparison from history
  const loadComparison = (comparison: {player1: PlayerStats; player2: PlayerStats}) => {
    setPlayer1(comparison.player1);
    setPlayer2(comparison.player2);
    setSearch1(comparison.player1.name);
    setSearch2(comparison.player2.name);
    setShowHistory(false);
  };
  
  // Load preset comparison
  const loadPreset = (preset: typeof comparisonPresets[0]) => {
    const p1 = MOCK_PLAYERS.find(p => p.web_name === preset.player1Name);
    const p2 = MOCK_PLAYERS.find(p => p.web_name === preset.player2Name);
    
    if (p1 && p2) {
      const player1Data = transformPlayer(p1);
      const player2Data = transformPlayer(p2);
      setPlayer1(player1Data);
      setPlayer2(player2Data);
      setSearch1(player1Data.name);
      setSearch2(player2Data.name);
      setActivePreset(preset.id);
    }
  };
  
  // Export comparison as text
  const exportComparison = () => {
    if (!player1 || !player2) return;
    
    const text = `
🔥 PLAYER COMPARISON - The Gaffer EPL

${player1.name} (${player1.team}) vs ${player2.name} (${player2.team})

📊 BASIC STATS:
Price: £${player1.price.toFixed(1)}m vs £${player2.price.toFixed(1)}m
Points: ${player1.points} vs ${player2.points}
Goals: ${player1.goals} vs ${player2.goals}
Assists: ${player1.assists} vs ${player2.assists}

📈 ADVANCED STATS:
Form: ${player1.form.toFixed(1)} vs ${player2.form.toFixed(1)}
xG: ${player1.expectedGoals.toFixed(1)} vs ${player2.expectedGoals.toFixed(1)}
xA: ${player1.expectedAssists.toFixed(1)} vs ${player2.expectedAssists.toFixed(1)}

💰 VALUE METRICS:
Pts/£m: ${player1.valueSeasonPoints.toFixed(1)} vs ${player2.valueSeasonPoints.toFixed(1)}
Ownership: ${player1.ownership.toFixed(1)}% vs ${player2.ownership.toFixed(1)}%

🏆 VERDICT:
${player1.points > player2.points ? `${player1.name} wins on total points!` : player2.points > player1.points ? `${player2.name} wins on total points!` : "It's a draw!"}

Generated by The Gaffer EPL - thegafferEPL.com
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Comparison copied to clipboard! 📋');
  };

  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return { p1: 'text-green-500 font-black', p2: 'text-slate-500' };
    if (stat2 > stat1) return { p1: 'text-slate-500', p2: 'text-green-500 font-black' };
    return { p1: 'text-slate-700 dark:text-slate-300', p2: 'text-slate-700 dark:text-slate-300' };
  };
  
  // Helper: Check if player is in form
  const isInForm = (player: PlayerStats) => player.form >= 6.0;
  
  // Helper: Check if player is a differential
  const isDifferential = (player: PlayerStats) => player.ownership < 10.0;

  const StatRow = ({ label, stat1, stat2, format = (v: number) => v.toString() }: { 
    label: string; 
    stat1: number; 
    stat2: number; 
    format?: (v: number) => string;
  }) => {
    const colors = getStatComparison(stat1, stat2);
    return (
      <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
        <div className={`flex-1 text-right font-bold ${colors.p1}`}>
          {format(stat1)}
        </div>
        <div className="flex-1 text-center px-4">
          <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
        </div>
        <div className={`flex-1 text-left font-bold ${colors.p2}`}>
          {format(stat2)}
        </div>
      </div>
    );
  };

  const FilterPanel = ({
    positionFilter,
    setPositionFilter,
    teamFilter,
    setTeamFilter,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters
  }: {
    positionFilter: 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD';
    setPositionFilter: (filter: 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD') => void;
    teamFilter: string;
    setTeamFilter: (team: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    sortBy: 'total_points' | 'form' | 'value' | 'ownership';
    setSortBy: (sort: 'total_points' | 'form' | 'value' | 'ownership') => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
  }) => (
    <div className="mt-2">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
      >
        <i className={`fas fa-filter text-xs`}></i>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      {showFilters && (
        <div className="mt-3 space-y-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          {/* Position Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Position</label>
            <div className="flex gap-1">
              {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => setPositionFilter(pos)}
                  className={`flex-1 px-2 py-1 rounded text-xs font-bold transition-all ${
                    positionFilter === pos
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
          
          {/* Team Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Team</label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white font-bold"
            >
              <option value="ALL">All Teams</option>
              {allTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          
          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Price: £{priceRange[0].toFixed(1)}m - £{priceRange[1].toFixed(1)}m
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="4.0"
                max="15.0"
                step="0.5"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="4.0"
                max="15.0"
                step="0.5"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>
          
          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white font-bold"
            >
              <option value="total_points">Total Points</option>
              <option value="form">Form</option>
              <option value="value">Value (Pts/£m)</option>
              <option value="ownership">Ownership %</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
  
  const PlayerSelector = ({ 
    value, 
    onChange, 
    placeholder, 
    filteredPlayers, 
    showDropdown, 
    setShowDropdown,
    positionFilter,
    setPositionFilter,
    teamFilter,
    setTeamFilter,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    placeholder: string;
    filteredPlayers: PlayerStats[];
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    positionFilter: 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD';
    setPositionFilter: (filter: 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD') => void;
    teamFilter: string;
    setTeamFilter: (team: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    sortBy: 'total_points' | 'form' | 'value' | 'ownership';
    setSortBy: (sort: 'total_points' | 'form' | 'value' | 'ownership') => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
  }) => (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-white font-bold"
      />
      
      {showDropdown && filteredPlayers.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto z-50">
          {filteredPlayers.map(player => (
            <button
              key={player.id}
              onClick={() => {
                if (placeholder.includes('Player 1')) {
                  handleSelectPlayer1(player);
                } else {
                  handleSelectPlayer2(player);
                }
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-8 h-8 shrink-0">
                <LogoWithFallback src={getTeamLogo(player.team)} teamName={player.team} size="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white truncate">{player.name}</div>
                <div className="text-xs text-slate-500">{player.team} • {player.position}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-purple-600 dark:text-purple-400">£{player.price.toFixed(1)}m</div>
                <div className="text-xs text-slate-500">{player.points} pts</div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      <FilterPanel
        positionFilter={positionFilter}
        setPositionFilter={setPositionFilter}
        teamFilter={teamFilter}
        setTeamFilter={setTeamFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </div>
  );
  
  const PlayerCard = ({ player, side }: { player: PlayerStats; side: 'left' | 'right' }) => (
    <div className={`flex-1 ${side === 'left' ? 'text-right' : 'text-left'}`}>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700 relative">
        {/* Phase 3: Badges */}
        <div className={`absolute top-2 ${side === 'left' ? 'left-2' : 'right-2'} flex flex-col gap-1`}>
          {isInForm(player) && (
            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black rounded-full flex items-center gap-1">
              <i className="fas fa-fire text-[8px]"></i>
              HOT
            </span>
          )}
          {isDifferential(player) && (
            <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-black rounded-full flex items-center gap-1">
              <i className="fas fa-gem text-[8px]"></i>
              DIFF
            </span>
          )}
        </div>
        
        <div className={`flex items-center gap-3 ${side === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-16 h-16 shrink-0">
            <LogoWithFallback src={getTeamLogo(player.team)} teamName={player.team} size="w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
              {player.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{player.team} • {player.position}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">£{player.price.toFixed(1)}m</span>
              <span className="text-xs text-slate-500">{player.ownership.toFixed(1)}% owned</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Price</div>
            <div className="text-lg font-black text-purple-600 dark:text-purple-400">£{player.price}m</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Points</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{player.points}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Form</div>
            <div className="text-lg font-black text-green-500">{player.form}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SeasonalAccessControl isPaidUser={isAdminAccess()}>
    <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
      <ShareSnapshot targetRef={containerRef} className="absolute top-3 right-32 z-30" />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fas fa-balance-scale text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Player Comparison</h2>
                <p className="text-sm text-blue-200">Head-to-head stats analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-bold text-sm transition-all border border-white/30 hover:border-white/50 flex items-center gap-2"
              >
                <i className="fas fa-book"></i>
                Guide
              </button>
            </div>
          </div>
          <p className="text-blue-100 text-sm italic">
            "Let's see who's actually worth the money, shall we?"
          </p>
        </div>
      </div>

      {/* Phase 3: Quick Actions Bar */}
      <div className="p-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center gap-1.5"
            >
              <i className="fas fa-history text-blue-500"></i>
              History ({comparisonHistory.length})
            </button>
            
            <button
              onClick={() => setShowSmartSuggestions(!showSmartSuggestions)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors flex items-center gap-1.5"
            >
              <i className="fas fa-lightbulb text-purple-500"></i>
              Smart Picks
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {player1 && player2 && (
              <>
                <button
                  onClick={saveComparison}
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                >
                  <i className="fas fa-bookmark"></i>
                  Save
                </button>
                
                <button
                  onClick={exportComparison}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                >
                  <i className="fas fa-share-alt"></i>
                  Export
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Phase 3: Comparison Presets */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <i className="fas fa-bolt text-yellow-500 text-sm"></i>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Quick Comparisons</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          {comparisonPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                activePreset === preset.id
                  ? 'bg-purple-500 text-white border-purple-600'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Phase 3: Comparison History Panel */}
      {showHistory && comparisonHistory.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-history text-blue-500"></i>
              Recent Comparisons
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="space-y-2">
            {comparisonHistory.map(comparison => (
              <button
                key={comparison.id}
                onClick={() => loadComparison(comparison)}
                className="w-full p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{comparison.player1.name}</span>
                    <span className="text-xs text-slate-500">vs</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{comparison.player2.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(comparison.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Phase 3: Smart Suggestions Panel */}
      {showSmartSuggestions && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-lightbulb text-purple-500"></i>
              Smart Suggestions
            </h3>
            <button
              onClick={() => setShowSmartSuggestions(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Similar to Player 1 */}
            {player1 && getSimilarPlayers(player1).length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Similar to {player1.name}</h4>
                <div className="flex gap-2 flex-wrap">
                  {getSimilarPlayers(player1).map(player => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectPlayer2(player)}
                      className="px-2 py-1 bg-white dark:bg-slate-800 rounded-full text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-colors"
                    >
                      {player.name} £{player.price.toFixed(1)}m
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* In-Form Players */}
            {inFormPlayers.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <i className="fas fa-fire text-green-500 text-xs"></i>
                  In-Form Players
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {inFormPlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => {
                        if (!player1) handleSelectPlayer1(player);
                        else handleSelectPlayer2(player);
                      }}
                      className="px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-xs font-bold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:border-green-500 transition-colors"
                    >
                      {player.name} {player.form.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Differential Players */}
            {differentialPlayers.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <i className="fas fa-gem text-purple-500 text-xs"></i>
                  Differential Picks
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {differentialPlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => {
                        if (!player1) handleSelectPlayer1(player);
                        else handleSelectPlayer2(player);
                      }}
                      className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full text-xs font-bold text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:border-purple-500 transition-colors"
                    >
                      {player.name} {player.ownership.toFixed(1)}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Player Selection */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Player 1</label>
            <PlayerSelector
              value={search1}
              onChange={setSearch1}
              placeholder="Search Player 1..."
              filteredPlayers={filteredPlayers1}
              showDropdown={showDropdown1}
              setShowDropdown={setShowDropdown1}
              positionFilter={positionFilter1}
              setPositionFilter={setPositionFilter1}
              teamFilter={teamFilter1}
              setTeamFilter={setTeamFilter1}
              priceRange={priceRange1}
              setPriceRange={setPriceRange1}
              sortBy={sortBy1}
              setSortBy={setSortBy1}
              showFilters={showFilters1}
              setShowFilters={setShowFilters1}
            />
          </div>
          
          <div className="shrink-0 mt-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">VS</span>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Player 2</label>
            <PlayerSelector
              value={search2}
              onChange={setSearch2}
              placeholder="Search Player 2..."
              filteredPlayers={filteredPlayers2}
              showDropdown={showDropdown2}
              setShowDropdown={setShowDropdown2}
              positionFilter={positionFilter2}
              setPositionFilter={setPositionFilter2}
              teamFilter={teamFilter2}
              setTeamFilter={setTeamFilter2}
              priceRange={priceRange2}
              setPriceRange={setPriceRange2}
              sortBy={sortBy2}
              setSortBy={setSortBy2}
              showFilters={showFilters2}
              setShowFilters={setShowFilters2}
            />
          </div>
        </div>
      </div>
      
      {/* Player Cards */}
      {player1 && player2 ? (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <PlayerCard player={player1} side="left" />
          
          <div className="shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">VS</span>
            </div>
          </div>
          
          <PlayerCard player={player2} side="right" />
        </div>

        {/* Comparison View Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => setComparisonView('basic')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              comparisonView === 'basic' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Basic Stats
          </button>
          <button
            onClick={() => setComparisonView('advanced')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              comparisonView === 'advanced' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Advanced
          </button>
          <button
            onClick={() => setComparisonView('value')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              comparisonView === 'value' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Value
          </button>
        </div>

        {/* Comparison Stats */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          {comparisonView === 'basic' && (
            <div>
              <StatRow label="Goals" stat1={player1.goals} stat2={player2.goals} />
              <StatRow label="Assists" stat1={player1.assists} stat2={player2.assists} />
              <StatRow label="Clean Sheets" stat1={player1.cleanSheets} stat2={player2.cleanSheets} />
              <StatRow label="Bonus Points" stat1={player1.bonus} stat2={player2.bonus} />
              <StatRow label="Total Points" stat1={player1.points} stat2={player2.points} />
              <StatRow label="Points/Game" stat1={player1.pointsPerGame} stat2={player2.pointsPerGame} format={(v) => v.toFixed(1)} />
            </div>
          )}

          {comparisonView === 'advanced' && (
            <div>
              <StatRow label="xG" stat1={player1.expectedGoals} stat2={player2.expectedGoals} format={(v) => v.toFixed(1)} />
              <StatRow label="xA" stat1={player1.expectedAssists} stat2={player2.expectedAssists} format={(v) => v.toFixed(1)} />
              <StatRow label="xGI" stat1={player1.expectedGoalInvolvements} stat2={player2.expectedGoalInvolvements} format={(v) => v.toFixed(1)} />
              <StatRow label="ICT Index" stat1={player1.ictIndex} stat2={player2.ictIndex} format={(v) => v.toFixed(1)} />
              <StatRow label="Influence" stat1={player1.influence} stat2={player2.influence} format={(v) => v.toFixed(1)} />
              <StatRow label="Creativity" stat1={player1.creativity} stat2={player2.creativity} format={(v) => v.toFixed(1)} />
              <StatRow label="Threat" stat1={player1.threat} stat2={player2.threat} format={(v) => v.toFixed(1)} />
              <StatRow label="BPS" stat1={player1.bps} stat2={player2.bps} />
            </div>
          )}

          {comparisonView === 'value' && (
            <div>
              <StatRow label="Price" stat1={player1.price} stat2={player2.price} format={(v) => `£${v}m`} />
              <StatRow label="Ownership %" stat1={player1.ownership} stat2={player2.ownership} format={(v) => `${v}%`} />
              <StatRow label="Value (Form)" stat1={player1.valueForm} stat2={player2.valueForm} format={(v) => v.toFixed(2)} />
              <StatRow label="Value (Season)" stat1={player1.valueSeasonPoints} stat2={player2.valueSeasonPoints} format={(v) => v.toFixed(1)} />
              <StatRow label="Pts/£m" stat1={player1.points / player1.price} stat2={player2.points / player2.price} format={(v) => v.toFixed(1)} />
              <StatRow label="Minutes" stat1={player1.minutesPlayed} stat2={player2.minutesPlayed} />
            </div>
          )}
        </div>

        {/* Winner Badge */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">🏆</span>
            <div className="text-center">
              <div className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase mb-1">
                Gaffer's Verdict
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {player1.points > player2.points 
                  ? `${player1.name} edges it. More points, more glory.`
                  : player2.points > player1.points
                  ? `${player2.name} takes the crown. Numbers don't lie.`
                  : "Dead heat! Both solid picks, can't go wrong."}
              </p>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-search text-3xl text-slate-400"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select Players to Compare</h3>
          <p className="text-slate-600 dark:text-slate-400">Use the search boxes above to find and compare any two Premier League players</p>
        </div>
      )}

      {/* Help Guide */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-2">
              <i className="fas fa-question-circle text-blue-500"></i>
              Understanding the Stats
            </span>
            <i className="fas fa-chevron-down group-open:rotate-180 transition-transform text-xs"></i>
          </summary>
          <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p><strong className="text-blue-600 dark:text-blue-400">xG (Expected Goals):</strong> Quality of chances. Higher = better finisher.</p>
            <p><strong className="text-blue-600 dark:text-blue-400">xA (Expected Assists):</strong> Quality of chances created for teammates.</p>
            <p><strong className="text-blue-600 dark:text-blue-400">ICT Index:</strong> Influence, Creativity, Threat combined. Overall impact metric.</p>
            <p><strong className="text-blue-600 dark:text-blue-400">Value (Form):</strong> Points per million based on recent form. Higher = better value.</p>
            <p><strong className="text-blue-600 dark:text-blue-400">BPS:</strong> Bonus Point System score. Determines who gets bonus points.</p>
          </div>
        </details>
      </div>

      {/* Gaffer's Tip */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <i className="fas fa-chart-bar text-white text-lg"></i>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 mb-1">Pro Tip</div>
            <p className="text-xs font-bold text-white/70 italic leading-relaxed">
              "Don't just look at total points. Check points per game, value metrics, and form. A cheaper player in good form can outscore an expensive template pick. Use presets for quick comparisons, save your favorites, and export to share with your mini-league."
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Usage Limit Overlay */}
    {showUsageLimit && !isAdminAccess() && (
      <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-8 max-w-md w-full border-2 border-orange-400 shadow-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-3xl font-black text-white mb-4">
              Monthly Limit Reached!
            </h2>
            <p className="text-orange-100 text-lg mb-6">
              You've used {usageCount}/{maxUsage} free comparisons this month
            </p>
            
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <h3 className="text-white font-bold mb-3">🔑 Admin Access Available</h3>
              <p className="text-orange-100 text-sm mb-4">
                Contact site administrator to unlock unlimited access!
              </p>
            </div>

            <div className="space-y-3">
              <a 
                href="#newsletter-form"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('selectTier', { detail: 'seasonPass' }));
                  setTimeout(() => {
                    const formElement = document.getElementById('newsletter-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      formElement.classList.add('ring-4', 'ring-accent', 'ring-opacity-50');
                      setTimeout(() => {
                        formElement.classList.remove('ring-4', 'ring-accent', 'ring-opacity-50');
                      }, 2000);
                    }
                  }, 100);
                  setShowUsageLimit(false);
                }}
                className="block w-full bg-white text-orange-600 py-3 px-6 rounded-lg font-black text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Season Pass - Unlimited Access
              </a>
              
              <button 
                onClick={() => setShowUsageLimit(false)}
                className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-bold transition-all hover:bg-white/30"
              >
                I'll Wait
              </button>
            </div>

            <p className="text-orange-200 text-xs mt-4 italic">
              "Stop being cheap! Your mates are already using the full toolkit while you're still in the academy."
            </p>
            <p className="text-orange-300 text-xs mt-1">- The Gaffer</p>
          </div>
        </div>
      </div>
    )}

    {/* Weekly Limit Overlay for Free Users */}
    {showWeeklyLimit && !isAdminAccess() && (
      <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 max-w-md w-full border-2 border-blue-400 shadow-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-3xl font-black text-white mb-4">
              Weekly Limit Reached!
            </h2>
            <p className="text-blue-100 text-lg mb-6">
              You've used {weeklyUsageCount}/{maxWeeklyUsage} free comparison this week
            </p>
            
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <h3 className="text-white font-bold mb-3">🎯 Want More?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Upgrade to First Team for <strong>50 comparisons per month</strong> or Season Pass for unlimited access!
              </p>
            </div>

            <div className="space-y-3">
              <a 
                href="#newsletter-form"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('selectTier', { detail: 'firstTeam' }));
                  setTimeout(() => {
                    const formElement = document.getElementById('newsletter-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      formElement.classList.add('ring-4', 'ring-green-500', 'ring-opacity-50');
                      setTimeout(() => {
                        formElement.classList.remove('ring-4', 'ring-green-500', 'ring-opacity-50');
                      }, 2000);
                    }
                  }, 100);
                  setShowWeeklyLimit(false);
                }}
                className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-black text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-2"
              >
                Get First Team - 50 Comparisons/Month
              </a>
              
              <a 
                href="#newsletter-form"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('selectTier', { detail: 'seasonPass' }));
                  setTimeout(() => {
                    const formElement = document.getElementById('newsletter-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      formElement.classList.add('ring-4', 'ring-yellow-500', 'ring-opacity-50');
                      setTimeout(() => {
                        formElement.classList.remove('ring-4', 'ring-yellow-500', 'ring-opacity-50');
                      }, 2000);
                    }
                  }, 100);
                  setShowWeeklyLimit(false);
                }}
                className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 py-3 px-6 rounded-lg font-black text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Season Pass - Unlimited Access
              </a>
              
              <button 
                onClick={() => setShowWeeklyLimit(false)}
                className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-bold transition-all hover:bg-white/30"
              >
                I'll Wait
              </button>
            </div>

            <p className="text-blue-200 text-xs mt-4 italic">
              "Come back next week for another free comparison! Or join the team and dominate your mini-league."
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Guide Modal */}
    <GuideModal 
      isOpen={showGuide} 
      onClose={() => setShowGuide(false)} 
      section="player-comparison"
    />
    </SeasonalAccessControl>
  );
};

export default PlayerComparison;


