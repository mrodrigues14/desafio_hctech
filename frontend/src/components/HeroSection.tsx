'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden mb-12">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Encontre o Seu Carro Perfeito
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
          Explore a nossa vasta seleção de veículos novos e usados. Obtenha as melhores ofertas e opções de financiamento.
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por marca, modelo ou palavra-chave"
              className="w-full px-4 py-3 pl-10 rounded-lg border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button type="submit" size="lg">
            Pesquisar
          </Button>
        </form>
      </div>
    </div>
  );
}
