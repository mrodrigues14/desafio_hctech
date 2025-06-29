import { Car, CreateCarDto, UpdateCarDto, LoginDto, AuthResponse, User, CreateUserDto, UpdateUserDto, AnalyticsData } from '@/types';

const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getPublicHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.access_token);
    return data;
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  async getCarsPublic(): Promise<Car[]> {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      headers: this.getPublicHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar carros');
    }

    return response.json();
  }

  async getCarPublic(id: number): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      headers: this.getPublicHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Carro não encontrado');
      }
      throw new Error('Erro ao buscar carro');
    }

    return response.json();
  }

  async getCars(): Promise<Car[]> {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      throw new Error('Erro ao buscar carros');
    }

    return response.json();
  }

  async getCar(id: number): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      if (response.status === 404) {
        throw new Error('Carro não encontrado');
      }
      throw new Error('Erro ao buscar carro');
    }

    return response.json();
  }

  async createCar(car: CreateCarDto): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(car),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      throw new Error('Erro ao criar carro');
    }

    return response.json();
  }

  async updateCar(id: number, car: UpdateCarDto): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(car),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      if (response.status === 404) {
        throw new Error('Carro não encontrado');
      }
      throw new Error('Erro ao atualizar carro');
    }

    return response.json();
  }

  async deleteCar(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      if (response.status === 404) {
        throw new Error('Carro não encontrado');
      }
      throw new Error('Erro ao deletar carro');
    }
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      throw new Error('Erro ao buscar usuários');
    }

    return response.json();
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      if (response.status === 404) {
        throw new Error('Usuário não encontrado');
      }
      throw new Error('Erro ao buscar usuário');
    }

    return response.json();
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      const errorData = await response.text();
      throw new Error(errorData || 'Erro ao criar usuário');
    }

    return response.json();
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      if (response.status === 404) {
        throw new Error('Usuário não encontrado');
      }
      const errorData = await response.text();
      throw new Error(errorData || 'Erro ao atualizar usuário');
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      if (response.status === 404) {
        throw new Error('Usuário não encontrado');
      }
      const errorData = await response.text();
      throw new Error(errorData || 'Erro ao deletar usuário');
    }
  }

  async getAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsData> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = `${API_BASE_URL}/cars/analytics${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      throw new Error('Erro ao buscar dados de analytics');
    }

    return response.json();
  }

  async uploadCarImage(file: File): Promise<{ imageUrl: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/cars/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expirado. Faça login novamente.');
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao fazer upload da imagem');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
