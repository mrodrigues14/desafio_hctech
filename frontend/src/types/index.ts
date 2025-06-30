export interface Car {
  id: number;
  modelo: string;
  marca: string;
  imagemUrl: string;
  imagens?: string[];
  cor: string;
  valor: number;
}

export interface CreateCarDto {
  modelo: string;
  marca: string;
  imagemUrl: string;
  imagens?: string[];
  cor: string;
  valor: number;
}

export interface UpdateCarDto {
  modelo?: string;
  marca?: string;
  imagemUrl?: string;
  imagens?: string[];
  cor?: string;
  valor?: number;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface CreateUserDto {
  username: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  role?: 'admin' | 'user';
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface BrandStats {
  marca: string;
  quantidade: number;
}

export interface PopularCar {
  car: Car;
  views: number;
}

export interface AnalyticsData {
  totalCars: number;
  avgPrice: number;
  totalViews: number;
  brandStats: BrandStats[];
  popularCars: PopularCar[];
  viewsByPeriod: { date: string; views: number }[];
}