'use client';

import { Meal } from '@/types/food';
import { Trash2, Clock, Utensils, Camera, Mic, FileText } from 'lucide-react';

interface MealListProps {
  meals: Meal[];
  onDelete: (mealId: string) => void;
}

const mealTypeColors = {
  breakfast: 'from-orange-400 to-amber-500',
  lunch: 'from-emerald-400 to-teal-500',
  dinner: 'from-blue-500 to-indigo-600',
  snack: 'from-pink-400 to-rose-500',
};

const mealTypeLabels = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
};

const sourceIcons = {
  manual: FileText,
  voice: Mic,
  photo: Camera,
  recipe: Utensils,
};

export default function MealList({ meals, onDelete }: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <Utensils className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Nenhuma refeição registrada hoje
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          Adicione sua primeira refeição acima
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meals.map((meal) => {
        const SourceIcon = sourceIcons[meal.source];
        const totalCalories = Math.round(meal.calories * meal.quantity);

        return (
          <div
            key={meal.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${mealTypeColors[meal.type]} text-white text-xs font-semibold`}>
                    {mealTypeLabels[meal.type]}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <SourceIcon className="w-3 h-3" />
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">
                  {meal.foodName}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(meal.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="mx-1">•</span>
                  <span>{meal.quantity}x {meal.serving}</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-lg">
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {totalCalories}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">kcal</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(meal.protein * meal.quantity)}g
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">prot</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg">
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {Math.round(meal.carbs * meal.quantity)}g
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">carb</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(meal.fat * meal.quantity)}g
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">gord</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDelete(meal.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors group"
                aria-label="Deletar refeição"
              >
                <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
