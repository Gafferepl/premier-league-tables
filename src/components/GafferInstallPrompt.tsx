import React, { useState, useEffect } from 'react';

const GafferInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Development mode - set to true to always show for testing
    const isDevelopment = import.meta.env.DEV;
    const forceShow = isDevelopment && false; // Change to true for testing
    
    // Check if cookies have been consented to first
    const cookieConsent = localStorage.getItem('gaffer_cookie_consent');
    if (!cookieConsent && !forceShow) {
      // console.log('Waiting for cookie consent before showing install prompt');
      return;
    }
    
    // Check if previously dismissed
    const isDismissed = localStorage.getItem('gaffer_install_dismissed');
    if (isDismissed && !forceShow) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches && !forceShow) {
      return; // Already installed, don't show prompt
    }

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Store globally for access from other components
      (window as any).deferredPrompt = e;
      // Wait a moment before showing it, so it feels like the Gaffer is assessing you
      setTimeout(() => setShowPrompt(true), 15000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also check if there's already a deferredPrompt from global scope
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
      setTimeout(() => setShowPrompt(true), 15000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Listen for cookie consent changes
  useEffect(() => {
    const handleCookieConsent = () => {
      const cookieConsent = localStorage.getItem('gaffer_cookie_consent');
      if (cookieConsent && deferredPrompt && !showPrompt) {
        // Show install prompt after cookie consent
        setTimeout(() => setShowPrompt(true), 2000); // 2 second delay after consent
      }
    };

    // Listen for storage changes (cookie consent)
    window.addEventListener('storage', handleCookieConsent);
    
    return () => window.removeEventListener('storage', handleCookieConsent);
  }, [deferredPrompt, showPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // console.log('Install prompt not available');
      return;
    }
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstalled(true);
        setShowPrompt(false);
        // Clear the deferred prompt
        setDeferredPrompt(null);
        (window as any).deferredPrompt = null;
        // Gaffer approves
        setTimeout(() => setInstalled(false), 5000);
        
        // Track installation event
        if (typeof (window as any).trackEvent === 'function') {
          (window as any).trackEvent('pwa_install', {
            event_category: 'engagement',
            event_label: 'install_accepted'
          });
        }
      } else {
        // User declined
        // console.log('User declined install');
        if (typeof (window as any).trackEvent === 'function') {
          (window as any).trackEvent('pwa_install', {
            event_category: 'engagement',
            event_label: 'install_declined'
          });
        }
      }
    } catch (error) {
      // console.error('Install prompt error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('gaffer_install_dismissed', 'true');
  };

  if (installed) {
      return (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-slow" data-html2canvas-ignore>
              <div className="bg-[#1a472a] text-[#d4af37] px-6 py-3 rounded-full border-2 border-[#d4af37] shadow-2xl flex items-center gap-3">
                  <i className="fas fa-check-circle text-xl"></i>
                  <span className="font-mono font-bold">"Cheers, lad. I live here now."</span>
              </div>
          </div>
      );
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in" data-html2canvas-ignore>
      {/* Chalkboard Card */}
      <div className="bg-[#1a472a] rounded-2xl border-4 border-[#d4af37] shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden relative max-w-md w-full animate-slide-up">
        
        {/* Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/blackboard.png')] pointer-events-none"></div>
        
        {/* Content */}
        <div className="p-8 relative z-10">
          <div className="flex items-start gap-4">
             <div className="shrink-0 bg-white p-2 rounded-full border-3 border-[#d4af37] shadow-xl">
                <img src="/gaffer-icon.png" alt="Gaffer" className="w-16 h-16 rounded-full object-contain" />
             </div>
             
             <div className="flex-grow">
                <h4 className="font-heading font-black text-[#d4af37] text-xl uppercase tracking-wider mb-2">
                   From the Touchline
                </h4>
                <p className="font-mono text-white text-base leading-relaxed mb-6">
                   "Oi! Stick this on your home screen. It's better than that rubbish news app you've got."
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                   <button 
                     onClick={handleInstallClick}
                     className="flex-1 bg-[#d4af37] text-[#1a472a] font-black uppercase text-base py-4 px-6 rounded-lg shadow-lg hover:bg-white hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px]"
                   >
                      <i className="fas fa-download text-lg"></i> Add Me, Boss
                   </button>
                   <button 
                     onClick={handleDismiss}
                     className="px-6 py-4 bg-white/20 text-white hover:bg-white/30 rounded-lg font-bold text-base transition-all duration-200 min-h-[44px]"
                   >
                      Nah
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Close X */}
        <button 
          onClick={handleDismiss} 
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Close"
        >
           <i className="fas fa-times text-lg"></i>
        </button>

      </div>
    </div>
  );
};

export default GafferInstallPrompt;


