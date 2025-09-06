// API Client for External Services

import { WeatherInfo, CurrencyConverter, VisaRequirement } from '@/types';

// Custom OpenRouter endpoint configuration (no API keys required)
const AI_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const AI_HEADERS = {
  'customerId': 'saumyarsharma1212@gmail.com',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export class AIClient {
  static async chatCompletion(messages: Array<{role: string, content: string}>, model?: string) {
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: AI_HEADERS,
        body: JSON.stringify({
          model: model || process.env.AI_MODEL_CHAT || 'openrouter/anthropic/claude-sonnet-4',
          messages
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Client Error:', error);
      throw error;
    }
  }

  static async generateImage(prompt: string, model?: string) {
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: AI_HEADERS,
        body: JSON.stringify({
          model: model || process.env.AI_MODEL_IMAGE || 'replicate/black-forest-labs/flux-1.1-pro',
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Image Generation API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Image Generation Error:', error);
      throw error;
    }
  }

  static async generateVideo(prompt: string, model?: string) {
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: AI_HEADERS,
        body: JSON.stringify({
          model: model || process.env.AI_MODEL_VIDEO || 'replicate/google/veo-3',
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Video Generation API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Video Generation Error:', error);
      throw error;
    }
  }
}

export class WeatherClient {
  private static baseUrl = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
  private static apiKey = process.env.WEATHER_API_KEY || 'demo_key';

  static async getCurrentWeather(city: string): Promise<WeatherInfo | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          // Return mock data for demo purposes when API key is invalid
          return this.getMockWeatherData(city);
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        location: data.name,
        current: {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: data.wind?.speed || 0,
          icon: data.weather[0].icon
        },
        forecast: [] // Will be populated by forecast endpoint
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      return this.getMockWeatherData(city);
    }
  }

  static async getForecast(city: string): Promise<WeatherInfo | null> {
    try {
      const current = await this.getCurrentWeather(city);
      if (!current) return null;

      const response = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        return current; // Return current weather without forecast
      }

      const data = await response.json();
      const forecast = data.list.slice(0, 5).map((item: any) => ({
        date: new Date(item.dt * 1000),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].main,
        precipitation: item.rain?.['3h'] || 0,
        icon: item.weather[0].icon
      }));

      return {
        ...current,
        forecast
      };
    } catch (error) {
      console.error('Weather Forecast Error:', error);
      return this.getMockWeatherData(city);
    }
  }

  private static getMockWeatherData(city: string): WeatherInfo {
    return {
      location: city,
      current: {
        temperature: 22,
        condition: 'Clear',
        humidity: 65,
        windSpeed: 5.2,
        icon: '01d'
      },
      forecast: [
        {
          date: new Date(Date.now() + 86400000),
          high: 25,
          low: 18,
          condition: 'Partly Cloudy',
          precipitation: 10,
          icon: '02d'
        },
        {
          date: new Date(Date.now() + 172800000),
          high: 23,
          low: 16,
          condition: 'Rain',
          precipitation: 80,
          icon: '10d'
        }
      ]
    };
  }
}

export class CurrencyClient {
  private static baseUrl = process.env.CURRENCY_API_URL || 'https://v6.exchangerate-api.com/v6';
  private static apiKey = process.env.CURRENCY_API_KEY || 'demo_key';

  static async getExchangeRates(baseCurrency: string = 'USD'): Promise<CurrencyConverter | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`);
      
      if (!response.ok) {
        return this.getMockCurrencyData(baseCurrency);
      }

      const data = await response.json();
      return {
        rates: data.conversion_rates,
        baseCurrency: baseCurrency,
        lastUpdated: new Date(data.time_last_update_utc)
      };
    } catch (error) {
      console.error('Currency API Error:', error);
      return this.getMockCurrencyData(baseCurrency);
    }
  }

  static async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    try {
      const rates = await this.getExchangeRates(from);
      if (!rates || !rates.rates[to]) {
        // Fallback to mock conversion
        return amount * 1.1; // Simple fallback
      }
      return amount * rates.rates[to];
    } catch (error) {
      console.error('Currency Conversion Error:', error);
      return amount * 1.1; // Simple fallback
    }
  }

  private static getMockCurrencyData(baseCurrency: string): CurrencyConverter {
    const mockRates: { [key: string]: number } = {
      'USD': baseCurrency === 'USD' ? 1 : 0.85,
      'EUR': baseCurrency === 'EUR' ? 1 : 1.18,
      'GBP': baseCurrency === 'GBP' ? 1 : 1.35,
      'JPY': baseCurrency === 'JPY' ? 1 : 0.0075,
      'AUD': baseCurrency === 'AUD' ? 1 : 0.72,
      'CAD': baseCurrency === 'CAD' ? 1 : 0.78,
      'CHF': baseCurrency === 'CHF' ? 1 : 1.12,
      'CNY': baseCurrency === 'CNY' ? 1 : 0.14,
      'INR': baseCurrency === 'INR' ? 1 : 0.012
    };

    return {
      rates: mockRates,
      baseCurrency,
      lastUpdated: new Date()
    };
  }
}

export class GeocodingClient {
  private static baseUrl = process.env.GEOCODING_API_URL || 'https://nominatim.openstreetmap.org';

  static async searchLocation(query: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SmartTravelPlanner/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      return data.map((item: any) => ({
        name: item.display_name,
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        },
        country: item.address?.country,
        city: item.address?.city || item.address?.town || item.address?.village,
        placeId: item.place_id
      }));
    } catch (error) {
      console.error('Geocoding Error:', error);
      // Return mock data for demo
      return [{
        name: query,
        coordinates: { lat: 40.7128, lng: -74.0060 },
        country: 'Demo Country',
        city: query,
        placeId: 'demo_place_id'
      }];
    }
  }

  static async reverseGeocode(lat: number, lng: number) {
    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            'User-Agent': 'SmartTravelPlanner/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding error: ${response.status}`);
      }

      const data = await response.json();
      return {
        name: data.display_name,
        coordinates: { lat, lng },
        country: data.address?.country,
        city: data.address?.city || data.address?.town || data.address?.village,
        address: data.display_name
      };
    } catch (error) {
      console.error('Reverse Geocoding Error:', error);
      return {
        name: `Location at ${lat}, ${lng}`,
        coordinates: { lat, lng },
        country: 'Unknown',
        city: 'Unknown',
        address: `${lat}, ${lng}`
      };
    }
  }
}

export class VisaClient {
  static async checkVisaRequirements(nationality: string, destination: string): Promise<VisaRequirement[]> {
    try {
      // Mock data for demo - in production, replace with real API
      const mockVisaData: VisaRequirement = {
        country: destination,
        nationality: nationality,
        required: Math.random() > 0.5,
        type: Math.random() > 0.3 ? 'visa_free' : 'visa_required',
        duration: Math.floor(Math.random() * 90) + 30,
        fee: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 25 : 0,
        documents: [
          'Valid passport (6+ months validity)',
          'Return flight ticket',
          'Proof of accommodation',
          'Travel insurance'
        ],
        processingTime: Math.floor(Math.random() * 14) + 1
      };

      return [mockVisaData];
    } catch (error) {
      console.error('Visa Requirements Error:', error);
      return [];
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();

  static isAllowed(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const keyRequests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    while (keyRequests.length > 0 && keyRequests[0] < windowStart) {
      keyRequests.shift();
    }
    
    // Check if under limit
    if (keyRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    keyRequests.push(now);
    return true;
  }
}

export default {
  AIClient,
  WeatherClient,
  CurrencyClient,
  GeocodingClient,
  VisaClient,
  RateLimiter
};