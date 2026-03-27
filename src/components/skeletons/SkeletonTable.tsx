
import React from 'react';

const SkeletonTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-4 md:p-6 min-h-[600px] animate-pulse relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="w-32 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </div>

      {/* Table Header */}
      <div className="flex gap-4 mb-4 px-2">
        <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded hidden sm:block"></div>
        <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded shrink-0"></div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
              <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="w-6 h-5 bg-slate-200 dark:bg-slate-700 rounded shrink-0"></div>
            <div className="w-6 h-5 bg-slate-200 dark:bg-slate-700 rounded shrink-0 hidden sm:block"></div>
            <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded shrink-0"></div>
          </div>
        ))}
      </div>
      
      {/* Chalkboard Dust Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blackboard.png')] opacity-5 pointer-events-none"></div>
    </div>
  );
};

export default SkeletonTable;


