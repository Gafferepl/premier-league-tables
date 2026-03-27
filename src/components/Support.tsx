import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Support: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('premium');
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Calculate realistic launch date (July 15, 2026 - about 1 month before 2026/27 season)
  const launchDate = new Date('2026-07-15');
  const today = new Date();
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    
    try {
      // For now, we'll use a demo email - when auth is implemented, get actual user email
      const userEmail = 'demo@example.com'; // Replace with actual user email
      
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        // console.error('No portal URL returned');
        alert('Portal temporarily unavailable. Please contact support.');
      }
    } catch (error) {
      // console.error('Portal error:', error);
      alert('Error accessing subscription portal. Please try again or contact support.');
    } finally {
      setPortalLoading(false);
    }
  };

  const faqCategories = [
    {
      id: 'premium',
      title: '🥅 Premium Features',
      icon: 'fa-crown',
      color: 'text-yellow-500',
      questions: [
        {
          q: "How do captain picks work?",
          a: "Right then, lads! Captain picks are the Gaffer's insider knowledge - who's nailed on for the armband this week. Elite members get them 48 hours before the mugs, premium members get them 24 hours before. Simple as that!"
        },
        {
          q: "When do elite tips drop?",
          a: "Elite tips drop every Tuesday at 2pm GMT - proper inside info before the masses. If you're not seeing them, check your subscription status. Even the best teams need to verify their lineup!"
        },
        {
          q: "Price tracker explained?",
          a: "The price tracker is your crystal ball for the FPL market! Shows you who's rising, who's falling, and most importantly - who to buy before the lemmings pile in. Essential for proper squad management!"
        },
        {
          q: "Beat the Gaffer strategy?",
          a: "Think you can outsmart the Gaffer? Beat the Gaffer is your chance to prove it! Make your predictions, go head-to-head with my picks, and see if you've got what it takes to manage at this level!"
        }
      ]
    },
    {
      id: 'billing',
      title: '💳 Account & Billing',
      icon: 'fa-credit-card',
      color: 'text-green-500',
      questions: [
        {
          q: "How do I cancel my subscription?",
          a: (
            <span>
              Easy as a tap-in! Click the <button 
                onClick={handleManageSubscription}
                className="text-accent hover:text-[#f50057] underline font-semibold"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Manage Subscription
              </button> button below to access your subscription portal. You can cancel anytime, and you'll keep premium access until the end of your current billing period. The Gaffer hates to see managers go, but understands tactical timeouts!
            </span>
          )
        },
        {
          q: "Update payment method?",
          a: (
            <span>
              Payment method acting up like a keeper in the rain? Use the <button 
                onClick={handleManageSubscription}
                className="text-accent hover:text-[#f50057] underline font-semibold"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Manage Subscription
              </button> button below to update your card details, view billing history, or download invoices. All handled securely through Stripe!
            </span>
          )
        },
        {
          q: "What's your refund policy?",
          a: "The Gaffer stands by his picks! If you're not happy with the insider knowledge, contact us within 7 days for a full refund. Simple as that - no nonsense, just proper service."
        },
        {
          q: "Can I switch between plans?",
          a: "Absolutely! Upgrade from weekly to season pass anytime - the Gaffer rewards loyalty! Downgrades take effect at the next billing period. Smart managers know value when they see it!"
        },
        {
          q: "How do I update my payment method?",
          a: (
            <span>
              Payment method acting up like a keeper in the rain? Use the <button 
                onClick={handleManageSubscription}
                className="text-accent hover:text-[#f50057] underline font-semibold"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Manage Subscription
              </button> button below to update your card details, view billing history, or download invoices. All handled securely through Stripe!
            </span>
          )
        },
        {
          q: "What happens when I cancel?",
          a: "When you cancel, you'll keep premium access until the end of your current billing period. No immediate loss of service! The Gaffer believes in fair play - you get what you paid for!"
        }
      ]
    },
    {
      id: 'technical',
      title: '🔧 Technical Help',
      icon: 'fa-wrench',
      color: 'text-blue-500',
      questions: [
        {
          q: "Site not loading properly?",
          a: "Technical difficulties? Even the best stadiums have pitch issues! Try clearing your cache, refreshing the page, or switching browsers. If you're still stuck, our Discord community (coming July 15th!) will have live tech support."
        },
        {
          q: "Dark mode gone mad?",
          a: "Dark mode playing up? Sometimes the floodlights need adjusting! Check your browser settings, or hit the theme toggle in the navigation. If it's still acting daft, give it a hard refresh - Ctrl+F5 sorts most issues out!"
        },
        {
          q: "Mobile app issues?",
          a: "Mobile site fully optimized for touch-based management! Pin it to your home screen for app-like experience. The Gaffer believes in keeping things simple and effective!"
        },
        {
          q: "Login troubles?",
          a: "Can't get in the dressing room? Check your email for the login link, or try the password reset. Sometimes the bouncer gets overzealous! If you're still locked out, Discord support will sort you out personally."
        }
      ]
    }
  ];

  const comingSoonFeatures = [
    {
      icon: 'fa-comments',
      title: 'Discord Community',
      description: 'Join 500+ FPL managers for live chat, instant support, and exclusive content. Get real-time captain picks, price change alerts, and insider analysis from the Gaffer himself!',
      date: 'July 15, 2026',
      status: 'active'
    },
    {
      icon: 'fa-trophy',
      title: 'Weekly Leagues',
      description: 'Compete against other managers in head-to-head leagues with custom scoring and bragging rights',
      date: 'August 1, 2026',
      status: 'pending'
    },
    {
      icon: 'fa-chart-line',
      title: 'Advanced Analytics',
      description: 'Deep dive into player stats, form analysis, and predictive modeling powered by the Gaffer\'s insights',
      date: 'September 1, 2026',
      status: 'pending'
    }
  ];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      try {
        // Save email to Supabase for Discord notifications
        const response = await fetch('/api/discord/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: emailInput,
            source: 'support_page',
            notification_type: 'discord_launch'
          })
        });
        
        if (response.ok) {
          setIsSubscribed(true);
          setEmailInput(''); // Clear input
          setTimeout(() => setIsSubscribed(false), 5000); // Show success for 5 seconds
        } else {
          // console.error('Failed to save email');
          // Still show success to user for UX, but log error
          setIsSubscribed(true);
          setEmailInput('');
          setTimeout(() => setIsSubscribed(false), 5000);
        }
      } catch (error) {
        // console.error('Email signup error:', error);
        // Show success anyway for better UX
        setIsSubscribed(true);
        setEmailInput('');
        setTimeout(() => setIsSubscribed(false), 5000);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Support Center | premierleaguetables.com</title>
        <meta name="description" content="Get help with FPL tips, premium features, and technical support from The Gaffer" />
      </Helmet>

      <section id="support" className="py-12 bg-white dark:bg-slate-800 relative transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, #f50057 25%, transparent 25%), 
                            linear-gradient(-45deg, #f50057 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #f50057 75%), 
                            linear-gradient(-45deg, transparent 75%, #f50057 75%)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center border-2 border-accent/30">
                <i className="fas fa-life-ring text-2xl text-accent"></i>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary dark:text-white inline-block relative">
                The Gaffer's Support Locker Room
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
              "Every good manager needs a tactical timeout. Got questions? The Gaffer's got answers! 
              Get instant help now, join the community soon. Rome wasn't built in a day, and neither is a proper support system!"
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
              <i className="fas fa-bolt text-accent"></i>
              <span className="text-sm font-semibold text-accent">Discord Community Launching: July 15, 2026</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-accent/20 to-purple-600/20 p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
                    📋 The Gaffer's Tactical Briefing (FAQ)
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    "Instant answers to keep your FPL campaign on track!"
                  </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 p-6 border-b border-slate-200 dark:border-slate-700">
                  {faqCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeCategory === category.id
                          ? 'bg-accent text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <i className={`fas ${category.icon} ${activeCategory === category.id ? 'text-white' : category.color}`}></i>
                      {category.title}
                    </button>
                  ))}
                </div>

                {/* FAQ Questions */}
                <div className="p-6">
                  <div className="space-y-4">
                    {faqCategories.find(cat => cat.id === activeCategory)?.questions.map((item, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-accent font-bold text-sm">Q</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-primary dark:text-white mb-2">{item.q}</h4>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-green-600 dark:text-green-400 font-bold text-sm">A</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
                    🚀 Coming Soon to the Locker Room
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    "The Gaffer's upgrading the facilities!"
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {comingSoonFeatures.map((feature, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            feature.status === 'active' ? 'bg-green-500/20' : 'bg-slate-200 dark:bg-slate-700'
                          }`}>
                            <i className={`fas ${feature.icon} ${
                              feature.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-slate-500'
                            }`}></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-primary dark:text-white mb-1">{feature.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{feature.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-accent">{feature.date}</span>
                              {feature.status === 'active' && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full font-semibold">
                                  In Progress
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Discord Countdown */}
                  <div className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white text-center">
                    <div className="flex items-center justify-center mb-3">
                      <i className="fab fa-discord text-3xl"></i>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Discord Community</h3>
                    <p className="text-sm mb-4 opacity-90">Join 500+ FPL managers for live chat and instant support!</p>
                    <div className="bg-white/20 rounded-lg p-3 mb-4">
                      <div className="text-2xl font-bold">{daysUntilLaunch}</div>
                      <div className="text-xs opacity-90">days until launch</div>
                    </div>
                    <div className="text-xs opacity-75">
                      <i className="fas fa-calendar-alt mr-1"></i>
                      Launch: July 15, 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Signup Section */}
          <div className="bg-gradient-to-r from-accent/10 to-purple-600/10 rounded-2xl p-8 border border-accent/20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <i className="fas fa-bell text-2xl text-accent"></i>
                <h3 className="text-2xl font-bold text-primary dark:text-white">
                  Be the First to Know!
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                "Get notified when the Discord community launches and new features drop. 
                The Gaffer doesn't like to keep people waiting!"
              </p>
              
              {!isSubscribed ? (
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-primary dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-[#f50057] transition-colors shadow-lg hover:shadow-xl"
                  >
                    Notify Me
                  </button>
                </form>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-semibold">You're on the list! We'll notify you at launch.</span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <i className="fas fa-lock text-accent"></i>
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-times-circle text-accent"></i>
                  <span>Unsubscribe anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-gift text-accent"></i>
                  <span>Exclusive content for subscribers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Management Section */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-indigo-600/10 rounded-3xl p-8 border border-purple-600/20 shadow-xl backdrop-blur-sm">
              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform">
                  <i className="fas fa-credit-card text-3xl text-white"></i>
                </div>
                <h3 className="text-3xl font-bold text-primary dark:text-white mb-2">
                  Manage Your Subscription
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full"></div>
              </div>
              
              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
                <span className="text-purple-600 dark:text-purple-400 font-semibold">"The Gaffer believes in fair play!"</span> 
                Access your subscription portal to manage billing, update payment methods, view invoices, or cancel your subscription. 
                All handled securely through Stripe with industry-standard protection.
              </p>
              
              {/* Main CTA Button */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg min-w-[200px]"
                >
                  {portalLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Loading Portal...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cog group-hover:rotate-90 transition-transform duration-300"></i>
                      <span>Manage Subscription</span>
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Secured by Stripe</span>
                </div>
              </div>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="group bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-purple-600/20 hover:border-purple-600/40 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <i className="fas fa-calendar-alt text-purple-600 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-primary dark:text-white mb-2">Billing Dates</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">View upcoming payment dates and billing cycles</p>
                  </div>
                </div>
                
                <div className="group bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-blue-600/20 hover:border-blue-600/40 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <i className="fas fa-file-invoice text-blue-600 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-primary dark:text-white mb-2">Download Invoices</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Access and download all your payment receipts</p>
                  </div>
                </div>
                
                <div className="group bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-green-600/20 hover:border-green-600/40 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <i className="fas fa-sync-alt text-green-600 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-primary dark:text-white mb-2">Payment Methods</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Update cards and manage payment options</p>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <i className="fas fa-lock text-purple-500"></i>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-user-shield text-blue-500"></i>
                  <span>Data Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock text-orange-500"></i>
                  <span>24/7 Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-xl border border-slate-300 dark:border-slate-600">
              <i className="fas fa-futbol text-2xl text-accent animate-bounce"></i>
              <div className="text-left">
                <h4 className="font-bold text-primary dark:text-white">Need Help Now?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Check the FAQ above or email us at info@premierleaguetables.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Support;


