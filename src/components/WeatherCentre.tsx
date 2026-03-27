import React, { useState, useEffect, useRef } from 'react';
import { Fixture } from '../../types';
import { getTeamLogo } from '../constants';
import ShareSnapshot from './ShareSnapshot';
import SkeletonWeather from './skeletons/SkeletonWeather';

// STADIUM COORDINATES
const STADIUMS: Record<string, { lat: number; lng: number }> = {
  "Arsenal": { lat: 51.5549, lng: -0.1084 },
  "Aston Villa": { lat: 52.5091, lng: -1.8848 },
  "Bournemouth": { lat: 50.7352, lng: -1.8385 },
  "Brentford": { lat: 51.4907, lng: -0.2891 },
  "Brighton": { lat: 50.8616, lng: -0.0837 },
  "Chelsea": { lat: 51.4816, lng: -0.1909 },
  "Crystal Palace": { lat: 51.3982, lng: -0.0855 },
  "Everton": { lat: 53.4388, lng: -2.9663 },
  "Fulham": { lat: 51.4749, lng: -0.2216 },
  "Liverpool": { lat: 53.4308, lng: -2.9608 },
  "Luton Town": { lat: 51.8841, lng: -0.4316 },
  "Man City": { lat: 53.4831, lng: -2.2004 },
  "Man Utd": { lat: 53.4631, lng: -2.2913 },
  "Newcastle": { lat: 54.9756, lng: -1.6218 },
  "Nott'm Forest": { lat: 52.9400, lng: -1.1329 },
  "Sheffield Utd": { lat: 53.3704, lng: -1.4709 },
  "Spurs": { lat: 51.6042, lng: -0.0662 },
  "West Ham": { lat: 51.5387, lng: -0.0166 },
  "Wolves": { lat: 52.5902, lng: -2.1304 },
  "Burnley": { lat: 53.789, lng: -2.230 },
  "Ipswich": { lat: 52.055, lng: 1.145 },
  "Leicester": { lat: 52.620, lng: -1.142 },
  "Southampton": { lat: 50.905, lng: -1.391 },
};

// DEBUG: Mock fixture to ensure visibility even if API fails
const MOCK_FIXTURE: Fixture = {
  id: 'mock-fixture-1',
  homeTeam: 'Manchester City',
  awayTeam: 'Liverpool',
  date: '2024-03-10',
  time: '16:30',
  status: 'upcoming',
  score: ''
};

interface WeatherCentreProps {
  fixtures: Fixture[];
}

const WeatherCentre: React.FC<WeatherCentreProps> = ({ fixtures }) => {
  const [selectedMatch, setSelectedMatch] = useState<Fixture | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Filter only valid upcoming matches
  let upcomingFixtures = fixtures?.filter(f => f.status !== 'finished') || [];

  // FORCE VISIBILITY: If no fixtures, use the mock
  if (upcomingFixtures.length === 0) {
    upcomingFixtures = [MOCK_FIXTURE];
  }

  // Auto-select first match on load
  useEffect(() => {
    // console.log("Weather Centre Mounted. Fixtures:", upcomingFixtures.length);
    if (upcomingFixtures.length > 0 && !selectedMatch) {
      handleMatchSelect(upcomingFixtures[0].homeTeam);
    }
  }, [fixtures]);

  const handleMatchSelect = async (homeTeam: string) => {
    const match = upcomingFixtures.find(f => f.homeTeam === homeTeam);
    if (!match) return;
    
    setSelectedMatch(match);
    setLoading(true);
    setWeather(null);

    // Normalize team name
    const stadiumKey = Object.keys(STADIUMS).find(k => homeTeam.includes(k) || k.includes(homeTeam));
    
    if (stadiumKey) {
      const { lat, lng } = STADIUMS[stadiumKey];
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,wind_speed_10m,cloud_cover&wind_speed_unit=mph`);
        const data = await res.json();
        setWeather(data.current);
      } catch (e) {
        // console.error("Weather error", e);
        // Fallback for debug if API fails
        setWeather({ temperature_2m: 12, wind_speed_10m: 15, precipitation: 0 });
      }
    } else {
        // Fallback if stadium not found in map
        setWeather({ temperature_2m: 10, wind_speed_10m: 10, precipitation: 0 });
    }
    setLoading(false);
  };

  if (!selectedMatch && loading) {
      return <SkeletonWeather />;
  }

  const getPieIndex = (temp: number) => {
    if (temp < 5) return "Baltic. Double Pie Required. 🥧🥧";
    if (temp < 15) return "Standard Matchday Pie. 🥧";
    return "Too hot for pastry. Pint instead. 🍺";
  };

  const getVerdict = (w: any) => {
    if (w.precipitation > 0.5) return "Slick surface. Get the studs in. Sliding tackles galore.";
    if (w.wind_speed_10m > 15) return "Keeper's nightmare. Keep it on the deck.";
    if (w.temperature_2m > 20) return "Water breaks imminent. Legs will go after 60 mins.";
    return "Perfect track. No excuses today.";
  };

  return (
    <section 
      id="weather-centre" 
      ref={sectionRef}
      className="py-12 bg-slate-900 text-white relative border-y-4 border-[#d4af37] z-20 scroll-mt-24"
    >
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-heading font-black uppercase text-[#d4af37]">
            <i className="fas fa-cloud-sun-rain mr-3"></i> The Gaffer's Pitch Report
          </h2>
          
          <select 
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white font-bold w-full md:w-auto focus:outline-none focus:border-[#d4af37]"
            onChange={(e) => handleMatchSelect(e.target.value)}
            value={selectedMatch?.homeTeam || ""}
          >
            <option value="" disabled>Select a match...</option>
            {upcomingFixtures.map((f, i) => (
              <option key={i} value={f.homeTeam} className="text-black">
                {f.homeTeam} vs {f.awayTeam}
              </option>
            ))}
          </select>
        </div>

        {/* THE REPORT CARD */}
        <div id="weather-card-snap" className="max-w-4xl mx-auto relative group">
          {/* Share Button */}
          <div className="absolute top-4 right-4 z-50">
             <ShareSnapshot targetId="weather-card-snap" />
          </div>

          <div className="bg-[#1a472a] rounded-xl p-8 shadow-2xl relative overflow-hidden border-2 border-white/10 min-h-[300px]">
            {/* Blackboard Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/blackboard.png')] pointer-events-none"></div>
            
            {loading ? (
               <div className="h-64 flex items-center justify-center text-[#d4af37] animate-pulse font-mono text-xl">
                 Checking the skies...
               </div>
            ) : selectedMatch && weather ? (
               <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                  
                  {/* Left: Stats */}
                  <div className="text-center md:text-left">
                     <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">{selectedMatch.homeTeam} Stadium</div>
                     <div className="text-6xl font-black text-white mb-2">{Math.round(weather.temperature_2m)}°C</div>
                     <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm font-bold text-[#d4af37] font-mono">
                        <span className="bg-black/30 px-3 py-1 rounded"><i className="fas fa-wind mr-2"></i> {weather.wind_speed_10m} mph</span>
                        <span className="bg-black/30 px-3 py-1 rounded"><i className="fas fa-tint mr-2"></i> {weather.precipitation} mm</span>
                     </div>
                  </div>

                  {/* Right: Verdict */}
                  <div className="bg-white/5 rounded-lg p-6 border-l-4 border-[#d4af37]">
                     <h3 className="text-[#d4af37] font-black uppercase text-sm mb-2">The Gaffer's Verdict</h3>
                     <p className="text-xl font-heading font-bold italic leading-relaxed mb-4">
                        "{getVerdict(weather)}"
                     </p>
                     <div className="border-t border-white/10 pt-3 mt-3">
                        <span className="text-xs font-bold text-white/50 uppercase block mb-1">Pie Index</span>
                        <span className="text-sm font-bold text-white">{getPieIndex(weather.temperature_2m)}</span>
                     </div>
                  </div>

               </div>
            ) : (
               <div className="h-64 flex flex-col items-center justify-center text-white/50 gap-4">
                  <i className="fas fa-cloud-moon text-4xl opacity-50"></i>
                  <p>Weather Centre Initializing...</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WeatherCentre;


