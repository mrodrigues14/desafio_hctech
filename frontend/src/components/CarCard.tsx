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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <Link href={`/carros/${car.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
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
        <Link href={`/carros/${car.id}`} className="block mb-3">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200">
            {car.marca} {car.modelo}
          </h3>
        </Link>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Cor:</span> {car.cor}
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(car.valor)}
          </p>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => onEdit?.(car)}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete?.(car.id)}
              className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200 font-medium"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
