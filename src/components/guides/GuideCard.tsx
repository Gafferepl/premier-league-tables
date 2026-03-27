import React from 'react';
import { Guide, DIFFICULTY_CONFIG } from '../../data/guides/guidesData';

interface GuideCardProps {
  guide: Guide;
  isExpanded: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onMarkComplete: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  isExpanded,
  isCompleted,
  onToggle,
  onMarkComplete
}) => {
  const difficultyConfig = DIFFICULTY_CONFIG[guide.difficulty];

  return (
    <div
      className={`group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isCompleted
          ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
          : isExpanded
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-xl'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg'
      }`}
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <button
        onClick={onToggle}
        className="relative w-full p-5 flex items-start gap-4 text-left transition-transform active:scale-[0.98]"
      >
        {/* Icon with animated background */}
        <div className="relative flex-shrink-0">
          <div className={`absolute inset-0 rounded-xl ${isExpanded ? 'bg-purple-500/20 animate-pulse' : 'bg-slate-100 dark:bg-slate-700'} transition-all`} />
          <span className="relative text-4xl block p-2 transform group-hover:scale-110 transition-transform duration-300">
            {guide.icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                {guide.title}
                {isCompleted && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white animate-bounce">
                    <i className="fas fa-check text-xs"></i>
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {guide.description}
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2 items-end flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyConfig.bgClass} ${difficultyConfig.textClass} flex items-center gap-1.5 whitespace-nowrap`}>
                <span>{difficultyConfig.icon}</span>
                <span>{guide.difficulty}</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <i className="fas fa-clock"></i>
                {guide.estimatedTime}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {guide.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
            {guide.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500">
                +{guide.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <i className="fas fa-list"></i>
              {guide.sections.length} sections
            </span>
            {guide.quiz && (
              <span className="flex items-center gap-1">
                <i className="fas fa-question-circle"></i>
                Quiz
              </span>
            )}
            {guide.videoUrl && (
              <span className="flex items-center gap-1">
                <i className="fas fa-video"></i>
                Video
              </span>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex-shrink-0 self-center">
          <i className={`fas fa-chevron-down text-slate-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}></i>
        </div>
      </button>

      {/* Expanded content - will be handled by parent */}
      {isExpanded && (
        <div className="relative border-t-2 border-slate-200 dark:border-slate-700">
          {/* Content placeholder - actual content rendered by GuideContent component */}
          <div className="p-6">
            {/* This will be filled by the parent component */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideCard;


