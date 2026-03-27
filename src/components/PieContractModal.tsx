
import React, { useState } from 'react';

interface PieContractModalProps {
  onClose: () => void;
}

const PieContractModal: React.FC<PieContractModalProps> = ({ onClose }) => {
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigned(true);
    // Open Ko-Fi link after signature animation completes
    setTimeout(() => {
      window.open('https://ko-fi.com/thegaffer', '_blank');
    }, 4000); // Open after 4 seconds (signature animation duration)
    // Close modal after animation finishes + delay
    setTimeout(() => {
      onClose();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-paper text-dark w-full max-w-xl max-h-[80vh] md:max-h-[90vh] flex flex-col md:transform md:rotate-1 transition-all relative shadow-[0_0_50px_rgba(0,0,0,0.5)] p-1 rounded-sm" 
        onClick={e => e.stopPropagation()}
      >
        {/* Paper visual effects */}
        <div className="bg-[url('https://www.transparenttextures.com/patterns/cream-dust.png')] absolute inset-0 pointer-events-none opacity-50"></div>
        
        {/* "Coffee Stain" effect */}
        <div className="absolute top-4 right-10 w-16 h-16 rounded-full border-4 border-amber-900/20 opacity-60 pointer-events-none hidden md:block"></div>
        
        {/* Main Content Container - Flex-1 ensures it fills available height but doesn't exceed it */}
        <div className="border-4 border-double border-dark/20 p-3 md:p-10 relative flex flex-col flex-1 min-h-0 bg-[#fdfbf7] overflow-hidden">
          
          {/* Vintage Header */}
          <div className="border-b-2 border-dark/80 pb-2 mb-2 md:pb-4 md:mb-4 shrink-0 w-full">
             <h2 className="font-heading font-black text-lg md:text-3xl uppercase tracking-widest text-primary mb-0 md:mb-1 leading-tight">The Gaffer's Pie Pact</h2>
             <div className="flex justify-between font-mono text-[10px] md:text-sm text-dark/60 uppercase mt-1 md:mt-2">
                <span>Ref: PIE-1976-V2</span>
                <span className="text-red-700 font-bold border border-red-700 px-1 rotate-[-4deg]">CONFIDENTIAL</span>
             </div>
          </div>

          {/* Contract Body - Scrollable Area */}
          <div className="font-mono text-xs md:text-base leading-relaxed space-y-3 text-left w-full flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 overscroll-contain">
             <p><strong>I, THE UNDERSIGNED</strong> (hereafter 'The Legend'), agree to purchase one (1) meat and potato pie for the lads at <span className="underline decoration-dotted">PremierLeagueTables.com</span>.</p>
             
             <p><strong>CLAUSE 1: TEMPERATURE</strong><br/>The pie must be of regulation temperature (approximately the heat of the sun).</p>
             
             <p><strong>CLAUSE 2: CONDIMENTS</strong><br/>Must be consumed with an excessive quantity of brown sauce. No red sauce allowed under Section 4 of the Gaffer's Rulebook.</p>
             
             <div className="bg-yellow-100/50 p-2 border-l-2 border-primary text-[10px] md:text-xs italic mt-2">
               "By signing this, I waive my right to complain about VAR for exactly 24 hours."
             </div>

             {/* Bottom padding to ensure text doesn't touch the signature area when scrolled */}
             <div className="h-4"></div>
          </div>

          {/* Signature Area - Fixed Footer */}
          <div className="w-full flex flex-col items-center mt-auto relative shrink-0 pt-2 border-t border-dashed border-dark/10 bg-[#fdfbf7] z-10">
             <div className="w-full border-b-2 border-dark border-dashed mb-1 md:mb-2 relative h-14 md:h-32 flex items-end justify-center overflow-visible">
                
                {/* Pie Seal/Stamp */}
                <div className="absolute top-0 right-2 md:top-2 md:right-8 opacity-90 rotate-12 pointer-events-none mix-blend-multiply">
                  <img src="/pie.svg" alt="Pie Seal" className="w-12 h-12 md:w-24 md:h-24 object-contain drop-shadow-sm opacity-60" />
                </div>

                {/* Mickey Mouse Signature Animation */}
                {signed && (
                   <svg viewBox="0 0 600 200" className="absolute bottom-[-5px] md:bottom-[-20px] left-1/2 -translate-x-1/2 w-full max-w-md h-20 md:h-40 overflow-visible pointer-events-none z-10">
                      <defs>
                        <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
                          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
                          <feGaussianBlur stdDeviation="0.3" />
                        </filter>
                      </defs>
                      
                      <g filter="url(#ink-bleed)">
                        {/* Mickey - Big Loopy M */}
                        <path 
                          d="M 80 150 C 60 80, 50 50, 100 50 C 130 50, 130 120, 130 150 M 130 130 C 130 80, 160 50, 190 50 C 220 50, 220 120, 220 150 C 220 150, 230 150, 240 140"
                          fill="none" 
                          stroke="#000080" 
                          strokeWidth="4" 
                          strokeDasharray="3000"
                          strokeDashoffset="3000"
                          className="animate-draw"
                          style={{ strokeLinecap: 'round', strokeLinejoin: 'round', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out' }}
                        />
                        
                        {/* "ickey" Cursive letters */}
                        <path
                          d="M 240 140 C 245 130, 250 130, 250 140 C 250 150, 255 150, 260 140 C 265 130, 270 130, 270 140 C 270 150, 275 150, 280 140 C 285 130, 290 110, 290 100 L 290 140 C 290 150, 295 150, 300 140 C 305 130, 310 130, 315 140 C 315 150, 320 150, 325 140"
                          fill="none" 
                          stroke="#000080" 
                          strokeWidth="4"
                          strokeDasharray="3000"
                          strokeDashoffset="3000"
                          className="animate-draw"
                          style={{ strokeLinecap: 'round', strokeLinejoin: 'round', animationDuration: '1s', animationDelay: '1.4s', animationFillMode: 'both' }}
                        />

                        {/* Dot for i */}
                        <path 
                          d="M 250 110 L 250 112" 
                          fill="none" 
                          stroke="#000080" 
                          strokeWidth="5" 
                          className="animate-draw"
                          style={{ animationDuration: '0.1s', animationDelay: '1.3s', animationFillMode: 'both' }}
                        />
                        
                        {/* Mouse - M and letters */}
                        <path 
                          d="M 350 150 C 340 100, 360 60, 380 60 C 400 60, 400 120, 400 150 M 400 130 C 400 90, 420 60, 440 60 C 460 60, 460 120, 460 150 C 460 150, 470 150, 480 140 C 485 130, 490 130, 495 140 C 495 150, 500 150, 505 140 C 510 130, 515 130, 520 140 C 520 150, 525 150, 530 140"
                          fill="none" 
                          stroke="#000080" 
                          strokeWidth="4" 
                          strokeDasharray="3000"
                          strokeDashoffset="3000"
                          className="animate-draw" 
                          style={{ strokeLinecap: 'round', strokeLinejoin: 'round', animationDuration: '1.5s', animationDelay: '2.2s', animationFillMode: 'both' }}
                        />

                        {/* Underline Swoosh */}
                        <path 
                          d="M 60 170 Q 300 210, 550 160"
                          fill="none" 
                          stroke="#000080" 
                          strokeWidth="5"
                          strokeDasharray="3000"
                          strokeDashoffset="3000"
                          className="animate-draw"
                          style={{ strokeLinecap: 'round', animationDuration: '0.6s', animationDelay: '3.5s', animationFillMode: 'both' }}
                        />
                      </g>
                   </svg>
                )}
                
                <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-wider text-dark/50 absolute bottom-[-16px] md:bottom-[-18px]">(Sign Here)</span>
             </div>
             
             {!signed ? (
               <button 
                  onClick={handleSign}
                  className="mt-3 md:mt-6 mb-2 px-5 py-3 md:px-8 md:py-3 bg-primary text-white font-heading font-bold text-sm md:text-lg uppercase tracking-wider shadow-lg hover:bg-blue-800 hover:-translate-y-1 transition-all transform md:rotate-[-1deg] flex items-center gap-2 group z-20"
               >
                  <i className="fas fa-pen-fancy group-hover:animate-pulse"></i> I Agree
               </button>
             ) : (
               <div className="mt-4 md:mt-10 mb-2 animate-stamp transform rotate-[-12deg] border-4 border-red-700 text-red-700 p-2 font-black text-xl md:text-3xl uppercase opacity-0 tracking-tighter bg-red-100/80 backdrop-blur-sm rounded shadow-xl z-20">
                  Contract Sealed
               </div>
             )}
          </div>

          {/* Close X */}
          <button onClick={onClose} className="absolute top-2 right-2 text-dark/40 hover:text-highlight transition-colors p-2 z-50">
             <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PieContractModal;


