import React, { useState, useEffect } from 'react';

const GafferInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    const isDismissed = localStorage.getItem('gaffer_install_dismissed');
    if (isDismissed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a moment before showing it, so it feels like the Gaffer is assessing you
      setTimeout(() => setShowPrompt(true), 15000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also check if already installed to show the "Cheers" message if recently done
    if (window.matchMedia('(display-mode: standalone)').matches) {
       // Logic to show "Already Here" toast could go here
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setInstalled(true);
      setShowPrompt(false);
      // Gaffer approves
      setTimeout(() => setInstalled(false), 5000);
    }
    setDeferredPrompt(null);
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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 animate-fade-in-up" data-html2canvas-ignore>
      {/* Chalkboard Card */}
      <div className="bg-[#1a472a] rounded-xl border-4 border-[#d4af37] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden relative transform rotate-1">
        
        {/* Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/blackboard.png')] pointer-events-none"></div>
        
        {/* Content */}
        <div className="p-6 relative z-10">
          <div className="flex items-start gap-4">
             <div className="shrink-0 bg-white p-1 rounded-full border-2 border-[#d4af37] shadow-lg">
                <img src="/says.svg" alt="Gaffer" className="w-12 h-12 rounded-full object-contain" />
             </div>
             
             <div className="flex-grow">
                <h4 className="font-heading font-black text-[#d4af37] text-lg uppercase tracking-wider mb-1">
                   From the Touchline
                </h4>
                <p className="font-mono text-white text-sm leading-relaxed mb-4">
                   "Oi! Stick this on your home screen. It's better than that rubbish news app you've got."
                </p>
                
                <div className="flex gap-2">
                   <button 
                     onClick={handleInstallClick}
                     className="flex-1 bg-[#d4af37] text-[#1a472a] font-black uppercase text-sm py-2 px-2 rounded shadow hover:bg-white transition-colors flex items-center justify-center gap-2"
                   >
                      <i className="fas fa-download"></i> Add Me, Boss
                   </button>
                   <button 
                     onClick={handleDismiss}
                     className="px-3 py-2 bg-black/30 text-white/70 hover:text-white rounded font-bold text-sm transition-colors"
                   >
                      Nah
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Close X */}
        <button onClick={handleDismiss} className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors">
           <i className="fas fa-times"></i>
        </button>

      </div>
    </div>
  );
};

export default GafferInstallPrompt;