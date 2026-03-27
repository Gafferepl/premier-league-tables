
import React, { useState } from 'react';
import { MODAL_CONTENT } from '../constants';
import PieContractModal from './PieContractModal';

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
  const year = new Date().getFullYear();

  const closeModal = () => setOpenModal(null);

  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <i className="fas fa-futbol text-3xl text-accent"></i>
              <h2 className="text-2xl font-heading font-bold">premierleaguetables.com</h2>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              The unofficial home of Premier League statistics. Built for speed, designed for fans. We strip away the clutter so you can focus on the numbers that matter.
            </p>
            
            {/* Pie Pact */}
            <div className="inline-block relative group cursor-pointer" onClick={() => setShowContract(true)}>
               <button className="flex items-center gap-3 bg-slate-800 px-5 py-3 rounded-xl border border-slate-700 hover:border-accent transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,64,129,0.2)] hover:-translate-y-1">
                  
                  {/* Custom Steaming Pie Icon */}
                  <SteamingPieIcon className="w-8 h-8 text-warning group-hover:text-white transition-colors duration-300" />
                  
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm text-slate-300 group-hover:text-white uppercase tracking-wide">Buy us a Pie</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-accent">Fuel the dev team</span>
                  </div>
               </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b-2 border-accent inline-block pb-1">Quick Links</h4>
            <ul className="space-y-3 text-slate-400">
              <li><button onClick={() => document.getElementById('league-table')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-accent transition-colors"><i className="fas fa-chevron-right text-xs mr-2"></i>League Table</button></li>
              <li><button onClick={() => document.getElementById('fixtures')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-accent transition-colors"><i className="fas fa-chevron-right text-xs mr-2"></i>Fixtures</button></li>
              <li><button onClick={() => document.getElementById('top-scorers')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-accent transition-colors"><i className="fas fa-chevron-right text-xs mr-2"></i>Top Scorers</button></li>
              <li><button onClick={() => document.getElementById('news-carousel')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-accent transition-colors"><i className="fas fa-chevron-right text-xs mr-2"></i>News</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b-2 border-accent inline-block pb-1">Information</h4>
            <ul className="space-y-3 text-slate-400">
              <li><button onClick={() => setOpenModal('about')} className="hover:text-accent transition-colors">About Us</button></li>
              <li><button onClick={() => setOpenModal('privacy')} className="hover:text-accent transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setOpenModal('terms')} className="hover:text-accent transition-colors">Terms of Service</button></li>
              <li><button onClick={() => setOpenModal('contact')} className="hover:text-accent transition-colors">Contact</button></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>&copy; {year} PremierLeagueTables.com. All rights reserved.</p>
            <p className="text-[10px] mt-2 opacity-60 max-w-lg">
              <strong>Disclaimer:</strong> This site is a fan project and is <strong>not</strong> associated with, endorsed by, or affiliated with the Premier League or any of its clubs. All trademarks belong to their respective owners.
            </p>
          </div>
          <div className="flex gap-4">
             <a href="https://x.com/thegafferEPL" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-white cursor-pointer transition-colors">
                <i className="fab fa-x-twitter text-lg"></i>
             </a>
             <a href="#" className="hover:text-white cursor-pointer transition-colors" aria-label="Facebook">
                <i className="fab fa-facebook text-lg"></i>
             </a>
             <a href="#" className="hover:text-white cursor-pointer transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram text-lg"></i>
             </a>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest">Information</span>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-highlight hover:text-white transition-colors">
                   <i className="fas fa-times"></i>
                </button>
             </div>
             <div className="p-8 text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{__html: MODAL_CONTENT[openModal]}}></div>
             <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center">
                <button onClick={closeModal} className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors text-sm font-bold">Close</button>
             </div>
          </div>
        </div>
      )}

      {/* Pie Contract Modal */}
      {showContract && <PieContractModal onClose={() => setShowContract(false)} />}
    </footer>
  );
};

export default Footer;
