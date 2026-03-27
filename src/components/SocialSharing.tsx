import React, { useState } from 'react';
import { User } from '../services/auth';

interface SocialSharingProps {
  user: User;
  predictionResult?: {
    points: number;
    accuracy: number;
    streak: number;
    verdict: 'win' | 'draw' | 'loss';
  };
}

const SocialSharing: React.FC<SocialSharingProps> = ({ user, predictionResult }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const generateShareText = () => {
    const baseUrl = window.location.origin;
    
    if (predictionResult) {
      const verdictEmoji = predictionResult.verdict === 'win' ? '🏆' : predictionResult.verdict === 'draw' ? '⚖️' : '😤';
      return `${verdictEmoji} Beat the Gaffer: ${predictionResult.points}pts | ${predictionResult.accuracy}% accuracy | 🔥 ${predictionResult.streak} streak! Can you do better? ${baseUrl}`;
    } else {
      return `🏆 I'm competing on premierleaguetables.com! 🏆\n📊 Current stats: ${user.allTimePoints}pts | ${user.accuracy.toFixed(1)}% accuracy | 🔥 ${user.currentStreak} streak\n👇 Join the competition! ${baseUrl}`;
    }
  };

  const shareToTwitter = () => {
    const text = generateShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const text = generateShareText();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const text = generateShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText('Copied!');
      setTimeout(() => setCopiedText(''), 2000);
    });
  };

  const challengeFriend = () => {
    const text = `🏆 Think you can beat me at Premier League predictions? I've got ${user.allTimePoints} points with ${user.accuracy.toFixed(1)}% accuracy! 🔥 ${user.currentStreak} streak\n\nJoin premierleaguetables.com and challenge me: ${window.location.origin}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText('Challenge copied!');
      setTimeout(() => setCopiedText(''), 2000);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareModal(!showShareModal)}
        className="bg-accent hover:bg-[#f50057] text-white px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2"
      >
        <i className="fas fa-share-alt"></i>
        Share
      </button>

      {showShareModal && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg text-primary dark:text-white">
              Share Your Success
            </h3>
            <button
              onClick={() => setShowShareModal(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* User Stats Preview */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-primary dark:text-white">{user.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.team} fan</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-accent">{user.allTimePoints}</p>
                <p className="text-xs text-slate-500">Points</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-500">{user.accuracy.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">Accuracy</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-500">{user.currentStreak}</p>
                <p className="text-xs text-slate-500">Streak</p>
              </div>
            </div>

            {predictionResult && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-bold text-center">
                  Latest: {predictionResult.points}pts ({predictionResult.verdict})
                </p>
              </div>
            )}
          </div>

          {/* Share Options */}
          <div className="space-y-2">
            <button
              onClick={shareToTwitter}
              className="w-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <i className="fab fa-twitter"></i>
              Share on Twitter
            </button>

            <button
              onClick={shareToFacebook}
              className="w-full bg-[#4267B2] hover:bg-[#365899] text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <i className="fab fa-facebook-f"></i>
              Share on Facebook
            </button>

            <button
              onClick={shareToWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <i className="fab fa-whatsapp"></i>
              Share on WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyToClipboard}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold py-2 px-3 rounded-lg transition-all text-sm flex items-center justify-center gap-1"
              >
                <i className="fas fa-copy"></i>
                {copiedText || 'Copy Text'}
              </button>

              <button
                onClick={challengeFriend}
                className="bg-accent hover:bg-[#f50057] text-white font-bold py-2 px-3 rounded-lg transition-all text-sm flex items-center justify-center gap-1"
              >
                <i className="fas fa-user-friends"></i>
                Challenge
              </button>
            </div>
          </div>

          {/* Preview Text */}
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Preview:</p>
            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3">
              {generateShareText()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialSharing;


