export interface Car {
  id: number;
  modelo: string;
  marca: string;
  imagemUrl: string;
  cor: string;
  valor: number;
}

export interface CreateCarDto {
  modelo: string;
  marca: string;
  imagemUrl: string;
  cor: string;
  valor: number;
}

export interface UpdateCarDto {
  modelo?: string;
  marca?: string;
  imagemUrl?: string;
  cor?: string;
  valor?: number;
}

export interface User {
  id: number;
  username: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
