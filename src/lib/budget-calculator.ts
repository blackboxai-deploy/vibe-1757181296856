// Budget Calculator and Optimization Logic

import { BudgetBreakdown, BudgetAlert, Trip, Itinerary, Activity, Accommodation, Transportation, Meal } from '@/types';

export class BudgetCalculator {
  static calculateTripBudget(itinerary: Itinerary, trip: Trip): BudgetBreakdown {
    const categories = {
      accommodation: 0,
      transport: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      miscellaneous: 0
    };

    const daily: { [date: string]: number } = {};

    itinerary.days.forEach(day => {
      const dateKey = day.date.toISOString().split('T')[0];
      let dayTotal = 0;

      // Calculate accommodation costs
      if (day.accommodation) {
        const accommodationCost = day.accommodation.totalCost;
        categories.accommodation += accommodationCost;
        dayTotal += accommodationCost;
      }

      // Calculate transport costs
      day.transport.forEach(transport => {
        categories.transport += transport.cost;
        dayTotal += transport.cost;
      });

      // Calculate food costs
      day.meals.forEach(meal => {
        categories.food += meal.cost;
        dayTotal += meal.cost;
      });

      // Calculate activity costs
      day.activities.forEach(activity => {
        categories.activities += activity.cost;
        dayTotal += activity.cost;
      });

      daily[dateKey] = dayTotal;
    });

    const total = Object.values(categories).reduce((sum: number, value: number) => sum + value, 0);
    const remaining = trip.totalBudget - total;

    const alerts = this.generateBudgetAlerts(categories, trip.totalBudget, remaining);

    return {
      total,
      categories,
      daily,
      remaining,
      alerts
    };
  }

  static generateBudgetAlerts(categories: BudgetBreakdown['categories'], totalBudget: number, remaining: number): BudgetAlert[] {
    const alerts: BudgetAlert[] = [];
    const total = Object.values(categories).reduce((sum, value) => sum + value, 0);

    // Check if over budget
    if (remaining < 0) {
      alerts.push({
        type: 'exceeded',
        category: 'miscellaneous',
        message: `Budget exceeded by ${Math.abs(remaining).toFixed(2)}`,
        amount: Math.abs(remaining),
        timestamp: new Date()
      });
    }

    // Check if close to budget limit (90% used)
    if (total / totalBudget > 0.9 && remaining > 0) {
      alerts.push({
        type: 'warning',
        category: 'miscellaneous',
        message: `Only ${remaining.toFixed(2)} remaining (${((remaining / totalBudget) * 100).toFixed(1)}% of budget)`,
        amount: remaining,
        timestamp: new Date()
      });
    }

    // Check individual category budgets
    const categoryLimits = {
      accommodation: 0.4, // 40% of budget
      transport: 0.3, // 30% of budget
      food: 0.2, // 20% of budget
      activities: 0.1 // 10% of budget
    };

    Object.entries(categoryLimits).forEach(([category, limit]) => {
      const categoryKey = category as keyof typeof categories;
      const categorySpend = categories[categoryKey];
      const categoryLimit = totalBudget * limit;

      if (categorySpend > categoryLimit) {
        alerts.push({
          type: 'warning',
          category: categoryKey,
          message: `${category} spending (${categorySpend.toFixed(2)}) exceeds recommended limit (${categoryLimit.toFixed(2)})`,
          amount: categorySpend - categoryLimit,
          timestamp: new Date()
        });
      }
    });

    // Add savings recommendations
    if (remaining > totalBudget * 0.2) { // More than 20% remaining
      alerts.push({
        type: 'recommendation',
        category: 'activities',
        message: `You have ${remaining.toFixed(2)} extra budget. Consider adding more activities or upgrading accommodations.`,
        amount: remaining,
        timestamp: new Date()
      });
    }

    return alerts;
  }

  static optimizeBudget(itinerary: Itinerary, targetBudget: number): {
    optimizedItinerary: Itinerary;
    savings: number;
    changes: string[];
  } {
    const changes: string[] = [];
    let totalSavings = 0;
    const optimizedItinerary = { ...itinerary };

    // Calculate current total
    const currentBudget = this.calculateTripBudget(itinerary, { totalBudget: targetBudget } as Trip);
    const overage = currentBudget.total - targetBudget;

    if (overage <= 0) {
      return {
        optimizedItinerary: itinerary,
        savings: 0,
        changes: ['Budget is already within limits']
      };
    }

    // Note: Optimization strategies could be used for future advanced optimization
=======

    let remainingToSave = overage;

    optimizedItinerary.days = itinerary.days.map(day => {
      const optimizedDay = { ...day };

      // Optimize accommodation
      if (remainingToSave > 0 && day.accommodation) {
        const maxSaving = day.accommodation.totalCost * 0.3;
        const saving = Math.min(maxSaving, remainingToSave);
        optimizedDay.accommodation = {
          ...day.accommodation,
          totalCost: day.accommodation.totalCost - saving
        };
        totalSavings += saving;
        remainingToSave -= saving;
        if (saving > 0) {
          changes.push(`Reduced accommodation cost by ${saving.toFixed(2)} on ${day.date.toDateString()}`);
        }
      }

      // Optimize activities
      if (remainingToSave > 0) {
        const expensiveActivities = day.activities
          .map((activity, index) => ({ activity, index }))
          .sort((a, b) => b.activity.cost - a.activity.cost);

        const activitiesToOptimize = expensiveActivities.slice(0, Math.ceil(expensiveActivities.length / 2));
        
        optimizedDay.activities = day.activities.map((activity, index) => {
          const shouldOptimize = activitiesToOptimize.some(item => item.index === index);
          if (shouldOptimize && remainingToSave > 0) {
            const maxSaving = activity.cost * 0.2;
            const saving = Math.min(maxSaving, remainingToSave);
            remainingToSave -= saving;
            totalSavings += saving;
            if (saving > 0) {
              changes.push(`Found cheaper alternative for ${activity.name} (saved ${saving.toFixed(2)})`);
            }
            return {
              ...activity,
              cost: activity.cost - saving
            };
          }
          return activity;
        });
      }

      // Optimize meals
      if (remainingToSave > 0) {
        optimizedDay.meals = day.meals.map(meal => {
          if (remainingToSave > 0) {
            const maxSaving = meal.cost * 0.15;
            const saving = Math.min(maxSaving, remainingToSave);
            remainingToSave -= saving;
            totalSavings += saving;
            if (saving > 0) {
              changes.push(`Found budget-friendly option for ${meal.name} (saved ${saving.toFixed(2)})`);
            }
            return {
              ...meal,
              cost: meal.cost - saving
            };
          }
          return meal;
        });
      }

      return optimizedDay;
    });

    return {
      optimizedItinerary,
      savings: totalSavings,
      changes
    };
  }

  static calculateDailyCosts(activities: Activity[], meals: Meal[], accommodation?: Accommodation, transport: Transportation[] = []): number {
    const activityCosts = activities.reduce((sum, activity) => sum + activity.cost, 0);
    const mealCosts = meals.reduce((sum, meal) => sum + meal.cost, 0);
    const accommodationCost = accommodation ? accommodation.costPerNight : 0;
    const transportCosts = transport.reduce((sum, t) => sum + t.cost, 0);

    return activityCosts + mealCosts + accommodationCost + transportCosts;
  }

  static suggestBudgetAdjustments(currentBudget: number, targetBudget: number): {
    recommendations: string[];
    alternativeOptions: {
      category: string;
      suggestion: string;
      potentialSaving: number;
    }[];
  } {
    const difference = currentBudget - targetBudget;
    const recommendations: string[] = [];
    const alternativeOptions: {
      category: string;
      suggestion: string;
      potentialSaving: number;
    }[] = [];

    if (difference <= 0) {
      recommendations.push('Your current plan is within budget!');
      recommendations.push(`You have ${Math.abs(difference).toFixed(2)} to spare for additional activities or upgrades.`);
    } else {
      recommendations.push(`You need to reduce costs by ${difference.toFixed(2)} to meet your budget.`);

      // Suggest specific optimizations
      alternativeOptions.push(
        {
          category: 'Accommodation',
          suggestion: 'Consider hostels or shared accommodations instead of hotels',
          potentialSaving: difference * 0.4
        },
        {
          category: 'Transport',
          suggestion: 'Use public transport or budget airlines instead of premium options',
          potentialSaving: difference * 0.3
        },
        {
          category: 'Food',
          suggestion: 'Mix restaurant meals with local markets and street food',
          potentialSaving: difference * 0.2
        },
        {
          category: 'Activities',
          suggestion: 'Focus on free or low-cost activities like hiking, museums on free days',
          potentialSaving: difference * 0.1
        }
      );
    }

    return {
      recommendations,
      alternativeOptions
    };
  }

  static trackRealTimeSpending(plannedBudget: BudgetBreakdown, actualExpenses: { [category: string]: number }): {
    variance: { [category: string]: number };
    projectedTotal: number;
    alerts: BudgetAlert[];
  } {
    const variance: { [category: string]: number } = {};
    const alerts: BudgetAlert[] = [];

    Object.keys(plannedBudget.categories).forEach(category => {
      const planned = plannedBudget.categories[category as keyof typeof plannedBudget.categories];
      const actual = actualExpenses[category] || 0;
      variance[category] = actual - planned;

      if (variance[category] > planned * 0.1) { // 10% over planned
        alerts.push({
          type: 'warning',
          category: category as keyof BudgetBreakdown['categories'],
          message: `${category} spending is ${Math.abs(variance[category]).toFixed(2)} over planned`,
          amount: Math.abs(variance[category]),
          timestamp: new Date()
        });
      }
    });

    const totalActual = Object.values(actualExpenses).reduce((sum, value) => sum + value, 0);
    const totalPlanned = plannedBudget.total;
    const projectedTotal = totalActual + (totalPlanned - totalActual); // Simple projection

    if (totalActual > totalPlanned * 1.1) {
      alerts.push({
        type: 'exceeded',
        category: 'miscellaneous',
        message: `Total spending significantly over budget`,
        amount: totalActual - totalPlanned,
        timestamp: new Date()
      });
    }

    return {
      variance,
      projectedTotal,
      alerts
    };
  }

  static generateBudgetReport(budgetBreakdown: BudgetBreakdown): {
    summary: string;
    categoryAnalysis: { [key: string]: string };
    recommendations: string[];
  } {
    const { total, categories, remaining } = budgetBreakdown;
    
    const summary = `Total planned: ${total.toFixed(2)} | Remaining: ${remaining.toFixed(2)}`;
    
    const categoryAnalysis: { [key: string]: string } = {};
    Object.entries(categories).forEach(([category, amount]) => {
      const percentage = (((amount as number) / total) * 100).toFixed(1);
      categoryAnalysis[category] = `${(amount as number).toFixed(2)} (${percentage}%)`;
    });

    const recommendations: string[] = [];
    
    // Generate smart recommendations based on spending patterns
    const highestCategory = Object.entries(categories).reduce((a, b) => 
      categories[a[0] as keyof typeof categories] > categories[b[0] as keyof typeof categories] ? a : b
    );
    
    recommendations.push(`${highestCategory[0]} is your largest expense category`);
    
    if (remaining < 0) {
      recommendations.push('Consider the optimization suggestions to reduce costs');
    } else if (remaining > total * 0.15) {
      recommendations.push('You have room to add more activities or upgrade experiences');
    }

    return {
      summary,
      categoryAnalysis,
      recommendations
    };
  }
}

export default BudgetCalculator;