// Gamification System - Badges, Achievements, and Progress Tracking

import { Badge, UserBadge, Achievement, User, Trip } from '@/types';

export class GamificationManager {
  // Predefined badges
  private static readonly BADGES: Badge[] = [
    {
      id: 'first_trip',
      name: 'First Journey',
      description: 'Complete your first trip planning',
      imageUrl: 'https://placehold.co/200x200?text=First+Journey+Badge+with+golden+compass+and+celebration+stars',
      criteria: {
        type: 'trips_completed',
        threshold: 1
      },
      rarity: 'common'
    },
    {
      id: 'budget_saver',
      name: 'Budget Master',
      description: 'Save 20% or more from original budget',
      imageUrl: 'https://placehold.co/200x200?text=Budget+Master+Badge+with+golden+piggy+bank+and+dollar+signs',
      criteria: {
        type: 'budget_saved',
        threshold: 20
      },
      rarity: 'rare'
    },
    {
      id: 'explorer',
      name: 'World Explorer',
      description: 'Visit 5 different countries',
      imageUrl: 'https://placehold.co/200x200?text=World+Explorer+Badge+with+globe+and+airplane+trail',
      criteria: {
        type: 'countries_visited',
        threshold: 5
      },
      rarity: 'rare'
    },
    {
      id: 'activity_enthusiast',
      name: 'Activity Enthusiast',
      description: 'Complete 50 different activities',
      imageUrl: 'https://placehold.co/200x200?text=Activity+Enthusiast+Badge+with+hiking+boots+and+mountain+peaks',
      criteria: {
        type: 'activities_done',
        threshold: 50
      },
      rarity: 'epic'
    },
    {
      id: 'frequent_traveler',
      name: 'Frequent Traveler',
      description: 'Complete 10 trips',
      imageUrl: 'https://placehold.co/200x200?text=Frequent+Traveler+Badge+with+vintage+suitcase+and+travel+stamps',
      criteria: {
        type: 'trips_completed',
        threshold: 10
      },
      rarity: 'epic'
    },
    {
      id: 'continent_collector',
      name: 'Continent Collector',
      description: 'Visit all 7 continents',
      imageUrl: 'https://placehold.co/200x200?text=Continent+Collector+Badge+with+world+map+and+golden+crown',
      criteria: {
        type: 'countries_visited',
        threshold: 20
      },
      rarity: 'legendary'
    },
    {
      id: 'budget_guru',
      name: 'Budget Guru',
      description: 'Save over $10,000 total across all trips',
      imageUrl: 'https://placehold.co/200x200?text=Budget+Guru+Badge+with+diamond+calculator+and+money+symbols',
      criteria: {
        type: 'budget_saved',
        threshold: 10000
      },
      rarity: 'legendary'
    },
    {
      id: 'solo_adventurer',
      name: 'Solo Adventurer',
      description: 'Complete 3 solo trips',
      imageUrl: 'https://placehold.co/200x200?text=Solo+Adventurer+Badge+with+lone+hiker+silhouette+and+sunrise',
      criteria: {
        type: 'trips_completed',
        threshold: 3
      },
      rarity: 'rare'
    },
    {
      id: 'group_organizer',
      name: 'Group Organizer',
      description: 'Organize 5 group trips (3+ people)',
      imageUrl: 'https://placehold.co/200x200?text=Group+Organizer+Badge+with+people+circle+and+leadership+star',
      criteria: {
        type: 'trips_completed',
        threshold: 5
      },
      rarity: 'epic'
    },
    {
      id: 'culture_seeker',
      name: 'Culture Seeker',
      description: 'Visit 25 museums and cultural sites',
      imageUrl: 'https://placehold.co/200x200?text=Culture+Seeker+Badge+with+classical+columns+and+art+palette',
      criteria: {
        type: 'activities_done',
        threshold: 25
      },
      rarity: 'rare'
    }
  ];

  static getAllBadges(): Badge[] {
    return [...this.BADGES];
  }

  static getBadgeById(badgeId: string): Badge | undefined {
    return this.BADGES.find(badge => badge.id === badgeId);
  }

  static checkBadgeEligibility(userId: string, userStats: UserStats): UserBadge[] {
    const eligibleBadges: UserBadge[] = [];

    this.BADGES.forEach(badge => {
      if (this.meetsCriteria(badge, userStats)) {
        eligibleBadges.push({
          userId,
          badgeId: badge.id,
          earnedDate: new Date(),
          progress: this.calculateProgress(badge, userStats)
        });
      }
    });

    return eligibleBadges;
  }

  private static meetsCriteria(badge: Badge, stats: UserStats): boolean {
    switch (badge.criteria.type) {
      case 'trips_completed':
        return stats.tripsCompleted >= badge.criteria.threshold;
      case 'countries_visited':
        return stats.countriesVisited >= badge.criteria.threshold;
      case 'budget_saved':
        return stats.totalBudgetSaved >= badge.criteria.threshold;
      case 'activities_done':
        return stats.activitiesCompleted >= badge.criteria.threshold;
      default:
        return false;
    }
  }

  private static calculateProgress(badge: Badge, stats: UserStats): number {
    let current = 0;
    
    switch (badge.criteria.type) {
      case 'trips_completed':
        current = stats.tripsCompleted;
        break;
      case 'countries_visited':
        current = stats.countriesVisited;
        break;
      case 'budget_saved':
        current = stats.totalBudgetSaved;
        break;
      case 'activities_done':
        current = stats.activitiesCompleted;
        break;
    }

    return Math.min((current / badge.criteria.threshold) * 100, 100);
  }

  static calculateAchievements(userId: string, userStats: UserStats): Achievement[] {
    const achievements: Achievement[] = [];

    // Explorer Achievement
    achievements.push({
      userId,
      type: 'explorer',
      level: Math.floor(userStats.countriesVisited / 3) + 1,
      progress: userStats.countriesVisited % 3,
      maxProgress: 3,
      rewards: [`Unlock destination recommendations for level ${Math.floor(userStats.countriesVisited / 3) + 1}`]
    });

    // Saver Achievement
    const saverLevel = Math.floor(userStats.totalBudgetSaved / 1000) + 1;
    achievements.push({
      userId,
      type: 'saver',
      level: saverLevel,
      progress: userStats.totalBudgetSaved % 1000,
      maxProgress: 1000,
      rewards: [`${saverLevel * 5}% discount on premium features`]
    });

    // Adventurer Achievement
    const adventurerLevel = Math.floor(userStats.activitiesCompleted / 10) + 1;
    achievements.push({
      userId,
      type: 'adventurer',
      level: adventurerLevel,
      progress: userStats.activitiesCompleted % 10,
      maxProgress: 10,
      rewards: [`Unlock ${adventurerLevel * 2} new activity categories`]
    });

    // Foodie Achievement
    const foodieLevel = Math.floor(userStats.restaurantsVisited / 15) + 1;
    achievements.push({
      userId,
      type: 'foodie',
      level: foodieLevel,
      progress: userStats.restaurantsVisited % 15,
      maxProgress: 15,
      rewards: [`Access to ${foodieLevel * 3} exclusive restaurant recommendations`]
    });

    // Photographer Achievement (based on photo-worthy activities)
    const photographerLevel = Math.floor(userStats.photoActivities / 8) + 1;
    achievements.push({
      userId,
      type: 'photographer',
      level: photographerLevel,
      progress: userStats.photoActivities % 8,
      maxProgress: 8,
      rewards: [`Unlock ${photographerLevel * 2} scenic photography spots per destination`]
    });

    return achievements;
  }

  static generateProgressReport(userStats: UserStats, userBadges: UserBadge[]): GameProgressReport {
    const totalPossibleBadges = this.BADGES.length;
    const earnedBadges = userBadges.length;
    const completionPercentage = (earnedBadges / totalPossibleBadges) * 100;

    const nextBadges = this.getNextBadgesToEarn(userStats, userBadges);
    const rarityStats = this.calculateRarityStats(userBadges);

    return {
      completionPercentage: Math.round(completionPercentage),
      earnedBadges,
      totalBadges: totalPossibleBadges,
      nextBadges,
      rarityStats,
      totalPoints: this.calculateTotalPoints(userBadges),
      rank: this.calculateRank(userStats),
      streakData: {
        currentStreak: userStats.currentStreak || 0,
        longestStreak: userStats.longestStreak || 0,
        lastActivity: userStats.lastActivityDate || new Date()
      }
    };
  }

  private static getNextBadgesToEarn(userStats: UserStats, earnedBadges: UserBadge[]): NextBadgeInfo[] {
    const earnedBadgeIds = new Set(earnedBadges.map(badge => badge.badgeId));
    
    return this.BADGES
      .filter(badge => !earnedBadgeIds.has(badge.id))
      .map(badge => ({
        badge,
        progress: this.calculateProgress(badge, userStats),
        remaining: badge.criteria.threshold - this.getCurrentValue(badge.criteria.type, userStats)
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  }

  private static getCurrentValue(type: Badge['criteria']['type'], stats: UserStats): number {
    switch (type) {
      case 'trips_completed':
        return stats.tripsCompleted;
      case 'countries_visited':
        return stats.countriesVisited;
      case 'budget_saved':
        return stats.totalBudgetSaved;
      case 'activities_done':
        return stats.activitiesCompleted;
      default:
        return 0;
    }
  }

  private static calculateRarityStats(userBadges: UserBadge[]): RarityStats {
    const stats: RarityStats = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    userBadges.forEach(userBadge => {
      const badge = this.getBadgeById(userBadge.badgeId);
      if (badge) {
        stats[badge.rarity]++;
      }
    });

    return stats;
  }

  private static calculateTotalPoints(userBadges: UserBadge[]): number {
    const rarityPoints = {
      common: 10,
      rare: 25,
      epic: 50,
      legendary: 100
    };

    return userBadges.reduce((total, userBadge) => {
      const badge = this.getBadgeById(userBadge.badgeId);
      return badge ? total + rarityPoints[badge.rarity] : total;
    }, 0);
  }

  private static calculateRank(userStats: UserStats): TravelerRank {
    const points = userStats.tripsCompleted * 20 + 
                   userStats.countriesVisited * 15 + 
                   userStats.activitiesCompleted * 2 + 
                   Math.floor(userStats.totalBudgetSaved / 100);

    if (points < 100) return { name: 'Novice Traveler', level: 1, pointsToNext: 100 - points };
    if (points < 300) return { name: 'Explorer', level: 2, pointsToNext: 300 - points };
    if (points < 600) return { name: 'Seasoned Traveler', level: 3, pointsToNext: 600 - points };
    if (points < 1000) return { name: 'Travel Expert', level: 4, pointsToNext: 1000 - points };
    if (points < 1500) return { name: 'Globetrotter', level: 5, pointsToNext: 1500 - points };
    if (points < 2500) return { name: 'World Navigator', level: 6, pointsToNext: 2500 - points };
    if (points < 4000) return { name: 'Travel Master', level: 7, pointsToNext: 4000 - points };
    return { name: 'Legendary Explorer', level: 8, pointsToNext: 0 };
  }

  static updateUserStats(currentStats: UserStats, trip: Trip, completed: boolean = false): UserStats {
    if (!completed) return currentStats;

    const newStats = { ...currentStats };
    
    // Update trip count
    newStats.tripsCompleted = (newStats.tripsCompleted || 0) + 1;
    
    // Update countries visited (avoid duplicates)
    const visitedCountries = new Set(newStats.visitedCountries || []);
    visitedCountries.add(trip.destination.country);
    newStats.countriesVisited = visitedCountries.size;
    newStats.visitedCountries = Array.from(visitedCountries);
    
    // Update budget savings
    const actualSpent = 0; // This would come from actual spending tracking
    const budgetSaved = Math.max(0, trip.totalBudget - actualSpent);
    newStats.totalBudgetSaved = (newStats.totalBudgetSaved || 0) + budgetSaved;
    
    // Update activity counts (would be calculated from itinerary)
    newStats.activitiesCompleted = (newStats.activitiesCompleted || 0) + 5; // Estimate
    newStats.restaurantsVisited = (newStats.restaurantsVisited || 0) + 3; // Estimate
    newStats.photoActivities = (newStats.photoActivities || 0) + 2; // Estimate
    
    // Update streaks
    const today = new Date();
    const lastActivity = new Date(newStats.lastActivityDate || 0);
    const daysDifference = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 3600 * 24));
    
    if (daysDifference === 1) {
      newStats.currentStreak = (newStats.currentStreak || 0) + 1;
    } else if (daysDifference > 1) {
      newStats.currentStreak = 1;
    }
    
    newStats.longestStreak = Math.max(newStats.longestStreak || 0, newStats.currentStreak || 0);
    newStats.lastActivityDate = today;
    
    return newStats;
  }

  static generateChallenges(userStats: UserStats): Challenge[] {
    const challenges: Challenge[] = [];
    
    // Weekly challenges
    challenges.push({
      id: 'weekly_planner',
      title: 'Weekly Planner',
      description: 'Plan 2 trips this week',
      type: 'weekly',
      target: 2,
      current: 0,
      reward: 'Unlock premium destination suggestions',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      difficulty: 'easy'
    });
    
    // Monthly challenges
    challenges.push({
      id: 'budget_optimizer',
      title: 'Budget Optimizer',
      description: 'Save $500 total across all trips this month',
      type: 'monthly',
      target: 500,
      current: userStats.monthlyBudgetSaved || 0,
      reward: '25% discount on premium features',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      difficulty: 'medium'
    });
    
    // Personal challenges based on user stats
    if (userStats.countriesVisited < 5) {
      challenges.push({
        id: 'country_explorer',
        title: 'Country Explorer',
        description: `Visit ${5 - userStats.countriesVisited} more countries`,
        type: 'personal',
        target: 5,
        current: userStats.countriesVisited,
        reward: 'World Explorer badge',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        difficulty: 'hard'
      });
    }
    
    return challenges;
  }
}

// Type definitions for gamification
export interface UserStats {
  tripsCompleted: number;
  countriesVisited: number;
  visitedCountries: string[];
  totalBudgetSaved: number;
  activitiesCompleted: number;
  restaurantsVisited: number;
  photoActivities: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  monthlyBudgetSaved: number;
}

export interface GameProgressReport {
  completionPercentage: number;
  earnedBadges: number;
  totalBadges: number;
  nextBadges: NextBadgeInfo[];
  rarityStats: RarityStats;
  totalPoints: number;
  rank: TravelerRank;
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastActivity: Date;
  };
}

export interface NextBadgeInfo {
  badge: Badge;
  progress: number;
  remaining: number;
}

export interface RarityStats {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface TravelerRank {
  name: string;
  level: number;
  pointsToNext: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'personal';
  target: number;
  current: number;
  reward: string;
  expiryDate: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default GamificationManager;