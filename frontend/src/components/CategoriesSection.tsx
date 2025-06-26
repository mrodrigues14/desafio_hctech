'use client';

import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count?: number;
}

const categories: Category[] = [
  {
    id: 'suv',
    name: 'SUVs',
    description: 'Veículos versáteis e espaçosos para famílias e aventureiros.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sedan',
    name: 'Sedans',
    description: 'Carros confortáveis e eficientes para deslocações diárias.',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'caminhoes',
    name: 'Caminhões',
    description: 'Veículos potentes e duráveis para trabalho e lazer.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'eletricos',
    name: 'Veículos Elétricos',
    description: 'Carros ecológicos e inovadores para um futuro sustentável.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

interface CategoriesSectionProps {
  onCategorySelect?: (category: string) => void;
}

export function CategoriesSection({ onCategorySelect }: CategoriesSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Navegue por Categoria</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200 leading-tight">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
