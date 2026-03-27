import React, { useState } from 'react';
import CountryIcon from './CountryIcon';

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const countries = [
    // UK Nations (prioritized for UK-based site)
    "England", "Wales", "Scotland", "Northern Ireland", "Ireland",
    
    // Western Europe
    "Germany", "France", "Spain", "Portugal", "Belgium", "Netherlands", "Switzerland", "Austria",
    
    // Southern Europe
    "Italy", "Croatia", "Slovenia",
    
    // Eastern Europe
    "Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria", "Serbia", "Ukraine", "Denmark",
    
    // Scandinavia
    "Sweden", "Norway", "Finland", "Iceland",
    
    // Americas
    "USA", "Canada", "Mexico", "Argentina", "Brazil", "Uruguay", "Colombia", "Chile", "Peru", "Ecuador", 
    "Bolivia", "Paraguay", "Venezuela", "Costa Rica", "Panama", "Jamaica", "Trinidad & Tobago", 
    "Haiti", "Guatemala",
    
    // Africa
    "Egypt", "Ghana", "Nigeria", "South Africa", "Morocco", "Tunisia", "Algeria", "Cameroon", 
    "Ivory Coast", "Senegal",
    
    // Asia
    "Japan", "South Korea", "China", "India", "Australia", "New Zealand"
  ];

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = countries.find(c => c === value);

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent flex items-center justify-between"
      >
        <div className="flex items-center">
          {selectedCountry ? (
            <>
              <CountryIcon country={selectedCountry} size="w-5 h-5" className="mr-2" />
              <span>{selectedCountry}</span>
            </>
          ) : (
            <span className="text-slate-500 dark:text-slate-400">Select your country</span>
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
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Country List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(country => (
                <button
                  key={country}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="w-full px-4 py-2 flex items-center hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors"
                >
                  <CountryIcon country={country} size="w-5 h-5" className="mr-3" />
                  <span className="text-slate-900 dark:text-white">{country}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm">
                No countries found
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

export default CountryDropdown;


