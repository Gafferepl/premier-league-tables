import React, { useState } from 'react';
import { authService, User } from '../services/auth';

interface UserRegistrationProps {
  onUserRegistered: (user: User) => void;
  onUserLoggedIn: (user: User) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onUserRegistered, onUserLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [team, setTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const premierLeagueTeams = [
    'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton',
    'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Liverpool',
    'Luton Town', 'Man City', 'Man Utd', 'Newcastle', "Nott'm Forest",
    'Sheffield Utd', 'Spurs', 'West Ham', 'Wolves', 'Burnley',
    'Ipswich', 'Leicester', 'Southampton'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const user = authService.login(email);
        onUserLoggedIn(user);
      } else {
        if (!username || !team) {
          setError('Please fill in all fields');
          return;
        }
        const user = authService.register(email, username, team);
        onUserRegistered(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#d4af37] rounded-full mx-auto mb-4 flex items-center justify-center">
            <img src="/says.svg" alt="Gaffer" className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-heading font-black text-primary dark:text-white uppercase">
            {isLogin ? 'Welcome Back' : 'Join The Gaffer'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            {isLogin ? 'Sign in to check your predictions' : 'Create your account to start predicting'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Username (Registration only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Your username"
                required
              />
            </div>
          )}

          {/* Team (Registration only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Favorite Team
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              >
                <option value="">Select your team</option>
                {premierLeagueTeams.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-[#f50057] text-white font-heading font-bold uppercase tracking-wider py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-accent hover:text-[#f50057] text-sm font-bold underline decoration-dotted"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>🏆 Track your prediction accuracy</p>
            <p>📊 Compete on leaderboards</p>
            <p>🔥 Build your winning streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;


