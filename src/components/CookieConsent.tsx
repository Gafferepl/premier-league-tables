import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('gaffer_cookie_consent');
    // console.log('Cookie consent check:', hasConsented);
    
    // Development mode - set to true to always show for testing
    const isDevelopment = import.meta.env.DEV;
    const forceShow = isDevelopment && false; // Change to true for testing
    
    if (!hasConsented || forceShow) {
      setShowConsent(true);
      // console.log('Showing cookie consent');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gaffer_cookie_consent', 'accepted');
    localStorage.setItem('gaffer_analytics_consent', 'true');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gaffer_cookie_consent', 'declined');
    localStorage.setItem('gaffer_analytics_consent', 'false');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a472a] text-white p-4 z-50 border-t-4 border-[#d4af37]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Gaffer Icon */}
          <div className="flex-shrink-0">
            <div className="bg-white p-1 rounded-full border-2 border-[#d4af37] shadow-lg">
              <img src="/gaffer-icon.png" alt="Gaffer" className="w-12 h-12 rounded-full object-contain" />
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 text-sm">
            <h3 className="font-bold text-[#d4af37] mb-1">The Gaffer's Cookie Policy</h3>
            <p className="text-green-100 leading-relaxed">
              Right then, listen up. We use proper biscuits—ahem, cookies—to track your predictions, remember your streak, and make sure you don't keep losing to the computer. 
              No funny business, just football stats and making sure the site works properly. 
              <span className="block mt-1 text-xs opacity-90">
                We also use them to see which teams everyone supports so we can have a proper laugh when Arsenal lose again.
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button
              onClick={handleAccept}
              className="bg-[#d4af37] hover:bg-[#b8941f] text-black font-bold px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Accept Proper Biscuits
            </button>
            <button
              onClick={handleDecline}
              className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
            >
              No Biscuits For Me
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="text-xs text-green-200">
            We use proper biscuits to make this site work better. Your data stays with us, no funny business.
            <br />
            <span className="text-xs">The Gaffer's word is his bond.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;


