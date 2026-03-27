
import React from 'react';

const SkeletonWeather: React.FC = () => {
  return (
    <section className="py-12 bg-slate-900 border-y-4 border-[#d4af37]/30 z-20 animate-pulse">
      <div className="container mx-auto px-4">
        
        {/* Header & Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="h-8 w-64 bg-slate-800 rounded"></div>
          <div className="h-10 w-full md:w-64 bg-slate-800 rounded border border-slate-700"></div>
        </div>

        {/* Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a472a]/50 rounded-xl p-8 shadow-2xl border-2 border-white/10 min-h-[300px] flex items-center justify-center">
             <div className="grid md:grid-cols-2 gap-12 w-full">
                <div className="flex flex-col items-center">
                   <div className="h-4 w-32 bg-slate-700/50 rounded mb-4"></div>
                   <div className="h-16 w-32 bg-slate-700/50 rounded mb-4"></div>
                   <div className="flex gap-4">
                      <div className="h-6 w-20 bg-slate-700/50 rounded"></div>
                      <div className="h-6 w-20 bg-slate-700/50 rounded"></div>
                   </div>
                </div>
                <div className="bg-white/5 rounded-lg p-6 h-48 flex flex-col justify-center space-y-4">
                   <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
                   <div className="h-6 w-full bg-slate-700/50 rounded"></div>
                   <div className="h-6 w-3/4 bg-slate-700/50 rounded"></div>
                   <div className="h-px w-full bg-white/10 my-4"></div>
                   <div className="h-4 w-1/2 bg-slate-700/50 rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkeletonWeather;


