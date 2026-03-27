
import React from 'react';

const SkeletonWinProb: React.FC = () => {
  return (
    <div className="container mx-auto px-4 mb-16 relative z-10 animate-pulse">
      <div className="text-center mb-8">
         <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-2"></div>
         <div className="h-1 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between">
           <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
           <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6">
              <div className="flex justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                 </div>
                 <div className="w-32 h-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                 <div className="flex items-center gap-2">
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                 </div>
              </div>
              <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonWinProb;


