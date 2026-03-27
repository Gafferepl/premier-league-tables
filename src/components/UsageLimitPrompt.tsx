import React, { useState } from 'react';
import { isAdminAccessClient } from '../config/admin';

interface UsageLimitPromptProps {
  usageCount: number;
  maxUsage: number;
}

const UsageLimitPrompt: React.FC<UsageLimitPromptProps> = ({ usageCount, maxUsage }) => {
  const [selectedMessage, setSelectedMessage] = useState(0);

  // Check for admin access
  const isAdminAccess = () => {
    return isAdminAccessClient();
  };

  // Admin bypass - don't show usage limits
  if (isAdminAccess()) {
    // console.log('🔑 Admin access bypass - Usage limits disabled');
    return null; // Don't render usage limit prompt
  }

  const gafferMessages = [
    {
      title: "Training Wheels Off, Mate!",
      message: "You've had your 5 free goes - time to step up to the Premier League! Get unlimited access and actually win your mini-league.",
      subtext: "Your mates are already using the full toolkit while you're still in the academy.",
      icon: "fa-graduation-cap"
    },
    {
      title: "Stop Being Cheap!",
      message: "5 comparisons? That's like watching just 5 minutes of a match! Get the Season Pass and see the full picture.",
      subtext: "Real managers use every tool available. Don't be that guy who loses by 2 points.",
      icon: "fa-money-bill-wave"
    },
    {
      title: "Time to Go Pro!",
      message: "You've seen how good this is - now stop freeloading and get the full package! Your team needs proper analysis.",
      subtext: "The difference between winning and losing is in the details you're missing.",
      icon: "fa-trophy"
    },
    {
      title: "No More Excuses!",
      message: "Either upgrade to Season Pass or stop complaining about your transfers! The tools are here - are you?",
      subtext: "Success costs less than that pint you're about to buy.",
      icon: "fa-exclamation-circle"
    }
  ];

  const currentMessage = gafferMessages[selectedMessage];

  return (
    <div className="relative min-h-[500px]">
      {/* Blurred background */}
      <div className="absolute inset-0 blur-md opacity-20 pointer-events-none bg-slate-100 dark:bg-slate-900">
        <div className="p-8">
          <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-32 mb-4"></div>
          <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-48"></div>
        </div>
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-slate-900/90 to-black/90 flex items-center justify-center p-4 z-50">
        <div className="max-w-xl w-full">
          {/* Main upgrade card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-orange-500/50 shadow-2xl">
            {/* Lock icon */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-500/50 animate-pulse">
                <i className="fas fa-lock text-white text-4xl"></i>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2">
                Monthly Limit Reached!
              </h2>
              <p className="text-orange-300 text-sm">
                You've used {usageCount}/{maxUsage} free comparisons this month
              </p>
            </div>

            {/* Rotating Gaffer messages */}
            <div className="bg-orange-900/30 rounded-xl p-6 mb-6 border border-orange-500/30 min-h-[180px]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <i className={`fas ${currentMessage.icon} text-white text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white mb-3">{currentMessage.title}</h3>
                  <p className="text-orange-200 mb-3 leading-relaxed">{currentMessage.message}</p>
                  <p className="text-orange-300 text-sm italic">{currentMessage.subtext}</p>
                </div>
              </div>

              {/* Message selector dots */}
              <div className="flex justify-center gap-2 mt-4">
                {gafferMessages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMessage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedMessage 
                        ? 'bg-orange-400 w-6' 
                        : 'bg-orange-700 hover:bg-orange-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Season Pass benefits */}
            <div className="bg-green-900/30 rounded-xl p-5 mb-6 border border-green-500/30">
              <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                <i className="fas fa-crown"></i>
                🎯 Season Pass Benefits:
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Unlimited comparisons</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Smart AI suggestions</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Save comparison history</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Export & share results</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Advanced filtering</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Priority features</span>
                </div>
              </div>
            </div>

            {/* Value proposition */}
            <div className="bg-purple-900/30 rounded-xl p-4 mb-6 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <i className="fas fa-calculator text-purple-400 text-2xl"></i>
                <div>
                  <p className="text-purple-300 font-bold text-sm">
                    £49.99/year = Less than 2 pints per month
                  </p>
                  <p className="text-purple-400 text-xs mt-1">
                    One good transfer decision pays for the entire season!
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg font-black text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                <i className="fas fa-bolt"></i>
                Upgrade to Season Pass
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-bold transition-all text-sm">
                  <i className="fas fa-list mr-2"></i>
                  View Benefits
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-bold transition-all text-sm">
                  <i className="fas fa-question-circle mr-2"></i>
                  Learn More
                </button>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-center mt-6">
              <p className="text-slate-400 text-xs italic">
                "Your rivals aren't waiting. Every comparison you miss is points you're losing."
              </p>
              <p className="text-slate-500 text-xs mt-2">
                - The Gaffer
              </p>
            </div>
          </div>

          {/* Reset info */}
          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              Free comparisons reset on the 1st of each month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitPrompt;


