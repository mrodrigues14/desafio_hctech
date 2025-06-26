'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types';

interface CarCardProps {
  car: Car;
  showActions?: boolean;
  onEdit?: (car: Car) => void;
  onDelete?: (id: number) => void;
}

export function CarCard({ car, showActions = false, onEdit, onDelete }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/carros/${car.id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={car.imagemUrl}
            alt={`${car.marca} ${car.modelo}`}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
            }}
            unoptimized={car.imagemUrl.includes('example.com')}
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/carros/${car.id}`} className="block mb-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {car.marca} {car.modelo}
          </h3>
        </Link>
        
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p><span className="font-medium">Cor:</span> {car.cor}</p>
          <p className="text-lg font-bold text-green-600">{formatPrice(car.valor)}</p>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-3 border-t">
            <button
              onClick={() => onEdit?.(car)}
              className="flex-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete?.(car.id)}
              className="flex-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
