import React, { useState, useEffect } from 'react';
import PremiumComparisonTable from './PremiumComparisonTable';
import { Helmet } from 'react-helmet-async';
import { supabaseService } from '../services/supabase';
import { isAdminAccessClient, grantAdminAccess } from '../config/admin';
import ClubDropdown from './ClubDropdown';
import CountryDropdown from './CountryDropdown';

// Add custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

// Inject styles into head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customScrollbarStyles;
  if (!document.head.querySelector('style[data-scrollbar-styles]')) {
    styleSheet.setAttribute('data-scrollbar-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

interface UserProfile {
  name: string;
  email: string;
  club: string;
  country: string;
  dateOfBirth: string;
  leagueOptIn: boolean;
  waitlistOptIn: boolean;
}

const Newsletter: React.FC = () => {
  // Check for admin access and reset for local development
  const isAdminAccess = () => {
    return isAdminAccessClient();
  };

  // Reset state for local development
  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Clear admin access on reload for testing
      localStorage.removeItem('adminEmail');
      sessionStorage.removeItem('adminEmail');
    }
  }, []);

  const [selectedTier, setSelectedTier] = useState<'free' | 'firstTeam' | 'seasonPass'>('free');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [spotsLeft, setSpotsLeft] = useState(112); // Internal tracking only - never displayed publicly
  const [foundingMemberSoldOut, setFoundingMemberSoldOut] = useState(false); // Track if 150 founding members reached

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
  
  // Check if founding members are sold out
  useEffect(() => {
    setFoundingMemberSoldOut(spotsLeft === 0);
  }, [spotsLeft]);
  
  // Determine urgency messaging (no specific numbers shown)
  const getUrgencyText = () => {
    if (foundingAvailabilityPercentage > 50) return 'Limited slots available';
    if (foundingAvailabilityPercentage > 25) return 'Filling fast';
    if (foundingAvailabilityPercentage > 10) return 'Very limited availability';
    return 'Almost full';
  };

  // Listen for tier selection events from PricingSection
  useEffect(() => {
    const handleTierSelection = (event: CustomEvent) => {
      // console.log('Received tier selection event:', event.detail);
      const tier = event.detail as 'free' | 'firstTeam' | 'seasonPass';
      setSelectedTier(tier);
      
      // console.log('Form should now be visible with tier:', tier);
      
      // Scroll to form with highlight effect
      setTimeout(() => {
        const formElement = document.getElementById('newsletter-form');
        // console.log('Form element found:', formElement);
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          formElement.classList.add('ring-4', 'ring-accent', 'ring-opacity-50');
          // console.log('Form highlighted and scrolled into view');
          setTimeout(() => {
            formElement.classList.remove('ring-4', 'ring-accent', 'ring-opacity-50');
          }, 2000);
        } else {
          // console.error('Form element not found!');
        }
      }, 100);
    };

    window.addEventListener('selectTier', handleTierSelection as EventListener);
    return () => window.removeEventListener('selectTier', handleTierSelection as EventListener);
  }, []);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    club: '',
    country: '',
    dateOfBirth: '',
    leagueOptIn: false,
    waitlistOptIn: false
  });
  const [formError, setFormError] = useState('');

  // Age calculation helper
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validate required fields
    if (!userProfile.name || !userProfile.email || !userProfile.club || !userProfile.country || !userProfile.dateOfBirth) {
      setFormError('Please fill in all required fields');
      return;
    }

    // Admin bypass for development
    if (userProfile.email && import.meta.env.ADMIN_EMAILS?.includes(userProfile.email)) {
      // console.log('🔑 ADMIN ACCESS GRANTED - Full site access enabled');
      // Store admin access securely
      grantAdminAccess();
      
      // Grant immediate access without validation
      setStatus('success');
      setFormError('');
      
      // Show admin success message
      setTimeout(() => {
        alert('🔑 Admin Access Granted! Full site access enabled. You can now access all features including Player Comparison and premium content.');
      }, 500);
      
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userProfile.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Age verification
    const age = calculateAge(userProfile.dateOfBirth);
    if (age < 13) {
      setFormError('You must be at least 13 years old to join');
      return;
    }

    setStatus('loading');
    
    try {
      // Save to Supabase first
      const { supabaseService } = await import('../services/supabase');
      const savedUser = await supabaseService.saveLeagueUser({
        email: userProfile.email,
        name: userProfile.name,
        tier: selectedTier,
        league_opt_in: userProfile.leagueOptIn,
        waitlist_opt_in: userProfile.waitlistOptIn,
        fpl_team_name: userProfile.club,
        country: userProfile.country,
        date_of_birth: userProfile.dateOfBirth,
        fpl_id: null,
        fpl_integration_level: selectedTier === 'free' ? 'none' : selectedTier === 'firstTeam' ? 'basic' : 'advanced'
      });
      
      // console.log('Newsletter signup saved to Supabase:', {
      //   tier: selectedTier,
      //   foundingMember: savedUser.founding_member,
      //   foundingMemberNumber: savedUser.founding_member_number,
      //   ...userProfile
      // });
      
      // If they're a founding member, log special message
      if (savedUser.founding_member && savedUser.founding_member_number) {
        // console.log(`🎉 FOUNDING MEMBER #${savedUser.founding_member_number} - Locked at £49.99 forever!`);
      }

      // Show success message for all tiers
      setStatus('success');
      
      // For paid tiers, prepare Stripe session but don't redirect yet
      if (selectedTier === 'firstTeam' || selectedTier === 'seasonPass') {
        try {
          const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userProfile.email,
              name: userProfile.name,
              tier: selectedTier,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create payment session');
          }

          const { sessionId, url } = await response.json();
          
          // Show thank you message, then redirect to payment after 3 seconds
          setTimeout(() => {
            window.location.href = url;
          }, 3000);
        } catch (error) {
          // console.error('Payment session creation failed:', error);
          setFormError('Payment setup failed. Please try again or contact support.');
          setStatus('idle');
          return;
        }
      }
      
      // Reset form
      setUserProfile({
        name: '',
        email: '',
        club: '',
        country: '',
        dateOfBirth: '',
        leagueOptIn: false,
        waitlistOptIn: false
      });
      
      // Scroll to top of form
      const formElement = document.getElementById('newsletter-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      // console.error('Newsletter signup failed:', error);
      setFormError('Signup failed. Please try again.');
      setStatus('idle');
    }
  };

  const tiers = [
    {
      id: 'free',
      name: 'Free Newsletter',
      price: 'FREE',
      description: 'All the essential FPL features. No credit card required.',
      icon: 'fa-envelope',
      color: 'from-blue-600 to-blue-700',
      benefits: [
        '🏆 Enter Gaffer\'s Community League Lottery (Random selection before 2026-27 season starts - 50 exclusive spots)',
        '👑 Weekly Captain Picks (Saturday 9 AM - Basic)',
        '📈 Live Price Updates & Market Trends',
        '🏥 Injury News & Team Updates',
        '⚽ Live Match Scores & Goal Events',
        '⚖️ Player Comparison Tools - 1 per week (teaser)',
        '📊 Basic Player Statistics & Form',
        '🎯 Fixture Difficulty Ratings',
        '🌤️ Weather Impact Analysis',
        '📧 1 Email Per Week (No Spam!)'
      ]
    },
    {
      id: 'firstTeam',
      name: 'First Team',
      price: '£2.99/week',
      description: 'The competitive edge. Get information 24 hours before everyone else.',
      icon: 'fa-star',
      color: 'from-purple-600 to-purple-700',
      benefits: [
        '🏆 Enter Gaffer\'s Community League Lottery (Random selection before 2026-27 season starts - 50 exclusive spots)',
        '🤖 AI Chat Assistant - Ask The Gaffer 24/7 (10 questions/day)',
        '💬 Instant Transfer Advice - Get recommendations in seconds',
        '🎯 Captain Questions - Real-time captaincy help',
        '🏥 Injury Queries - Ask about specific player fitness',
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
        '🎲 Bench Boost Optimizer (Optimal bench selections)',
        'Everything in FREE'
      ]
    },
    {
      id: 'seasonPass',
      name: foundingMemberSoldOut ? 'Season Pass' : 'Founding Member',
      price: foundingMemberSoldOut ? '£59.99' : '£49.99',
      description: foundingMemberSoldOut ? 'Full season access. Regular price £59.99/season.' : 'Lock in £49.99/season FOREVER. Limited slots available.',
      icon: foundingMemberSoldOut ? 'fa-star' : 'fa-crown',
      color: 'from-yellow-600 to-orange-600',
      benefits: [
        '🏆 Enter Gaffer\'s Community League Lottery (Random selection before 2026-27 season starts - 50 exclusive spots)',
        '🤖 AI Chat Assistant - Ask The Gaffer 24/7 (UNLIMITED)',
        '💬 Instant Transfer Advice - Unlimited questions',
        '🎯 Captain Questions - Priority responses',
        '🏥 Injury Queries - Advanced analysis',
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
        'Everything in FIRST TEAM'
      ]
    }
  ];

  return (
    <section className="bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Founding Member Availability with Heat Map */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <i className="fas fa-users text-orange-500 text-xl"></i>
            <h3 className="text-xl font-bold text-white">Founding Member Availability</h3>
          </div>
          
          {/* Heat Map Visualization */}
          <div className="mb-6 relative">
            {/* Gaffer-style Heat Map Bar */}
            <div className="h-6 w-full bg-slate-700 rounded-full overflow-hidden shadow-inner relative">
              <div 
                className="h-full absolute top-0 left-0 bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-600 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${100 - foundingAvailabilityPercentage}%` }} // Inverted - shows filled spots
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-marquee"></div>
              </div>
            </div>
            
            {/* Urgency Overlay - Only shows when almost gone */}
            {foundingAvailabilityPercentage <= 15 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse">
                  <span className="text-white font-bold text-sm">
                    {foundingAvailabilityPercentage <= 5 ? 'HURRY! ALMOST GONE!' : 
                     foundingAvailabilityPercentage <= 10 ? 'LAST FEW SPOTS!' : 
                     'GET YOURS BEFORE THEY\'RE GONE!'}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-slate-400">
              <strong>Limited founding member slots available</strong> - lock in £49.99/season pricing FOREVER. Regular price increases to £59.99 next season. When slots are filled, this opportunity never returns.
            </p>
            <button 
              onClick={() => {
                // console.log('Founding Member CTA clicked');
                setSelectedTier('seasonPass');
                
                // Scroll to form
                setTimeout(() => {
                  const formElement = document.getElementById('newsletter-form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    formElement.classList.add('ring-4', 'ring-red-500', 'ring-opacity-50');
                    setTimeout(() => {
                      formElement.classList.remove('ring-4', 'ring-red-500', 'ring-opacity-50');
                    }, 2000);
                  }
                }, 100);
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105"
            >
              <i className="fas fa-crown mr-2"></i>
              Claim Your Founding Member Spot
            </button>
          </div>
        </div>

        {/* Premium Comparison Table */}
        <div className="mb-8">
          <PremiumComparisonTable />
        </div>

        {/* Simplified Tier Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-slate-800 rounded-2xl border-2 p-6 relative hover:scale-105 transition-transform cursor-pointer
                ${selectedTier === tier.id 
                  ? tier.id === 'free' ? 'border-blue-500/50 shadow-2xl' :
                    tier.id === 'firstTeam' ? 'border-green-500/50 shadow-2xl' :
                    'border-yellow-500/50 shadow-2xl'
                  : tier.id === 'free' ? 'border-blue-500/30' :
                    tier.id === 'firstTeam' ? 'border-green-500/30' :
                    'border-yellow-500/30'
                }
              `}
              onClick={() => setSelectedTier(tier.id as 'free' | 'firstTeam' | 'seasonPass')}
            >
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {tier.price}
                </div>
                <p className="text-slate-400 text-sm mt-2">{tier.description}</p>
              </div>

              {/* Get Started Button */}
              <div className="text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(tier.id as 'free' | 'firstTeam' | 'seasonPass');
                    
                    // Scroll to form
                    setTimeout(() => {
                      const formElement = document.getElementById('newsletter-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        formElement.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
                        setTimeout(() => {
                          formElement.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50');
                        }, 2000);
                      }
                    }, 100);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all
                    ${tier.id === 'free' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      : tier.id === 'firstTeam'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900'
                    }`}
                >
                  {tier.id === 'free' ? (
                    <>
                      <i className="fas fa-envelope mr-2"></i>
                      Sign Up Free
                    </>
                  ) : (
                    <>
                      Get {tier.name}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Signup Form */}
        <div id="newsletter-form" className="max-w-2xl mx-auto transition-all duration-300">
          <div className={`bg-slate-800 rounded-2xl p-8 border-2 transition-all duration-300
            ${selectedTier 
              ? 'border-red-500/50 shadow-2xl' 
              : 'border-slate-700'
            }`}>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              {selectedTier 
                ? `Get Started with ${tiers.find(t => t.id === selectedTier)?.name}`
                : 'Choose Your Tier Above'
              }
            </h3>
            
            {!selectedTier && (
              <div className="text-center mb-4">
                <p className="text-slate-400 text-lg mb-2">
                  👆 Select a tier above to get started
                </p>
                <div className="flex justify-center gap-4 text-sm flex-wrap">
                  <div className="bg-blue-500/10 rounded-lg px-4 py-2 border border-blue-500/30">
                    <span className="text-blue-300">🆓 Free - Basic features</span>
                  </div>
                  <div className="bg-green-500/10 rounded-lg px-4 py-2 border border-green-500/30">
                    <span className="text-green-300">⭐ First Team - Premium</span>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg px-4 py-2 border border-yellow-500/30">
                    <span className="text-yellow-300">👑 Season Pass - Ultimate</span>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your Name *
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your full name..." 
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  disabled={status === 'loading' || !selectedTier}
                  className="w-full px-4 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  placeholder="your@email.com..." 
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  disabled={status === 'loading' || !selectedTier}
                  className="w-full px-4 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70"
                  required
                />
              </div>

              {/* Date of Birth Field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <i className="fas fa-birthday-cake text-blue-400"></i>
                  Date of Birth *
                  <span className="relative inline-block">
                    <i className="fas fa-info-circle text-blue-300 text-xs cursor-help"></i>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-72 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl border border-blue-500/30 z-10">
                      <div className="font-bold text-blue-300 mb-1">🎂 Gaffer's Age Policy:</div>
                      <p className="text-slate-300">Must be 13+ to join. We use this to make sure you're old enough to handle the tactical genius we're about to drop on you. Plus, helps us sort the kids from the proper football fans.</p>
                      <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </span>
                </label>
                <input 
                  type="date" 
                  value={userProfile.dateOfBirth}
                  onChange={(e) => setUserProfile({...userProfile, dateOfBirth: e.target.value})}
                  disabled={status === 'loading' || !selectedTier}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70"
                  required
                />
              </div>

              {/* Club Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your Club *
                </label>
                <ClubDropdown
                  value={userProfile.club}
                  onChange={(club) => setUserProfile({...userProfile, club})}
                  className="w-full"
                />
              </div>

              {/* Country Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Country *
                </label>
                <CountryDropdown
                  value={userProfile.country}
                  onChange={(country) => setUserProfile({...userProfile, country})}
                  className="w-full"
                />
              </div>

              {/* Gaffer's League Opt-In */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-400"></i>
                  🏆 Gaffer's League - Exclusive Competition
                </h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={userProfile.leagueOptIn}
                      onChange={(e) => setUserProfile({...userProfile, leagueOptIn: e.target.checked})}
                      disabled={status === 'loading' || !selectedTier}
                      className="mt-1 w-4 h-4 rounded"
                    />
                    <div className="text-sm text-blue-100">
                      <strong className="text-white">Yes, I want to be considered for the Gaffer's League!</strong>
                      <p className="mt-1 text-blue-200">
                        Only <strong>50 managers</strong> will be randomly selected for each tier's exclusive league. 
                        All applicants have a <strong>fair and equal chance</strong> to join this prestigious competition. 
                        Selection happens <strong>~2 weeks before the season starts</strong>.
                      </p>
                    </div>
                  </label>
                  
                  {userProfile.leagueOptIn && (
                    <label className="flex items-start gap-3 cursor-pointer ml-7">
                      <input 
                        type="checkbox" 
                        checked={userProfile.waitlistOptIn}
                        onChange={(e) => setUserProfile({...userProfile, waitlistOptIn: e.target.checked})}
                        disabled={status === 'loading' || !selectedTier}
                        className="mt-1 w-4 h-4 rounded"
                      />
                      <div className="text-sm text-blue-100">
                        <strong className="text-white">Add me to the waitlist if not selected</strong>
                        <p className="mt-1 text-blue-200">
                          Get priority access for next season and notifications if spots become available.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
                
                <div className="mt-3 bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-blue-200">
                    <i className="fas fa-info-circle mr-1"></i>
                    <strong>ONLY THE FEW WILL COMPETE:</strong> This is the most exclusive FPL league. 
                    We'll keep you updated via email approximately 2 weeks before the season starts.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-sm text-red-200">{formError}</p>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={status === 'loading' || !selectedTier}
                className={`w-full py-4 font-bold rounded-xl text-lg transition-all min-h-[56px] flex items-center justify-center
                  ${!selectedTier
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : status === 'success' && !isAdminAccess()
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-default' 
                    : status === 'success' && isAdminAccess()
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                    : selectedTier === 'free'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      : selectedTier === 'firstTeam'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900'}`}
              >
                {status === 'loading' ? (
                  <div className="flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Saving your details...</span>
                  </div>
                ) : status === 'success' && !isAdminAccess() ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-2xl"></i>
                      <span className="text-lg">Thank You, {userProfile.name.split(' ')[0]}!</span>
                    </div>
                    <span className="text-sm opacity-90">
                      {selectedTier === 'free' 
                        ? '✅ You\'re in! Check your email for confirmation.' 
                        : selectedTier === 'firstTeam' 
                        ? '🚀 Redirecting to payment...' 
                        : '👑 Redirecting to secure checkout...'}
                    </span>
                  </div>
                ) : status === 'success' && isAdminAccess() ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-key text-2xl"></i>
                      <span className="text-lg">🔑 Admin Access Active!</span>
                    </div>
                    <span className="text-sm opacity-90">
                      Full site access enabled - Continue testing
                    </span>
                  </div>
                ) : !selectedTier ? (
                  <span>Select a tier to get started</span>
                ) : (
                  <span>
                    {selectedTier === 'free' ? 'Join Free - No Credit Card' : 
                     selectedTier === 'firstTeam' ? 'Continue to Payment - £2.99/week' : 
                     'Continue to Payment - £49.99'}
                  </span>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-blue-300 opacity-70">
                No spam. Unsubscribe anytime. Privacy policy applies.
              </p>
              {selectedTier !== 'free' && (
                <p className="text-xs text-blue-300 opacity-70 mt-2">
                  {selectedTier === 'firstTeam' ? '£2.99/month • Cancel anytime' : '£49.99/year • Save £13.89'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;


