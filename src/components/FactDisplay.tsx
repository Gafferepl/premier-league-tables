
import React, { useState, useEffect } from 'react';
import { FACTS } from '../constants';
import { Fact } from '../types';

const FactDisplay: React.FC = () => {
  // Fact of the day logic - Random on mount, moved from Hero.tsx
  const [todaysFact, setTodaysFact] = useState<Fact>(FACTS[0]);

  useEffect(() => {
    // Select a random fact when component mounts (page refresh)
    const randomIndex = Math.floor(Math.random() * FACTS.length);
    setTodaysFact(FACTS[randomIndex]);
  }, []);

  return (
    <div className="container mx-auto px-4 mb-16 md:mb-24 relative z-10">
      {/* New, eye-catching design for its new location */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl border border-warning/50 shadow-xl flex items-start gap-4 transform rotate-1 group hover:rotate-0 transition-all duration-300">
        <div className="shrink-0 bg-warning/20 p-3 rounded-full border border-warning/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <i className="fas fa-lightbulb text-warning text-2xl drop-shadow-md"></i>
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold mb-2 text-primary dark:text-white drop-shadow-sm">The Gaffer's Fact of the Day</h3>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2 leading-relaxed italic">"{todaysFact.fact}"</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 opacity-90">{todaysFact.context}</p>
        </div>
      </div>
    </div>
  );
};

export default FactDisplay;


