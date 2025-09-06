// Core Data Types for Smart Travel Planner

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  bio?: string;
  travelStyle: 'budget' | 'mid-range' | 'luxury';
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  preferences: TravelPreferences;
}

export interface TravelPreferences {
  destinations: string[];
  activities: ActivityType[];
  accommodationType: AccommodationType[];
  transportModes: TransportMode[];
  dietaryRestrictions: string[];
  accessibility: boolean;
  languagePreference: string[];
}

export type ActivityType = 
  | 'sightseeing' 
  | 'adventure' 
  | 'cultural' 
  | 'nightlife' 
  | 'shopping' 
  | 'food' 
  | 'nature' 
  | 'relaxation'
  | 'photography'
  | 'history';

export type AccommodationType = 
  | 'hotel' 
  | 'hostel' 
  | 'airbnb' 
  | 'guesthouse' 
  | 'resort' 
  | 'camping'
  | 'boutique';

export type TransportMode = 
  | 'flight' 
  | 'train' 
  | 'bus' 
  | 'car' 
  | 'bike' 
  | 'walk'
  | 'ferry'
  | 'rideshare';

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: Destination;
  startDate: Date;
  endDate: Date;
  totalBudget: number;
  currency: string;
  status: 'planning' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  travelers: Traveler[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  name: string;
  country: string;
  city?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  currency: string;
}

export interface Traveler {
  id: string;
  name: string;
  email?: string;
  age: number;
  role: 'organizer' | 'traveler';
  preferences: Partial<TravelPreferences>;
}

export interface Itinerary {
  id: string;
  tripId: string;
  days: ItineraryDay[];
  budgetBreakdown: BudgetBreakdown;
  optimizedRoutes: Route[];
}

export interface ItineraryDay {
  date: Date;
  activities: Activity[];
  meals: Meal[];
  accommodation?: Accommodation;
  transport: Transportation[];
  totalCost: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: ActivityType;
  location: Location;
  duration: number; // minutes
  cost: number;
  rating?: number;
  timeSlot: {
    start: Date;
    end: Date;
  };
  bookingRequired: boolean;
  bookingUrl?: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  location: Location;
  cost: number;
  cuisine: string;
  rating?: number;
  time: Date;
}

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  location: Location;
  checkIn: Date;
  checkOut: Date;
  costPerNight: number;
  totalCost: number;
  rating?: number;
  amenities: string[];
  bookingUrl?: string;
  images: string[];
}

export interface Transportation {
  id: string;
  mode: TransportMode;
  from: Location;
  to: Location;
  departure: Date;
  arrival: Date;
  cost: number;
  duration: number; // minutes
  provider?: string;
  bookingUrl?: string;
}

export interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export interface Route {
  from: Location;
  to: Location;
  options: TransportOption[];
  recommended: string; // transport option id
}

export interface TransportOption {
  id: string;
  mode: TransportMode;
  duration: number;
  cost: number;
  provider?: string;
  stops?: Location[];
  carbonFootprint?: number;
}

export interface BudgetBreakdown {
  total: number;
  categories: {
    accommodation: number;
    transport: number;
    food: number;
    activities: number;
    shopping: number;
    miscellaneous: number;
  };
  daily: {
    [date: string]: number;
  };
  remaining: number;
  alerts: BudgetAlert[];
}

export interface BudgetAlert {
  type: 'warning' | 'exceeded' | 'recommendation';
  category: keyof BudgetBreakdown['categories'];
  message: string;
  amount: number;
  timestamp: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: {
    type: 'trips_completed' | 'countries_visited' | 'budget_saved' | 'activities_done';
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedDate: Date;
  progress?: number;
}

export interface Achievement {
  userId: string;
  type: 'explorer' | 'saver' | 'adventurer' | 'foodie' | 'photographer';
  level: number;
  progress: number;
  maxProgress: number;
  rewards: string[];
}

// Weather Types
export interface WeatherInfo {
  location: string;
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: Date;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  icon: string;
}

// Currency Types
export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

export interface CurrencyConverter {
  rates: { [currency: string]: number };
  baseCurrency: string;
  lastUpdated: Date;
}

// Chat Assistant Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tripContext?: string;
  suggestions?: string[];
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  context: {
    currentTrip?: string;
    userPreferences: TravelPreferences;
  };
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// External API Types
export interface HotelSearchParams {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  budget?: {
    min: number;
    max: number;
  };
}

export interface FlightSearchParams {
  from: string;
  to: string;
  departure: Date;
  return?: Date;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  budget?: {
    max: number;
  };
}

// Visa Requirements
export interface VisaRequirement {
  country: string;
  nationality: string;
  required: boolean;
  type?: 'visa_free' | 'visa_on_arrival' | 'evisa' | 'visa_required';
  duration?: number; // days
  fee?: number;
  documents: string[];
  processingTime?: number; // days
}

// Emergency Contacts
export interface EmergencyContact {
  country: string;
  city?: string;
  services: {
    police: string;
    medical: string;
    fire: string;
    tourist_hotline?: string;
    embassy?: {
      name: string;
      phone: string;
      address: string;
    };
  };
}

// Document Vault
export interface TravelDocument {
  id: string;
  userId: string;
  type: 'passport' | 'visa' | 'insurance' | 'ticket' | 'hotel_booking' | 'other';
  name: string;
  fileUrl: string;
  encrypted: boolean;
  expiryDate?: Date;
  tripId?: string;
  createdAt: Date;
  updatedAt: Date;
}