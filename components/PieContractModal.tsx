import React, { useState } from 'react';

interface PieContractModalProps {
  onClose: () => void;
}

const PieContractModal: React.FC<PieContractModalProps> = ({ onClose }) => {
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigned(true);
    // Close automatically after animation finishes + delay
    setTimeout(() => {
      onClose();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-paper text-dark w-full max-w-xl max-h-[85vh] flex flex-col md:transform md:rotate-1 transition-all relative shadow-[0_0_50px_rgba(0,0,0,0.5)] p-1 rounded-sm" 
        onClick={e => e.stopPropagation()}
      >
        {/* Paper visual effects - Absolute positioning prevents layout interference */}
        <div className="bg-[url('https://www.transparenttextures.com/patterns/cream-dust.png')] absolute inset-0 pointer-events-none opacity-50"></div>
        <div className="absolute top-4 right-10 w-16 h-16 rounded-full border-4 border-amber-900/20 opacity-60 pointer-events-none hidden md:block"></div>
        
        {/* Main Flex Container - Crucial: flex-1 min-h-0 allows nested scrolling */}
        <div className="border-4 border-double border-dark/20 relative flex flex-col flex-1 min-h-0 bg-[#fdfbf7] overflow-hidden">
          
          {/* SECTION 1: HEADER (Fixed - Never Shrinks) */}
          <div className="flex-shrink-0 border-b-2 border-dark/80 p-4 w-full bg-[#fdfbf7] z-20">
             <div className="flex justify-between items-start">
                <div>
                   <h2 className="font-heading font-black text-xl md:text-3xl uppercase tracking-widest text-primary leading-tight">The Gaffer's Pact</h2>
                   <div className="flex gap-2 font-mono text-[10px] md:text-xs text-dark/60 uppercase mt-1">
                      <span>Ref: PIE-V2</span>
                      <span className="text-red-700 font-bold border border-red-700 px-1 rotate-[-2deg]">CONFIDENTIAL</span>
                   </div>
                </div>
                <button onClick={onClose} className="text-dark/40 hover:text-highlight transition-colors p-1 -mt-1 -mr-1">
                   <i className="fas fa-times text-xl"></i>
                </button>
             </div>
          </div>

          {/* SECTION 2: BODY (Scrollable - Takes remaining space) */}
          <div className="flex-grow overflow-y-auto min-h-0 p-4 md:p-6 font-mono text-sm md:text-base leading-relaxed space-y-4 text-left w-full custom-scrollbar overscroll-contain relative z-0">
             <p><strong>I, THE UNDERSIGNED</strong> (hereafter 'The Legend'), agree to purchase one (1) meat and potato pie for the lads at <span className="underline decoration-dotted">PremierLeagueTables.com</span>.</p>
             
             <p><strong>CLAUSE 1: TEMPERATURE</strong><br/>The pie must be of regulation temperature (approximately the heat of the sun).</p>
             
             <p><strong>CLAUSE 2: CONDIMENTS</strong><br/>Must be consumed with an excessive quantity of brown sauce. No red sauce allowed under Section 4 of the Gaffer's Rulebook.</p>
             
             <p><strong>CLAUSE 3: VAR</strong><br/>I agree that VAR was a mistake, unless it benefits my team, in which case it is "technology moving the game forward".</p>

             <div className="bg-yellow-100/50 p-3 border-l-2 border-primary text-xs italic mt-2">
               "By signing this, I confirm I am not a referee, a VAR official, or anyone who thinks half-and-half scarves are acceptable."
             </div>
             
             {/* Extra spacer at bottom so text doesn't look cramped against footer line */}
             <div className="h-2"></div>
          </div>

          {/* SECTION 3: FOOTER (Fixed - Never Shrinks) */}
          <div className="flex-shrink-0 p-4 border-t border-dashed border-dark/20 bg-[#fdfbf7] z-20 w-full flex flex-col items-center justify-center relative shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
             
             {/* Signature Box */}
             <div className="w-full border-b-2 border-dark border-dashed mb-4 relative h-16 md:h-24 flex items-end justify-center overflow-visible">
                
                {/* Stamp */}
                <div className="absolute top-0 right-0 md:right-4 opacity-90 rotate-12 pointer-events-none mix-blend-multiply">
                  <img src="/pie.svg" alt="Pie Seal" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm opacity-60" />
                </div>

                {/* Mickey Mouse Signature Animation */}
                {signed && (
                   <svg viewBox="0 0 600 200" className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-full max-w-sm h-24 overflow-visible pointer-events-none z-10">
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
                
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-wider text-dark/40 absolute -bottom-4 left-0">(Sign Here)</span>
             </div>
             
             {!signed ? (
               <button 
                  onClick={handleSign}
                  className="w-full md:w-auto px-6 py-3 md:px-10 bg-primary text-white font-heading font-bold text-base md:text-lg uppercase tracking-wider shadow-lg hover:bg-blue-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group z-30 rounded"
               >
                  <i className="fas fa-pen-fancy group-hover:animate-pulse"></i> Sign The Pact
               </button>
             ) : (
               <div className="animate-stamp transform rotate-[-8deg] border-4 border-red-700 text-red-700 p-2 font-black text-xl md:text-2xl uppercase opacity-0 tracking-tighter bg-red-100/90 backdrop-blur-sm rounded shadow-xl z-30 inline-block">
                  AGREED
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieContractModal;