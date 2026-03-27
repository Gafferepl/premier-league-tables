
import React, { useState, useEffect } from 'react';

// Update: Add props interface for the new gameweek prop
interface HeroProps {
  currentGameweek: number | null; 
}

const getSeasonString = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11 (Jan is 0)

  // Standard Football Season Logic:
  // Season starts in July/August.
  // If we are in Jan (0) to June (5), the season started the previous year.
  // If we are in July (6) to Dec (11), the season started this year.
  
  const startYear = currentMonth < 6 ? currentYear - 1 : currentYear;
  const endYear = startYear + 1;
  const shortEndYear = endYear.toString().slice(-2);

  return `${startYear}/${shortEndYear}`;
};

const Hero: React.FC<HeroProps> = ({ currentGameweek }) => {
  const seasonString = getSeasonString();
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 100);
    const timer2 = setTimeout(() => setShowLine2(true), 1200);
    const timer3 = setTimeout(() => setShowLine3(true), 2300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <header className="relative pt-32 pb-16 md:pt-48 md:pb-24 text-white overflow-hidden min-h-[600px] flex items-center">
      
      {/* LAYER 1: Enhanced Gradient Background with Subtle Pattern */}
      <div className="absolute inset-0 z-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#37003c] via-[#2a0845] to-[#37003c]"></div>
        
        {/* Subtle football field pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px),
              repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)
            `,
            backgroundSize: '70px 70px',
            animation: 'float 20s ease-in-out infinite'
          }}></div>
        </div>
        
        {/* Animated gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 animate-pulse-slow"></div>
      </div>
      
      {/* LAYER 2: Floating Football Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Floating football icon */}
        <div className="absolute top-20 left-10 text-white/5 animate-float-slow">
          <i className="fas fa-futbol text-8xl"></i>
        </div>
        <div className="absolute bottom-20 right-10 text-white/5 animate-float-delayed">
          <i className="fas fa-futbol text-6xl"></i>
        </div>
      </div>

      {/* LAYER 3: Enhanced Light Effects */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top left ambient light */}
        <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-gradient-to-br from-blue-500/10 to-transparent blur-[120px] opacity-60 transform -translate-x-1/4 -translate-y-1/4 animate-pulse-slow"></div>
        
        {/* Bottom right accent light */}
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-purple-500/10 to-transparent blur-[100px] opacity-50 transform translate-x-1/4 translate-y-1/4 animate-pulse-delayed"></div>
        
        {/* Center spotlight effect */}
        <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 bg-gradient-to-r from-accent/5 to-blue-500/5 rounded-full blur-[80px] opacity-40 transform -translate-x-1/2 -translate-y-1/2 animate-float"></div>
      </div>

      {/* LAYER 4: Hero Content */}
      <div className="container mx-auto px-4 relative z-20 flex flex-col md:flex-row justify-between items-end">
        
        {/* Main Title and Subtitle */}
        <div className="max-w-3xl mb-10 md:mb-0">
          <div className="inline-block px-4 py-1 bg-gradient-to-r from-accent/90 to-blue-600/90 border border-accent/50 rounded-full text-white text-sm font-bold mb-6 backdrop-blur-sm shadow-[0_0_20px_rgba(255,64,129,0.6)] animate-pulse-slow">
              LIVE UPDATES 24/7
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4 drop-shadow-2xl">
            Premier League Tables.com{" "}
            <span className="block md:inline italic relative" style={{ zIndex: 50 }}>
              <svg 
                className="inline-block relative" 
                width="280" 
                height="100" 
                viewBox="0 0 280 100"
                style={{ verticalAlign: 'middle', zIndex: 50, position: 'relative' }}
              >
                <defs>
                  <linearGradient id="seasonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff4081" />
                    <stop offset="100%" stopColor="#2196f3" />
                  </linearGradient>
                </defs>
                <text 
                  x="10" 
                  y="70" 
                  fill="url(#seasonGradient)" 
                  fontSize="60" 
                  fontWeight="bold" 
                  fontFamily="Inter, system-ui, -apple-system, sans-serif"
                  style={{ textRendering: 'geometricPrecision', zIndex: 51, position: 'relative' }}
                >
                  {seasonString}
                </text>
              </svg>
            </span>
          </h1>
          <div className="text-xl md:text-2xl text-blue-100 font-medium max-w-2xl drop-shadow-lg mb-8">
            <div 
              style={{
                opacity: showLine1 ? 1 : 0,
                transform: showLine1 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              Oi! This is premium fantasy football coaching.
            </div>
            <div 
              className="mt-2"
              style={{
                opacity: showLine2 ? 1 : 0,
                transform: showLine2 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              The <span style={{
                background: 'linear-gradient(120deg, transparent 0%, rgba(255,64,129,0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: showLine2 ? 'toolHighlight 2.5s ease-in-out 0.6s infinite' : 'none',
                borderRadius: '4px',
                padding: '0 6px',
                fontWeight: 600
              }}>fantasy football tools</span> other sites are too scared to build.
            </div>
            <div 
              className="mt-2"
              style={{
                opacity: showLine3 ? 1 : 0,
                transform: showLine3 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              Time to turn your mini-league into a one-horse race.
            </div>
          </div>
           <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 mb-6 border border-accent/30">
            <p className="text-white font-bold text-lg mb-2">
              "Oi! Your rivals are playing checkers. The Gaffer's playing chess."
            </p>
            <p className="text-blue-200 text-sm">
              Get proper analysis, tactical insights, and the edge you need to dominate your fantasy league.
            </p>
          </div>
           <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => document.getElementById('newsletter')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-gradient-to-r from-accent to-[#e91e63] hover:from-[#e91e63] hover:to-accent text-white font-bold rounded-lg shadow-[0_4px_20px_rgba(255,64,129,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,64,129,0.6)] flex items-center justify-center gap-2 group border border-accent/50">
                <span>Free Newsletter</span>
                <i className="fas fa-trophy group-hover:translate-x-1 transition-transform"></i>
              </button>
              <button onClick={() => document.getElementById('squad-builder')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-black/40 backdrop-blur-md border border-white/30 text-white hover:bg-black/60 font-bold rounded-lg shadow-lg transition-all hover:-translate-y-1 hover:border-white/50">
                Try The Tools
              </button>
            </div>
        </div>

        {/* Enhanced Current Gameweek Indicator */}
        <div className="mt-6 flex justify-end shrink-0">
           <div className="text-center bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md p-4 rounded-xl border border-white/20 inline-block shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
             <p className="text-xs text-blue-300 uppercase tracking-widest font-bold mb-2 drop-shadow-md">Current Gameweek</p>
             <svg 
               className="inline-block" 
               width="120" 
               height="50" 
               viewBox="0 0 120 50"
               style={{ verticalAlign: 'middle' }}
             >
               <defs>
                 <linearGradient id="gameweekGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#ff4081" />
                   <stop offset="100%" stopColor="#2196f3" />
                 </linearGradient>
               </defs>
               <text 
                 x="60" 
                 y="40" 
                 fill="url(#gameweekGradient)"
                 fontSize="36"
                 fontWeight="bold"
                 fontFamily="Inter, system-ui, -apple-system, sans-serif"
                 textAnchor="middle"
                 style={{ textRendering: 'geometricPrecision' }}
               >
                 {currentGameweek ? `GW ${currentGameweek}` : 'N/A'}
               </text>
             </svg>
           </div>
        </div>

      </div>

      {/* Custom animations using CSS classes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes toolHighlight {
          0%, 100% {
            background-position: -100% 0;
            box-shadow: 0 0 20px rgba(255,64,129,0.3);
          }
          50% {
            background-position: 100% 0;
            box-shadow: 0 0 30px rgba(255,64,129,0.6);
          }
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Hero;


