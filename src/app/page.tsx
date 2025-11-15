'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Mic, Target, TrendingUp, Calendar, Flame, Activity } from 'lucide-react';
import FoodScanner from '@/components/custom/FoodScanner';
import MealList from '@/components/custom/MealList';
import RecipeImporter from '@/components/custom/RecipeImporter';
import { searchFood, getFoodById } from '@/lib/foodDatabase';
import { getDailyLog, saveMeal, deleteMeal, getCalorieGoal, setCalorieGoal } from '@/lib/storage';
import { Food, Meal, DailyLog } from '@/types/food';

export default function Home() {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isListening, setIsListening] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState(2000);
  const [activeTab, setActiveTab] = useState<'manual' | 'photo' | 'recipe'>('manual');

  useEffect(() => {
    loadDailyLog();
  }, []);

  const loadDailyLog = () => {
    const log = getDailyLog();
    setDailyLog(log);
    setNewGoal(log.calorieGoal);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = searchFood(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleAddMeal = () => {
    if (!selectedFood) return;

    const meal: Meal = {
      id: Date.now().toString(),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      serving: selectedFood.serving,
      quantity,
      timestamp: Date.now(),
      type: mealType,
      source: activeTab === 'photo' ? 'photo' : activeTab === 'recipe' ? 'recipe' : 'manual',
    };

    saveMeal(meal);
    setSelectedFood(null);
    setQuantity(1);
    loadDailyLog();
  };

  const handleDeleteMeal = (mealId: string) => {
    deleteMeal(mealId);
    loadDailyLog();
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSearch(transcript);
    };

    recognition.start();
  };

  const handleFoodDetected = (food: Food) => {
    setSelectedFood(food);
    setActiveTab('manual');
  };

  const handleRecipeImported = (recipe: any) => {
    const caloriesPerServing = Math.round(recipe.totalCalories / recipe.servings);
    const proteinPerServing = Math.round(recipe.totalProtein / recipe.servings);
    const carbsPerServing = Math.round(recipe.totalCarbs / recipe.servings);
    const fatPerServing = Math.round(recipe.totalFat / recipe.servings);

    const meal: Meal = {
      id: Date.now().toString(),
      foodId: 'recipe-' + Date.now(),
      foodName: recipe.name,
      calories: caloriesPerServing,
      protein: proteinPerServing,
      carbs: carbsPerServing,
      fat: fatPerServing,
      serving: '1 porção',
      quantity: 1,
      timestamp: Date.now(),
      type: mealType,
      source: 'recipe',
    };

    saveMeal(meal);
    loadDailyLog();
  };

  const handleUpdateGoal = () => {
    setCalorieGoal(newGoal);
    loadDailyLog();
    setShowGoalModal(false);
  };

  if (!dailyLog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const caloriePercentage = Math.min((dailyLog.totalCalories / dailyLog.calorieGoal) * 100, 100);
  const remainingCalories = dailyLog.calorieGoal - dailyLog.totalCalories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NutriTrack
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rastreamento Inteligente</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard de Calorias */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Hoje</h2>
            <button
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all"
            >
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Meta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Círculo de Progresso */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - caloriePercentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {dailyLog.totalCalories}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    de {dailyLog.calorieGoal} kcal
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
                    {remainingCalories > 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        {remainingCalories} restantes
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        {Math.abs(remainingCalories)} acima
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Macros */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Proteínas</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(dailyLog.totalProtein)}g
                  </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((dailyLog.totalProtein / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Carboidratos</span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {Math.round(dailyLog.totalCarbs)}g
                  </span>
                </div>
                <div className="w-full bg-amber-200 dark:bg-amber-900/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((dailyLog.totalCarbs / 250) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Gorduras</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(dailyLog.totalFat)}g
                  </span>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-900/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((dailyLog.totalFat / 70) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adicionar Refeição */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Adicionar Refeição</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Buscar
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'photo'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Flame className="w-4 h-4 inline mr-2" />
              Scanner IA
            </button>
            <button
              onClick={() => setActiveTab('recipe')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'recipe'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Receita
            </button>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Buscar alimento..."
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={handleVoiceInput}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900 rounded-2xl p-3">
                  {searchResults.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{food.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {food.calories} kcal • {food.serving}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedFood && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">{selectedFood.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value))}
                        className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Refeição
                      </label>
                      <select
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value as any)}
                        className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="breakfast">Café</option>
                        <option value="lunch">Almoço</option>
                        <option value="dinner">Jantar</option>
                        <option value="snack">Lanche</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {Math.round(selectedFood.calories * quantity)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">kcal</div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(selectedFood.protein * quantity)}g
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">prot</div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {Math.round(selectedFood.carbs * quantity)}g
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">carb</div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(selectedFood.fat * quantity)}g
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">gord</div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddMeal}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Adicionar Refeição
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'photo' && (
            <FoodScanner onFoodDetected={handleFoodDetected} />
          )}

          {activeTab === 'recipe' && (
            <RecipeImporter onRecipeImported={handleRecipeImported} />
          )}
        </div>

        {/* Lista de Refeições */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Refeições de Hoje</h2>
          <MealList meals={dailyLog.meals} onDelete={handleDeleteMeal} />
        </div>
      </main>

      {/* Modal de Meta */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Definir Meta de Calorias
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Calorias diárias (kcal)
              </label>
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg font-semibold"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateGoal}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
