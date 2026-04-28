import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SkipNavigation } from '../components/SkipNavigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SmartTable from '../components/SmartTable';
import SmartFixtures from '../components/SmartFixtures';
import Footer from '../components/Footer';
import LiveBar from '../components/LiveBar';
import GafferTip from '../components/GafferTip';
import FactDisplay from '../components/FactDisplay'; 
import GafferInstallPrompt from '../components/GafferInstallPrompt';
import BeatTheGafferNew from '../components/BeatTheGafferNew';
// import SimpleNewsletterEditor from '../components/SimpleNewsletterEditor';
import UserRegistration from '../components/UserRegistration';
import CookieConsent from '../components/CookieConsent';
import ModernAffiliateBanner from '../components/ModernAffiliateBanner';
import GafferTrendSquad from '../components/GafferTrendSquad';
import PlayerDatabase from '../components/PlayerDatabase';
import SquadBuilder from '../components/SquadBuilder';
import LivePointsTracker from '../components/LivePointsTracker';
import AdvancedStats from '../components/AdvancedStats';
import PricingSection from '../components/PricingSection';
import CaptainPicks from '../components/CaptainPicks';
import PriceChangeTracker from '../components/PriceChangeTracker';
import PlayerComparison from '../components/PlayerComparison';
import FPLGuide from '../components/FPLGuide';
import ErrorBoundary from '../components/ErrorBoundary';
import PerformanceOptimizerSimple from '../components/PerformanceOptimizerSimple';
import GafferChat from '../components/GafferChat';
import BackupStatus from '../components/BackupStatus';
import GoogleAnalytics2026 from '../components/GoogleAnalytics2026';

import { supabase } from '../services/supabase';
import { authService, User } from '../services/auth';
// import { apiService } from '../services/apiService'; // Disabled - using Supabase only
// import DataUpdater from '../services/dataUpdater';
// import { backupService } from '../services/backupService'; // Disabled - was triggering old data paths
import { AppData, Fixture } from '../../types';
import { FALLBACK_DATA } from '../constants';

// Import Skeletons
import SkeletonWinProb from '../components/skeletons/SkeletonWinProb';
import SkeletonSackZone from '../components/skeletons/SkeletonSackZone';
import SkeletonTopScorers from '../components/skeletons/SkeletonTopScorers';
import SkeletonNews from '../components/skeletons/SkeletonNews';
import SkeletonStats from '../components/skeletons/SkeletonStats';

// Lazy Load Heavy Components
const WinProbability = React.lazy(() => import('../components/WinProbability'));
const SackZone = React.lazy(() => import('../components/SackZone'));
const TopScorers = React.lazy(() => import('../components/TopScorers'));
const StatsCarousel = React.lazy(() => import('../components/StatsCarousel'));
const Newsletter = React.lazy(() => import('../components/Newsletter'));
const Support = React.lazy(() => import('../components/Support'));

declare global {
  interface Window {
    FWP?: {
      init: () => void;
    };
  }
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [data, setData] = useState<AppData>(FALLBACK_DATA);
  const [rawPlayers, setRawPlayers] = useState<any[]>([]);
  const [rawTeams, setRawTeams] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  // Initialize auth
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // User registration handlers
  const handleUserRegistered = (user: User) => {
    setCurrentUser(user);
    setShowRegistration(false);
  };

  const handleUserLoggedIn = (user: User) => {
    setCurrentUser(user);
    setShowRegistration(false);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Admin Trigger for Bot (Hidden Feature)
  // Triple click the hero title to force a bot check
  const handleBotCheck = async () => {
     try {
       // console.log("Wake up, Gaffer...");
       // Note: This calls the Vercel function directly
       await fetch('/api/cron'); 
     } catch (e) {
       // console.error("Gaffer is sleeping.");
     }
  };

  // Backup service disabled - was triggering old gemini/FPL API data paths
  // useEffect(() => {
  //   const initializeBackup = async () => {
  //     try {
  //       await backupService.start();
  //     } catch (error) {}
  //   };
  //   const timer = setTimeout(initializeBackup, 5000);
  //   return () => {
  //     clearTimeout(timer);
  //     backupService.stop();
  //   };
  // }, []);

  // Theme initialization - Dark mode as default
  useEffect(() => {
    // Default to dark mode unless user explicitly set light mode
    if (localStorage.getItem('color-theme') === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark mode
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  }, []);

  // Helper: Transform FPL API fixtures to App format
  function transformFPLFixtures(fplFixtures: any[], teams: any[]): Fixture[] {
    if (!fplFixtures || !teams) return [];

    const teamMap = new Map(teams.map(t => [t.id, t.name]));

    return fplFixtures.map(f => {
      const homeTeam = teamMap.get(f.team_h) || 'Unknown';
      const awayTeam = teamMap.get(f.team_a) || 'Unknown';

      // Determine status - use kickoff_time to handle stale cache where finished flag may be wrong
      const fixtureNow = Date.now();
      let status: 'upcoming' | 'live' | 'finished' = 'upcoming';
      if (f.finished) {
        status = 'finished';
      } else if (f.started && !f.finished) {
        status = 'live';
      } else if (f.kickoff_time) {
        const kickoffMs = new Date(f.kickoff_time).getTime();
        if (kickoffMs + (3 * 60 * 60 * 1000) < fixtureNow) {
          status = 'finished'; // Kickoff was 3+ hours ago - treat as finished even if cache is stale
        }
      }

      // Format score if finished
      let score = undefined;
      if (f.finished && f.team_h_score !== null && f.team_a_score !== null) {
        score = `${f.team_h_score} - ${f.team_a_score}`;
      }

      return {
        id: String(f.id),
        homeTeam,
        awayTeam,
        time: f.kickoff_time ? new Date(f.kickoff_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
        date: f.kickoff_time ? new Date(f.kickoff_time).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '',
        score,
        status,
        gameweek: f.event || 0,
        venue: '',
        referee: '',
        difficulty: { overall: 3, att: 3, def: 3 }
      };
    });
  }

  // Helper: Calculate league table from FPL fixtures
  function calculateTableFromFixtures(teams: any[], fixtures: any[]) {
    const teamMap = new Map(teams.map(t => [t.id, t.name]));
    const table = teams.map(team => ({
      position: 0,
      team: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      form: [] as string[]
    }));

    fixtures.forEach(f => {
      if (f.finished && f.team_h_score !== null && f.team_a_score !== null) {
        const homeTeam = table.find(t => t.team === teamMap.get(f.team_h));
        const awayTeam = table.find(t => t.team === teamMap.get(f.team_a));
        
        if (homeTeam && awayTeam) {
          homeTeam.played++;
          awayTeam.played++;
          homeTeam.gf += f.team_h_score;
          homeTeam.ga += f.team_a_score;
          awayTeam.gf += f.team_a_score;
          awayTeam.ga += f.team_h_score;

          if (f.team_h_score > f.team_a_score) {
            homeTeam.won++;
            homeTeam.points += 3;
            homeTeam.form.push('W');
            awayTeam.lost++;
            awayTeam.form.push('L');
          } else if (f.team_h_score < f.team_a_score) {
            awayTeam.won++;
            awayTeam.points += 3;
            awayTeam.form.push('W');
            homeTeam.lost++;
            homeTeam.form.push('L');
          } else {
            homeTeam.drawn++;
            awayTeam.drawn++;
            homeTeam.points += 1;
            awayTeam.points += 1;
            homeTeam.form.push('D');
            awayTeam.form.push('D');
          }
        }
      }
    });

    table.forEach(t => t.gd = t.gf - t.ga);
    table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    table.forEach((t, i) => t.position = i + 1);

    return table;
  }

  // Fetch Data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🎯 Supabase-Only Data Loading...');
        
        const [bootstrapResult, fixturesResult] = await Promise.all([
          supabase.from('fpl_bootstrap_cache').select('data').order('fetched_at', { ascending: false }).limit(1),
          supabase.from('fpl_fixtures_cache').select('data').order('fetched_at', { ascending: false }).limit(1)
        ]);

        console.log('📊 Bootstrap result:', bootstrapResult);
        console.log('📊 Bootstrap error:', bootstrapResult.error);
        console.log('📊 Fixtures result:', fixturesResult);
        console.log('📊 Fixtures error:', fixturesResult.error);

        const bootstrapData = bootstrapResult.data?.[0]?.data;
        const fixturesData = fixturesResult.data?.[0]?.data;

        console.log('📊 Bootstrap data:', bootstrapData);
        console.log('📊 Fixtures data:', fixturesData);

        if (bootstrapData && fixturesData) {
          console.log('✅ Supabase data loaded successfully!');
          console.log('📊 Players:', bootstrapData.elements?.length);
          console.log('📊 Fixtures:', fixturesData.length);

          // Transform Supabase data to AppData format
          // Use deadline_time to calculate real current GW - don't rely on stale is_current flag
          const now = Date.now();
          const allEvents = bootstrapData.events || [];
          const passedDeadlines = allEvents
            .filter((e: any) => e.deadline_time && new Date(e.deadline_time).getTime() <= now)
            .sort((a: any, b: any) => a.id - b.id);
          const currentGW = passedDeadlines.length > 0
            ? passedDeadlines[passedDeadlines.length - 1].id
            : (allEvents.find((e: any) => e.is_current)?.id || 1);
          console.log('📅 Current GW from deadline_time:', currentGW);

          // Transform FPL fixtures to App format
          const transformedFixtures = transformFPLFixtures(fixturesData, bootstrapData.teams || []);
          console.log('📊 Transformed fixtures:', transformedFixtures.length, 'matches');

          // Generate league table directly from Supabase fixtures
          const table = calculateTableFromFixtures(bootstrapData.teams || [], fixturesData);
          console.log('📊 Generated table:', table.length, 'teams');

          const supabaseData: AppData = {
            lastUpdated: Date.now(),
            currentGameweek: currentGW,
            table,
            fixtures: transformedFixtures,
            scorers: (bootstrapData.elements || [])
              .filter((p: any) => p.goals_scored > 0)
              .sort((a: any, b: any) => b.goals_scored - a.goals_scored)
              .slice(0, 20)
              .map((p: any) => ({
                name: p.web_name,
                team: bootstrapData.teams?.find((t: any) => t.id === p.team)?.name || 'Unknown',
                goals: p.goals_scored,
                assists: p.assists,
                played: p.minutes > 0 ? ((p.minutes / 90)).toFixed(0) : 0,
                goalsPer90: p.minutes > 0 ? ((p.goals_scored / p.minutes) * 90).toFixed(2) : '0.00'
              })),
            matchStats: [],
            news: [],
            weeklyTip: ''
          };
          setData(supabaseData);
          setRawPlayers(bootstrapData.elements || []);
          setRawTeams(bootstrapData.teams || []);
        } else {
          console.log('⚠️ Supabase data not available, using fallback');
          setData(FALLBACK_DATA);
        }
      } catch (error) {
        console.error('❌ Failed to load Supabase data:', error);
        setData(FALLBACK_DATA);
      }
    };

    loadData();
  }, []);

  // Scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setDarkMode(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if we're on the newsletter editor page
  // Temporarily disabled due to build errors
  // if (window.location.pathname === '/newsletter-editor') {
  //   return <SimpleNewsletterEditor />;
  // }

  return (
    <ErrorBoundary>
      <PerformanceOptimizerSimple>
        <>
          <HelmetProvider>
            <div className="min-h-screen flex flex-col relative pb-20 md:pb-12 bg-slate-50 dark:bg-dark transition-colors duration-300">
            <SkipNavigation />
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <div id="main-content" onDoubleClick={handleBotCheck}>
        <Hero currentGameweek={data.currentGameweek || null} />
      </div>
      
      {/* League Table Section */}
      <section id="league-table" className="py-12 bg-section-gradient dark:bg-section-gradient-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              Premier League Table
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
          </div>
          <SmartTable 
            data={data.table} 
            fallbackEmbedId="" 
          />
        </div>
      </section>

      {/* Fixtures Section */}
      <section id="fixtures" className="py-12 bg-white dark:bg-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              Upcoming Fixtures
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
          </div>
          <SmartFixtures 
            data={data.fixtures} 
            fallbackEmbedId="" 
          />
        </div>
      </section>

      {/* Live Points Tracker Section */}
      <section id="live-points" className="py-12 bg-white dark:bg-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              Live Points Tracker
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Track your FPL points in real-time across all Gameweek matches
            </p>
          </div>
          <LivePointsTracker />
        </div>
      </section>

      {/* Banner 1: Streaming - User tracking live scores → watch the actual match */}
      <ModernAffiliateBanner
        type="streaming"
        title="Stream Every Premier League Match Live"
        description="Don't just track the points — watch the goals go in. All 380 games live."
        imageUrl=""
        ctaText="Watch Now"
        imageAlt="Live Streaming"
        darkMode={darkMode}
      />

      {/* Squad Builder Section */}
      <section id="squad-builder" className="py-12 bg-white dark:bg-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              Squad Builder
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Build your ultimate FPL dream team with a £100m budget across 7 formations
            </p>
          </div>
          <SquadBuilder />
        </div>
      </section>

      {/* Captain Picks Section */}
      <section id="captain-picks" className="py-12 bg-section-gradient dark:bg-section-gradient-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              👑 Captain Picks
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              The Gaffer's top armband choices for this gameweek with confidence ratings and expert analysis
            </p>
          </div>
          <CaptainPicks />
        </div>
      </section>

      {/* Banner 3: Betting - User just made captain picks → back your choices */}
      <ModernAffiliateBanner
        type="betting"
        title="Back Your Captain Pick"
        description="Confident in your captain choice? Get enhanced odds on this weekend's Premier League picks."
        imageUrl=""
        ctaText="Place Bets"
        imageAlt="Betting Odds"
        darkMode={darkMode}
      />

      {/* Price Change Tracker Section */}
      <section id="price-tracker" className="py-12 bg-white dark:bg-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              📈 Price Changes
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Live price change monitoring with risers, fallers, and predicted changes for tonight
            </p>
          </div>
          <PriceChangeTracker />
        </div>
      </section>

      {/* Player Comparison Section */}
      <section id="player-comparison" className="py-12 bg-section-gradient dark:bg-section-gradient-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              ⚖️ Player Comparison
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Compare players head-to-head with basic stats, advanced metrics, and value analysis
            </p>
          </div>
          <PlayerComparison />
        </div>
      </section>

      {/* Banner 2: Merchandise - User just built their dream team → get the shirt */}
      <ModernAffiliateBanner
        type="merchandise"
        title="Get Your Captain's Shirt"
        description="Show your support with official Premier League kits. Free shipping on orders over £50."
        imageUrl=""
        ctaText="Shop Now"
        imageAlt="Football Kits"
        darkMode={darkMode}
      />

      {/* Player Database Section */}
      <section id="player-database" className="py-12 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              Player Database
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Search, filter and analyse every Premier League player with advanced stats and transfer trends
            </p>
          </div>
          <PlayerDatabase players={rawPlayers} teams={rawTeams} />
        </div>
      </section>

      {/* Advanced Analytics Section */}
      <section id="advanced-stats" className="py-12 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              Advanced Analytics
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Expected Goals (xG), Expected Assists (xA), and advanced metrics for deeper insights
            </p>
          </div>
          <AdvancedStats data={data.table} />
        </div>
      </section>

      {/* BeatTheGaffer Section */}
      <section id="beat-the-gaffer" className="py-12 bg-white dark:bg-slate-800 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
              🏆 Beat The Gaffer
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">
              Test your football knowledge against The Gaffer's predictions
            </p>
          </div>
          <BeatTheGafferNew />
        </div>
      </section>

      {/* Newsletter Section - Email Capture */}
      <section id="newsletter" className="py-12 bg-section-gradient dark:bg-section-gradient-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <PricingSection />
          <Suspense fallback={<div className="text-center py-8">Loading signup form...</div>}>
            <Newsletter />
          </Suspense>
        </div>
      </section>

      {/* Banner 4: Equipment - User just played Beat The Gaffer → get gear for real */}
      <ModernAffiliateBanner
        type="gaming"
        title="Level Up Your Game"
        description="Beat the Gaffer? Now kit yourself out like the pros. Boots, balls, and training essentials."
        imageUrl=""
        ctaText="Shop Equipment"
        imageAlt="Football Equipment"
        darkMode={darkMode}
      />

      {/* Gaffer's Gut Section */}
      <section id="gaffers-gut" className="py-12 bg-white dark:bg-slate-800 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SkeletonWinProb />}>
            <WinProbability 
              fixtures={data.fixtures} 
              table={data.table} 
              scorers={data.scorers} 
            />
          </Suspense>
        </div>
      </section>

      {/* Sack Race Section */}
      <section id="sack-race" className="py-12 bg-white dark:bg-slate-800 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-2 text-primary dark:text-white inline-block relative pb-2">
              Gaffer's Sack Race
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic mb-2">
              Who's getting the boot this week? The Gaffer's not-so-scientific predictions.
            </p>
          </div>
          <ErrorBoundary>
            <Suspense fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="bg-slate-800 rounded-xl p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading sack race data...</p>
                </div>
              </div>
            }>
              <SackZone data={data?.sackRace || []} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* Golden Boot Section */}
      <section id="golden-boot" className="py-12 bg-white dark:bg-slate-800 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="bg-slate-800 rounded-xl p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading Golden Boot data...</p>
                </div>
              </div>
            }>
              <TopScorers data={data?.scorers || []} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-embed" className="py-12 bg-white dark:bg-slate-800 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="bg-slate-800 rounded-xl p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading match stats...</p>
                </div>
              </div>
            }>
              <StatsCarousel data={data?.matchStats || []} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-12 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="bg-slate-800 rounded-xl p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading support section...</p>
              </div>
            </div>
          }>
            <Support />
          </Suspense>
        </ErrorBoundary>
      </section>

          <Footer />
          <LiveBar />

          <GafferInstallPrompt />
          <BackupStatus />
          <GoogleAnalytics2026 />

          <CookieConsent />

          <FPLGuide />

          
          {/* AI Chat Assistant - The Gaffer */}
          <GafferChat 
            userEmail={currentUser?.email || 'demo@thegafferEPL.com'}
            userTier={currentUser?.tier || 'firstTeam'}
            userName={currentUser?.name || 'Demo Manager'}
          />

          
          <button 
            onClick={scrollToTop}
            className={`fixed right-6 bottom-20 z-30 bg-accent text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#f50057] hover:-translate-y-1 ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            aria-label="Back to top"
          >
            <i className="fas fa-arrow-up"></i>
          </button>

        </div>
          </HelmetProvider>
        </>
      </PerformanceOptimizerSimple>
    </ErrorBoundary>
  );
};

export default App;


