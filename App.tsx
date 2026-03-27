import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EmbedSection from './components/EmbedSection';
import SmartTable from './components/SmartTable';
import SmartFixtures from './components/SmartFixtures';
import Footer from './components/Footer';
import LiveBar from './components/LiveBar';
import GafferTip from './components/GafferTip';
import FactDisplay from './components/FactDisplay'; 
import GafferInstallPrompt from './components/GafferInstallPrompt';
import BeatTheGafferNew from './components/BeatTheGafferNew';
import { fetchPremierLeagueData } from './services/gemini';
import { AppData } from './types';

// Lazy Load Heavy Components for Performance Optimization
const WinProbability = React.lazy(() => import('./components/WinProbability'));
const SackZone = React.lazy(() => import('./components/SackZone'));
const TopScorers = React.lazy(() => import('./components/TopScorers'));
const NewsCarousel = React.lazy(() => import('./components/NewsCarousel'));
const StatsCarousel = React.lazy(() => import('./components/StatsCarousel'));
const Newsletter = React.lazy(() => import('./components/Newsletter'));

// Loading Fallback Component
const SectionLoader = () => (
  <div className="w-full h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl animate-pulse">
    <div className="flex flex-col items-center gap-3">
      <i className="fas fa-circle-notch fa-spin text-3xl text-accent"></i>
      <span className="text-sm font-bold text-slate-400">Loading Gaffer Stats...</span>
    </div>
  </div>
);

// Add type definition for FWP global object
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
  
  // State for data fetched from Gemini
  const [data, setData] = useState<AppData>({
    lastUpdated: 0,
    currentGameweek: undefined, 
    table: [],
    fixtures: [],
    news: [], 
    scorers: [], 
    matchStats: [],
    sackRace: []
  });

  // Theme initialization
  useEffect(() => {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch Data from Gemini (Cached)
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchPremierLeagueData();
      setData(fetchedData);
      
      // Fallback init for static embeds if needed
      setTimeout(() => {
        if (window.FWP && typeof window.FWP.init === 'function') {
          window.FWP.init();
        }
      }, 1000);
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

  return (
    <div className="min-h-screen flex flex-col relative pb-12">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <Hero currentGameweek={data.currentGameweek || null} />
      
      <EmbedSection 
        id="league-table"
        title="Premier League Table"
        gafferQuote="The table never lies, Clive. Unless it's April 1st."
        embedId="" 
        extraContent={
          <SmartTable 
            data={data.table} 
            fallbackEmbedId="" 
          />
        }
      />
      
      <EmbedSection 
        id="fixtures"
        title="Upcoming Fixtures"
        gafferQuote="There are no easy games in this league. Apart from when we play them."
        embedId=""
        bgClass="bg-white dark:bg-dark"
        extraContent={
          <SmartFixtures 
            data={data.fixtures} 
            fallbackEmbedId="" 
          />
        }
      />

      <section id="beat-the-gaffer" className="py-16 bg-white dark:bg-dark relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SectionLoader />}>
            <BeatTheGafferNew />
          </Suspense>
        </div>
      </section>

      {/* Gaffer's Gut Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SectionLoader />}>
            <WinProbability 
              fixtures={data.fixtures} 
              table={data.table} 
              scorers={data.scorers} 
            />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<SectionLoader />}>
        <SackZone data={data.sackRace || []} />
      </Suspense>

      <GafferTip tip={data.weeklyTip} />
      
      <Suspense fallback={<SectionLoader />}>
        <TopScorers data={data.scorers} />
      </Suspense>
      
      <FactDisplay />
      
      <Suspense fallback={<SectionLoader />}>
        <NewsCarousel data={data.news} />
      </Suspense>

      <EmbedSection 
         id="stats-embed"
         title="The Gaffer's Roundup"
         gafferQuote="Statistics are like mini-skirts. They show a lot, but hide the vital parts."
         embedId=""
         extraContent={
           <Suspense fallback={<SectionLoader />}>
             <StatsCarousel data={data.matchStats} />
           </Suspense>
         }
      />

      <Suspense fallback={null}>
        <Newsletter />
      </Suspense>
      
      <Footer />
      
      <LiveBar />

      <GafferInstallPrompt />

      <button 
        onClick={scrollToTop}
        className={`fixed right-6 bottom-20 z-30 bg-accent text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#f50057] hover:-translate-y-1 ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

    </div>
  );
};

export default App;