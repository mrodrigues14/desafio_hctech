'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/types';
import { apiService } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedCars } from '@/components/FeaturedCars';
import { CategoriesSection } from '@/components/CategoriesSection';
import { CarCard } from '@/components/CarCard';

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCarsPublic();
      setCars(data);
      setFilteredCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCars(cars);
      return;
    }

    const filtered = cars.filter(car => 
      car.modelo.toLowerCase().includes(query.toLowerCase()) ||
      car.marca.toLowerCase().includes(query.toLowerCase()) ||
      car.cor.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCars(filtered);
  };

  const handleCategorySelect = (category: string) => {
    const categoryMapping: { [key: string]: string } = {
      'suv': 'Honda',
      'sedan': 'Toyota',
      'caminhoes': 'Ford',
      'eletricos': 'Tesla',
    };

    const brand = categoryMapping[category];
    if (brand) {
      const filtered = cars.filter(car => 
        car.marca.toLowerCase().includes(brand.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  };

  if (loading) {
    return <Loading size="lg" text="Carregando catálogo de carros..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <ErrorMessage message={error} onRetry={loadCars} />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection onSearch={handleSearch} />

      <FeaturedCars cars={filteredCars} isLoading={loading} />

      <CategoriesSection onCategorySelect={handleCategorySelect} />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Todos os Veículos ({filteredCars.length})
          </h2>
        
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-6xl mb-6 text-gray-400">�</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Nenhum carro encontrado
            </h3>
            <p className="text-gray-600 mb-8">
              {cars.length === 0 
                ? 'Ainda não há carros no catálogo' 
                : 'Tente ajustar sua pesquisa ou explore nossas categorias'
              }
            </p>
            {cars.length === 0 && isAuthenticated && (
              <Link href="/gestao">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2 rounded">
                  Adicionar Primeiro Carro
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
