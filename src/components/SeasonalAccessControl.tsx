import React, { useState, useEffect } from 'react';
import { isAdminAccessClient } from '../config/admin';

interface SeasonalAccessControlProps {
  children: React.ReactNode;
  isPaidUser?: boolean;
}

// Calculate time until season start (example: August 16, 2025)
const SEASON_START_DATE = new Date('2025-08-16T11:30:00');
const LOCKDOWN_DATE = new Date(SEASON_START_DATE.getTime() - (14 * 24 * 60 * 60 * 1000)); // 2 weeks before

// For local development/testing, use future dates
const getCurrentDate = () => {
  // If in local development, use a date before lockdown for testing
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return new Date('2025-07-01T11:30:00'); // Before lockdown period
  }
  return new Date(); // Use actual date for production
};

const SeasonalAccessControl: React.FC<SeasonalAccessControlProps> = ({ 
  children, 
  isPaidUser = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [showWarning, setShowWarning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Check for admin access
  const isAdminAccess = () => {
    return isAdminAccessClient();
  };

  function calculateTimeLeft() {
    const now = getCurrentDate();
    const diff = LOCKDOWN_DATE.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    return {
      weeks: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)),
      days: Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  useEffect(() => {
    const now = getCurrentDate();
    const sixWeeksOut = new Date(LOCKDOWN_DATE.getTime() - (42 * 24 * 60 * 60 * 1000));
    
    // Show warning 6 weeks before lockdown
    if (now >= sixWeeksOut && now < LOCKDOWN_DATE) {
      setShowWarning(true);
    }
    
    // Lock access 2 weeks before season
    if (now >= LOCKDOWN_DATE && !isPaidUser) {
      setIsLocked(true);
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaidUser]);

  // Admin bypass - grant full access regardless of restrictions
  if (isAdminAccess()) {
    // console.log('🔑 Admin access bypass - All restrictions disabled');
    return <>{children}</>;
  }

  // If user is paid, show everything
  if (isPaidUser) {
    return <>{children}</>;
  }

  // If locked and not paid user, show lockdown
  if (isLocked && !isPaidUser) {
    return <SeasonalLockdown />;
  }

  // If warning period, show countdown + content
  if (showWarning && timeLeft) {
    return (
      <>
        <SeasonalWarningBanner />
        {children}
      </>
    );
  }

  // Default: show content
  return <>{children}</>;
};

// Warning Banner Component
const SeasonalWarningBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate countdown to next season start (2026)
  React.useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const targetDate = new Date('2026-08-16T19:00:00'); // August 16th, 2026, 7 PM - Next season start
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Check if user has dismissed this session
  React.useEffect(() => {
    const dismissed = sessionStorage.getItem('seasonalWarningDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsExpanded(false);
    // Don't set isDismissed to true - just collapse to smaller state
  };

  const handleReopen = () => {
    setIsExpanded(true);
    setIsDismissed(false);
    sessionStorage.removeItem('seasonalWarningDismissed');
  };

  if (isDismissed) return null;

  return (
    <div className="mb-6 transform transition-all duration-500 ease-out">
      {isExpanded ? (
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white rounded-2xl p-6 shadow-2xl border-2 border-orange-300/50 relative overflow-hidden backdrop-blur-sm">
          {/* Enhanced animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] animate-pulse"></div>
          </div>
          
          {/* Enhanced dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 group z-50"
            title="Collapse warning"
          >
            <i className="fas fa-chevron-up text-white group-hover:scale-110 transition-transform duration-200"></i>
          </button>

          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                <i className="fas fa-exclamation-triangle text-3xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                  ⚠️ 2026-27 SEASON CHANGES
                  <span className="px-2 py-0.5 bg-red-600 text-xs rounded-full animate-pulse">LAST CHANCE</span>
                </h3>
                <p className="text-lg font-bold mb-1">
                  Player Comparison becomes <span className="bg-white/20 px-2 py-0.5 rounded">paid tier exclusive</span> when the 2026-27 season starts in:
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                <div className="text-2xl font-bold text-white">{countdown.days}</div>
                <div className="text-xs text-white/80">Days</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                <div className="text-2xl font-bold text-white">{countdown.hours}</div>
                <div className="text-xs text-white/80">Hours</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                <div className="text-2xl font-bold text-white">{countdown.minutes}</div>
                <div className="text-xs text-white/80">Minutes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                <div className="text-2xl font-bold text-white">{countdown.seconds}</div>
                <div className="text-xs text-white/80">Seconds</div>
              </div>
            </div>

            {/* Gaffer Message */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
              <div className="flex items-start gap-3">
                <i className="fas fa-bullhorn text-2xl mt-1"></i>
                <div>
                  <h4 className="font-black text-lg mb-2">The Gaffer Says:</h4>
                  <p className="italic leading-relaxed">
                    "Pre-season is when champions are made, not during GW1 panic. Lock in your £49.99 founding rate NOW before prices go up. Your rivals are already preparing - are you?"
                  </p>
                </div>
              </div>
            </div>

            {/* NEW: Squad Builder Feature */}
            <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-lg p-4 mb-4 border-2 border-purple-400/50">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="fas fa-futbol text-purple-300"></i>
                🆕 NEW: The Gaffer's Squad Builder!
              </h4>
              <p className="text-sm mb-3 text-purple-100">
                Build your FPL squad and get instant AI-powered tactical analysis from The Gaffer:
              </p>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-brain text-purple-300"></i>
                  <span>AI squad strength analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-users text-purple-300"></i>
                  <span>Player performance ratings</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-exchange-alt text-purple-300"></i>
                  <span>Transfer recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-star text-purple-300"></i>
                  <span>Captain selection tips</span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-white/10 rounded text-xs">
                <strong className="text-yellow-300">Free users:</strong> 1 analysis/month with preview
                <br />
                <strong className="text-green-300">Paid tiers:</strong> Unlimited full reports!
              </div>
            </div>

            {/* Benefits Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="fas fa-crown text-yellow-300"></i>
                What You'll Miss Without Season Pass:
              </h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-300"></i>
                  <span>Unlimited squad analyses</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-300"></i>
                  <span>GW1 transfer analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-300"></i>
                  <span>Early season form tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-300"></i>
                  <span>Gaffer's insider suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-300"></i>
                  <span>Unlimited comparisons</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-300"></i>
                  <span>Complete tactical reports</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a 
                href="#newsletter-form"
                onClick={(e) => {
                  e.preventDefault();
                  // Trigger tier selection event for Season Pass
                  window.dispatchEvent(new CustomEvent('selectTier', { detail: 'seasonPass' }));
                  // Scroll directly to form element
                  setTimeout(() => {
                    const formElement = document.getElementById('newsletter-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      formElement.classList.add('ring-4', 'ring-accent', 'ring-opacity-50');
                      setTimeout(() => {
                        formElement.classList.remove('ring-4', 'ring-accent', 'ring-opacity-50');
                      }, 2000);
                    }
                  }, 100);
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-6 rounded-lg font-black text-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fas fa-crown"></i>
                <div className="text-center">
                  <div>Season Pass</div>
                  <div className="text-sm font-normal opacity-90">£49.99/year</div>
                </div>
              </a>
              
              <a 
                href="#newsletter-form"
                onClick={(e) => {
                  e.preventDefault();
                  // Trigger tier selection event for First Team
                  window.dispatchEvent(new CustomEvent('selectTier', { detail: 'firstTeam' }));
                  // Scroll directly to form element
                  setTimeout(() => {
                    const formElement = document.getElementById('newsletter-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      formElement.classList.add('ring-4', 'ring-accent', 'ring-opacity-50');
                      setTimeout(() => {
                        formElement.classList.remove('ring-4', 'ring-accent', 'ring-opacity-50');
                      }, 2000);
                    }
                  }, 100);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-lg font-black text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fas fa-star"></i>
                <div className="text-center">
                  <div>First Team</div>
                  <div className="text-sm font-normal opacity-90">£2.99/week</div>
                </div>
              </a>
            </div>

            <p className="text-center text-xs mt-3 opacity-90">
              🔒 This founding price is locked in until the 2026-27 season kicks off - grab it before it's gone forever!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white py-3 px-4 rounded-xl font-bold hover:from-orange-600/90 hover:to-red-600/90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg backdrop-blur-sm border border-orange-300/30">
          <button
            onClick={handleReopen}
            className="w-full flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <i className="fas fa-exclamation-triangle text-sm"></i>
              </div>
              <div className="text-left">
                <div className="font-bold">⚠️ 2026-27 Season Changes</div>
                <div className="text-xs opacity-90">Player Comparison going exclusive next season</div>
              </div>
            </span>
            <i className="fas fa-chevron-down group-hover:translate-y-1 transition-transform duration-200"></i>
          </button>
        </div>
      )}
    </div>
  );
};

// Lockdown Overlay Component
const SeasonalLockdown: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState(0);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showWhySeasonPass, setShowWhySeasonPass] = useState(false);

  const gafferMessages = [
    {
      title: "Season's Started - Time to Step Up!",
      message: "The 2025-26 FPL season is here and Player Comparison is now exclusive to managers who are serious about winning. No more free rides.",
      subtext: "Your mini-league rivals are already using these tools to get ahead. Every day you wait is points you're losing.",
      icon: "fa-trophy"
    },
    {
      title: "Stop Playing Amateur Hour!",
      message: "You've had months to prepare. Now it's time to either commit to winning or accept mediocrity. Real managers invest in success.",
      subtext: "That £49.99 is less than what you'll spend celebrating your mini-league win. Or crying into your pint about finishing 8th.",
      icon: "fa-chart-line"
    },
    {
      title: "Your Rivals Aren't Waiting!",
      message: "While you're here reading this, your mates are comparing players, finding differentials, and building winning teams. The gap is widening.",
      subtext: "GW1 is crucial. GW2 is critical. By GW3, you're either ahead or playing catch-up all season.",
      icon: "fa-users"
    }
  ];

  const currentMessage = gafferMessages[selectedMessage];

  return (
    <div className="relative min-h-[600px]">
      {/* Blurred background */}
      <div className="absolute inset-0 blur-md opacity-30 pointer-events-none bg-slate-100 dark:bg-slate-900">
        <div className="p-8">
          <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-40 mb-4"></div>
          <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-60"></div>
        </div>
      </div>

      {/* Lockdown overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-slate-900/95 to-black/95 flex items-center justify-center p-4 z-50">
        <div className="max-w-2xl w-full">
          {/* Main lockdown card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl">
            {/* Lock icon */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <i className="fas fa-lock text-white text-4xl"></i>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2">
                🏆 SEASON PASS REQUIRED
              </h2>
              <p className="text-purple-300 text-sm">
                Player Comparison is now exclusive to Season Pass members
              </p>
            </div>

            {/* Rotating Gaffer messages */}
            <div className="bg-purple-900/30 rounded-xl p-6 mb-6 border border-purple-500/30 min-h-[180px]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                  <i className={`fas ${currentMessage.icon} text-white text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white mb-3">{currentMessage.title}</h3>
                  <p className="text-purple-200 mb-3 leading-relaxed">{currentMessage.message}</p>
                  <p className="text-purple-300 text-sm italic">{currentMessage.subtext}</p>
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
                        ? 'bg-purple-400 w-6' 
                        : 'bg-purple-700 hover:bg-purple-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* What you're missing */}
            <div className="bg-green-900/30 rounded-xl p-5 mb-6 border border-green-500/30">
              <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                <i className="fas fa-star"></i>
                What You're Missing Right Now:
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Unlimited player comparisons</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Gaffer's insider suggestions</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">GW1-3 transfer analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Form tracking & differentials</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Comparison history & export</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-check text-green-400 mt-0.5"></i>
                  <span className="text-green-200">Advanced filtering & presets</span>
                </div>
              </div>
            </div>

            {/* Urgency message */}
            <div className="bg-yellow-900/30 rounded-xl p-4 mb-6 border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <i className="fas fa-exclamation-triangle text-yellow-400 text-2xl"></i>
                <div>
                  <p className="text-yellow-300 font-bold text-sm">
                    Your rivals are already analyzing players, finding value picks, and building winning teams!
                  </p>
                  <p className="text-yellow-400 text-xs mt-1">
                    Every hour you wait is points you're losing. The season waits for no one.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {/* Main Subscription Buttons - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href="#newsletter-form"
                  onClick={(e) => {
                    e.preventDefault();
                    // Trigger tier selection event for Season Pass
                    window.dispatchEvent(new CustomEvent('selectTier', { detail: 'seasonPass' }));
                    // Scroll directly to form element
                    setTimeout(() => {
                      const formElement = document.getElementById('newsletter-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        formElement.classList.add('ring-4', 'ring-accent', 'ring-opacity-50');
                        setTimeout(() => {
                          formElement.classList.remove('ring-4', 'ring-accent', 'ring-opacity-50');
                        }, 2000);
                      }
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-6 rounded-lg font-black text-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fas fa-crown"></i>
                  <div className="text-center">
                    <div>Season Pass</div>
                    <div className="text-sm font-normal opacity-90">£49.99/year</div>
                  </div>
                </a>
                
                <a 
                  href="#newsletter-form"
                  onClick={(e) => {
                    e.preventDefault();
                    // Trigger tier selection event for First Team
                    window.dispatchEvent(new CustomEvent('selectTier', { detail: 'firstTeam' }));
                    // Scroll directly to form element
                    setTimeout(() => {
                      const formElement = document.getElementById('newsletter-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        formElement.classList.add('ring-4', 'ring-accent', 'ring-opacity-50');
                        setTimeout(() => {
                          formElement.classList.remove('ring-4', 'ring-accent', 'ring-opacity-50');
                        }, 2000);
                      }
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-lg font-black text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fas fa-star"></i>
                  <div className="text-center">
                    <div>First Team</div>
                    <div className="text-sm font-normal opacity-90">£2.99/week</div>
                  </div>
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowBenefits(!showBenefits)}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-bold transition-all text-sm"
                >
                  <i className="fas fa-list mr-2"></i>
                  View All Benefits
                </button>
                <button 
                  onClick={() => setShowWhySeasonPass(!showWhySeasonPass)}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-bold transition-all text-sm"
                >
                  <i className="fas fa-question-circle mr-2"></i>
                  Why Season Pass?
                </button>
              </div>
            </div>

            {/* All Benefits Expandable Section */}
            {showBenefits && (
              <div className="mt-4 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-6 border border-green-500/30 animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-black text-green-300 flex items-center gap-2">
                    <i className="fas fa-crown"></i>
                    Complete Season Pass Benefits
                  </h4>
                  <button 
                    onClick={() => setShowBenefits(false)}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-950/50 rounded-lg p-3">
                    <h5 className="font-bold text-green-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-infinity text-green-400"></i>
                      Unlimited Access
                    </h5>
                    <ul className="text-sm text-green-300 space-y-1 ml-6">
                      <li>• Unlimited player comparisons every month</li>
                      <li>• No restrictions on usage or features</li>
                      <li>• Access during crucial transfer windows</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-950/50 rounded-lg p-3">
                    <h5 className="font-bold text-green-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-brain text-purple-400"></i>
                      Gaffer's Insider Knowledge
                    </h5>
                    <ul className="text-sm text-green-300 space-y-1 ml-6">
                      <li>• Smart player suggestions from the Gaffer</li>
                      <li>• Similar player recommendations</li>
                      <li>• In-form player identification</li>
                      <li>• Differential picks (low ownership gems)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-950/50 rounded-lg p-3">
                    <h5 className="font-bold text-green-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-database text-blue-400"></i>
                      Data & History
                    </h5>
                    <ul className="text-sm text-green-300 space-y-1 ml-6">
                      <li>• Save comparison history (last 10)</li>
                      <li>• Export comparisons to clipboard</li>
                      <li>• Share results with mini-league</li>
                      <li>• Track your research over time</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-950/50 rounded-lg p-3">
                    <h5 className="font-bold text-green-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-filter text-orange-400"></i>
                      Advanced Tools
                    </h5>
                    <ul className="text-sm text-green-300 space-y-1 ml-6">
                      <li>• Advanced filtering (position, team, price)</li>
                      <li>• Multiple sort options (points, form, value)</li>
                      <li>• Quick comparison presets</li>
                      <li>• Visual badges (HOT/DIFF indicators)</li>
                    </ul>
                  </div>
                  
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-green-200 text-sm italic">
                    "Everything you need to dominate your mini-league, all season long."
                  </p>
                </div>
              </div>
            )}
            
            {/* Why Season Pass Expandable Section */}
            {showWhySeasonPass && (
              <div className="mt-4 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-6 border border-purple-500/30 animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-black text-purple-300 flex items-center gap-2">
                    <i className="fas fa-question-circle"></i>
                    Why You Need Season Pass
                  </h4>
                  <button 
                    onClick={() => setShowWhySeasonPass(false)}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-950/50 rounded-lg p-4">
                    <h5 className="font-bold text-purple-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-trophy text-yellow-400"></i>
                      Win Your Mini-League
                    </h5>
                    <p className="text-sm text-purple-300 leading-relaxed">
                      Your rivals are using every advantage they can get. The Gaffer's insider knowledge, unlimited comparisons, and data-driven decisions separate winners from also-rans. One good transfer decision pays for the entire season.
                    </p>
                  </div>
                  
                  <div className="bg-purple-950/50 rounded-lg p-4">
                    <h5 className="font-bold text-purple-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-chart-line text-green-400"></i>
                      Make Better Decisions
                    </h5>
                    <p className="text-sm text-purple-300 leading-relaxed">
                      Stop guessing. Stop following the crowd. Use the Gaffer's insider knowledge to find value picks, identify form players, and spot differentials before everyone else. Data beats gut feelings every time.
                    </p>
                  </div>
                  
                  <div className="bg-purple-950/50 rounded-lg p-4">
                    <h5 className="font-bold text-purple-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-clock text-blue-400"></i>
                      Save Time, Gain Edge
                    </h5>
                    <p className="text-sm text-purple-300 leading-relaxed">
                      No more hours on spreadsheets or Twitter threads. Get instant comparisons, smart suggestions, and export-ready analysis. Spend less time researching, more time winning.
                    </p>
                  </div>
                  
                  <div className="bg-purple-950/50 rounded-lg p-4">
                    <h5 className="font-bold text-purple-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-pound-sign text-orange-400"></i>
                      Incredible Value
                    </h5>
                    <p className="text-sm text-purple-300 leading-relaxed">
                      £49.99 for the entire season = £4.16/month = less than 2 pints. You'll spend more celebrating your mini-league win than you paid for the tools that got you there.
                    </p>
                  </div>
                  
                  <div className="bg-purple-950/50 rounded-lg p-4">
                    <h5 className="font-bold text-purple-200 mb-2 flex items-center gap-2">
                      <i className="fas fa-users text-red-400"></i>
                      Don't Fall Behind
                    </h5>
                    <p className="text-sm text-purple-300 leading-relaxed">
                      While you're reading this, your mini-league rivals are comparing players, finding differentials, and building winning teams. Every day without these tools is points you're losing. The gap is widening.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                  <p className="text-yellow-200 text-sm font-bold text-center">
                    "The question isn't whether you should get Season Pass. The question is: can you afford NOT to?"
                  </p>
                  <p className="text-yellow-400 text-xs text-center mt-2">- The Gaffer</p>
                </div>
              </div>
            )}

            {/* Footer message */}
            <div className="text-center mt-6">
              <p className="text-slate-400 text-xs italic">
                "Success costs less than that pint you're about to buy. Your choice: amateur or champion?"
              </p>
              <p className="text-slate-500 text-xs mt-2">
                - The Gaffer
              </p>
            </div>
          </div>

          {/* Additional info below card */}
          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              Questions? <a href="#" className="text-purple-400 hover:text-purple-300 underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalAccessControl;


