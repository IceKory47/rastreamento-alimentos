export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  serving: string;
}

export interface Meal {
  id: string;
  foodId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  quantity: number;
  timestamp: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  source: 'manual' | 'voice' | 'photo' | 'recipe';
}

export interface Recipe {
  id: string;
  name: string;
  url?: string;
  ingredients: string[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  servings: number;
}

export interface DailyLog {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  calorieGoal: number;
}
