'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Car } from '@/types';
import { apiService } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { CarImageGallery } from '@/components/CarImageGallery';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Share2, 
  Heart,
  Car as CarIcon,
  Palette,
  DollarSign,
  Info
} from 'lucide-react';

export default function CarDetailPage() {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!carId || isNaN(Number(carId))) {
      setError('ID do carro inválido');
      setLoading(false);
      return;
    }

    loadCar();
  }, [carId]);

  const loadCar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCarPublic(Number(carId));
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

  const handleShare = async () => {
    if (navigator.share && car) {
      try {
        await navigator.share({
          title: `${car.marca} ${car.modelo}`,
          text: `Confira este ${car.marca} ${car.modelo} por ${formatPrice(car.valor)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Aqui você pode implementar a lógica para salvar favoritos
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Loading size="lg" text="Carregando detalhes do carro..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorMessage message={error} onRetry={loadCar} />
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => router.push('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Catálogo
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Carro não encontrado
            </h1>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Catálogo', href: '/' },
            { label: `${car.marca} ${car.modelo}`, current: true }
          ]}
        />

        {/* Botão Voltar */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <CarImageGallery 
                car={car}
                allowNavigation={false}
              />
            </div>
          </div>

          {/* Informações do Carro */}
          <div className="space-y-6">
            {/* Header com título e ações */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {car.marca} {car.modelo}
                  </h1>
                  <p className="text-4xl font-bold text-green-600">
                    {formatPrice(car.valor)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFavorite}
                    className={isFavorite ? 'text-red-500 border-red-300' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="primary">
                  <CarIcon className="w-4 h-4 mr-1" />
                  {car.marca}
                </Badge>
                <Badge variant="secondary">
                  <Palette className="w-4 h-4 mr-1" />
                  {car.cor}
                </Badge>
                <Badge variant="success">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Disponível
                </Badge>
              </div>
            </div>

            {/* Especificações */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Especificações
              </h2>
              <div className="grid gap-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <CarIcon className="w-4 h-4 mr-2" />
                    Marca
                  </span>
                  <span className="text-gray-900 font-semibold">{car.marca}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Modelo
                  </span>
                  <span className="text-gray-900 font-semibold">{car.modelo}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Cor
                  </span>
                  <span className="text-gray-900 font-semibold">{car.cor}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Valor
                  </span>
                  <span className="text-gray-900 font-semibold">{formatPrice(car.valor)}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    ID do Veículo
                  </span>
                  <span className="text-gray-500 font-mono">#{car.id}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Interessado?
              </h2>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Entrar em Contato
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Ver Mais Carros
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Carros Relacionados (placeholder) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Você também pode gostar
          </h2>
          <div className="text-center py-8 text-gray-500">
            <CarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Carros relacionados serão exibidos aqui</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push('/')}
            >
              Ver Todo o Catálogo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
