'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Car } from '@/types';
import { apiService } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { CarCard } from '@/components/CarCard';
import { Button } from '@/components/ui/Button';

export default function CatalogoPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const searchParams = useSearchParams();

  useEffect(() => {
    loadCars();
    
    const urlQuery = searchParams.get('q');
    const urlBrand = searchParams.get('brand');
    
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
    if (urlBrand) {
      setSelectedBrand(urlBrand);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [cars, searchQuery, selectedBrand, minPrice, maxPrice, selectedColor, sortBy]);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCarsPublic();
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carros');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(car => 
        car.modelo.toLowerCase().includes(query) ||
        car.marca.toLowerCase().includes(query) ||
        car.cor.toLowerCase().includes(query)
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(car => car.marca === selectedBrand);
    }

    if (selectedColor) {
      filtered = filtered.filter(car => car.cor === selectedColor);
    }

    if (minPrice) {
      filtered = filtered.filter(car => car.valor >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(car => car.valor <= Number(maxPrice));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`);
        case 'price-asc':
          return a.valor - b.valor;
        case 'price-desc':
          return b.valor - a.valor;
        case 'brand':
          return a.marca.localeCompare(b.marca);
        default:
          return 0;
      }
    });

    setFilteredCars(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedColor('');
    setSortBy('name');
  };

  const brands = [...new Set(cars.map(car => car.marca))].sort();
  const colors = [...new Set(cars.map(car => car.cor))].sort();

  if (loading) {
    return <Loading size="lg" text="Carregando catálogo..." />;
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
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link 
                href="/" 
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Início
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Catálogo</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Veículos</h1>
          <p className="text-gray-600">
            {filteredCars.length} de {cars.length} veículos encontrados
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Limpar
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Marca, modelo ou cor..."
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="">Todas as marcas</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="">Todas as cores</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faixa de Preço
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Preço mínimo"
                      className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Preço máximo"
                      className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="name">Nome (A-Z)</option>
                    <option value="brand">Marca (A-Z)</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {filteredCars.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-6xl mb-6 text-gray-400">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Nenhum veículo encontrado
                </h3>
                <p className="text-gray-600 mb-8">
                  Tente ajustar os filtros ou fazer uma nova pesquisa
                </p>
                <Button onClick={clearFilters} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
