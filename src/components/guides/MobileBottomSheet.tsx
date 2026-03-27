import React, { useEffect, useRef } from 'react';
import { GUIDE_CATEGORIES, GuideCategory } from '../../data/guides/guidesData';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  completedCount: Record<string, number>;
  totalCount: Record<string, number>;
}

const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategorySelect,
  completedCount,
  totalCount
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  // Handle swipe to close
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;
      
      if (diff > 0 && sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${diff}px)`;
      }
    };

    const handleTouchEnd = () => {
      const diff = currentY.current - startY.current;
      
      if (diff > 100) {
        onClose();
      }
      
      if (sheetRef.current) {
        sheetRef.current.style.transform = '';
      }
    };

    const sheet = sheetRef.current;
    if (sheet) {
      sheet.addEventListener('touchstart', handleTouchStart);
      sheet.addEventListener('touchmove', handleTouchMove);
      sheet.addEventListener('touchend', handleTouchEnd);

      return () => {
        sheet.removeEventListener('touchstart', handleTouchStart);
        sheet.removeEventListener('touchmove', handleTouchMove);
        sheet.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = Object.values(GUIDE_CATEGORIES).sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Browse Categories
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <i className="fas fa-times text-slate-600 dark:text-slate-400"></i>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-4">
          <div className="space-y-3">
            {categories.map((category) => {
              const completed = completedCount[category.id] || 0;
              const total = totalCount[category.id] || 0;
              const progress = total > 0 ? (completed / total) * 100 : 0;
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategorySelect(category.id);
                    onClose();
                  }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 transform active:scale-95 ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                      {category.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h4 className="font-black text-slate-900 dark:text-white mb-1">
                        {category.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {category.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${category.gradient} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {completed}/{total}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <i className="fas fa-chevron-right text-slate-400 flex-shrink-0"></i>
                  </div>
                </button>
              );
            })}
          </div>

          {/* View All Button */}
          <button
            onClick={() => {
              onCategorySelect('');
              onClose();
            }}
            className="w-full mt-4 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 font-bold">
              <i className="fas fa-th-large"></i>
              <span>View All Guides</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileBottomSheet;


