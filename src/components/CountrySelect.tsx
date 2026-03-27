import React from 'react';
import CountryIcon from './CountryIcon';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, className = "" }) => {
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

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent ${className}`}
    >
      <option value="">Select your country</option>
      {countries.map(country => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;


