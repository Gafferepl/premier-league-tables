
import React from 'react';

const SkeletonSackZone: React.FC = () => {
  return (
    <div className="container mx-auto px-4 mb-16 relative z-10 animate-pulse">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border-t-4 border-red-600/30 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-2">
           <div className="flex justify-between mb-2">
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-6 w-24 bg-red-100 dark:bg-slate-700 rounded"></div>
           </div>
           <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
           {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 grid grid-cols-12 gap-4 items-center">
                 {/* Manager */}
                 <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                    <div className="space-y-2 w-full">
                       <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                       <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                 </div>
                 {/* Bar */}
                 <div className="col-span-7 sm:col-span-5 space-y-2">
                    <div className="flex justify-between">
                       <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                       <div className="h-3 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                 </div>
                 {/* Odds */}
                 <div className="hidden sm:block sm:col-span-3 pl-4 border-l border-slate-100 dark:border-slate-700">
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonSackZone;


