import React, { useState, useEffect } from 'react';
import { authService, LeaderboardEntry } from '../services/auth';
import { getTeamLogo } from '../constants';
import LogoWithFallback from './LogoWithFallback';

// Ghost data for demo purposes - lower values for new user competition
const GHOST_LEADERBOARD: LeaderboardEntry[] = [
  {
    user: {
      id: 'ghost1',
      email: 'mancityfan@example.com',
      username: 'CityFan92',
      team: 'Man City',
      joinedDate: new Date('2024-01-01'),
      totalPredictions: 45,
      accuracy: 58.5,
      currentStreak: 3,
      bestStreak: 6,
      weeklyPoints: 15,
      monthlyPoints: 38,
      allTimePoints: 156
    },
    rank: 1,
    points: 156,
    accuracy: 58.5,
    predictions: 45
  },
  {
    user: {
      id: 'ghost2',
      email: 'liverpoolsupporter@example.com',
      username: 'YNWA_Forever',
      team: 'Liverpool',
      joinedDate: new Date('2024-01-05'),
      totalPredictions: 38,
      accuracy: 52.1,
      currentStreak: 2,
      bestStreak: 4,
      weeklyPoints: 12,
      monthlyPoints: 32,
      allTimePoints: 142
    },
    rank: 2,
    points: 142,
    accuracy: 52.1,
    predictions: 38
  },
  {
    user: {
      id: 'ghost3',
      email: 'gunners@example.com',
      username: 'Gooner2024',
      team: 'Arsenal',
      joinedDate: new Date('2024-01-10'),
      totalPredictions: 34,
      accuracy: 49.4,
      currentStreak: 1,
      bestStreak: 3,
      weeklyPoints: 10,
      monthlyPoints: 28,
      allTimePoints: 128
    },
    rank: 3,
    points: 128,
    accuracy: 49.4,
    predictions: 34
  },
  {
    user: {
      id: 'ghost4',
      email: 'chelseablue@example.com',
      username: 'BluesBrother',
      team: 'Chelsea',
      joinedDate: new Date('2024-01-12'),
      totalPredictions: 31,
      accuracy: 45.2,
      currentStreak: 0,
      bestStreak: 2,
      weeklyPoints: 8,
      monthlyPoints: 25,
      allTimePoints: 115
    },
    rank: 4,
    points: 115,
    accuracy: 45.2,
    predictions: 31
  },
  {
    user: {
      id: 'ghost5',
      email: 'spursfan@example.com',
      username: 'HotspurHero',
      team: 'Spurs',
      joinedDate: new Date('2024-01-15'),
      totalPredictions: 28,
      accuracy: 43.9,
      currentStreak: 1,
      bestStreak: 2,
      weeklyPoints: 7,
      monthlyPoints: 22,
      allTimePoints: 98
    },
    rank: 5,
    points: 98,
    accuracy: 43.9,
    predictions: 28
  },
  {
    user: {
      id: 'ghost6',
      email: 'manutd@example.com',
      username: 'RedDevil',
      team: 'Man Utd',
      joinedDate: new Date('2024-01-18'),
      totalPredictions: 25,
      accuracy: 41.6,
      currentStreak: 0,
      bestStreak: 1,
      weeklyPoints: 6,
      monthlyPoints: 18,
      allTimePoints: 87
    },
    rank: 6,
    points: 87,
    accuracy: 41.6,
    predictions: 25
  },
  {
    user: {
      id: 'ghost7',
      email: 'newcastle@example.com',
      username: 'ToonArmy',
      team: 'Newcastle',
      joinedDate: new Date('2024-01-20'),
      totalPredictions: 22,
      accuracy: 39.0,
      currentStreak: 2,
      bestStreak: 2,
      weeklyPoints: 5,
      monthlyPoints: 15,
      allTimePoints: 76
    },
    rank: 7,
    points: 76,
    accuracy: 39.0,
    predictions: 22
  },
  {
    user: {
      id: 'ghost8',
      email: 'brighton@example.com',
      username: 'SeagullsFan',
      team: 'Brighton',
      joinedDate: new Date('2024-01-22'),
      totalPredictions: 18,
      accuracy: 37.1,
      currentStreak: 1,
      bestStreak: 1,
      weeklyPoints: 4,
      monthlyPoints: 12,
      allTimePoints: 65
    },
    rank: 8,
    points: 65,
    accuracy: 37.1,
    predictions: 18
  }
];

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'allTime' | 'team'>('allTime');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);

  const premierLeagueTeams = [
    'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton',
    'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Liverpool',
    'Luton Town', 'Man City', 'Man Utd', 'Newcastle', "Nott'm Forest",
    'Sheffield Utd', 'Spurs', 'West Ham', 'Wolves', 'Burnley',
    'Ipswich', 'Leicester', 'Southampton'
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab, selectedTeam]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      if (activeTab === 'team' && selectedTeam) {
        const data = authService.getTeamLeaderboard(selectedTeam);
        // Add ghost data if team leaderboard is empty
        const teamGhostData = GHOST_LEADERBOARD.filter(entry => entry.user.team === selectedTeam);
        const finalData = data.length > 0 ? data : teamGhostData;
        setTeamLeaderboard(finalData);
      } else {
        const data = authService.getLeaderboard(activeTab as 'weekly' | 'monthly' | 'allTime');
        // Add ghost data if main leaderboard is empty (less than 5 users)
        const finalData = data.length >= 5 ? data : [...data, ...GHOST_LEADERBOARD.slice(0, 8 - data.length)];
        setLeaderboard(finalData);
      }
    } catch (error) {
      // console.error('Failed to load leaderboard:', error);
      // Fallback to ghost data on error
      if (activeTab === 'team' && selectedTeam) {
        const teamGhostData = GHOST_LEADERBOARD.filter(entry => entry.user.team === selectedTeam);
        setTeamLeaderboard(teamGhostData);
      } else {
        setLeaderboard(GHOST_LEADERBOARD);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🥇' };
    if (rank === 2) return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🥈' };
    if (rank === 3) return { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🥉' };
    return { bg: 'bg-slate-100', text: 'text-slate-800', icon: rank.toString(), size: 'w-10 h-10' };
  };

  const currentData = activeTab === 'team' ? teamLeaderboard : leaderboard;

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-primary dark:text-white uppercase italic mb-4">
            🏆 Leaderboards
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Compete against fellow football fans and climb the rankings. Show everyone who's the real Gaffer!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['weekly', 'monthly', 'allTime'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
                activeTab === tab && activeTab !== 'team'
                  ? 'bg-accent text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tab === 'allTime' ? 'All Time' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          
          {/* Team Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                if (e.target.value) {
                  setActiveTab('team');
                }
              }}
              className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm border-0 focus:ring-2 focus:ring-accent"
            >
              <option value="">Select Team</option>
              {premierLeagueTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Leaderboard Table */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accuracy</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Predictions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {currentData.map((entry) => {
                      const badge = getRankBadge(entry.rank);
                      const teamLogo = getTeamLogo(entry.user.team);
                      
                      return (
                        <tr key={entry.user.id} className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center justify-center ${badge.size || 'w-8 h-8'} rounded-full ${badge.bg} ${badge.text} text-sm font-bold`}>
                              {badge.icon}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                  {entry.user.username.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                  {entry.user.username}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  Streak: 🔥 {entry.user.currentStreak}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <LogoWithFallback 
                                src={teamLogo} 
                                teamName={entry.user.team} 
                                size="w-6 h-6" 
                                className="mr-2"
                              />
                              <span className="text-sm text-slate-900 dark:text-white">
                                {entry.user.team}
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-lg font-bold text-accent">
                              {entry.points}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className={`text-sm font-bold ${
                              entry.accuracy >= 70 ? 'text-emerald-600' :
                              entry.accuracy >= 50 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {entry.accuracy.toFixed(1)}%
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-slate-900 dark:text-white">
                              {entry.predictions}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {currentData.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-trophy text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
                  <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-2">
                    No predictions yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    Be the first to start predicting and climb the leaderboard!
                  </p>
                </div>
              )}
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold opacity-90">Top Predictor</p>
                    <p className="text-2xl font-bold">
                      {currentData[0]?.user.username || 'N/A'}
                    </p>
                  </div>
                  <i className="fas fa-crown text-3xl opacity-50"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold opacity-90">Highest Accuracy</p>
                    <p className="text-2xl font-bold">
                      {Math.max(...currentData.map(e => e.accuracy), 0).toFixed(1)}%
                    </p>
                  </div>
                  <i className="fas fa-bullseye text-3xl opacity-50"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold opacity-90">Total Players</p>
                    <p className="text-2xl font-bold">
                      {currentData.length}
                    </p>
                  </div>
                  <i className="fas fa-users text-3xl opacity-50"></i>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;


