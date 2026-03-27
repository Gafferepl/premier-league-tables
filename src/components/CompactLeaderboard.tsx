import React, { useState, useEffect } from 'react';
import { authService, LeaderboardEntry } from '../services/auth';
import { getTeamLogo } from '../constants';
import LogoWithFallback from './LogoWithFallback';

interface CompactLeaderboardProps {
  currentUser: any;
  showFull?: boolean;
  maxEntries?: number;
}

const CompactLeaderboard: React.FC<CompactLeaderboardProps> = ({ 
  currentUser, 
  showFull = false, 
  maxEntries = 5 
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'allTime'>('allTime');

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = authService.getLeaderboard(activeTab);
      
      // Add current user if not in top entries
      const currentUserEntry = data.find(entry => entry.user.id === currentUser.id);
      const topEntries = data.slice(0, maxEntries);
      
      // If current user is not in top entries, add them at the end
      if (!currentUserEntry && currentUser.allTimePoints > 0) {
        const userEntry: LeaderboardEntry = {
          user: currentUser,
          rank: data.length + 1,
          points: currentUser.allTimePoints,
          accuracy: currentUser.accuracy,
          predictions: currentUser.totalPredictions
        };
        setLeaderboard([...topEntries, userEntry]);
      } else {
        setLeaderboard(topEntries);
      }
    } catch (error) {
      // console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🥇' };
    if (rank === 2) return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🥈' };
    if (rank === 3) return { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🥉' };
    return { bg: 'bg-slate-100', text: 'text-slate-800', icon: rank.toString(), size: 'w-8 h-8' };
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1 h-3 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-blue-500/10 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="fas fa-trophy text-accent"></i>
            Leaderboard
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                activeTab === 'weekly'
                  ? 'bg-accent text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setActiveTab('allTime')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                activeTab === 'allTime'
                  ? 'bg-accent text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="p-4 space-y-2">
        {leaderboard.map((entry) => {
          const badge = getRankBadge(entry.rank);
          const isCurrentUser = entry.user.id === currentUser.id;
          const teamLogo = getTeamLogo(entry.user.team);
          
          return (
            <div
              key={entry.user.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                isCurrentUser 
                  ? 'bg-accent/10 border border-accent/30' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {/* Rank */}
              <div className={`flex items-center justify-center ${badge.size || 'w-8 h-8'} rounded-full ${badge.bg} ${badge.text} text-sm font-bold flex-shrink-0`}>
                {badge.icon}
              </div>
              
              {/* User Info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-pink-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {entry.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold truncate ${
                      isCurrentUser ? 'text-accent dark:text-accent' : 'text-slate-800 dark:text-white'
                    }`}>
                      {entry.user.username}
                      {isCurrentUser && <span className="text-xs">(You)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <LogoWithFallback src={teamLogo} teamName={entry.user.team} size="w-4 h-4" />
                    <span className="truncate">{entry.user.team}</span>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-3 text-right flex-shrink-0">
                <div>
                  <div className="text-lg font-bold text-accent">{entry.points}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">pts</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-slate-800 dark:text-white">
                    {entry.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    🔥 {entry.user.currentStreak}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {showFull && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => document.getElementById('leaderboard')?.scrollIntoView({behavior: 'smooth'})}
            className="w-full py-2 bg-accent hover:bg-[#f50057] text-white font-bold rounded-lg transition-all text-sm"
          >
            View Full Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default CompactLeaderboard;


