import React from 'react';

// Update: Add props interface for the new gameweek prop
interface HeroProps {
  currentGameweek: number | null; 
}

const getSeasonString = () => {
  // BRANDING REQUIREMENT:
  // Explicitly return "2025/26" as requested by the user.
  // This bypasses any date math issues or year offsets.
  return "2025/26";
};

const Hero: React.FC<HeroProps> = ({ currentGameweek }) => {
  const seasonString = getSeasonString();

  return (
    <header className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-hero-gradient text-white overflow-hidden min-h-[600px] flex items-center">
      
      {/* LAYER 1: Background Color (Provided by bg-hero-gradient class on header above) */}

      {/* LAYER 2: The Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-web.svg" 
          alt="Premier League Stadium Atmosphere" 
          className="w-full h-full object-cover animate-ken-burns" 
          style={{ objectPosition: 'center 40%' }}
          onError={(e) => {
            // Fallback if image is missing
            e.currentTarget.onerror = null; 
            e.currentTarget.src = "https://images.unsplash.com/photo-1522778119026-d647f0565c00?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
          }}
        />
        {/* Darkening Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-75"></div>
      </div>
      
      {/* LAYER 3: Decorative Light Streaks (for visual depth) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-white/5 blur-[100px] opacity-20 transform -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-accent/5 blur-[100px] opacity-20 transform translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* LAYER 4: Stadium Light Glare (Top Right) */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yellow-300/10 rounded-full blur-[150px] transform translate-x-1/3 -translate-y-1/3 z-20 pointer-events-none"></div>

      {/* LAYER 5: Hero Content - Title and Text */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-end">
        
        {/* Main Title and Subtitle */}
        <div className="max-w-3xl mb-10 md:mb-0">
          <div className="inline-block px-4 py-1 bg-accent/90 border border-accent/50 rounded-full text-white text-sm font-bold mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(255,64,129,0.5)] animate-pulse-slow">
              LIVE UPDATES 24/7
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4 drop-shadow-lg">
            PREMIER LEAGUE{" "}
            <span className="text-accent italic block md:inline">{seasonString}</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-medium max-w-2xl drop-shadow-md mb-8">
            We wear our unofficial badge like a medal. No press badge, no PR filter—just raw football brilliance in unofficial packaging.
          </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => document.getElementById('league-table')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-accent hover:bg-[#f50057] text-white font-bold rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group border border-accent/50">
                <span>View Table</span>
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
              <button onClick={() => document.getElementById('fixtures')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-black/40 backdrop-blur-md border border-white/30 text-white hover:bg-black/60 font-bold rounded-lg shadow-lg transition-all hover:-translate-y-1">
                Check Fixtures
              </button>
            </div>
        </div>

        {/* Current Gameweek Indicator - Now uses the prop */}
        <div className="mt-6 flex justify-end shrink-0">
           <div className="text-right bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 inline-block shadow-lg">
             <p className="text-xs text-blue-300 uppercase tracking-widest font-bold mb-1 drop-shadow-md">Current Gameweek</p>
             <div className="text-3xl font-heading font-bold drop-shadow-lg text-white">
               {/* Updated: Display the dynamic prop value */}
               {currentGameweek ? `GW ${currentGameweek}` : 'N/A'} 
             </div>
           </div>
        </div>

      </div>
    </header>
  );
};

export default Hero;