'use client';

import { 
  Smartphone, 
  Shirt, 
  Home, 
  Book, 
  Dumbbell, 
  Sparkles,
  LucideIcon 
} from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onSelect: (categoryName: string) => void;
  isSelected: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  shirt: Shirt,
  home: Home,
  book: Book,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
};

export default function CategoryCard({ category, onSelect, isSelected }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Home;

  return (
    <button
      onClick={() => onSelect(category.name)}
      className={`card text-center p-4 transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? 'bg-primary text-white border-2 border-primary' 
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      <IconComponent 
        size={32} 
        className={`mx-auto mb-2 ${isSelected ? 'text-white' : 'text-primary'}`} 
      />
      <h3 className="font-medium text-sm">{category.name}</h3>
    </button>
  );
} 