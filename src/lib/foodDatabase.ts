import { Food } from '@/types/food';

export const foodDatabase: Food[] = [
  // Proteínas
  { id: '1', name: 'Peito de Frango', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { id: '2', name: 'Ovo', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '1 unidade' },
  { id: '3', name: 'Salmão', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g' },
  { id: '4', name: 'Atum', calories: 132, protein: 28, carbs: 0, fat: 1.3, serving: '100g' },
  { id: '5', name: 'Carne Bovina', calories: 250, protein: 26, carbs: 0, fat: 15, serving: '100g' },
  
  // Carboidratos
  { id: '6', name: 'Arroz Branco', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, serving: '100g' },
  { id: '7', name: 'Batata Doce', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, serving: '100g' },
  { id: '8', name: 'Pão Integral', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, serving: '100g' },
  { id: '9', name: 'Macarrão', calories: 131, protein: 5, carbs: 25, fat: 1.1, serving: '100g' },
  { id: '10', name: 'Aveia', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, serving: '100g' },
  
  // Frutas
  { id: '11', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, serving: '1 unidade' },
  { id: '12', name: 'Maçã', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, serving: '1 unidade' },
  { id: '13', name: 'Morango', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, serving: '100g' },
  { id: '14', name: 'Abacate', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, serving: '100g' },
  
  // Vegetais
  { id: '15', name: 'Brócolis', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, serving: '100g' },
  { id: '16', name: 'Alface', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, serving: '100g' },
  { id: '17', name: 'Tomate', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, serving: '100g' },
  
  // Laticínios
  { id: '18', name: 'Leite Integral', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, serving: '100ml' },
  { id: '19', name: 'Iogurte Natural', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, serving: '100g' },
  { id: '20', name: 'Queijo Minas', calories: 264, protein: 17.4, carbs: 3.1, fat: 20.8, serving: '100g' },
  
  // Gorduras Saudáveis
  { id: '21', name: 'Azeite de Oliva', calories: 884, protein: 0, carbs: 0, fat: 100, serving: '100ml' },
  { id: '22', name: 'Amendoim', calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, serving: '100g' },
  { id: '23', name: 'Castanha do Pará', calories: 656, protein: 14, carbs: 12, fat: 66, fiber: 7.5, serving: '100g' },
  
  // Bebidas
  { id: '24', name: 'Suco de Laranja', calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, serving: '100ml' },
  { id: '25', name: 'Café', calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '100ml' },
];

export function searchFood(query: string): Food[] {
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  );
}

export function getFoodById(id: string): Food | undefined {
  return foodDatabase.find(food => food.id === id);
}

// Simula análise de foto usando IA
export function analyzeFoodFromImage(imageData: string): Promise<Food> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula detecção aleatória de um alimento
      const randomFood = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
      resolve(randomFood);
    }, 2000);
  });
}

// Simula análise de receita da web
export function analyzeRecipeFromUrl(url: string): Promise<{
  name: string;
  ingredients: string[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  servings: number;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula extração de receita
      resolve({
        name: 'Receita Importada',
        ingredients: ['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3'],
        totalCalories: 450,
        totalProtein: 25,
        totalCarbs: 40,
        totalFat: 15,
        servings: 2,
      });
    }, 2000);
  });
}
