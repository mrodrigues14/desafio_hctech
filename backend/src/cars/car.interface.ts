import { IsString, IsNotEmpty, IsNumber, IsUrl, Min } from 'class-validator';

export interface Car {
  id: number;
  modelo: string;
  marca: string;
  imagemUrl: string;
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

  @IsString()
  @IsUrl()
  imagemUrl: string;

  @IsString()
  @IsNotEmpty()
  cor: string;

  @IsNumber()
  @Min(0)
  valor: number;
}

export class UpdateCarDto {
  @IsString()
  @IsNotEmpty()
  modelo?: string;

  @IsString()
  @IsNotEmpty()
  marca?: string;

  @IsString()
  @IsUrl()
  imagemUrl?: string;

  @IsString()
  @IsNotEmpty()
  cor?: string;

  @IsNumber()
  @Min(0)
  valor?: number;
}
