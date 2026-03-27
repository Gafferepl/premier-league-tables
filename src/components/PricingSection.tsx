import React, { useState, useEffect } from 'react';

interface PricingCard {
  type: 'free' | 'firstTeam' | 'seasonPass';
  name: string;
  launchPrice: number;
  regularPrice: number;
  period: string;
  savings: number;
  features: string[];
  badge: string;
  icon: string;
  color: string;
}

const PricingSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [spotsLeft, setSpotsLeft] = useState(112); // Internal tracking only - never displayed publicly
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [currentGameWeek, setCurrentGameWeek] = useState(20);
  const [seasonEndYear, setSeasonEndYear] = useState(2024);

  // Calculate current game week dynamically
  useEffect(() => {
    const calculateCurrentGameWeek = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      
      // Premier League season runs from August to May
      // Game Week 1 typically starts in mid-August
      let seasonStartYear = year;
      let seasonEndYear = year;
      
      if (month >= 7) { // August onwards
        seasonStartYear = year;
        seasonEndYear = year + 1;
      } else { // Before August
        seasonStartYear = year - 1;
        seasonEndYear = year;
      }
      
      // Approximate game week calculation
      // Season typically starts mid-August and runs for ~38 weeks
      const seasonStart = new Date(seasonStartYear, 7, 15); // August 15
      const weeksPassed = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      const gameWeek = Math.max(1, Math.min(38, weeksPassed + 1));
      
      setCurrentGameWeek(gameWeek);
      setSeasonEndYear(seasonEndYear);
    };

    calculateCurrentGameWeek();
    const interval = setInterval(calculateCurrentGameWeek, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const calculateNextSeasonStart = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      // Premier League season typically starts mid-August
      // If we're before August, next season starts this year
      // If we're after August, next season starts next year
      let nextSeasonYear = currentYear;
      
      if (currentMonth >= 7) { // August or later
        nextSeasonYear = currentYear + 1;
      }
      
      // Set to mid-August (typical Premier League start)
      // Using August 16th as a reasonable start date
      return new Date(nextSeasonYear, 7, 16, 19, 0, 0); // August 16th, 7 PM
    };
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = calculateNextSeasonStart();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // If we're past the date, reset to show 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Simulate spots decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft(prev => Math.max(1, prev - Math.floor(Math.random() * 3)));
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Calculate founding member availability percentage (INTERNAL ONLY - NOT DISPLAYED)
  const totalFoundingSpots = 150; // Hidden from public
  const foundingAvailabilityPercentage = (spotsLeft / totalFoundingSpots) * 100;
  
  // Determine urgency messaging (no specific numbers shown)
  const getUrgencyText = () => {
    if (foundingAvailabilityPercentage > 50) return 'Limited slots available';
    if (foundingAvailabilityPercentage > 25) return 'Filling fast';
    if (foundingAvailabilityPercentage > 10) return 'Very limited availability';
    return 'Almost full';
  };

  // Dynamic pricing cards based on founding member availability
  const getPricingCards = (): PricingCard[] => {
    const foundingMemberSoldOut = spotsLeft === 0;
    
    return [
      {
        type: 'free',
        name: 'Free Newsletter',
        launchPrice: 0,
        regularPrice: 0,
        period: 'forever',
        savings: 0,
        features: [
          '📋 The Weekly Briefing: Key stats from the previous gameweek',
          '📅 Upcoming Fixtures: FDR-rated schedule for immediate planning',
          '🔍 The Scout\'s Dossier: High-form assets for your watchlist'
        ],
        badge: 'No Cost',
        icon: 'fas fa-envelope',
        color: 'blue'
      },
      {
        type: 'firstTeam',
        name: 'First Team',
        launchPrice: 2.99,
        regularPrice: 4.99,
        period: 'per week',
        savings: 40,
        features: [
          '📋 Everything in Tier 1, plus:',
          '🏆 Enter Gaffer\'s Community League Lottery (Random selection before 2026-27 season starts - 50 exclusive spots)',
          '🚨 Elite Captain Picks (Thursday 6 PM - 48h advantage)',
          '📈 Price Intelligence (Friday 6 PM - Time-critical market data)',
          '📊 Weekly Intelligence Digest (Saturday 9 AM - All premium content consolidated)',
          '⚖️ Player Comparison Tools - 50 per month',
          '🎯 Transfer Strategy (Integrated in Weekly Digest)',
          '🎯 Personalized Team Analysis (Integrated in Weekly Digest)',
          '📧 2 Premium Emails Per Week (Optimized - Less spam, more value)',
          '📊 Advanced Analytics (xG, xA, ICT Index) - PREMIUM ACCESS',
          '🔮 Custom Algorithm Access & Personalized Tools - PREMIUM ACCESS',
          '📈 Historical Performance Database (5 years) - PREMIUM ACCESS',
          '🔍 Differential Detectives (Low ownership gems)',
          '🏥 The Physio Room (Enhanced injury intelligence)',
          '💨 The Hairdryer Treatment (Players to drop immediately)',
          '📈 Ownership Trend Analysis (Market movement insights)',
          '🎯 Set-Piece Specialists (Who takes penalties/corners/free kicks)',
          '💎 Budget Gems Analysis (Best value players)',
          '🔥 Hot/Cold Form Tracker (In-form vs out-of-form players)',
          '🎪 Captaincy Matrix (Data-driven captain rankings)',
          '📅 Fixture Difficulty Heatmap (Easy/hard fixtures visualized)',
          '🎲 Bench Boost Optimizer (Optimal bench selections)'
        ],
        badge: 'Launch Special',
        icon: 'fas fa-users',
        color: 'green'
      },
      {
        type: 'seasonPass',
        name: foundingMemberSoldOut ? 'Season Pass' : 'Founding Member',
        launchPrice: foundingMemberSoldOut ? 59.99 : 49.99,
        regularPrice: 59.99,
        period: foundingMemberSoldOut ? 'per season' : 'per season',
        savings: foundingMemberSoldOut ? 0 : 10,
        features: foundingMemberSoldOut ? [
          '📋 Everything in Tier 2, plus:',
          '🏆 Enter Gaffer\'s Community League Lottery (Random selection before 2026-27 season starts - 50 exclusive spots)',
          '🚨 Elite Captain Picks (Thursday 6 PM - 48h advantage)',
          '📈 Advanced Price Intelligence (Friday 6 PM - Elite market analysis)',
          '👑 Elite Weekly Digest (Saturday 9 AM - All premium features consolidated)',
          '⚖️ Player Comparison Tools - UNLIMITED',
          '🎯 Personalized Team Analysis (Elite-level insights for YOUR FPL team)',
          '🎯 Transfer Strategy (Advanced fixture + xG analysis)',
          '📧 2 Elite Emails Per Week (Maximum value, minimum spam)',
          '📊 Advanced Analytics (xG, xA, ICT Index) - UNLIMITED ACCESS',
          '🔮 Custom Algorithm Access & Personalized Tools - UNLIMITED ACCESS',
          '📈 Historical Performance Database (5 years) - UNLIMITED ACCESS',
          '🎯 Priority Algorithm Access (faster predictions) - UNLIMITED ACCESS',
          '🚨 48-Hour Early Captain Picks - UNLIMITED ACCESS',
          '📈 Daily Intelligence Digest (Advanced Market Analysis) - UNLIMITED ACCESS',
          '🔍 Differential Detectives (Low ownership gems) - UNLIMITED ACCESS',
          '🏥 The Physio Room (Enhanced injury intelligence) - UNLIMITED ACCESS',
          '💨 The Hairdryer Treatment (Players to drop immediately) - UNLIMITED ACCESS',
          '📈 Ownership Trend Analysis (Market movement insights) - UNLIMITED ACCESS',
          '🎯 Set-Piece Specialists (Who takes penalties/corners/free kicks) - UNLIMITED ACCESS',
          '💎 Budget Gems Analysis (Best value players) - UNLIMITED ACCESS',
          '🔥 Hot/Cold Form Tracker (In-form vs out-of-form players) - UNLIMITED ACCESS',
          '🎪 Captaincy Matrix (Data-driven captain rankings) - UNLIMITED ACCESS',
          '📅 Fixture Difficulty Heatmap (Easy/hard fixtures visualized) - UNLIMITED ACCESS',
          '🎲 Bench Boost Optimizer (Optimal bench selections) - UNLIMITED ACCESS',
          '👑 Season Pass Benefits: Full season access at £59.99/season, premium features, priority support'
        ] : [
          '📋 Everything in Tier 2, plus:',
          '🏆 Enter Gaffer\'s Community League Lottery (Random selection before 2026-27 season starts - 50 exclusive spots)',
          '🚨 Elite Captain Picks (Thursday 6 PM - 48h advantage)',
          '📈 Advanced Price Intelligence (Friday 6 PM - Elite market analysis)',
          '👑 Elite Weekly Digest (Saturday 9 AM - All premium features consolidated)',
          '🎯 Personalized Team Analysis (Elite-level insights for YOUR FPL team)',
          '🎯 Transfer Strategy (Advanced fixture + xG analysis)',
          '📧 2 Elite Emails Per Week (Maximum value, minimum spam)',
          '📊 Advanced Analytics (xG, xA, ICT Index) - UNLIMITED ACCESS',
          '🔮 Custom Algorithm Access & Personalized Tools - UNLIMITED ACCESS',
          '📈 Historical Performance Database (5 years) - UNLIMITED ACCESS',
          '🎯 Priority Algorithm Access (faster predictions) - UNLIMITED ACCESS',
          '🚨 48-Hour Early Captain Picks - UNLIMITED ACCESS',
          '📈 Daily Intelligence Digest (Advanced Market Analysis) - UNLIMITED ACCESS',
          '🔍 Differential Detectives (Low ownership gems) - UNLIMITED ACCESS',
          '🏥 The Physio Room (Enhanced injury intelligence) - UNLIMITED ACCESS',
          '💨 The Hairdryer Treatment (Players to drop immediately) - UNLIMITED ACCESS',
          '📈 Ownership Trend Analysis (Market movement insights) - UNLIMITED ACCESS',
          '🎯 Set-Piece Specialists (Who takes penalties/corners/free kicks) - UNLIMITED ACCESS',
          '💎 Budget Gems Analysis (Best value players) - UNLIMITED ACCESS',
          '🔥 Hot/Cold Form Tracker (In-form vs out-of-form players) - UNLIMITED ACCESS',
          '🎪 Captaincy Matrix (Data-driven captain rankings) - UNLIMITED ACCESS',
          '📅 Fixture Difficulty Heatmap (Easy/hard fixtures visualized) - UNLIMITED ACCESS',
          '🎲 Bench Boost Optimizer (Optimal bench selections) - UNLIMITED ACCESS',
          '👑 Founding Member Benefits: £49.99/season FOREVER, beta features, exclusive badge'
        ],
        badge: foundingMemberSoldOut ? 'Premium Access' : 'Limited time only',
        icon: foundingMemberSoldOut ? 'fas fa-star' : 'fas fa-crown',
        color: 'yellow'
      }
    ];
  };

  const FreeExplanation = () => (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700">
      <h4 className="font-bold text-white mb-3">What You Get Free</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-start space-x-2">
          <i className="fas fa-envelope text-blue-500 mt-1"></i>
          <div>
            <strong>Weekly email newsletter</strong>
            <p className="text-slate-400">Premier League insights delivered to your inbox</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-gamepad text-purple-500 mt-1"></i>
          <div>
            <strong>Beat The Gaffer game access</strong>
            <p className="text-slate-400">Play weekly prediction games & see leaderboard</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-chart-line text-green-500 mt-1"></i>
          <div>
            <strong>Basic analysis & tips</strong>
            <p className="text-slate-400">Fantasy League advice and match previews</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-gift text-yellow-500 mt-1"></i>
          <div>
            <strong>Forever free</strong>
            <p className="text-slate-400">No credit card required, cancel anytime</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-2 mt-3">
        <div className="text-xs text-slate-400">
          Perfect for casual football fans who want quality content without commitment
        </div>
      </div>
    </div>
  );

  const FirstTeamExplanation = () => (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700">
      <h4 className="font-bold text-white mb-3">How You're Charged</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-start space-x-2">
          <i className="fas fa-check-circle text-green-500 mt-1"></i>
          <div>
            <strong>£2.99 per active game week only</strong>
            <p className="text-slate-400">No charges during international breaks</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-calendar-alt text-blue-500 mt-1"></i>
          <div>
            <strong>~30 chargeable weeks per season</strong>
            <p className="text-slate-400">Approximately £12/month during active periods</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-times-circle text-red-500 mt-1"></i>
          <div>
            <strong>Cancel anytime</strong>
            <p className="text-slate-400">No commitment, stop whenever you want</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-2 mt-3">
        <div className="text-xs text-slate-400">
          Example: Join in Game Week 10 → Pay for 29 weeks = ~£87 total
        </div>
      </div>
    </div>
  );

  const SeasonPassExplanation = () => {
  const foundingMemberSoldOut = spotsLeft === 0;
  
  if (foundingMemberSoldOut) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700">
        <h4 className="font-bold text-white mb-3">Season Pass Benefits</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <i className="fas fa-star text-yellow-500 mt-1"></i>
            <div>
              <strong>Full season access</strong>
              <p className="text-slate-400">Complete access to all premium features for the entire season</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <i className="fas fa-chart-line text-green-500 mt-1"></i>
            <div>
              <strong>Advanced analytics</strong>
              <p className="text-slate-400">Deep insights, projections, and professional-grade analysis</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <i className="fas fa-bolt text-blue-500 mt-1"></i>
            <div>
              <strong>Priority support</strong>
              <p className="text-slate-400">Get help faster with dedicated support channels</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <i className="fas fa-gem text-purple-500 mt-1"></i>
            <div>
              <strong>Premium features</strong>
              <p className="text-slate-400">Exclusive tools and content not available elsewhere</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-2 mt-3">
          <div className="text-xs text-slate-400">
            Founding Member opportunity has ended. Season Pass provides full access to all premium features.
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700">
      <h4 className="font-bold text-white mb-3">Founding Member Benefits</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-start space-x-2">
          <i className="fas fa-crown text-yellow-500 mt-1"></i>
          <div>
            <strong>Limited founding member slots</strong>
            <p className="text-slate-400">Exclusive founding member status - never offered again</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-lock text-green-500 mt-1"></i>
          <div>
            <strong>Price locked forever at £49.99/season</strong>
            <p className="text-slate-400">Regular price increases to £59.99 next season - founding members stay at £49.99 forever</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-flask text-purple-500 mt-1"></i>
          <div>
            <strong>Beta features access</strong>
            <p className="text-slate-400">Test new features before anyone else</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <i className="fas fa-star text-orange-500 mt-1"></i>
          <div>
            <strong>Founding member badge</strong>
            <p className="text-slate-400">Special badge on all content and comments</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-2 mt-3">
        <div className="text-xs text-slate-400">
          One-time only offer at £49.99/season. When founding member slots are filled, this opportunity never returns.
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            The Gaffer's Newsletter
          </h1>
          <p className="text-xl text-slate-400 mb-2">
            Professional fantasy football insights that win leagues
          </p>
          <div className="flex items-center justify-center space-x-2 text-slate-300">
            <i className="fas fa-futbol text-red-500"></i>
            <span>Game Week {currentGameWeek} of 38 • Season ends May {seasonEndYear}</span>
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <i className="fas fa-fire text-red-500 text-2xl animate-pulse"></i>
              <h2 className="text-2xl font-bold text-red-500">Next Premier League Season Starts In:</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-xs text-slate-400">Days</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-xs text-slate-400">Hours</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-xs text-slate-400">Minutes</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-xs text-slate-400">Seconds</div>
              </div>
            </div>
            
            <div className="text-red-400 font-medium">
              ⚠️ Founding members lock in £49.99/season pricing FOREVER! Limited slots available - when they're gone, they're gone. Regular price increases to £59.99 next season.
            </div>
          </div>
        </div>

        </div>
    </div>
  );
};

export default PricingSection;


