import React, { useState, useEffect, useRef } from 'react';
import { NAV_LINKS } from '../constants';
import GafferGuides from './GafferGuides';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

/* Primary links shown inline on desktop + bottom tab bar on mobile */
const PRIMARY_IDS = ['league-table', 'fixtures', 'captain-picks', 'price-tracker', 'player-database'];

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState<string>('league-table');
  const [isScrolled, setIsScrolled]       = useState(false);
  const [moreOpen, setMoreOpen]           = useState(false);   // desktop More dropdown
  const [sheetOpen, setSheetOpen]         = useState(false);   // mobile More sheet
  const [guidesOpen, setGuidesOpen]       = useState(false);   // guides drawer
  const moreRef = useRef<HTMLDivElement>(null);

  const primaryLinks   = NAV_LINKS.filter(l => PRIMARY_IDS.includes(l.id));
  const secondaryLinks = NAV_LINKS.filter(l => !PRIMARY_IDS.includes(l.id));
  const isSecondaryActive = secondaryLinks.some(l => l.id === activeSection);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const sections = NAV_LINKS.map(l => document.getElementById(l.id));
      let current = '';
      for (const s of sections) {
        if (s && window.scrollY >= s.offsetTop - 120) current = s.id;
      }
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Close More dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    setActiveSection(id);
    setMoreOpen(false);
    setSheetOpen(false);
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          TOP NAVBAR (desktop + mobile top bar)
      ══════════════════════════════════════════ */}
      <nav id="navigation" className={`fixed top-0 w-full z-50 transition-all duration-500 bg-gradient-to-r from-[#37003c] via-[#2a0845] to-[#37003c] text-white ${isScrolled ? 'shadow-2xl py-2 backdrop-blur-sm' : 'py-3'}`} aria-label="Main navigation">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent animate-shimmer"></div>
        
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 relative z-10">

          {/* Enhanced Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center shadow-lg shadow-[#d4af37]/30 group-hover:scale-110 transition-transform">
                <i className="fas fa-futbol text-black text-lg"></i>
              </div>
              <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center">
              <span className="text-lg md:text-xl font-heading font-black tracking-tight leading-none text-white">
                premierleaguetables
              </span>
              <span className="text-lg md:text-xl font-heading font-bold text-[#d4af37] ml-1 leading-none">
                .com
              </span>
            </div>
          </button>

          {/* ── Enhanced Desktop nav ── */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {primaryLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 group
                  ${activeSection === link.id
                    ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30 border-2 border-[#d4af37]/50'
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-2 border-transparent'}`}
              >
                <i className={`fas ${link.icon} text-sm ${activeSection === link.id ? 'text-black' : 'text-[#d4af37]'}`}></i>
                <span className={activeSection === link.id ? 'text-black' : 'text-white'}>
                  {link.label}
                </span>
                <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#d4af37] to-[#b8941f] rounded-full transition-all duration-300
                  ${activeSection === link.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'} `} />
              </button>
            ))}

            {/* Enhanced More dropdown */}
            {secondaryLinks.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(o => !o)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 border-2 group
                    ${isSecondaryActive || moreOpen
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30 border-[#d4af37]/50'
                      : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent'}`}
                >
                  <span className={isSecondaryActive || moreOpen ? 'text-black' : 'text-white'}>
                    More
                  </span>
                  <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${moreOpen ? 'rotate-180' : ''} ${isSecondaryActive || moreOpen ? 'text-black' : 'text-[#d4af37]'}`}></i>
                </button>

                {moreOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-gradient-to-br from-[#37003c] to-[#2a0845] border-2 border-[#d4af37]/50 rounded-xl shadow-2xl shadow-[#d4af37]/30 overflow-hidden z-50 backdrop-blur-sm">
                    <div className="p-2 border-b border-[#d4af37]/30">
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></div>
                        <span className="text-xs font-black text-[#d4af37] uppercase tracking-wider">
                          GAFFER'S TOOLS
                        </span>
                      </div>
                    </div>
                    {secondaryLinks.map(link => (
                      <button
                        key={link.id}
                        onClick={() => scrollTo(link.id)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold transition-all duration-200 group
                          ${activeSection === link.id
                            ? 'bg-[#d4af37] text-black'
                            : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
                      >
                        <i className={`fas ${link.icon} w-4 text-center ${activeSection === link.id ? 'text-black' : 'text-[#d4af37]'}`}></i>
                        <span className={activeSection === link.id ? 'text-black' : 'text-white'}>
                          {link.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Right controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Premium Guides button */}
            <button
              onClick={() => setGuidesOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg shadow-purple-500/30 border-2 border-purple-500/50 relative"
              aria-label="FPL Guides"
            >
              <i className="fas fa-book-open text-lg"></i>
              <span>Guides</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-black animate-pulse">?</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[#d4af37] text-black hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#d4af37]/30 border-2 border-[#d4af37]/50"
              aria-label="Toggle theme"
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>

            {/* Mobile: More sheet trigger */}
            <button
              onClick={() => setSheetOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-[#d4af37] text-black hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#d4af37]/30 border-2 border-[#d4af37]/50"
              aria-label="More menu"
            >
              <i className="fas fa-grip-horizontal text-sm"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE BOTTOM TAB BAR
      ══════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#37003c] via-[#2a0845] to-[#37003c] backdrop-blur-md border-t-4 border-[#d4af37] shadow-2xl shadow-[#d4af37]/30 safe-area-pb">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent animate-shimmer"></div>
        
        <div className="flex items-stretch relative z-10">
          {primaryLinks.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-300 min-w-0 relative
                ${activeSection === link.id 
                  ? 'bg-[#d4af37] text-black' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <div className="relative">
                <i className={`fas ${link.icon} text-lg ${activeSection === link.id ? 'text-black' : 'text-[#d4af37]'}`}></i>
                {activeSection === link.id && (
                  <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-ping"></div>
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider truncate w-full text-center px-1 ${activeSection === link.id ? 'text-black' : 'text-white'}`}>
                {link.label}
              </span>
              {activeSection === link.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#d4af37] to-[#b8941f] rounded-full"></span>
              )}
            </button>
          ))}

          {/* Enhanced More tab */}
          <button
            onClick={() => setSheetOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-300 relative
              ${isSecondaryActive 
                ? 'bg-[#d4af37] text-black' 
                : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <div className="relative">
              <i className={`fas fa-ellipsis-h text-lg ${isSecondaryActive ? 'text-black' : 'text-[#d4af37]'}`}></i>
              {isSecondaryActive && (
                <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-ping"></div>
              )}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${isSecondaryActive ? 'text-black' : 'text-white'}`}>
              More
            </span>
            {isSecondaryActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#d4af37] to-[#b8941f] rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE MORE SHEET (slide up)
      ══════════════════════════════════════════ */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-slate-900 rounded-t-2xl border-t border-white/10 shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="px-4 pb-2 pt-1">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">More Sections</p>
              <div className="grid grid-cols-2 gap-2">
                {secondaryLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                      ${activeSection === link.id
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/5'}`}
                  >
                    <i className={`fas ${link.icon} w-4 text-center`}></i>
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Premium Guides button in mobile sheet */}
              <button
                onClick={() => { setSheetOpen(false); setTimeout(() => setGuidesOpen(true), 200); }}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg shadow-purple-500/30 border-2 border-purple-500/50 relative"
              >
                <i className="fas fa-book-open text-lg"></i>
                <span>The Gaffer's Guides</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-black animate-pulse">?</span>
              </button>

              {/* Theme toggle in sheet */}
              <button
                onClick={() => { toggleTheme(); setSheetOpen(false); }}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <i className={`fas ${darkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-blue-400'}`}></i>
                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>

              <div className="h-6" /> {/* safe area spacer */}
            </div>
          </div>
        </>
      )}

      {/* Gaffer's Guides drawer */}
      <GafferGuides isOpen={guidesOpen} onClose={() => setGuidesOpen(false)} />
    </>
  );
};

export default Navbar;


