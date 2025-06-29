'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Car } from '@/types';

interface CarImageGalleryProps {
  car: Car;
  className?: string;
  allowNavigation?: boolean;
}

export function CarImageGallery({ car, className = '', allowNavigation = false }: CarImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<boolean[]>([]);
  const images = car.imagens && car.imagens.length > 0 ? car.imagens : [car.imagemUrl];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setCurrentImageIndex(index);
  };

  const handleImageError = (index: number) => {
    setImageError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  if (images.length === 1) {
    return (
      <div className="relative w-full h-full">
        {imageError[0] ? (
          <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded`}>
            <div className="text-center p-4">
              <div className="text-gray-400 text-lg mb-2">📷</div>
              <div className="text-gray-500 text-sm font-medium">Erro ao carregar imagem</div>
            </div>
          </div>
        ) : (
          <img
            src={images[0]}
            alt={`${car.marca} ${car.modelo}`}
            className={className}
            onError={() => handleImageError(0)}
            style={{ pointerEvents: allowNavigation ? 'none' : 'auto' }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative group w-full h-full">
      {/* Main Image */}
      <div className="relative w-full h-full">
        {imageError[currentImageIndex] ? (
          <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded`}>
            <div className="text-center p-4">
              <div className="text-gray-400 text-lg mb-2">📷</div>
              <div className="text-gray-500 text-sm font-medium">Erro ao carregar imagem</div>
              <div className="text-gray-400 text-xs mt-1">{currentImageIndex + 1} de {images.length}</div>
            </div>
          </div>
        ) : (
          <img
            src={images[currentImageIndex]}
            alt={`${car.marca} ${car.modelo} - Imagem ${currentImageIndex + 1}`}
            className={className}
            onError={() => handleImageError(currentImageIndex)}
            style={{ pointerEvents: allowNavigation ? 'none' : 'auto' }}
          />
        )}
        
        {/* Invisible overlay to prevent navigation when interacting with gallery - only when allowNavigation is false */}
        {images.length > 1 && !allowNavigation && (
          <div 
            className="absolute inset-0 z-10 group-hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        )}
      </div>

      {/* Navigation Arrows - Positioned relative to the container */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-opacity-90 hover:scale-110 z-30 shadow-lg border border-white border-opacity-20"
            aria-label="Imagem anterior"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-opacity-90 hover:scale-110 z-30 shadow-lg border border-white border-opacity-20"
            aria-label="Próxima imagem"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg z-30">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => selectImage(index, e)}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 shadow-sm ${
                index === currentImageIndex 
                  ? 'bg-white scale-125 shadow-md' 
                  : 'bg-white bg-opacity-60 hover:bg-opacity-90 hover:scale-110'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
              style={{ pointerEvents: 'auto' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
