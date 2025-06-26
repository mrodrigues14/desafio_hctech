'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Car } from '@/types';
import { apiService } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function CarDetailPage() {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!carId || isNaN(Number(carId))) {
      setError('ID do carro inválido');
      setLoading(false);
      return;
    }

    loadCar();
  }, [carId, isAuthenticated]);

  const loadCar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCar(Number(carId));
      setCar(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carro');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (!isAuthenticated) {
    return null; // Vai redirecionar para login
  }

  if (loading) {
    return <Loading size="lg" text="Carregando detalhes do carro..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} onRetry={loadCar} />
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => router.push('/')}>
            Voltar ao Catálogo
          </Button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Carro não encontrado
        </h1>
        <Button onClick={() => router.push('/')}>
          Voltar ao Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Voltar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Imagem */}
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={car.imagemUrl}
                alt={`${car.marca} ${car.modelo}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-car.jpg';
                }}
              />
            </div>
          </div>

          {/* Detalhes */}
          <div className="md:w-1/2 p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.marca} {car.modelo}
              </h1>
              <p className="text-3xl font-bold text-green-600">
                {formatPrice(car.valor)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600 font-medium">Marca:</span>
                <span className="text-gray-900 font-semibold">{car.marca}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600 font-medium">Modelo:</span>
                <span className="text-gray-900 font-semibold">{car.modelo}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600 font-medium">Cor:</span>
                <span className="text-gray-900 font-semibold">{car.cor}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600 font-medium">ID:</span>
                <span className="text-gray-500">#{car.id}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button 
                className="w-full"
                onClick={() => router.push('/gestao')}
              >
                Gerenciar Carros
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/')}
              >
                Ver Catálogo Completo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
