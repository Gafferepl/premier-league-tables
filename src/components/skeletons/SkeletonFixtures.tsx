
import React from 'react';

const SkeletonFixtures: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 min-h-[400px] animate-pulse relative">
      {/* Key */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex gap-4">
        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 flex flex-col md:flex-row items-center gap-4">
            {/* Date */}
            <div className="md:w-28 shrink-0 flex flex-col gap-2 items-center md:items-start">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>

            {/* Teams */}
            <div className="flex-1 flex items-center justify-center gap-3 w-full">
              {/* Home */}
              <div className="flex-1 flex justify-end items-center gap-2">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded hidden sm:block"></div>
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
              </div>

              {/* VS Box */}
              <div className="w-12 h-8 rounded bg-slate-200 dark:bg-slate-700 shrink-0"></div>

              {/* Away */}
              <div className="flex-1 flex justify-start items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded hidden sm:block"></div>
              </div>
            </div>

            {/* Time */}
            <div className="md:w-24 flex justify-end">
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonFixtures;


