import React, { useState } from 'react';
import { MODAL_CONTENT, FALLBACK_DATA } from '../constants'; // Import Data for the generator
import PieContractModal from './PieContractModal';
import NewsletterGenerator from './NewsletterGenerator'; // Import Generator
import { authService, User } from '../services/auth';
import DOMPurify from 'dompurify';

// Safe content rendering function
const renderModalContent = (content: string) => {
  return DOMPurify.sanitize(content);
};

type ModalType = 'about' | 'privacy' | 'terms' | 'contact' | null;

// Custom Steaming Pie Icon Component
const SteamingPieIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Steam Lines - Animated */}
    <path d="M7 6C7 6 5 5 5 3C5 1 7 2 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-70 animate-pulse" style={{ animationDelay: '0s' }} />
    <path d="M12 5C12 5 10 4 10 2C10 0 12 1 12 -1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }} />
    <path d="M17 6C17 6 15 5 15 3C15 1 17 2 17 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
    
    {/* Pie Tin Base (Tapered) */}
    <path d="M4 14 L5.5 20.5 C5.7 21.4 6.5 22 7.4 22 H16.6 C17.5 22 18.3 21.4 18.5 20.5 L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Pie Crust Lid (Oval) */}
    <path d="M2 14 C2 11.5 6.5 9.5 12 9.5 C17.5 9.5 22 11.5 22 14 C22 16.5 17.5 18.5 12 18.5 C6.5 18.5 2 16.5 2 14 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Pastry Dome Detail */}
    <path d="M3 14 C3 14 6 11 12 11 C18 11 21 14 21 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="opacity-50" />

    {/* Steam Vents (Crucial for Pie look) */}
    <path d="M10.5 12.5 L13.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13.5 12.5 L10.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Footer: React.FC = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [showContract, setShowContract] = useState(false);
  const [showNewsletterGen, setShowNewsletterGen] = useState(false); // State for generator
  const year = new Date().getFullYear();

  const closeModal = () => setOpenModal(null);

  // Fallback for fixtures if context not available here (In a real app, use Context or Prop drilling, 
  // but for Footer independence we use the fallback constant for the tool)
  const fixtures = FALLBACK_DATA.fixtures;

  return (
    <footer className="bg-dark text-white pt-12 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">

        {/* Top row: Brand left, Info right */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10 pb-10 border-b border-slate-800">
          {/* Brand + actions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-futbol text-2xl text-accent"></i>
              <h2 className="text-xl font-heading font-bold">premierleaguetables.com</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-5">
              The unofficial home of Premier League statistics. Built for speed, designed for fans.
            </p>
            <div className="flex items-center gap-4">
              <div className="inline-block relative group cursor-pointer" onClick={() => setShowContract(true)}>
                <button className="flex items-center gap-3 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-accent transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,64,129,0.2)] hover:-translate-y-0.5">
                  <SteamingPieIcon className="w-7 h-7 text-warning group-hover:text-white transition-colors duration-300" />
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-xs text-slate-300 group-hover:text-white uppercase tracking-wide">Buy us a Pie</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-accent">Fuel the dev team</span>
                  </div>
                </button>
              </div>
              <a href="https://x.com/thegafferEPL" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:border-accent text-slate-400 hover:text-white transition-all hover:-translate-y-0.5">
                <i className="fab fa-x-twitter text-xl"></i>
              </a>
            </div>
          </div>

          {/* Information */}
          <div className="shrink-0">
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">Information</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-slate-400 text-sm">
              <li><button onClick={() => setOpenModal('about')} className="hover:text-accent transition-colors">About Us</button></li>
              <li><button onClick={() => setOpenModal('privacy')} className="hover:text-accent transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setOpenModal('terms')} className="hover:text-accent transition-colors">Terms of Service</button></li>
              <li><button onClick={() => setOpenModal('contact')} className="hover:text-accent transition-colors">Contact</button></li>
              <li><button onClick={() => document.getElementById('support')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-accent transition-colors">Support Center</button></li>
              <li><button onClick={() => document.getElementById('support')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-accent transition-colors">Manage Subscription</button></li>
              <li><a href="https://ko-fi.com/thegaffer" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Support Us</a></li>
            </ul>
          </div>
        </div>

        {/* Middle row: Tools & Features */}
        <div className="mb-8 pb-8 border-b border-slate-800">
          <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">Tools & Features</h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-2 text-slate-400 text-sm">
            {/* Primary Navigation */}
            <li><button onClick={() => document.getElementById('league-table')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-table text-xs"></i><span>League Table</span></button></li>
            <li><button onClick={() => document.getElementById('fixtures')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-calendar-alt text-xs"></i><span>Fixtures</span></button></li>
            <li><button onClick={() => document.getElementById('captain-picks')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-crown text-xs"></i><span>Captain Picks</span></button></li>
            <li><button onClick={() => document.getElementById('price-tracker')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-chart-line text-xs"></i><span>Price Tracker</span></button></li>
            <li><button onClick={() => document.getElementById('player-database')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-users text-xs"></i><span>Player Database</span></button></li>
            
            {/* Advanced Features */}
            <li><button onClick={() => document.getElementById('squad-builder')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-tshirt text-xs"></i><span>Squad Builder</span></button></li>
            <li><button onClick={() => document.getElementById('player-comparison')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-balance-scale text-xs"></i><span>Player Comparison</span></button></li>
            <li><button onClick={() => document.getElementById('live-points')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-bolt text-xs"></i><span>Live Points</span></button></li>
            <li><button onClick={() => document.getElementById('advanced-stats')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-chart-bar text-xs"></i><span>Advanced Stats</span></button></li>
            <li><button onClick={() => document.getElementById('beat-the-gaffer')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-gamepad text-xs"></i><span>Beat Gaffer</span></button></li>
            
            {/* Interactive & Analysis */}
            <li><button onClick={() => document.getElementById('newsletter')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-envelope text-xs"></i><span>Newsletter</span></button></li>
            <li><button onClick={() => document.getElementById('gaffers-gut')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-brain text-xs"></i><span>Gaffer's Gut</span></button></li>
            <li><button onClick={() => document.getElementById('sack-race')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-fire text-xs"></i><span>Sack Race</span></button></li>
            <li><button onClick={() => document.getElementById('golden-boot')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-futbol text-xs"></i><span>Golden Boot</span></button></li>
            <li><button onClick={() => document.getElementById('stats-embed')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 hover:text-accent transition-colors"><i className="fas fa-chart-pie text-xs"></i><span>Match Stats</span></button></li>
          </ul>
        </div>

        {/* Bottom row: Partners & Offers — single horizontal line */}
        <div className="mb-8">
          <h4 className="text-sm font-bold mb-3 text-white uppercase tracking-wider">Partners & Offers</h4>
          <ul className="flex flex-wrap gap-x-6 gap-y-1.5 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-accent transition-colors">Football Streaming</a></li>
            <li className="text-slate-700">·</li>
            <li><a href="#" className="hover:text-accent transition-colors">Football Equipment</a></li>
            <li className="text-slate-700">·</li>
            <li><a href="#" className="hover:text-accent transition-colors">Team Merchandise</a></li>
          </ul>
        </div>

        <div className="border-t border-slate-800 pt-6 pb-6 text-center text-slate-500 text-sm">
          <div className="max-w-4xl mx-auto space-y-3">
            <p>&copy; {year} PremierLeagueTables.com. All rights reserved.</p>
            <p className="text-[10px] opacity-60 max-w-2xl mx-auto">
              <strong>Disclaimer:</strong> This site is a fan project and is <strong>not</strong> associated with, endorsed by, or affiliated with the Premier League or any of its clubs. All trademarks belong to their respective owners.
            </p>
            <p className="text-[10px] opacity-60 max-w-2xl mx-auto">
              <strong>Affiliate Disclosure:</strong> "Listen lads, some links on this site pay us a few quid if you buy something. It doesn't cost you extra - same price, just helps keep the floodlights on and buys the odd pie for the backroom staff. We only recommend gear we'd actually use ourselves. No nonsense, just honest recommendations."
            </p>
            <p className="text-[10px] opacity-50 max-w-2xl mx-auto">
              <em>Fully compliant with FTC and UK advertising guidelines. We may earn commissions from qualifying purchases through affiliate links.</em>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest">
                  {openModal === 'about' ? 'About Us' : openModal === 'privacy' ? 'Privacy Policy' : openModal === 'terms' ? 'Terms of Service' : 'Contact'}
                </span>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-highlight hover:text-white transition-colors">
                   <i className="fas fa-times"></i>
                </button>
             </div>
             <div className="p-6 md:p-8 text-slate-700 dark:text-slate-300 overflow-y-auto" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MODAL_CONTENT[openModal])}}></div>
             <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center shrink-0">
                <button onClick={closeModal} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-bold">Close</button>
             </div>
          </div>
        </div>
      )}

      {/* Pie Contract Modal */}
      {showContract && <PieContractModal onClose={() => setShowContract(false)} />}

      {/* Newsletter Generator Modal */}
      {showNewsletterGen && <NewsletterGenerator isOpen={showNewsletterGen} onClose={() => setShowNewsletterGen(false)} fixtures={fixtures} />}
    </footer>
  );
};

export default Footer;


