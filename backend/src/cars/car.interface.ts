import { IsString, IsNotEmpty, IsNumber, IsUrl, Min, IsOptional } from 'class-validator';

export interface Car {
  id: number;
  modelo: string;
  marca: string;
  imagemUrl: string;
  imagens?: string[]; // Array de URLs das imagens adicionais
  cor: string;
  valor: number;
}

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @IsOptional()
  imagens?: string[];

  @IsString()
  @IsNotEmpty()
  cor: string;

  @IsNumber()
  @Min(0)
  valor: number;
}

export class UpdateCarDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  modelo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  marca?: string;

  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @IsOptional()
  imagens?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cor?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;
}
