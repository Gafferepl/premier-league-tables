import React, { useState } from 'react';
import LogoWithFallback from './LogoWithFallback';

interface ClubDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ClubDropdown: React.FC<ClubDropdownProps> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const premierLeagueClubs = [
    "Manchester City", "Arsenal", "Liverpool", "Chelsea", "Manchester United",
    "Newcastle", "Brighton", "West Ham", "Aston Villa", "Tottenham",
    "Fulham", "Brentford", "Crystal Palace", "Wolves", "Leicester",
    "Everton", "Nottingham Forest", "Bournemouth", "Luton Town", "Burnley", "Sheffield United"
  ];

  const filteredClubs = premierLeagueClubs.filter(club =>
    club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClub = premierLeagueClubs.find(c => c === value);

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent flex items-center justify-between"
      >
        <div className="flex items-center">
          {selectedClub ? (
            <>
              <LogoWithFallback 
                src={`https://resources.premierleague.com/premierleague/badges/100/${selectedClub.toLowerCase().replace(/\s+/g, '')}.png`}
                teamName={selectedClub}
                size="w-5 h-5"
                className="mr-2"
              />
              <span>{selectedClub}</span>
            </>
          ) : (
            <span className="text-slate-500 dark:text-slate-400">Select your club</span>
          )}
        </div>
        <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Club List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredClubs.length > 0 ? (
              filteredClubs.map(club => (
                <button
                  key={club}
                  type="button"
                  onClick={() => {
                    onChange(club);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="w-full px-4 py-2 flex items-center hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors"
                >
                  <LogoWithFallback 
                    src={`https://resources.premierleague.com/premierleague/badges/100/${club.toLowerCase().replace(/\s+/g, '')}.png`}
                    teamName={club}
                    size="w-5 h-5"
                    className="mr-3"
                  />
                  <span className="text-slate-900 dark:text-white">{club}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm">
                No clubs found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ClubDropdown;


