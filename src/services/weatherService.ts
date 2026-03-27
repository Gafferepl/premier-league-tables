// Weather Service - Free OpenWeatherMap API Integration
// Provides weather data for upcoming Premier League matches

interface WeatherData {
  condition: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
}

interface MatchWeather {
  fixture: string;
  venue: string;
  weather: WeatherData;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface UpcomingMatchWeather {
  matches: MatchWeather[];
  recommendations: string[];
}

// Premier League stadium coordinates
const STADIUM_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Emirates Stadium': { lat: 51.5549, lon: -0.1084 },
  'Villa Park': { lat: 52.5092, lon: -1.8848 },
  'Vitality Stadium': { lat: 50.7352, lon: -1.8384 },
  'Brentford Community Stadium': { lat: 51.4908, lon: -0.2889 },
  'Amex Stadium': { lat: 50.8609, lon: -0.0831 },
  'Stamford Bridge': { lat: 51.4817, lon: -0.1910 },
  'Selhurst Park': { lat: 51.3983, lon: -0.0854 },
  'Goodison Park': { lat: 53.4388, lon: -2.9663 },
  'Craven Cottage': { lat: 51.4749, lon: -0.2217 },
  'Anfield': { lat: 53.4308, lon: -2.9608 },
  'King Power Stadium': { lat: 52.6204, lon: -1.1420 },
  'Etihad Stadium': { lat: 53.4831, lon: -2.2004 },
  'Old Trafford': { lat: 53.4631, lon: -2.2913 },
  'St James\' Park': { lat: 54.9756, lon: -1.6217 },
  'City Ground': { lat: 52.9400, lon: -1.1328 },
  'St Mary\'s Stadium': { lat: 50.9059, lon: -1.3910 },
  'Tottenham Hotspur Stadium': { lat: 51.6043, lon: -0.0664 },
  'London Stadium': { lat: 51.5386, lon: -0.0163 },
  'Molineux Stadium': { lat: 52.5903, lon: -2.1302 }
};

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private cacheKey = 'weather_cache';
  private cacheMinutes = 60;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || import.meta.env.OPENWEATHER_API_KEY || '';
  }

  /**
   * Get weather for upcoming matches
   */
  async getUpcomingMatchWeather(): Promise<UpcomingMatchWeather | null> {
    if (!this.apiKey || this.apiKey === 'your_openweather_api_key') {
      // console.warn('⚠️ OpenWeatherMap API key not configured');
      return null;
    }

    // Check cache
    const cached = this.getCached();
    if (cached) {
      // console.log('✅ Using cached weather data');
      return cached;
    }

    try {
      // Get weather for major stadiums (sample for next gameweek)
      const stadiums = Object.keys(STADIUM_COORDINATES).slice(0, 10);
      const weatherPromises = stadiums.map(stadium => this.getStadiumWeather(stadium));
      
      const weatherData = await Promise.all(weatherPromises);
      
      const matches: MatchWeather[] = weatherData
        .filter(w => w !== null)
        .map((weather, index) => ({
          fixture: `Match at ${stadiums[index]}`,
          venue: stadiums[index],
          weather: weather!,
          impact: this.assessWeatherImpact(weather!),
          recommendation: this.generateRecommendation(weather!)
        }));

      const result: UpcomingMatchWeather = {
        matches,
        recommendations: this.generateOverallRecommendations(matches)
      };

      this.cache(result);
      return result;
    } catch (error) {
      // console.error('❌ Weather API error:', error);
      return null;
    }
  }

  /**
   * Get weather for specific stadium
   */
  private async getStadiumWeather(stadium: string): Promise<WeatherData | null> {
    const coords = STADIUM_COORDINATES[stadium];
    if (!coords) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        condition: data.weather[0]?.main || 'Clear',
        temperature: Math.round(data.main?.temp || 15),
        windSpeed: Math.round(data.wind?.speed || 0),
        precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0,
        humidity: data.main?.humidity || 50
      };
    } catch (error) {
      // console.error(`Weather fetch error for ${stadium}:`, error);
      return null;
    }
  }

  /**
   * Assess weather impact on match
   */
  private assessWeatherImpact(weather: WeatherData): 'high' | 'medium' | 'low' {
    if (weather.precipitation > 5 || weather.windSpeed > 30) {
      return 'high';
    } else if (weather.precipitation > 2 || weather.windSpeed > 20 || weather.temperature < 5) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Generate weather recommendation
   */
  private generateRecommendation(weather: WeatherData): string {
    if (weather.precipitation > 5) {
      return 'Heavy rain expected - favor defensive assets';
    } else if (weather.windSpeed > 25) {
      return 'Strong winds - aerial threat reduced';
    } else if (weather.temperature < 5) {
      return 'Cold conditions - stamina may be affected';
    }
    return 'Good conditions for attacking football';
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(matches: MatchWeather[]): string[] {
    const recommendations: string[] = [];

    const highImpact = matches.filter(m => m.impact === 'high').length;
    if (highImpact > 3) {
      recommendations.push('Multiple matches affected by poor weather - consider defensive captains');
    }

    const rainyMatches = matches.filter(m => m.weather.precipitation > 2);
    if (rainyMatches.length > 0) {
      recommendations.push(`${rainyMatches.length} matches with rain - slippery conditions favor counter-attacks`);
    }

    return recommendations;
  }

  /**
   * Cache management
   */
  private getCached(): UpcomingMatchWeather | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;
      const maxAge = this.cacheMinutes * 60 * 1000;

      if (age < maxAge) {
        return parsed.data;
      }

      localStorage.removeItem(this.cacheKey);
    } catch (error) {
      // console.error('Weather cache error:', error);
    }
    return null;
  }

  private cache(data: UpcomingMatchWeather): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      // console.error('Weather cache write error:', error);
    }
  }
}

export const weatherService = new WeatherService();


