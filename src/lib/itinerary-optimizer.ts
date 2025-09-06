// AI-Powered Itinerary Optimization Logic

import { AIClient } from './api-client';
import { Trip, Itinerary, ItineraryDay, Activity, Meal, Accommodation, Transportation, Location, TravelPreferences } from '@/types';

export class ItineraryOptimizer {
  static async generateItinerary(trip: Trip, preferences: TravelPreferences): Promise<Itinerary> {
    try {
      const prompt = this.buildItineraryPrompt(trip, preferences);
      
      const response = await AIClient.chatCompletion([
        {
          role: 'system',
          content: 'You are an expert travel planner. Generate detailed, budget-optimized itineraries based on user preferences. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const generatedItinerary = this.parseAIResponse(response);
      return this.enhanceWithLocalData(generatedItinerary, trip);
    } catch (error) {
      console.error('Itinerary generation error:', error);
      return this.generateFallbackItinerary(trip, preferences);
    }
  }

  private static buildItineraryPrompt(trip: Trip, preferences: TravelPreferences): string {
    const duration = Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return `
Create a detailed ${duration}-day travel itinerary for ${trip.destination.name}, ${trip.destination.country}.

Trip Details:
- Budget: ${trip.totalBudget} ${trip.currency}
- Travelers: ${trip.travelers.length} person(s)
- Dates: ${trip.startDate.toDateString()} to ${trip.endDate.toDateString()}

Preferences:
- Travel Style: ${trip.travelers[0]?.preferences?.activities?.join(', ') || 'general tourism'}
- Accommodation: ${preferences.accommodationType.join(', ')}
- Activities: ${preferences.activities.join(', ')}
- Transport: ${preferences.transportModes.join(', ')}
- Dietary: ${preferences.dietaryRestrictions.join(', ') || 'none'}

Please provide a JSON response with this structure:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "name": "Activity Name",
          "description": "Description",
          "type": "sightseeing|adventure|cultural|etc",
          "duration": 120,
          "cost": 25,
          "location": {
            "name": "Location Name",
            "address": "Address",
            "coordinates": {"lat": 0, "lng": 0}
          },
          "timeSlot": {
            "start": "2024-01-01T09:00:00Z",
            "end": "2024-01-01T11:00:00Z"
          }
        }
      ],
      "meals": [
        {
          "name": "Restaurant Name",
          "type": "breakfast|lunch|dinner",
          "cost": 15,
          "cuisine": "local",
          "location": {
            "name": "Restaurant Name",
            "address": "Address",
            "coordinates": {"lat": 0, "lng": 0}
          },
          "time": "2024-01-01T12:00:00Z"
        }
      ],
      "accommodation": {
        "name": "Hotel Name",
        "type": "hotel|hostel|airbnb",
        "costPerNight": 80,
        "location": {
          "name": "Hotel Name",
          "address": "Address",
          "coordinates": {"lat": 0, "lng": 0}
        },
        "amenities": ["wifi", "breakfast"]
      },
      "transport": [
        {
          "mode": "bus|train|flight|walk",
          "from": {"name": "Origin", "address": "Address", "coordinates": {"lat": 0, "lng": 0}},
          "to": {"name": "Destination", "address": "Address", "coordinates": {"lat": 0, "lng": 0}},
          "cost": 10,
          "duration": 30,
          "departure": "2024-01-01T08:00:00Z",
          "arrival": "2024-01-01T08:30:00Z"
        }
      ]
    }
  ]
}

Focus on:
1. Budget-conscious recommendations
2. Logical geographic flow
3. Time-efficient scheduling
4. Local authentic experiences
5. Mix of must-see attractions and hidden gems
`;
  }

  private static parseAIResponse(response: any): Partial<Itinerary> {
    try {
      const content = response.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content in response');

      // Extract JSON from response (in case there's additional text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw error;
    }
  }

  private static async enhanceWithLocalData(itinerary: Partial<Itinerary>, trip: Trip): Promise<Itinerary> {
    // Add IDs and enhance with additional data
    const enhancedDays: ItineraryDay[] = (itinerary.days || []).map((day: any) => ({
      ...day,
      date: new Date(day.date),
      activities: day.activities.map((activity: any) => ({
        ...activity,
        id: this.generateId(),
        timeSlot: {
          start: new Date(activity.timeSlot.start),
          end: new Date(activity.timeSlot.end)
        },
        bookingRequired: activity.cost > 20,
        rating: this.generateRandomRating()
      })),
      meals: day.meals.map((meal: any) => ({
        ...meal,
        id: this.generateId(),
        time: new Date(meal.time),
        rating: this.generateRandomRating()
      })),
      accommodation: day.accommodation ? {
        ...day.accommodation,
        id: this.generateId(),
        checkIn: new Date(day.date),
        checkOut: new Date(new Date(day.date).getTime() + 86400000),
        totalCost: day.accommodation.costPerNight,
        rating: this.generateRandomRating(),
        images: this.generateAccommodationImages(day.accommodation.name)
      } : undefined,
      transport: day.transport.map((transport: any) => ({
        ...transport,
        id: this.generateId(),
        departure: new Date(transport.departure),
        arrival: new Date(transport.arrival)
      })),
      totalCost: this.calculateDayCost(day)
    }));

    return {
      id: this.generateId(),
      tripId: trip.id,
      days: enhancedDays,
      budgetBreakdown: {
        total: 0,
        categories: {
          accommodation: 0,
          transport: 0,
          food: 0,
          activities: 0,
          shopping: 0,
          miscellaneous: 0
        },
        daily: {},
        remaining: trip.totalBudget,
        alerts: []
      },
      optimizedRoutes: []
    };
  }

  private static generateFallbackItinerary(trip: Trip, preferences: TravelPreferences): Itinerary {
    const duration = Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyBudget = trip.totalBudget / duration;
    
    const days: ItineraryDay[] = [];
    
    for (let i = 0; i < duration; i++) {
      const currentDate = new Date(trip.startDate.getTime() + i * 86400000);
      
      days.push({
        date: currentDate,
        activities: this.generateFallbackActivities(trip.destination, preferences, dailyBudget),
        meals: this.generateFallbackMeals(trip.destination, dailyBudget),
        accommodation: i === 0 ? this.generateFallbackAccommodation(trip.destination, dailyBudget) : undefined,
        transport: i === 0 ? this.generateFallbackTransport(trip.destination) : [],
        totalCost: dailyBudget
      });
    }

    return {
      id: this.generateId(),
      tripId: trip.id,
      days,
      budgetBreakdown: {
        total: trip.totalBudget,
        categories: {
          accommodation: trip.totalBudget * 0.4,
          transport: trip.totalBudget * 0.3,
          food: trip.totalBudget * 0.2,
          activities: trip.totalBudget * 0.1,
          shopping: 0,
          miscellaneous: 0
        },
        daily: {},
        remaining: 0,
        alerts: []
      },
      optimizedRoutes: []
    };
  }

  private static generateFallbackActivities(destination: any, preferences: TravelPreferences, dailyBudget: number): Activity[] {
    const activities: Activity[] = [
      {
        id: this.generateId(),
        name: `Explore ${destination.name} Old Town`,
        description: 'Walking tour of the historic city center',
        type: 'cultural',
        location: {
          name: `${destination.name} Old Town`,
          address: `Historic Center, ${destination.name}`,
          coordinates: destination.coordinates
        },
        duration: 180,
        cost: dailyBudget * 0.15,
        timeSlot: {
          start: new Date(),
          end: new Date()
        },
        bookingRequired: false,
        rating: 4.2
      },
      {
        id: this.generateId(),
        name: `${destination.name} Main Museum`,
        description: 'Visit to the city\'s primary cultural museum',
        type: 'cultural',
        location: {
          name: `${destination.name} Museum`,
          address: `Museum District, ${destination.name}`,
          coordinates: destination.coordinates
        },
        duration: 120,
        cost: dailyBudget * 0.1,
        timeSlot: {
          start: new Date(),
          end: new Date()
        },
        bookingRequired: true,
        rating: 4.5
      }
    ];

    return activities;
  }

  private static generateFallbackMeals(destination: any, dailyBudget: number): Meal[] {
    return [
      {
        id: this.generateId(),
        name: `Local Breakfast Spot`,
        type: 'breakfast',
        location: {
          name: `${destination.name} Cafe`,
          address: `City Center, ${destination.name}`,
          coordinates: destination.coordinates
        },
        cost: dailyBudget * 0.1,
        cuisine: 'local',
        rating: 4.0,
        time: new Date()
      },
      {
        id: this.generateId(),
        name: `Traditional Restaurant`,
        type: 'dinner',
        location: {
          name: `${destination.name} Restaurant`,
          address: `Restaurant District, ${destination.name}`,
          coordinates: destination.coordinates
        },
        cost: dailyBudget * 0.2,
        cuisine: 'traditional',
        rating: 4.3,
        time: new Date()
      }
    ];
  }

  private static generateFallbackAccommodation(destination: any, dailyBudget: number): Accommodation {
    return {
      id: this.generateId(),
      name: `${destination.name} Budget Hotel`,
      type: 'hotel',
      location: {
        name: `Budget Hotel ${destination.name}`,
        address: `City Center, ${destination.name}`,
        coordinates: destination.coordinates
      },
      checkIn: new Date(),
      checkOut: new Date(),
      costPerNight: dailyBudget * 0.4,
      totalCost: dailyBudget * 0.4,
      rating: 3.8,
      amenities: ['wifi', 'breakfast', 'ac'],
      images: this.generateAccommodationImages(`${destination.name} Budget Hotel`)
    };
  }

  private static generateFallbackTransport(destination: any): Transportation[] {
    return [
      {
        id: this.generateId(),
        mode: 'bus',
        from: {
          name: 'Airport',
          address: `${destination.name} Airport`,
          coordinates: { lat: destination.coordinates.lat + 0.1, lng: destination.coordinates.lng + 0.1 }
        },
        to: {
          name: 'City Center',
          address: `${destination.name} City Center`,
          coordinates: destination.coordinates
        },
        departure: new Date(),
        arrival: new Date(),
        cost: 15,
        duration: 45
      }
    ];
  }

  static async optimizeForTime(itinerary: Itinerary): Promise<Itinerary> {
    // Optimize activity scheduling to minimize travel time
    const optimizedDays = itinerary.days.map(day => {
      // Sort activities by geographic proximity
      const sortedActivities = [...day.activities].sort((a, b) => {
        const distanceA = this.calculateDistance(
          day.activities[0].location.coordinates,
          a.location.coordinates
        );
        const distanceB = this.calculateDistance(
          day.activities[0].location.coordinates,
          b.location.coordinates
        );
        return distanceA - distanceB;
      });

      // Reschedule time slots
      let currentTime = new Date(day.date);
      currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

      const rescheduledActivities = sortedActivities.map(activity => {
        const startTime = new Date(currentTime);
        const endTime = new Date(currentTime.getTime() + activity.duration * 60000);
        
        currentTime = new Date(endTime.getTime() + 30 * 60000); // 30 min buffer

        return {
          ...activity,
          timeSlot: {
            start: startTime,
            end: endTime
          }
        };
      });

      return {
        ...day,
        activities: rescheduledActivities
      };
    });

    return {
      ...itinerary,
      days: optimizedDays
    };
  }

  static async optimizeForBudget(itinerary: Itinerary, maxBudget: number): Promise<Itinerary> {
    // Replace expensive items with budget alternatives
    const optimizedDays = itinerary.days.map(day => {
      let dayCost = day.totalCost;
      const targetDailyCost = maxBudget / itinerary.days.length;

      if (dayCost <= targetDailyCost) return day;

      // Reduce costs starting with most expensive items
      const optimizedActivities = day.activities.map(activity => {
        if (dayCost > targetDailyCost && activity.cost > targetDailyCost * 0.1) {
          const newCost = activity.cost * 0.7; // 30% reduction
          dayCost = dayCost - activity.cost + newCost;
          return { ...activity, cost: newCost };
        }
        return activity;
      });

      const optimizedMeals = day.meals.map(meal => {
        if (dayCost > targetDailyCost && meal.cost > targetDailyCost * 0.05) {
          const newCost = meal.cost * 0.8; // 20% reduction
          dayCost = dayCost - meal.cost + newCost;
          return { ...meal, cost: newCost };
        }
        return meal;
      });

      return {
        ...day,
        activities: optimizedActivities,
        meals: optimizedMeals,
        totalCost: dayCost
      };
    });

    return {
      ...itinerary,
      days: optimizedDays
    };
  }

  private static calculateDistance(coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static calculateDayCost(day: any): number {
    const activityCosts = day.activities?.reduce((sum: number, activity: any) => sum + (activity.cost || 0), 0) || 0;
    const mealCosts = day.meals?.reduce((sum: number, meal: any) => sum + (meal.cost || 0), 0) || 0;
    const accommodationCost = day.accommodation?.costPerNight || 0;
    const transportCosts = day.transport?.reduce((sum: number, transport: any) => sum + (transport.cost || 0), 0) || 0;

    return activityCosts + mealCosts + accommodationCost + transportCosts;
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static generateRandomRating(): number {
    return Math.round((Math.random() * 2 + 3) * 10) / 10; // Rating between 3.0 and 5.0
  }

  private static generateAccommodationImages(name: string): string[] {
    return [
      `https://placehold.co/800x600?text=${encodeURIComponent(name + ' exterior view with modern architecture and welcoming entrance')}`,
      `https://placehold.co/800x600?text=${encodeURIComponent(name + ' comfortable guest room with modern amenities and cozy atmosphere')}`,
      `https://placehold.co/800x600?text=${encodeURIComponent(name + ' lobby area with elegant design and comfortable seating')}`
    ];
  }
}

export default ItineraryOptimizer;