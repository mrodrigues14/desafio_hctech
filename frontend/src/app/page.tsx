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
import { PromotionsSection } from '@/components/PromotionsSection';

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const loadCars = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCars();
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
  }, [isAuthenticated]);

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
    // Por enquanto, vamos apenas filtrar por marca baseado na categoria
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section for Non-Authenticated Users */}
        <div className="relative h-screen flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              🚗 HCTech Cars
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Encontre o Seu Carro Perfeito
            </p>
            <p className="text-lg mb-12 max-w-2xl mx-auto opacity-80">
              Explore nossa vasta seleção de veículos novos e usados. Obtenha as melhores ofertas e opções de financiamento com autenticação segura.
            </p>
            
            <div className="space-y-6">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-4">
                  Fazer Login e Explorar
                </Button>
              </Link>
              
              <div className="mt-8 p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-3">Credenciais para Teste:</h3>
                <div className="text-left space-y-1">
                  <p><span className="font-medium">Usuário:</span> admin</p>
                  <p><span className="font-medium">Senha:</span> admin123</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher HCTech Cars?</h2>
              <p className="text-lg text-gray-600">Tecnologia avançada para uma experiência superior</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  🔐
                </div>
                <h3 className="text-xl font-semibold mb-2">Autenticação Segura</h3>
                <p className="text-gray-600">Sistema JWT para máxima segurança dos seus dados</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  🚗
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
                <p className="text-gray-600">CRUD completo para gerenciar seu catálogo de veículos</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  ⚡
                </div>
                <h3 className="text-xl font-semibold mb-2">Interface Moderna</h3>
                <p className="text-gray-600">Design responsivo e experiência de usuário intuitiva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Carregando catálogo..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <ErrorMessage 
          message={error} 
          onRetry={loadCars}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Featured Cars */}
      <FeaturedCars cars={filteredCars} isLoading={loading} />

      {/* Promotions */}
      <PromotionsSection />

      {/* Categories */}
      <CategoriesSection onCategorySelect={handleCategorySelect} />

      {/* All Cars Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Todos os Veículos ({filteredCars.length})
          </h2>
          <Link href="/gestao">
            <Button>
              Gerenciar Carros
            </Button>
          </Link>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum carro encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              {cars.length === 0 
                ? 'Adicione alguns carros para começar' 
                : 'Tente ajustar sua pesquisa ou explore nossas categorias'
              }
            </p>
            {cars.length === 0 && (
              <Link href="/gestao">
                <Button>
                  Adicionar Primeiro Carro
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/carros/${car.id}`} className="block">
                  <div className="aspect-video relative bg-gray-100">
                    <img
                      src={car.imagemUrl}
                      alt={`${car.marca} ${car.modelo}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {car.marca} {car.modelo}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p><span className="font-medium">Cor:</span> {car.cor}</p>
                      <p className="text-lg font-bold text-green-600">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(car.valor)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
