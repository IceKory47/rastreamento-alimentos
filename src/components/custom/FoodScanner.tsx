'use client';

import { useState } from 'react';
import { Camera, Loader2, Sparkles } from 'lucide-react';
import { analyzeFoodFromImage } from '@/lib/foodDatabase';
import { Food } from '@/types/food';

interface FoodScannerProps {
  onFoodDetected: (food: Food) => void;
}

export default function FoodScanner({ onFoodDetected }: FoodScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cria preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simula análise de IA
    setIsScanning(true);
    try {
      const detectedFood = await analyzeFoodFromImage(file.name);
      onFoodDetected(detectedFood);
    } finally {
      setIsScanning(false);
      setPreview(null);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="food-photo"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-300 dark:border-purple-700"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isScanning ? (
            <>
              <Loader2 className="w-12 h-12 mb-3 text-purple-500 animate-spin" />
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Analisando imagem com IA...
              </p>
            </>
          ) : preview ? (
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
          ) : (
            <>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Scanner Inteligente de Alimentos
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tire uma foto ou selecione uma imagem
              </p>
            </>
          )}
        </div>
        <input
          id="food-photo"
          type="file"
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          disabled={isScanning}
        />
      </label>
    </div>
  );
}
