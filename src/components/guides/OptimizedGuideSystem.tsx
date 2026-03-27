import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { GUIDES, GUIDE_CATEGORIES, Guide } from '../../data/guides/guidesData';
import MobileBottomSheet from './MobileBottomSheet';
import '../../styles/guide-animations.css';

// Lazy load heavy components
const GuideCard = lazy(() => import('./GuideCard'));
const GuideContent = lazy(() => import('./GuideContent'));

interface OptimizedGuideSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const OptimizedGuideSystem: React.FC<OptimizedGuideSystemProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [completedGuides, setCompletedGuides] = useState<Set<string>>(new Set());
  const [quizResults, setQuizResults] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [bookmarkedGuides, setBookmarkedGuides] = useState<Set<string>>(new Set());
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem('fpl_completed_guides');
    const savedBookmarks = localStorage.getItem('fpl_bookmarked_guides');
    const savedQuizzes = localStorage.getItem('fpl_quiz_results');

    if (savedCompleted) setCompletedGuides(new Set(JSON.parse(savedCompleted)));
    if (savedBookmarks) setBookmarkedGuides(new Set(JSON.parse(savedBookmarks)));
    if (savedQuizzes) setQuizResults(JSON.parse(savedQuizzes));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (completedGuides.size > 0) {
      localStorage.setItem('fpl_completed_guides', JSON.stringify(Array.from(completedGuides)));
    }
  }, [completedGuides]);

  useEffect(() => {
    if (bookmarkedGuides.size > 0) {
      localStorage.setItem('fpl_bookmarked_guides', JSON.stringify(Array.from(bookmarkedGuides)));
    }
  }, [bookmarkedGuides]);

  useEffect(() => {
    if (Object.keys(quizResults).length > 0) {
      localStorage.setItem('fpl_quiz_results', JSON.stringify(quizResults));
    }
  }, [quizResults]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filtered and sorted guides
  const filteredGuides = useMemo(() => {
    return GUIDES.filter(guide => {
      const matchesSearch = searchTerm === '' || 
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || guide.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || guide.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  // Category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { completed: number; total: number }> = {};
    
    Object.keys(GUIDE_CATEGORIES).forEach(catId => {
      const categoryGuides = GUIDES.filter(g => g.category === catId);
      const completed = categoryGuides.filter(g => completedGuides.has(g.id)).length;
      stats[catId] = { completed, total: categoryGuides.length };
    });
    
    return stats;
  }, [completedGuides]);

  const completionRate = useMemo(() => {
    return Math.round((completedGuides.size / GUIDES.length) * 100);
  }, [completedGuides]);

  const markComplete = (guideId: string) => {
    setCompletedGuides(prev => new Set([...prev, guideId]));
  };

  const toggleBookmark = (guideId: string) => {
    setBookmarkedGuides(prev => {
      const newSet = new Set(prev);
      if (newSet.has(guideId)) {
        newSet.delete(guideId);
      } else {
        newSet.add(guideId);
      }
      return newSet;
    });
  };

  const handleQuizAnswer = (guideId: string, answerIndex: number) => {
    const guide = GUIDES.find(g => g.id === guideId);
    if (guide?.quiz) {
      setQuizResults(prev => ({ ...prev, [guideId]: answerIndex }));
      if (answerIndex === guide.quiz.correct) {
        markComplete(guideId);
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative flex w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 animate-slideInRight">
        
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-xl">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black">
                  📚 FPL Mastery
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              {/* Progress */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">Your Progress</span>
                  <span className="text-2xl font-black">{completionRate}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <p className="text-xs mt-2 opacity-90">
                  {completedGuides.size} of {GUIDES.length} guides completed
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <i className="fas fa-times text-xs text-slate-600 dark:text-slate-400"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {Object.values(GUIDE_CATEGORIES).sort((a, b) => a.order - b.order).map(category => {
                  const stats = categoryStats[category.id];
                  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                  const isSelected = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-lg'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center text-xl shadow-md`}>
                          {category.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-black text-slate-900 dark:text-white text-sm">
                            {category.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {stats.total} guides
                          </p>
                        </div>
                        {stats.completed > 0 && (
                          <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                            {stats.completed}/{stats.total}
                          </div>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${category.gradient} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                  {selectedCategory 
                    ? GUIDE_CATEGORIES[selectedCategory].title 
                    : 'All Guides'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedCategory 
                    ? GUIDE_CATEGORIES[selectedCategory].description 
                    : `${filteredGuides.length} guides to master FPL`}
                </p>
              </div>
              
              {isMobile && (
                <button
                  onClick={() => setShowMobileSheet(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-filter"></i>
                  Filter
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
                  <span className="text-sm font-bold text-green-800 dark:text-green-200">
                    {completedGuides.size} Completed
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-300 dark:border-purple-700">
                <div className="flex items-center gap-2">
                  <i className="fas fa-bookmark text-purple-600 dark:text-purple-400"></i>
                  <span className="text-sm font-bold text-purple-800 dark:text-purple-200">
                    {bookmarkedGuides.size} Bookmarked
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-300 dark:border-blue-700">
                <div className="flex items-center gap-2">
                  <i className="fas fa-search text-blue-600 dark:text-blue-400"></i>
                  <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                    {filteredGuides.length} Found
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guides List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredGuides.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-6">
                  <i className="fas fa-search text-6xl text-purple-400"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  No guides found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                    setSelectedDifficulty(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-5xl mx-auto">
                <Suspense fallback={
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                }>
                  {filteredGuides.map(guide => (
                    <div key={guide.id} className="relative">
                      <GuideCard
                        guide={guide}
                        isExpanded={expandedGuide === guide.id}
                        isCompleted={completedGuides.has(guide.id)}
                        onToggle={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                        onMarkComplete={() => markComplete(guide.id)}
                      />
                      
                      {expandedGuide === guide.id && (
                        <div className="mt-[-2px]">
                          <GuideContent
                            guide={guide}
                            onComplete={() => markComplete(guide.id)}
                            onNavigate={handleNavigate}
                            quizAnswer={quizResults[guide.id]}
                            onQuizAnswer={(idx) => handleQuizAnswer(guide.id, idx)}
                          />
                        </div>
                      )}

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(guide.id)}
                        className={`absolute top-5 right-16 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                          bookmarkedGuides.has(guide.id)
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-purple-500 border-2 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <i className={`fas fa-bookmark ${bookmarkedGuides.has(guide.id) ? 'animate-bounce' : ''}`}></i>
                      </button>
                    </div>
                  ))}
                </Suspense>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
        {isMobile && (
          <MobileBottomSheet
            isOpen={showMobileSheet}
            onClose={() => setShowMobileSheet(false)}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            completedCount={Object.fromEntries(
              Object.entries(categoryStats).map(([k, v]) => [k, v.completed])
            )}
            totalCount={Object.fromEntries(
              Object.entries(categoryStats).map(([k, v]) => [k, v.total])
            )}
          />
        )}
      </div>
    </div>
  );
};

export default OptimizedGuideSystem;


