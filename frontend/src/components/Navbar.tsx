'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              🚗 HCTech Cars
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Início
                </Link>
                <Link 
                  href="/gestao" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Gestão
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Olá, {user?.username}!
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button>Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
