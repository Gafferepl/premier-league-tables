
import React from 'react';

const SkeletonNews: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-100 dark:bg-[#0f172a]">
      <div className="container mx-auto px-4">
        {/* Title Skeleton */}
        <div className="flex justify-center mb-12">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
        </div>

        {/* Banner Skeleton */}
        <div className="max-w-4xl mx-auto mb-12 h-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>

        {/* Carousel Cards */}
        <div className="flex gap-6 overflow-hidden pb-8">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="min-w-[300px] md:min-w-[400px] h-[450px] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse relative p-6 flex flex-col justify-end border border-slate-300 dark:border-slate-700"
            >
              {/* Badge */}
              <div className="absolute top-6 left-6 w-24 h-6 bg-slate-300 dark:bg-slate-700 rounded"></div>
              
              {/* Text Lines */}
              <div className="space-y-3 mb-6">
                <div className="w-20 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
                <div className="w-3/4 h-8 bg-slate-300 dark:bg-slate-700 rounded"></div>
                <div className="w-full h-8 bg-slate-300 dark:bg-slate-700 rounded"></div>
              </div>

              {/* Button */}
              <div className="w-full h-12 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkeletonNews;


