'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, User, CreateCarDto, UpdateCarDto, CreateUserDto, UpdateUserDto } from '@/types';
import { apiService } from '@/services/api';
import { getCarBrands, getCarColors } from '@/services/carData';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { MultipleImageUpload } from '@/components/ui/MultipleImageUpload';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'carros' | 'usuarios';

export default function GestaoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('carros');
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showCarModal, setShowCarModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'carros' && cars.length === 0) {
      loadCars();
    } else if (activeTab === 'usuarios' && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [carsData, usersData] = await Promise.all([
        apiService.getCars(),
        apiService.getUsers()
      ]);
      
      setCars(carsData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const carsData = await apiService.getCars();
      setCars(carsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carros');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadData = loadInitialData;

  const handleDeleteCar = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este carro?')) return;
    
    try {
      await apiService.deleteCar(id);
      setCars(cars.filter(car => car.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar carro');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    
    try {
      await apiService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar usuário');
    }
  };

  if (loading) {
    return <Loading size="lg" text="Carregando..." />;
  }

  return (
    <ProtectedRoute requireAdmin={true}>
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
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Início
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Gestão</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Gestão</h1>
            <p className="text-gray-600">
              Gerencie carros e usuários do sistema
            </p>
          </div>
          <div>
            <Link 
              href="/gestao/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Dashboard Analytics
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={loadInitialData} />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('carros')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'carros'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Carros ({cars.length})
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'usuarios'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usuários ({users.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'carros' ? (
              <CarsTab 
                cars={cars} 
                onEdit={(car) => {
                  setEditingCar(car);
                  setShowCarModal(true);
                }}
                onDelete={handleDeleteCar}
                onAdd={() => {
                  setEditingCar(null);
                  setShowCarModal(true);
                }}
              />
            ) : (
              <UsersTab 
                users={users}
                currentUser={currentUser}
                onEdit={(user) => {
                  setEditingUser(user);
                  setShowUserModal(true);
                }}
                onDelete={handleDeleteUser}
                onAdd={() => {
                  setEditingUser(null);
                  setShowUserModal(true);
                }}
              />
            )}
          </div>
        </div>

        {/* Car Modal */}
        {showCarModal && (
          <CarModal
            car={editingCar}
            onClose={() => {
              setShowCarModal(false);
              setEditingCar(null);
            }}
            onSuccess={(updatedCar) => {
              if (editingCar) {
                setCars(cars.map(c => c.id === updatedCar.id ? updatedCar : c));
              } else {
                setCars([...cars, updatedCar]);
              }
              setShowCarModal(false);
              setEditingCar(null);
            }}
          />
        )}

        {/* User Modal */}
        {showUserModal && (
          <UserModal
            user={editingUser}
            onClose={() => {
              setShowUserModal(false);
              setEditingUser(null);
            }}
            onSuccess={(updatedUser) => {
              if (editingUser) {
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
              } else {
                setUsers([...users, updatedUser]);
              }
              setShowUserModal(false);
              setEditingUser(null);
            }}
          />
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}

interface CarsTabProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

function CarsTab({ cars, onEdit, onDelete, onAdd }: CarsTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Carros</h2>
        <Button onClick={onAdd} className="bg-gray-900 hover:bg-gray-800 text-white">
          Adicionar Carro
        </Button>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum carro cadastrado</h3>
          <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo carro ao catálogo.</p>
          <div className="mt-6">
            <Button onClick={onAdd} className="bg-gray-900 hover:bg-gray-800 text-white">
              Adicionar Primeiro Carro
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-lg object-cover" src={car.imagemUrl} alt={car.modelo} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{car.modelo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.marca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.cor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {car.valor.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(car)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(car.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface UsersTabProps {
  users: User[];
  currentUser: User | null;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

function UsersTab({ users, currentUser, onEdit, onDelete, onAdd }: UsersTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Usuários</h2>
        <Button onClick={onAdd} className="bg-gray-900 hover:bg-gray-800 text-white">
          Adicionar Usuário
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome de Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      {currentUser?.id === user.id && (
                        <div className="text-xs text-blue-600">(Você)</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    Editar
                  </Button>
                  {user.role !== 'admin' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Excluir
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CarModalProps {
  car: Car | null;
  onClose: () => void;
  onSuccess: (car: Car) => void;
}

function CarModal({ car, onClose, onSuccess }: CarModalProps) {
  const [formData, setFormData] = useState<CreateCarDto>({
    modelo: car?.modelo || '',
    marca: car?.marca || '',
    imagemUrl: car?.imagemUrl || '',
    imagens: car?.imagens || [],
    cor: car?.cor || '',
    valor: car?.valor || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carColors, setCarColors] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brands, colors] = await Promise.all([
          getCarBrands(),
          getCarColors()
        ]);
        setCarBrands(brands);
        setCarColors(colors);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        imagemUrl: formData.imagemUrl || (formData.imagens && formData.imagens.length > 0 ? formData.imagens[0] : '')
      };

      let result: Car;
      if (car) {
        result = await apiService.updateCar(car.id, submitData);
      } else {
        result = await apiService.createCar(submitData);
      }
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar carro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-20 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {car ? 'Editar Carro' : 'Adicionar Carro'}
          </h3>
          
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                placeholder="Ex: Civic, Corolla, Focus"
                required
              />
            </div>

            <div>
              <Autocomplete
                label="Marca"
                value={formData.marca}
                onChange={(value) => setFormData({ ...formData, marca: value })}
                options={carBrands}
                placeholder="Ex: Honda, Toyota, Ford"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens do Carro
              </label>
              <MultipleImageUpload
                currentImages={formData.imagens}
                onImagesUploaded={(imageUrls) => {
                  setFormData({ 
                    ...formData, 
                    imagens: imageUrls,
                    imagemUrl: imageUrls.length > 0 ? imageUrls[0] : formData.imagemUrl
                  });
                }}
                disabled={loading}
                maxImages={5}
              />
            </div>

            <div>
              <Autocomplete
                label="Cor"
                value={formData.cor}
                onChange={(value) => setFormData({ ...formData, cor: value })}
                options={carColors}
                placeholder="Ex: Preto, Branco, Prata"
                disabled={loading}
              />
            </div>

            <div>
              <CurrencyInput
                label="Valor (R$)"
                value={formData.valor}
                onChange={(value) => setFormData({ ...formData, valor: value })}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

function UserModal({ user, onClose, onSuccess }: UserModalProps) {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: user?.username || '',
    password: '',
    role: user?.role || 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result: User;
      if (user) {
        const updateData: UpdateUserDto = { 
          username: formData.username,
          role: formData.role 
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        result = await apiService.updateUser(user.id, updateData);
      } else {
        result = await apiService.createUser(formData);
      }
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-20 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {user ? 'Editar Usuário' : 'Adicionar Usuário'}
          </h3>
          
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                placeholder="Digite o nome de usuário"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha {user && '(deixe em branco para manter a atual)'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                required={!user}
                placeholder={user ? 'Nova senha (opcional)' : 'Digite a senha'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
