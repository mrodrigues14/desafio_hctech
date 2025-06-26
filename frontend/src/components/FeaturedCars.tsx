'use client';

import { Car } from '@/types';
import { CarCard } from '@/components/CarCard';

interface FeaturedCarsProps {
  cars: Car[];
  isLoading?: boolean;
}

export function FeaturedCars({ cars, isLoading }: FeaturedCarsProps) {
  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Veículos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      </section>
    );
  }

  const featuredCars = cars.slice(0, 3);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Veículos em Destaque</h2>
      {featuredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum veículo em destaque no momento.</p>
        </div>
      )}
    </section>
  );
}
