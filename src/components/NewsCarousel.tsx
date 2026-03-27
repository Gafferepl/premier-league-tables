
import React, { useState, useRef, useEffect } from 'react';
import { NewsItem } from '../../types';
import { AFFILIATE_LINK } from '../constants';
import DynamicNewsCard from './DynamicNewsCard';

interface NewsCarouselProps {
  data?: NewsItem[];
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ data }) => {
  const items = data && data.length > 0 ? data : [];
  const isLoading = items.length === 0;
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || items.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 400, behavior: 'smooth' });
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  return (
    <section id="news-carousel" className="py-16 md:py-24 bg-section-gradient dark:bg-section-gradient-dark relative transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
            Latest Headlines
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
          </h2>
        </div>

        <a href={AFFILIATE_LINK} target="_blank" rel="noopener noreferrer" className="block relative group mb-12 max-w-4xl mx-auto">
          <div className="bg-primary text-white rounded-lg shadow-lg flex items-center relative border-l-8 border-accent transform group-hover:scale-[1.01] transition-transform duration-300 overflow-visible">
            <div className="w-24 md:w-32 h-32 flex-shrink-0 relative">
               <div className="absolute bottom-0 left-0 md:-left-4 z-20 w-40 md:w-52 max-w-none pointer-events-none">
                  <img 
                    src="/says.svg" 
                    alt="The Gaffer Says" 
                    className="w-full h-auto object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300 origin-bottom"
                    style={{ maxHeight: '140%' }}
                    loading="lazy"
                    onError={(e) => { 
  e.currentTarget.style.display='none'; 
  const parent = e.currentTarget.parentElement;
  if (parent) {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'h-full flex items-center justify-center';
    const icon = document.createElement('i');
    icon.className = 'fas fa-bullhorn text-4xl text-warning transform -rotate-12';
    fallbackDiv.appendChild(icon);
    parent.appendChild(fallbackDiv);
  }
}} 
                  />
               </div>
               <div className="absolute inset-0 bg-blue-900 rounded-l"></div>
            </div>
            <div className="p-4 md:p-6 flex-grow relative z-10">
              <p className="font-heading font-bold text-warning text-xs md:text-sm uppercase tracking-wider mb-1">The Gaffer Says:</p>
              <p className="text-base md:text-xl font-medium italic pr-4">"I don't read the papers. I just wrap my chips in them."</p>
            </div>
             <div className="absolute right-4 top-4 text-white/20 group-hover:text-white/40 transition-colors">
               <i className="fas fa-external-link-alt text-sm"></i>
            </div>
          </div>
        </a>

        {isLoading ? (
           <div className="flex gap-6 overflow-hidden pb-8">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="min-w-[300px] md:min-w-[400px] h-[450px] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse relative p-6 flex flex-col justify-end">
                   <div className="w-24 h-6 bg-slate-300 dark:bg-slate-700 rounded mb-4 absolute top-6 left-6"></div>
                   <div className="w-3/4 h-8 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
                   <div className="w-full h-4 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
                   <div className="w-2/3 h-4 bg-slate-300 dark:bg-slate-700 rounded mb-6"></div>
                   <div className="w-full h-12 bg-slate-300 dark:bg-slate-700 rounded"></div>
                </div>
             ))}
           </div>
        ) : (
        <div 
          className="relative mb-16 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-accent text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -ml-6 md:-ml-0 shadow-lg"
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-accent text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -mr-6 md:-mr-0 shadow-lg"
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <a 
                key={item.id || Math.random()} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`min-w-[300px] md:min-w-[400px] h-[450px] snap-center relative rounded-2xl overflow-hidden group/card cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-2 ${item.isAdvanced ? 'border-4 border-yellow-400' : ''}`}
              >
                {/* Replaced Static Image with Dynamic News Card */}
                <div className="absolute inset-0 bg-slate-900 group-hover/card:scale-105 transition-transform duration-700">
                   <DynamicNewsCard 
                      title={item.title} 
                      source={item.source} 
                      className="opacity-90 group-hover/card:opacity-100 transition-opacity duration-300"
                   />
                </div>

                <div className={`absolute inset-0 bg-gradient-to-t ${item.isAdvanced ? 'from-yellow-900/90 via-black/50' : 'from-black via-black/70'} to-transparent`}></div>
                
                {item.isAdvanced && (
                   <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                )}

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                   
                   <div className="absolute top-4 left-4 flex items-center gap-2">
                      {item.isAdvanced ? (
                         <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider animate-pulse flex items-center gap-1">
                            <i className="fas fa-chart-line"></i> Stat Attack
                         </span>
                      ) : (
                         <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                           Breaking
                         </span>
                      )}
                      
                      <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20">
                        {item.source}
                      </span>
                   </div>

                   <div className="mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                        <i className="far fa-clock text-accent"></i> {item.time}
                      </div>
                      <h3 className={`text-2xl font-heading font-bold text-white leading-tight mb-3 transition-colors drop-shadow-md ${item.isAdvanced ? 'text-yellow-400' : 'group-hover/card:text-accent'}`}>
                        {item.title}
                      </h3>
                      
                      {item.quote ? (
                         <div className="relative pl-4 border-l-2 border-accent mb-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover/card:translate-y-0">
                            <p className="text-sm text-gray-200 italic font-medium">"{item.quote}"</p>
                         </div>
                      ) : (
                         <p className="text-sm text-gray-300 line-clamp-3 mb-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover/card:translate-y-0">
                           {item.summary}
                         </p>
                      )}
                   </div>

                   <div className="flex items-center gap-3">
                      <div className={`w-full py-3 backdrop-blur-sm border rounded-lg text-center font-bold text-white text-sm transition-all flex items-center justify-center gap-2 ${item.isAdvanced ? 'bg-yellow-600/20 border-yellow-400/50 group-hover/card:bg-yellow-500 group-hover/card:border-yellow-500 text-yellow-100' : 'bg-white/10 border-white/20 group-hover/card:bg-accent group-hover/card:border-accent'}`}>
                         {item.isAdvanced ? 'View Analysis' : 'Read Full Story'} <i className="fas fa-arrow-right text-xs transform group-hover/card:translate-x-1 transition-transform"></i>
                      </div>
                   </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        )}

        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
           <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-heading font-bold text-primary dark:text-white uppercase tracking-wide text-sm">
                 <i className="fas fa-rss text-accent mr-2"></i> Breaking News Feed
              </h3>
              <span className="text-xs text-slate-500">Top Stories</span>
           </div>
           <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading ? (
                 [...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex gap-4 animate-pulse">
                       <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0"></div>
                       <div className="flex-grow space-y-2">
                          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded"></div>
                       </div>
                    </div>
                 ))
              ) : (
              items.map((item, idx) => (
                 <a 
                   key={idx} 
                   href={item.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={`block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group ${item.isAdvanced ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}
                 >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                       {/* Replaced Small Image with Compact Dynamic Card */}
                       <div className={`w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden relative ${item.isAdvanced ? 'border border-yellow-400' : ''}`}>
                          <DynamicNewsCard title={item.title} source={item.source} size="small" />
                       </div>
                       
                       <div className="flex-grow">
                          <h4 className={`font-bold text-base transition-colors flex items-center gap-2 ${item.isAdvanced ? 'text-yellow-700 dark:text-yellow-400' : 'text-dark dark:text-white group-hover:text-accent'}`}>
                             {item.title}
                             {item.isAdvanced && <i className="fas fa-star text-xs text-yellow-500"></i>}
                          </h4>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                             {item.quote ? (
                                <span className="italic text-slate-600 dark:text-slate-300">"{item.quote}"</span>
                             ) : (
                                <span className="line-clamp-1">{item.summary}</span>
                             )}
                          </div>
                       </div>
                       <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0 md:w-32 md:justify-end">
                          <span>{item.time}</span>
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                             {item.source}
                          </span>
                       </div>
                    </div>
                 </a>
              )))}
           </div>
        </div>

      </div>
    </section>
  );
};

export default NewsCarousel;


