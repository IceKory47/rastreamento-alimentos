import { Meal, DailyLog } from '@/types/food';

const STORAGE_KEY = 'food-tracker-data';
const GOAL_KEY = 'calorie-goal';

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDailyLog(date: string = getTodayDate()): DailyLog {
  if (typeof window === 'undefined') {
    return createEmptyLog(date);
  }

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return createEmptyLog(date);
  }

  const allLogs: Record<string, DailyLog> = JSON.parse(data);
  return allLogs[date] || createEmptyLog(date);
}

export function saveMeal(meal: Meal): void {
  if (typeof window === 'undefined') return;

  const date = getTodayDate();
  const data = localStorage.getItem(STORAGE_KEY);
  const allLogs: Record<string, DailyLog> = data ? JSON.parse(data) : {};
  
  const currentLog = allLogs[date] || createEmptyLog(date);
  currentLog.meals.push(meal);
  
  // Recalcula totais
  currentLog.totalCalories = currentLog.meals.reduce((sum, m) => sum + m.calories * m.quantity, 0);
  currentLog.totalProtein = currentLog.meals.reduce((sum, m) => sum + m.protein * m.quantity, 0);
  currentLog.totalCarbs = currentLog.meals.reduce((sum, m) => sum + m.carbs * m.quantity, 0);
  currentLog.totalFat = currentLog.meals.reduce((sum, m) => sum + m.fat * m.quantity, 0);
  
  allLogs[date] = currentLog;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
}

export function deleteMeal(mealId: string): void {
  if (typeof window === 'undefined') return;

  const date = getTodayDate();
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;

  const allLogs: Record<string, DailyLog> = JSON.parse(data);
  const currentLog = allLogs[date];
  
  if (!currentLog) return;

  currentLog.meals = currentLog.meals.filter(m => m.id !== mealId);
  
  // Recalcula totais
  currentLog.totalCalories = currentLog.meals.reduce((sum, m) => sum + m.calories * m.quantity, 0);
  currentLog.totalProtein = currentLog.meals.reduce((sum, m) => sum + m.protein * m.quantity, 0);
  currentLog.totalCarbs = currentLog.meals.reduce((sum, m) => sum + m.carbs * m.quantity, 0);
  currentLog.totalFat = currentLog.meals.reduce((sum, m) => sum + m.fat * m.quantity, 0);
  
  allLogs[date] = currentLog;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
}

export function getCalorieGoal(): number {
  if (typeof window === 'undefined') return 2000;
  
  const goal = localStorage.getItem(GOAL_KEY);
  return goal ? parseInt(goal) : 2000;
}

export function setCalorieGoal(goal: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GOAL_KEY, goal.toString());
}

function createEmptyLog(date: string): DailyLog {
  return {
    date,
    meals: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    calorieGoal: getCalorieGoal(),
  };
}
