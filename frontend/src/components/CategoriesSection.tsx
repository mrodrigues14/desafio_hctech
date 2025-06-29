'use client';

import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count?: number;
  brand?: string;
}

const categories: Category[] = [
  {
    id: 'suv',
    name: 'SUVs',
    description: 'Veículos versáteis e espaçosos para famílias e aventureiros.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    brand: 'Honda',
  },
  {
    id: 'sedan',
    name: 'Sedans',
    description: 'Carros confortáveis e eficientes para deslocações diárias.',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    brand: 'Toyota',
  },
  {
    id: 'eletricos',
    name: 'Veículos Elétricos',
    description: 'Carros ecológicos e inovadores para um futuro sustentável.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    brand: 'Tesla',
  },
];

interface CategoriesSectionProps {
  onCategorySelect?: (category: string) => void;
}

export function CategoriesSection({ onCategorySelect }: CategoriesSectionProps) {
  const router = useRouter();

  const handleCategoryClick = (category: Category) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      if (category.brand) {
        router.push(`/catalogo?brand=${encodeURIComponent(category.brand)}`);
      }
    } else {
      onCategorySelect?.(category.id);
    }
  };
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Navegue por Categoria</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
