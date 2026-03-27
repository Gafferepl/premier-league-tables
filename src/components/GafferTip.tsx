
import React from 'react';

interface GafferTipProps {
  tip?: string;
}

const GafferTip: React.FC<GafferTipProps> = ({ tip }) => {
  if (!tip) return null;

  return (
    <div className="container mx-auto px-4 my-12 relative z-10">
      <div className="bg-[#1a472a] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[#d4af37] p-6 md:p-8 relative overflow-hidden max-w-4xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
        
        {/* Chalkboard Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blackboard.png')] opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/40 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
          
          {/* Icon Area */}
          <div className="shrink-0">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center border-2 border-[#d4af37] shadow-inner backdrop-blur-sm">
                <i className="fas fa-clipboard-list text-3xl md:text-4xl text-[#d4af37]"></i>
             </div>
          </div>

          {/* Text Area */}
          <div className="flex-grow text-center md:text-left">
            <h3 className="font-heading font-black text-[#d4af37] text-lg uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-2">
               <i className="fas fa-star text-xs animate-spin-slow"></i> Gaffer's Weekly Tip
            </h3>
            <p className="font-mono text-white text-sm md:text-lg leading-relaxed shadow-black drop-shadow-md">
              "{tip}"
            </p>
          </div>

          {/* Action Badge */}
          <div className="shrink-0 hidden md:block">
             <div className="bg-[#d4af37] text-[#1a472a] text-xs font-black uppercase px-3 py-1 rounded rotate-3 shadow-lg border border-white/20">
                Gameweek Tactics
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GafferTip;


