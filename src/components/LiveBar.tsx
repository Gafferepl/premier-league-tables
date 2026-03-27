import React, { useState, useEffect, useRef } from 'react';
import { fetchLiveScores, LiveScoreMatch } from '../services/liveScore';

// Helper to dynamically swap the favicon
const setGoalFavicon = (active: boolean) => {
  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'icon';
  
  if (active) {
    // Render a Football Emoji as the favicon
    link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚽</text></svg>`;
  } else {
    // Revert to original
    link.href = '/icon.svg'; 
  }
  document.getElementsByTagName('head')[0].appendChild(link);
};

const LiveBar: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<LiveScoreMatch[]>([]);
  const prevMatchesRef = useRef<LiveScoreMatch[]>([]);
  const flashIntervalRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const originalTitle = useRef(document.title);

  // Logic to trigger the browser notification effects
  const triggerGoalAlert = (match: LiveScoreMatch) => {
    // 1. Clear any existing alerts
    if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    // 2. Set Visuals
    setGoalFavicon(true);
    let showFlash = true;
    
    // 3. Start Title Flashing Loop
    const flashTitle = () => {
      document.title = showFlash 
        ? "⚽ GOAL! ⚽" 
        : `${match.homeTeam} ${match.score} ${match.awayTeam}`;
      showFlash = !showFlash;
    };

    flashTitle(); // Immediate run
    flashIntervalRef.current = window.setInterval(flashTitle, 1000);

    // 4. Set Auto-Reset Timer (10 seconds)
    resetTimeoutRef.current = window.setTimeout(() => {
      stopGoalAlert();
    }, 10000);
  };

  const stopGoalAlert = () => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    document.title = originalTitle.current;
    setGoalFavicon(false);
  };

  const detectChanges = (newMatches: LiveScoreMatch[]) => {
    const prevMatches = prevMatchesRef.current;
    if (prevMatches.length === 0) return;

    // Find a match where the score has changed
    const goalMatch = newMatches.find(newMatch => {
      const oldMatch = prevMatches.find(p => 
        p.homeTeam === newMatch.homeTeam && p.awayTeam === newMatch.awayTeam
      );
      return oldMatch && oldMatch.score !== newMatch.score;
    });

    if (goalMatch) {
      triggerGoalAlert(goalMatch);
    }
  };

  useEffect(() => {
    // Save original title on mount
    originalTitle.current = document.title;

    const updateScores = async () => {
      const matches = await fetchLiveScores();
      // Only update if we get a valid array
      if (Array.isArray(matches)) {
        detectChanges(matches);
        setLiveMatches(matches);
        prevMatchesRef.current = matches;
      }
    };

    // 1. Call immediately on mount
    updateScores();

    // 2. Set up polling interval (every 60 seconds)
    const intervalId = setInterval(updateScores, 60000);

    // 3. Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      stopGoalAlert();
    };
  }, []);

  // Only render if there are active live matches
  if (liveMatches.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#37003c] via-[#2a0845] to-[#37003c] text-white z-40 border-t-4 border-[#d4af37] shadow-2xl transition-all duration-500 ease-in-out transform translate-y-0 backdrop-blur-sm">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent animate-shimmer"></div>
      
      <div className="container mx-auto px-2 md:px-4 h-16 md:h-18 flex items-center relative z-10">
        
        {/* Gaffer Live Indicator */}
        <div className="flex items-center gap-3 mr-6 shrink-0">
          <div className="relative">
            <div className="w-4 h-4 bg-[#d4af37] rounded-full animate-pulse shadow-lg shadow-[#d4af37]/50"></div>
            <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-ping"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm md:text-base font-heading tracking-wider text-[#d4af37]">
              GAFFER'S LIVE
            </span>
            <span className="text-xs text-green-300 font-medium">
              ⚽ LIVE MATCHES
            </span>
          </div>
        </div>
        
        {/* Enhanced Ticker Content */}
        <div className="flex-grow overflow-hidden relative h-full flex items-center">
          <div className="flex items-center gap-12 whitespace-nowrap animate-marquee text-sm md:text-base font-medium text-blue-100 w-full hover:[animation-play-state:paused]">
            {liveMatches.map((match, idx) => (
              <div key={idx} className="flex items-center gap-4 px-6 border-r border-white/20 last:border-0 hover:bg-white/5 transition-all duration-300 py-2 rounded-lg group">
                {/* Home Team */}
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="font-black text-white text-sm group-hover:text-[#d4af37] transition-colors">
                    {match.homeTeam}
                  </span>
                  <span className="text-xs text-green-300 opacity-75">HOME</span>
                </div>
                
                {/* Enhanced Score Display */}
                <div className="relative">
                  <div className="px-4 py-2 bg-gradient-to-br from-[#d4af37] to-[#b8941f] text-black rounded-xl font-black text-sm shadow-lg shadow-[#d4af37]/30 border-2 border-[#d4af37]/50">
                    {match.score}
                  </div>
                  {/* Animated goal indicator */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <span className="text-xs text-white font-black">⚽</span>
                  </div>
                </div>
                
                {/* Away Team */}
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="font-black text-white text-sm group-hover:text-[#d4af37] transition-colors">
                    {match.awayTeam}
                  </span>
                  <span className="text-xs text-green-300 opacity-75">AWAY</span>
                </div>
                
                {/* Match Status */}
                <div className="flex flex-col items-center">
                  <span className={`text-xs font-black px-2 py-1 rounded ${
                    match.status === 'live' 
                      ? 'bg-[#d4af37] text-black animate-pulse shadow-lg' 
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {match.time}
                  </span>
                  <span className="text-xs text-[#d4af37] opacity-75 mt-1">
                    {match.status === 'live' ? 'LIVE' : 'HT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="shrink-0 ml-6 flex gap-3 border-l border-white/20 pl-6">
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              document.getElementById('fixtures')?.scrollIntoView({behavior: 'smooth'})
            }} 
            className="px-4 py-2 bg-[#d4af37] text-black rounded-lg font-black text-sm hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#d4af37]/50 flex items-center gap-2"
          >
            <i className="fas fa-chart-line"></i>
            VIEW ALL
          </button>
          <button className="px-4 py-2 border-2 border-white/30 text-white rounded-lg font-bold text-sm hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
            <i className="fas fa-bell"></i>
            ALERTS
          </button>
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out 4; /* Only 4 runs on load */
          animation-delay: 1s; /* Start after page loads */
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(212, 175, 55, 0.1) 50%, 
            transparent 100%);
        }
        
        /* Restart animation on hover for premium feel */
        .live-bar:hover .animate-shimmer {
          animation: shimmer 3s ease-in-out 2; /* 2 runs on hover */
          animation-delay: 0.2s;
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LiveBar;


