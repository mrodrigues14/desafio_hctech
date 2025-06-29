import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'user'])
  role?: 'admin' | 'user';
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
