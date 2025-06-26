import { Injectable, NotFoundException } from '@nestjs/common';
import { Car, CreateCarDto, UpdateCarDto } from './car.interface';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: 1,
      modelo: 'Civic',
      marca: 'Honda',
      imagemUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cor: 'Prata',
      valor: 120000,
    },
    {
      id: 2,
      modelo: 'Corolla',
      marca: 'Toyota',
      imagemUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cor: 'Branco',
      valor: 110000,
    },
    {
      id: 3,
      modelo: 'Focus',
      marca: 'Ford',
      imagemUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cor: 'Azul',
      valor: 95000,
    },
  ];

  findAll(): Car[] {
    return this.cars;
  }

  findOne(id: number): Car {
    const car = this.cars.find(car => car.id === id);
    if (!car) {
      throw new NotFoundException(`Carro com ID ${id} não encontrado`);
    }
    return car;
  }

  create(createCarDto: CreateCarDto): Car {
    const newCar: Car = {
      id: this.cars.length > 0 ? Math.max(...this.cars.map(c => c.id)) + 1 : 1,
      ...createCarDto,
    };
    this.cars.push(newCar);
    return newCar;
  }

  update(id: number, updateCarDto: UpdateCarDto): Car {
    const carIndex = this.cars.findIndex(car => car.id === id);
    if (carIndex === -1) {
      throw new NotFoundException(`Carro com ID ${id} não encontrado`);
    }
    
    this.cars[carIndex] = { ...this.cars[carIndex], ...updateCarDto };
    return this.cars[carIndex];
  }

  remove(id: number): void {
    const carIndex = this.cars.findIndex(car => car.id === id);
    if (carIndex === -1) {
      throw new NotFoundException(`Carro com ID ${id} não encontrado`);
    }
    this.cars.splice(carIndex, 1);
  }
}
