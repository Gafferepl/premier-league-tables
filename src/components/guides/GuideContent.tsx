import React, { useState } from 'react';
import { Guide } from '../../data/guides/guidesData';

interface GuideContentProps {
  guide: Guide;
  onComplete: () => void;
  onNavigate: (sectionId: string) => void;
  quizAnswer?: number;
  onQuizAnswer: (answerIndex: number) => void;
}

const GuideContent: React.FC<GuideContentProps> = ({
  guide,
  onComplete,
  onNavigate,
  quizAnswer,
  onQuizAnswer
}) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Sections */}
      {guide.sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
              {idx + 1}
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              {section.heading}
            </h4>
          </div>

          {/* Points */}
          <ul className="space-y-3 ml-13">
            {section.points.map((point, pointIdx) => (
              <li
                key={pointIdx}
                className="flex items-start gap-3 group"
              >
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:scale-150 transition-transform duration-300" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* Interactive Tip */}
          {section.interactiveTip && (
            <div className="ml-13 relative overflow-hidden rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 animate-bounce">💡</span>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    Pro Tip
                  </div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    {section.interactiveTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Example */}
          {section.example && (
            <div className="ml-13 relative overflow-hidden rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 group hover:shadow-lg transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-start gap-3">
                <i className="fas fa-lightbulb text-2xl text-amber-500 flex-shrink-0"></i>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                    Real Example
                  </div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    {section.example}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Code Snippet */}
          {section.codeSnippet && (
            <div className="ml-13 rounded-xl bg-slate-900 p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
                <code>{section.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      ))}

      {/* Quiz Section */}
      {guide.quiz && (
        <div className="mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg">
              <i className="fas fa-question text-lg"></i>
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Test Your Knowledge
            </h4>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700">
            <p className="text-base font-semibold text-slate-900 dark:text-white mb-4">
              {guide.quiz.question}
            </p>

            {/* Hint button */}
            {guide.quiz.hint && quizAnswer === undefined && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="mb-4 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2"
              >
                <i className={`fas fa-lightbulb ${showHint ? 'animate-pulse' : ''}`}></i>
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
            )}

            {/* Hint */}
            {showHint && guide.quiz.hint && (
              <div className="mb-4 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  💭 {guide.quiz.hint}
                </p>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 mb-4">
              {guide.quiz.options.map((option, idx) => {
                const isSelected = quizAnswer === idx;
                const isCorrect = idx === guide.quiz!.correct;
                const showResult = quizAnswer !== undefined;

                return (
                  <button
                    key={idx}
                    onClick={() => onQuizAnswer(idx)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      showResult
                        ? isSelected
                          ? isCorrect
                            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-green-900 dark:text-green-100 shadow-lg'
                            : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-900 dark:text-red-100'
                          : isCorrect
                          ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                          : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        : 'bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 text-slate-900 dark:text-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        showResult && isSelected && isCorrect
                          ? 'bg-green-500 text-white'
                          : showResult && isSelected && !isCorrect
                          ? 'bg-red-500 text-white'
                          : showResult && isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                      }`}>
                        {showResult && isCorrect ? (
                          <i className="fas fa-check"></i>
                        ) : showResult && isSelected && !isCorrect ? (
                          <i className="fas fa-times"></i>
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {quizAnswer !== undefined && (
              <div className={`p-4 rounded-xl animate-fadeIn ${
                quizAnswer === guide.quiz.correct
                  ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700'
                  : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700'
              }`}>
                <div className="flex items-start gap-3">
                  <i className={`fas ${
                    quizAnswer === guide.quiz.correct ? 'fa-check-circle text-green-600' : 'fa-info-circle text-red-600'
                  } text-xl flex-shrink-0 mt-0.5`}></i>
                  <div>
                    <div className={`text-sm font-black uppercase tracking-wider mb-1 ${
                      quizAnswer === guide.quiz.correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {quizAnswer === guide.quiz.correct ? '🎉 Correct!' : '📚 Learn More'}
                    </div>
                    <p className={`text-sm ${
                      quizAnswer === guide.quiz.correct ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {guide.quiz.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
        {guide.cta && (
          <button
            onClick={() => onNavigate(guide.cta!.sectionId)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <i className="fas fa-arrow-right"></i>
            {guide.cta.label}
          </button>
        )}
        
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
        >
          <i className="fas fa-check-circle"></i>
          Mark Complete
        </button>

        {guide.videoUrl && (
          <a
            href={guide.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <i className="fas fa-play-circle"></i>
            Watch Video
          </a>
        )}
      </div>

      {/* Related Guides */}
      {guide.relatedGuides && guide.relatedGuides.length > 0 && (
        <div className="mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
          <h5 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            📚 Related Guides
          </h5>
          <div className="flex flex-wrap gap-2">
            {guide.relatedGuides.map((relatedId) => (
              <button
                key={relatedId}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                {relatedId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideContent;


