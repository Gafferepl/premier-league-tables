import React, { useState, useEffect, useRef } from 'react';
import { isAdminAccessClient } from '../config/admin';
import { getTeamLogo } from '../constants';
import LogoWithFallback from './LogoWithFallback';
import CountryIcon from './CountryIcon';
import CountryDropdown from './CountryDropdown';
import ClubDropdown from './ClubDropdown';
import { authService } from '../services/auth';
import { apiService } from '../services/apiService';
import { transformFPLFixture } from '../services/dataTransformer';
import { Fixture } from '../../types';
import { useAnalytics } from '../hooks/useAnalytics';

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isRandomChars = /^[a-zA-Z]{1,3}$/.test(email) || /^\d+$/.test(email);
  return emailRegex.test(email) && !isRandomChars && email.length > 5;
};

// Cookie functions
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return '';
};

// Admin access is now handled through secure configuration

// Get the current week key (e.g. "2026-W08")
const getCurrentWeekKey = (): string => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

// Get next Sunday at 8pm
const getNextSunday = (): Date => {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay() + 7) % 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(20, 0, 0, 0); // 8pm Sunday
  return nextSunday;
};

// Check if results should be available (Sunday 8pm onwards)
const areResultsAvailable = (): boolean => {
  const now = new Date();
  const nextSunday = getNextSunday();
  return now >= nextSunday;
};

// Check if user has already submitted this week
const hasSubmittedThisWeek = (email: string): boolean => {
  const weekKey = getCurrentWeekKey();
  return localStorage.getItem(`btg_submitted_${email}_${weekKey}`) === 'true';
};

// Get user's weekly submission
const getWeeklySubmission = (email: string) => {
  const weekKey = getCurrentWeekKey();
  const submission = localStorage.getItem(`btg_submission_${email}_${weekKey}`);
  return submission ? JSON.parse(submission) : null;
};

// Check if a user has already played this week
const hasPlayedThisWeek = (email: string): boolean => {
  if (isAdminAccessClient()) return false; // Admin override
  const weekKey = getCurrentWeekKey();
  const played = localStorage.getItem(`btg_played_${email.toLowerCase()}_${weekKey}`);
  return played === 'true';
};

// Mark a user as having played this week
const markAsPlayed = (email: string): void => {
  if (isAdminAccessClient()) return; // Don't mark admin
  const weekKey = getCurrentWeekKey();
  localStorage.setItem(`btg_played_${email.toLowerCase()}_${weekKey}`, 'true');
};

// Mock data for local testing
const MOCK_FIXTURES: Fixture[] = [
  {
    id: '1',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    date: '2024-01-15T15:00:00Z',
    status: 'upcoming'
  },
  {
    id: '2', 
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    date: '2024-01-15T17:30:00Z',
    status: 'upcoming'
  },
  {
    id: '3',
    homeTeam: 'Manchester United', 
    awayTeam: 'Tottenham',
    date: '2024-01-16T20:00:00Z',
    status: 'upcoming'
  },
  {
    id: '4',
    homeTeam: 'Newcastle',
    awayTeam: 'Aston Villa',
    date: '2024-01-16T19:45:00Z', 
    status: 'upcoming'
  },
  {
    id: '5',
    homeTeam: 'Brighton',
    awayTeam: 'West Ham',
    date: '2024-01-17T19:30:00Z',
    status: 'upcoming'
  }
];

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Alex Johnson', club: 'Manchester City', country: 'England', points: 12, beatGaffer: true },
  { rank: 2, name: 'Sarah Williams', club: 'Liverpool', country: 'Wales', points: 10, beatGaffer: true },
  { rank: 3, name: 'Mike Chen', club: 'Arsenal', country: 'China', points: 9, beatGaffer: false },
  { rank: 4, name: 'Emma Davis', club: 'Chelsea', country: 'Scotland', points: 8, beatGaffer: false },
  { rank: 5, name: 'Tom Wilson', club: 'Manchester United', country: 'England', points: 7, beatGaffer: true }
];

// Mock Gaffer predictions
const GAFFER_PREDICTIONS: { [key: string]: 'home' | 'draw' | 'away' } = {
  '1': 'home',
  '2': 'draw', 
  '3': 'away',
  '4': 'home',
  '5': 'draw'
};

// Enhanced Gaffer Button Suggestions
const GAFFER_BUTTON_SUGGESTIONS = {
  classicManagerWisdom: [
    "📊 Points Are Sanity - Show Results",
    "🏆 Ugly Win? No Such Thing - Show Results",
    "⚽ Form Is Temporary, Class Is Permanent - Show Results",
    "🥧 Half-Time Analysis - Show Results"
  ],
  pieCulture: [
    "🥧 Half-Time Analysis - Show Results",
    "🍺 Time for the Pint and Predictions",
    "📊 The Gaffer's Tea Break Verdict",
    "🏆 Touchline Talk - Show Results",
    "📋 Dugout Decisions - Show Results"
  ],
  managerSpeak: [
    "🎯 The Gaffer's Crystal Ball",
    "📊 My Notebook Says...",
    "🏆 The Board Room Results",
    "⚽ The Gaffer's Gut Feeling",
    "📈 The Manager's Assessment"
  ],
  selfDeprecating: [
    "🤔 Even I Get It Wrong Sometimes - Show Results",
    "🥧 Need Another Pie - Show Results"
  ],
  interactive: [
    "🎯 Beat the Gaffer? Let's See",
    "⚽ Your Predictions vs The Gaffer",
    "🏆 Who's the Real Manager Here?",
    "📊 Time to Face the Music",
    "🎮 Game Over - Show Results"
  ]
};

// Types
interface UserPrediction {
  matchId: string;
  prediction: 'home' | 'draw' | 'away';
}

interface UserProfile {
  name: string;
  email: string;
  club: string;
  country: string;
  leagueOptIn: boolean;
}

const BeatTheGafferNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();
  const [gameState, setGameState] = useState<'intro' | 'signup' | 'playing' | 'results' | 'leaderboard'>('intro');
  const [predictions, setPredictions] = useState<Array<{ matchId: string; prediction: 'home' | 'draw' | 'away' }>>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', email: '', club: '', country: '', leagueOptIn: false });
  const [emailError, setEmailError] = useState('');
  const [selectedMatches, setSelectedMatches] = useState(MOCK_FIXTURES);
  const [userScore, setUserScore] = useState(0);
  const [gafferScore, setGafferScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [buttonText, setButtonText] = useState('📊 Points Are Sanity - Show Results');

  // Context-aware button text selection
  const getButtonText = () => {
    // Always prioritize the top recommendation from the plan
    return "📊 Points Are Sanity - Show Results";
  };

  const handlePrediction = (matchId: string, prediction: 'home' | 'draw' | 'away') => {
    setPredictions(prev => {
      const filtered = prev.filter(p => p.matchId !== matchId);
      return [...filtered, { matchId, prediction }];
    });
  };

  const handleNewsletterSignup = async () => {
    try {
      // Validate email
      if (!isValidEmail(userProfile.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      if (userProfile.name && userProfile.email && userProfile.club && userProfile.country) {
        // Track newsletter signup
        analytics.trackNewsletterSignup('beat_the_gaffer');
        
        // Save to Supabase (including league opt-in)
        try {
          const { supabaseService } = await import('../services/supabase');
          await supabaseService.saveLeagueUser({
            email: userProfile.email,
            name: userProfile.name,
            tier: 'free', // Beat the Gaffer users are free tier
            league_opt_in: userProfile.leagueOptIn,
            waitlist_opt_in: false, // Can add this later if needed
            fpl_team_name: userProfile.club
          });
          // console.log('League data saved to Supabase');
        } catch (dbError) {
          // console.error('Failed to save to Supabase:', dbError);
          // Continue with signup even if database fails
        }
        
        // console.log('Newsletter signup:', userProfile);
        
        // Store user data
        setCookie('btg_user_name', userProfile.name, 30);
        setCookie('btg_user_email', userProfile.email, 30);
        setCookie('btg_user_club', userProfile.club, 30);
        setCookie('btg_user_country', userProfile.country, 30);
        
        // Check if user has admin access
        if (isAdminAccessClient()) {
          // console.log('🔑 Admin access detected - bypassing weekly limit');
          return true; // Admin bypass
        }
        
        // Mark as played this week
        markAsPlayed(userProfile.email);
        
        setGameState('playing');
        setEmailError('');
        
        // Scroll to beat-the-gaffer section to center the game
        const section = document.getElementById('beat-the-gaffer');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        return true;
      }
    } catch (error) {
      // console.error('Newsletter signup failed:', error);
      return false;
    }
  };

  const handleCompleteGame = () => {
    // Calculate scores
    let userPoints = 0;
    let gafferPoints = 0;

    predictions.forEach(pred => {
      // Mock result calculation (random for demo)
      const mockResult = Math.random() > 0.5 ? 'home' : Math.random() > 0.5 ? 'draw' : 'away';
      if (pred.prediction === mockResult) {
        userPoints += 2; // 2 points for correct prediction
      }
      
      const gafferPred = GAFFER_PREDICTIONS[pred.matchId as keyof typeof GAFFER_PREDICTIONS];
      if (gafferPred === mockResult) {
        gafferPoints += 2;
      }
    });

    setUserScore(userPoints);
    setGafferScore(gafferPoints);
    
    // Store weekly submission
    const weekKey = getCurrentWeekKey();
    const submission = {
      weekKey,
      predictions,
      userProfile,
      submittedAt: new Date().toISOString(),
      score: userPoints,
      gafferScore: gafferPoints
    };
    
    localStorage.setItem(`btg_submission_${userProfile.email}_${weekKey}`, JSON.stringify(submission));
    localStorage.setItem(`btg_submitted_${userProfile.email}_${weekKey}`, 'true');
    
    // Mark as played this week
    markAsPlayed(userProfile.email);
    
    setGameState('results');
       
    // Track game completion
    analytics.trackGameCompleted(predictions.length, userPoints);
       
    // Scroll to beat-the-gaffer section to center the results
    const section = document.getElementById('beat-the-gaffer');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewLeaderboard = () => {
    setGameState('leaderboard');
    // Scroll to beat-the-gaffer section to center the leaderboard
    const section = document.getElementById('beat-the-gaffer');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetGame = () => {
    setGameState('intro');
    setPredictions([]);
    setUserScore(0);
    setGafferScore(0);
    // Scroll to beat-the-gaffer section to center the intro
    const section = document.getElementById('beat-the-gaffer');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPredictionIcon = (prediction: 'home' | 'draw' | 'away') => {
    switch (prediction) {
      case 'home': return '🏠';
      case 'draw': return '🤝';
      case 'away': return '✈️';
      default: return '❓';
    }
  };

  const getPredictionText = (prediction: 'home' | 'draw' | 'away', homeTeam: string, awayTeam: string) => {
    switch (prediction) {
      case 'home': return homeTeam;
      case 'draw': return 'Draw';
      case 'away': return awayTeam;
      default: return 'Select';
    }
  };

  // Generate Gaffer Banter
  const generateGafferBanter = (userPreds: any[], gafferPreds: any): string => {
    const disagreements = userPreds.filter(pred => {
      const gafferPred = gafferPreds[pred.matchId as keyof typeof gafferPreds];
      return pred.prediction !== gafferPred;
    }).length;

    const awayPicks = userPreds.filter(pred => pred.prediction === 'away').length;
    const homePicks = userPreds.filter(pred => pred.prediction === 'home').length;
    const drawPicks = userPreds.filter(pred => pred.prediction === 'draw').length;

    // Dynamic banter based on user's actual choices
    if (disagreements === 0) {
      return "Great minds think alike! Though I've been doing this since you were in short trousers. Copycat!";
    } else if (disagreements === 1) {
      return "Only one disagreement? Playing it safe are we? One brave pick amongst the sheep following the shepherd!";
    } else if (disagreements === 2) {
      return "Going against the gaffer twice! Either you're a genius or you'll be buying the pies this weekend. Bold!";
    } else if (disagreements >= 3) {
      return "Three or more disagreements? You've got bigger cojones than a bull in a china shop! Respect the confidence, son!";
    }

    if (awayPicks >= 3) {
      return "Backing all the away teams? Either you've got inside information or you're just plain daft! Away wins are for gamblers!";
    }

    if (homePicks >= 4) {
      return "Playing it safe with all the home wins? No imagination, son! Sometimes you've got to take a chance or you'll never beat the gaffer!";
    }

    if (drawPicks >= 3) {
      return "Three or more draws? Sitting on the fence are we? Make a decision! Draws are for people who can't make their mind up!";
    }

    return "Interesting picks... I've seen worse, but not many! Let's see if your bravery pays off or if you're just helping my pension fund!";
  };

  // Calculate risk level based on predictions
  const calculateRiskLevel = (userPreds: any[]) => {
    const awayPicks = userPreds.filter(pred => pred.prediction === 'away').length;
    const disagreements = userPreds.filter(pred => {
      const gafferPred = GAFFER_PREDICTIONS[pred.matchId as keyof typeof GAFFER_PREDICTIONS];
      return pred.prediction !== gafferPred;
    }).length;

    if (awayPicks >= 3 || disagreements >= 3) return "BOLD ⚡⚡⚡";
    if (awayPicks >= 2 || disagreements >= 2) return "ADVENTUROUS ⚡⚡";
    if (awayPicks >= 1 || disagreements >= 1) return "CAUTIOUS ⚡";
    return "CONSERVATIVE 😴";
  };

  // Check if user has already submitted this week
  useEffect(() => {
    const savedEmail = getCookie('btg_user_email');
    
    // Load saved user profile
    const savedName = getCookie('btg_user_name');
    const savedClub = getCookie('btg_user_club');
    const savedCountry = getCookie('btg_user_country');
    
    if (savedEmail) {
      setUserProfile({
        name: savedName || '',
        email: savedEmail,
        club: savedClub || '',
        country: savedCountry || '',
        leagueOptIn: false // Reset league opt-in on page load
      });
      
      // Check if user has already submitted this week
      if (hasSubmittedThisWeek(savedEmail)) {
        setGameState('results');
        // Load their submission
        const submission = getWeeklySubmission(savedEmail);
        if (submission) {
          setUserScore(submission.score);
          setGafferScore(submission.gafferScore);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* INTRO STATE */}
        {gameState === 'intro' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Can you outsmart The Gaffer? Predict 5 Premier League matches and compete for the weekly leaderboard!
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  🏆 Weekly competition • 📧 Free to enter • 🎯 2 minutes to play
                </p>
              </div>
            </div>

            {/* How to Play Section - Always Expanded */}
            <div className="mb-8">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 text-left">
                <h3 className="font-bold text-xl mb-6 text-primary dark:text-white text-center">🎮 How to Play & Rules</h3>
                
                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl flex-shrink-0">1️⃣</div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Sign Up:</strong>
                      <p className="mt-1">Enter your name, email, club and country to join the weekly competition.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl flex-shrink-0">2️⃣</div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Predict 5 Matches:</strong>
                      <p className="mt-1">Each week, predict Home/Draw/Away for 5 random Premier League matches. The Gaffer makes his predictions too!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl flex-shrink-0">3️⃣</div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Score Points:</strong>
                      <p className="mt-1">Get 2 points for each correct prediction. Maximum 10 points per week. Beat The Gaffer's score for bonus bragging rights!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl flex-shrink-0">4️⃣</div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Weekly Leaderboard:</strong>
                      <p className="mt-1">Top 5 players announced every Sunday evening. Get exclusive Gaffer insights and football banter!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sample Match Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-primary dark:text-white mb-4 text-center">
                ⚽ Example Match Prediction
              </h3>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">Manchester City</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">vs</span>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Liverpool</span>
                    <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mt-3">
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-sm font-medium">🏠 Home</button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium">🤝 Draw</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium">✈️ Away</button>
                </div>
                
                <div className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                  🧠 Gaffer predicts: 🏠 Home
                </div>
              </div>
            </div>

            {/* Newsletter Signup Form */}
            <div className="max-w-md mx-auto mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Club
                  </label>
                  <ClubDropdown
                    value={userProfile.club}
                    onChange={(club) => setUserProfile({...userProfile, club})}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country
                  </label>
                  <CountryDropdown
                    value={userProfile.country}
                    onChange={(country) => setUserProfile({...userProfile, country})}
                    className="w-full"
                  />
                </div>
                
                {/* League Opt-in Checkbox */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userProfile.leagueOptIn}
                      onChange={(e) => setUserProfile({...userProfile, leagueOptIn: e.target.checked})}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        🏆 Enter me in the Gaffer's League lottery!
                      </span>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        Get a chance to join our exclusive Fantasy Premier League league (50 spots). 
                        Winners selected randomly 2 weeks before season starts.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              
              {emailError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-6">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-3">📧 WHAT THE GAFFER SENDS YOU</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700 dark:text-yellow-300">
                  <div className="flex items-center space-x-2">
                    <span>🏆</span>
                    <span>WEEKLY RESULTS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🧠</span>
                    <span>GAFFER'S INSIGHTS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>EXCLUSIVE STATS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🥧</span>
                    <span>FOOTBALL BANTER</span>
                  </div>
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3 text-center">
                  No spam - just weekly football fun!
                </p>
              </div>

              <button
                onClick={handleNewsletterSignup}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg mt-6"
              >
                📧 Sign Up & Start Playing
              </button>
              
              <button
                onClick={() => {
                  handleViewLeaderboard();
                  const section = document.getElementById('beat-the-gaffer');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-lg transition-all"
              >
                👀 View Current Leaderboard
              </button>
            </div>
            
            <div className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
              <p>📊 Top 5 players announced every Sunday evening</p>
              <p>🧠 See how you compare against The Gaffer's predictions</p>
              <p>📧 Join thousands of football fans testing their knowledge!</p>
            </div>
          </div>
        )}

        {/* SIGNUP STATE */}
        {gameState === 'signup' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
                📧 Sign Up to Play
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Club
                  </label>
                  <ClubDropdown
                    value={userProfile.club}
                    onChange={(club) => setUserProfile({...userProfile, club})}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country
                  </label>
                  <CountryDropdown
                    value={userProfile.country}
                    onChange={(country) => setUserProfile({...userProfile, country})}
                    className="w-full"
                  />
                </div>
                
                {/* League Opt-in Checkbox */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userProfile.leagueOptIn}
                      onChange={(e) => setUserProfile({...userProfile, leagueOptIn: e.target.checked})}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        🏆 Enter me in the Gaffer's League lottery!
                      </span>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        Get a chance to join our exclusive Fantasy Premier League league (50 spots). 
                        Winners selected randomly 2 weeks before season starts.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              
              {emailError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleNewsletterSignup}
                  className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setGameState('intro')}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && (
          <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-start justify-center p-4 pt-8">
            <div className="max-w-4xl w-full">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
                  🧠 Beat The Gaffer - Predict 5 Matches
                </h2>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                  {predictions.length}/5 predictions • Risk Level: {calculateRiskLevel(predictions)}
                </div>

                <div className="space-y-4">
                  {selectedMatches.map(match => (
                    <div key={match.id} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8">
                            <LogoWithFallback src={getTeamLogo(match.homeTeam)} teamName={match.homeTeam} size="w-full h-full" />
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{match.homeTeam}</span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400">vs</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{match.awayTeam}</span>
                          <div className="w-8 h-8">
                            <LogoWithFallback src={getTeamLogo(match.awayTeam)} teamName={match.awayTeam} size="w-full h-full" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handlePrediction(match.id, 'home')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            predictions.find(p => p.matchId === match.id)?.prediction === 'home'
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                          }`}
                        >
                          🏠 Home
                        </button>
                        <button
                          onClick={() => handlePrediction(match.id, 'draw')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            predictions.find(p => p.matchId === match.id)?.prediction === 'draw'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                          }`}
                        >
                          🤝 Draw
                        </button>
                        <button
                          onClick={() => handlePrediction(match.id, 'away')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            predictions.find(p => p.matchId === match.id)?.prediction === 'away'
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                          }`}
                        >
                          ✈️ Away
                        </button>
                      </div>
                      
                      <div className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                        🧠 Gaffer predicts: {getPredictionIcon(GAFFER_PREDICTIONS[match.id])} {getPredictionText(GAFFER_PREDICTIONS[match.id], match.homeTeam, match.awayTeam)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Make your predictions and compete against The Gaffer!
                  </div>
                  <button
                    onClick={handleCompleteGame}
                    disabled={predictions.length < 5}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      predictions.length === 5
                        ? 'bg-accent hover:bg-accent/90 text-white'
                        : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS STATE */}
        {gameState === 'results' && (
          <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-start justify-center p-4 pt-8">
            <div className="max-w-2xl w-full">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-6">📊 Predictions Submitted!</h2>
                
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-xl text-slate-700 dark:text-slate-300 mb-4">
                    Come back Sunday evening to see how you've done!
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <div className="font-bold mb-2">📅 Results Release:</div>
                    <div className="text-2xl font-black">Sunday 8:00 PM</div>
                    <div className="text-xs mt-2">Results compared against The Gaffer's predictions</div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4 text-center">🎩 The Gaffer's Verdict</h3>
                  <p className="text-center text-slate-700 dark:text-slate-300 italic">
                    "{generateGafferBanter(predictions, GAFFER_PREDICTIONS)}"
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <button
                    onClick={() => {
                      setGameState('leaderboard');
                      const section = document.getElementById('beat-the-gaffer');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-lg"
                  >
                    🏆 View Current Leaderboard
                  </button>
                </div>

                <div className="mt-8 text-sm text-slate-600 dark:text-slate-400 text-center">
                  <p>📧 You'll receive an email with the weekly leaderboard</p>
                  <p>🏆 Compete against other players for the top spot!</p>
                  <p>📅 New predictions available next Monday</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD STATE */}
        {gameState === 'leaderboard' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-6">🏆 Leaderboard</h2>
            
            <div className="space-y-3 mb-8">
              {MOCK_LEADERBOARD.map(player => (
                <div key={player.rank} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-primary dark:text-white">#{player.rank}</div>
                      <CountryIcon country={player.country} size="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{player.name}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{player.club}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary dark:text-white">{player.points}pts</div>
                    {player.beatGaffer && <div className="text-xs text-green-600 dark:text-green-400">Beat Gaffer!</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  handleResetGame();
                  const section = document.getElementById('beat-the-gaffer');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-lg"
              >
                🏠 Back to Game
              </button>
            </div>
            
            <div className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
              <p>📊 Top 5 players announced every Sunday evening</p>
              <p>🧠 See how you compare against The Gaffer's predictions</p>
              <p>📧 Join thousands of football fans testing their knowledge!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatTheGafferNew;


