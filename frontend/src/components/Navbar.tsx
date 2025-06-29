'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200">
              HCTech Cars
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Início
            </Link>
            
            <Link 
              href="/catalogo" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Catálogo
            </Link>


            <Link 
              href="/catalogo" 
              className="lg:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200"
              title="Pesquisar veículos"
            >
              <svg 
                className="h-5 w-5 text-gray-600"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/gestao" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Gestão
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                    Olá, {user?.username}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  >
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 font-medium px-4 py-2">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
