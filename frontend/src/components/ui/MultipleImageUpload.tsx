'use client';

import { useState, useRef } from 'react';
import { Button } from './Button';
import { Loading } from './Loading';
import { ErrorMessage } from './ErrorMessage';

interface MultipleImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  currentImages?: string[];
  disabled?: boolean;
  maxImages?: number;
}

interface UploadProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export function MultipleImageUpload({ 
  onImagesUploaded, 
  currentImages = [], 
  disabled = false,
  maxImages = 5 
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(currentImages);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validar número total de imagens
    const totalImages = images.length + files.length;
    if (totalImages > maxImages) {
      setError(`Máximo de ${maxImages} imagens permitidas. Você já tem ${images.length} imagem(ns) e está tentando adicionar ${files.length}.`);
      return;
    }

    // Validar cada arquivo
    const invalidFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) return true;
      if (file.size > 5 * 1024 * 1024) return true;
      return false;
    });

    if (invalidFiles.length > 0) {
      setError(`Alguns arquivos são inválidos. Certifique-se de que são imagens (JPG, PNG, GIF) com no máximo 5MB cada.`);
      return;
    }

    // Inicializar progresso
    const progressItems: UploadProgress[] = files.map(file => ({
      file,
      progress: 0
    }));
    setUploadProgress(progressItems);
    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      // Upload cada arquivo individualmente
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Atualizar progresso para "enviando"
        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress: 50 } : item
          )
        );

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:8080/cars/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Erro ao fazer upload da imagem');
        }

        const data = await response.json();
        uploadedUrls.push(data.imageUrl);

        // Atualizar progresso para "concluído"
        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress: 100, url: data.imageUrl } : item
          )
        );
      }

      // Atualizar lista de imagens
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesUploaded(newImages);

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
      setUploadProgress([]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const remainingSlots = maxImages - images.length;

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading || remainingSlots <= 0}
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled || uploading || remainingSlots <= 0}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loading size="sm" />
              Enviando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {images.length === 0 ? 'Escolher Imagens' : 'Adicionar Mais'}
            </>
          )}
        </Button>

        <div className="text-sm text-gray-600">
          {images.length}/{maxImages} imagens
          {remainingSlots > 0 && (
            <span className="text-green-600"> ({remainingSlots} disponível{remainingSlots !== 1 ? 'is' : ''})</span>
          )}
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB por imagem. Máximo: {maxImages} imagens.
      </p>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Enviando imagens:</p>
          {uploadProgress.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {item.progress}%
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Current Images */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Imagens atuais:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled || uploading}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  title="Remover imagem"
                >
                  ×
                </button>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {index === 0 ? 'Principal' : `#${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {images.length >= maxImages && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            🚨 Você atingiu o limite máximo de {maxImages} imagens. Remova uma imagem para adicionar outra.
          </p>
        </div>
      )}

      {images.length >= maxImages - 1 && images.length < maxImages && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            ℹ️ Você pode adicionar mais {maxImages - images.length} imagem{maxImages - images.length !== 1 ? 's' : ''}.
          </p>
        </div>
      )}
    </div>
  );
}
