
import React from 'react';

const SkeletonStats: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative h-[500px] animate-pulse">
      {/* Header */}
      <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>

      {/* Scoreboard Area */}
      <div className="p-8 bg-slate-200 dark:bg-slate-800 h-48 flex justify-between items-center px-12">
        {/* Home */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="w-24 h-5 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
        
        {/* Score */}
        <div className="w-32 h-16 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>

        {/* Away */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="w-24 h-5 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
      </div>

      {/* Stats Bars */}
      <div className="p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonStats;


