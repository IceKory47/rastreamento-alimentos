'use client';

import { useState } from 'react';
import { Link2, Loader2, Sparkles, ChefHat } from 'lucide-react';
import { analyzeRecipeFromUrl } from '@/lib/foodDatabase';

interface RecipeImporterProps {
  onRecipeImported: (recipe: {
    name: string;
    ingredients: string[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    servings: number;
  }) => void;
}

export default function RecipeImporter({ onRecipeImported }: RecipeImporterProps) {
  const [url, setUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsImporting(true);
    try {
      const recipe = await analyzeRecipeFromUrl(url);
      onRecipeImported(recipe);
      setUrl('');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <form onSubmit={handleImport} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {isImporting ? (
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          ) : (
            <Link2 className="w-5 h-5 text-purple-500" />
          )}
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole a URL da receita aqui..."
          disabled={isImporting}
          className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={isImporting || !url.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Importando...</span>
            </>
          ) : (
            <>
              <ChefHat className="w-4 h-4" />
              <span className="hidden sm:inline">Importar</span>
            </>
          )}
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 px-1">
        <Sparkles className="w-3 h-3 text-purple-500" />
        <span>IA extrai automaticamente ingredientes e calcula valores nutricionais</span>
      </div>
    </form>
  );
}
