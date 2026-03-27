import React, { useState, useEffect } from 'react';

interface PitchConditionsProps {
  homeTeam: string;
}

// Stadium Coordinates (Lat/Lon) for all 20 PL Teams
const STADIUM_LOCATIONS: Record<string, { lat: number; lon: number }> = {
  "Arsenal": { lat: 51.5549, lon: -0.1084 },
  "Aston Villa": { lat: 52.5091, lon: -1.8848 },
  "Bournemouth": { lat: 50.7352, lon: -1.8383 },
  "Brentford": { lat: 51.4907, lon: -0.2891 },
  "Brighton": { lat: 50.8616, lon: -0.0837 },
  "Chelsea": { lat: 51.4817, lon: -0.1910 },
  "Crystal Palace": { lat: 51.3983, lon: -0.0855 },
  "Everton": { lat: 53.4388, lon: -2.9663 },
  "Fulham": { lat: 51.4749, lon: -0.2216 },
  "Ipswich": { lat: 52.0551, lon: 1.1447 },
  "Leicester": { lat: 52.6203, lon: -1.1422 },
  "Liverpool": { lat: 53.4308, lon: -2.9608 },
  "Man City": { lat: 53.4831, lon: -2.2004 },
  "Man Utd": { lat: 53.4631, lon: -2.2913 },
  "Newcastle": { lat: 54.9756, lon: -1.6218 },
  "Nottingham Forest": { lat: 52.9400, lon: -1.1328 },
  "Southampton": { lat: 50.9058, lon: -1.3910 },
  "Spurs": { lat: 51.6042, lon: -0.0662 },
  "West Ham": { lat: 51.5387, lon: -0.0166 },
  "Wolves": { lat: 52.5902, lon: -2.1304 }
};

// Helper moved outside to be used in initial state
const generateSimulatedWeather = () => {
  const isWinter = new Date().getMonth() < 3 || new Date().getMonth() > 9;
  return {
    temperature_2m: isWinter ? Math.random() * 10 : 10 + Math.random() * 15,
    precipitation: Math.random() > 0.7 ? Math.random() * 5 : 0,
    wind_speed_10m: 5 + Math.random() * 25,
    weather_code: Math.random() > 0.8 ? 51 : 0 // Occasional rain
  };
};

const PitchConditions: React.FC<PitchConditionsProps> = ({ homeTeam }) => {
  const [weather, setWeather] = useState<any>(generateSimulatedWeather());
  const displayTeam = homeTeam || "Matchday Stadium";

  // Normalize home team name to find coords
  const normalizeTeamKey = (name: string) => {
    if (!name) return null;
    const n = name.toLowerCase();
    if (n.includes('man') && n.includes('city')) return 'Man City';
    if (n.includes('man') && (n.includes('utd') || n.includes('united'))) return 'Man Utd';
    if (n.includes('forest')) return 'Nottingham Forest';
    if (n.includes('spurs') || n.includes('tottenham')) return 'Spurs';
    if (n.includes('wolves')) return 'Wolves';
    if (n.includes('sheffield')) return 'Sheffield United';
    if (n.includes('luton')) return 'Luton';
    
    // Direct match check
    const exactMatch = Object.keys(STADIUM_LOCATIONS).find(k => k.toLowerCase() === n);
    if (exactMatch) return exactMatch;

    // Partial match check
    return Object.keys(STADIUM_LOCATIONS).find(k => n.includes(k.toLowerCase())) || null;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const teamKey = normalizeTeamKey(homeTeam);
      const coords = teamKey ? STADIUM_LOCATIONS[teamKey] : null;

      if (!coords) {
        // Keep simulated weather if no coords found
        return;
      }

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation&forecast_days=1`
        );
        if (!response.ok) throw new Error("API Failed");
        const data = await response.json();
        
        if (data.current) {
            // MERGE with existing mock data to ensure we don't lose keys if API is partial
            setWeather((prev: any) => ({
                ...prev,
                ...data.current
            }));
        }
      } catch (e) {
        // Silent failure - already showing simulated weather
        // console.warn("Weather fetch failed, keeping simulation");
      }
    };

    if (homeTeam) {
        fetchWeather();
    }
  }, [homeTeam]);

  // Gaffer Interpretation Logic
  const getGafferForecast = (w: any) => {
    // Default to mock values if properties missing
    const temp = w.temperature_2m !== undefined ? w.temperature_2m : 10;
    const wind = w.wind_speed_10m !== undefined ? w.wind_speed_10m : 10;
    const rain = w.precipitation !== undefined ? w.precipitation : 0;
    const code = w.weather_code !== undefined ? w.weather_code : 0;

    // Conditions
    if (code >= 95) return { text: "Thunderbolts expected. Keep the ball moving.", icon: "fa-bolt", color: "text-yellow-400" };
    if (code >= 71) return { text: "Orange ball needed. Get stuck in.", icon: "fa-snowflake", color: "text-white" };
    if (rain > 0.5 || code >= 51) return { text: "Slick surface. Get the long studs in.", icon: "fa-cloud-rain", color: "text-blue-400" };
    if (wind > 20) return { text: "Swirling wind. Keeper's nightmare.", icon: "fa-wind", color: "text-slate-300" };
    if (temp < 5) return { text: "Brass monkeys. Gloves on.", icon: "fa-temperature-low", color: "text-cyan-300" };
    if (temp > 22) return { text: "Scorcher. Water breaks imminent.", icon: "fa-sun", color: "text-orange-500" };
    
    return { text: "Perfect track. No excuses today.", icon: "fa-cloud-sun", color: "text-yellow-300" };
  };

  const forecast = getGafferForecast(weather);
  const temp = Math.round(weather.temperature_2m || 0);
  const wind = Math.round(weather.wind_speed_10m || 0);
  const isRaining = (weather.precipitation || 0) > 0;

  return (
    <div className="relative w-full z-20">
      <div className="bg-slate-900 rounded-lg p-3 border border-slate-700 flex items-center justify-between shadow-lg relative overflow-hidden group min-h-[80px]">
        
        {/* Animated Background Effect - CSS Only, No External Images */}
        <div 
            className={`absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-1000 ${isRaining ? 'animate-marquee' : ''}`}
            style={{
                backgroundImage: isRaining 
                    ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, #4299e1 10px, #4299e1 12px)' 
                    : 'none'
            }}
        ></div>

        <div className="flex items-center gap-3 relative z-10 overflow-hidden">
           <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-lg ${forecast.color} shrink-0`}>
              <i className={`fas ${forecast.icon} text-xl ${isRaining || wind > 15 ? 'animate-pulse' : 'animate-bounce-slow'}`}></i>
           </div>
           <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1">
                 <i className="fas fa-map-marker-alt text-accent"></i> Pitch Report: {displayTeam}
              </div>
              <div className="text-sm font-bold text-white leading-tight pr-2">
                 "{forecast.text}"
              </div>
           </div>
        </div>

        <div className="text-right block relative z-10 shrink-0">
           <div className="text-2xl font-mono font-bold text-slate-200">
              {temp}°C
           </div>
           <div className="text-[9px] text-slate-500 font-bold uppercase">
              Wind: {wind}km/h
           </div>
        </div>

      </div>
    </div>
  );
};

export default PitchConditions;


