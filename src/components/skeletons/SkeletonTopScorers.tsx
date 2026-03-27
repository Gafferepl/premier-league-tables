
import React from 'react';

const SkeletonTopScorers: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative animate-pulse">
      {/* Header Row */}
      <div className="grid grid-cols-12 bg-slate-100 dark:bg-[#0f172a] py-4 px-6 border-b border-slate-200 dark:border-slate-700">
        <div className="col-span-1 h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
        <div className="col-span-5 h-3 bg-slate-300 dark:bg-slate-600 rounded mx-4"></div>
        <div className="col-span-2 h-3 bg-slate-300 dark:bg-slate-600 rounded hidden md:block"></div>
        <div className="col-span-4 h-3 bg-slate-300 dark:bg-slate-600 rounded ml-auto w-1/2"></div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 items-center py-4 px-6">
            {/* Rank */}
            <div className="col-span-1">
              <div className="w-6 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>

            {/* Player Info with Kit Silhouette */}
            <div className="col-span-5 md:col-span-4 flex items-center gap-4">
              <div className="relative w-12 h-14 shrink-0">
                {/* Hanger */}
                <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600 mx-auto mb-1 rounded-full"></div>
                {/* Kit Body */}
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 mx-auto rounded-t-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded md:hidden"></div>
              </div>
            </div>

            {/* Team Logo */}
            <div className="col-span-2 hidden md:flex justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Goals */}
            <div className="col-span-2 text-center flex justify-center">
              <div className="w-12 h-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Breakdown */}
            <div className="col-span-4 md:col-span-3 flex justify-end gap-2">
              <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTopScorers;


