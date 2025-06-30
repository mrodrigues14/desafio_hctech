import { Injectable, NotFoundException } from '@nestjs/common';
import { Car, CreateCarDto, UpdateCarDto } from './car.interface';

export interface CarView {
  carId: number;
  timestamp: Date;
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

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: 1,
      modelo: 'Civic',
      marca: 'Honda',
      imagemUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      cor: 'Prata',
      valor: 120000,
    },
    {
      id: 2,
      modelo: 'Corolla',
      marca: 'Toyota',
      imagemUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      cor: 'Branco',
      valor: 110000,
    },
    {
      id: 3,
      modelo: 'Focus',
      marca: 'Ford',
      imagemUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      cor: 'Azul',
      valor: 95000,
    },
    {
      id: 4,
      modelo: 'Accord',
      marca: 'Honda',
      imagemUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imagens: [],
      cor: 'Preto',
      valor: 140000,
    },
    {
      id: 5,
      modelo: 'Camry',
      marca: 'Toyota',
      imagemUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494976688153-c2fb13c9b24b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      cor: 'Vermelho',
      valor: 130000,
    },
    {
      id: 6,
      modelo: 'A4',
      marca: 'Audi',
      imagemUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      cor: 'Cinza',
      valor: 200000,
    },
    {
      id: 7,
      modelo: 'Serie 3',
      marca: 'BMW',
      imagemUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494976688153-c2fb13c9b24b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      cor: 'Azul',
      valor: 220000,
    },
  ];

  private carViews: CarView[] = [];

  constructor() {
    this.generateMockViews();
  }

  findAll(): Car[] {
    return this.cars;
  }

  findOne(id: number): Car {
    const car = this.cars.find(car => car.id === id);
    if (!car) {
      throw new NotFoundException(`Carro com ID ${id} não encontrado`);
    }
    
    this.addView(id);
    
    return car;
  }

  create(createCarDto: CreateCarDto): Car {
    const imagemUrl = createCarDto.imagemUrl || 
                     (createCarDto.imagens && createCarDto.imagens.length > 0 ? createCarDto.imagens[0] : '');
    
    const newCar: Car = {
      id: this.cars.length > 0 ? Math.max(...this.cars.map(c => c.id)) + 1 : 1,
      ...createCarDto,
      imagemUrl,
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
    
    this.carViews = this.carViews.filter(view => view.carId !== id);
  }

  addView(carId: number): void {
    this.carViews.push({
      carId,
      timestamp: new Date(),
    });
  }

  private generateMockViews(): void {
    const now = new Date();
    const daysAgo = 30;
    
    for (let i = 0; i < daysAgo; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const viewsPerDay = Math.floor(Math.random() * 16) + 5;
      
      for (let j = 0; j < viewsPerDay; j++) {
        const randomCarId = this.cars[Math.floor(Math.random() * this.cars.length)].id;
        const randomTime = new Date(date);
        randomTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        
        this.carViews.push({
          carId: randomCarId,
          timestamp: randomTime,
        });
      }
    }
  }

  getAnalytics(startDate?: Date, endDate?: Date): AnalyticsData {
    const now = new Date();
    const start = startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); 
    const end = endDate || now;

    const periodViews = this.carViews.filter(
      view => view.timestamp >= start && view.timestamp <= end
    );

    const brandStats = this.getBrandStats();

    const popularCars = this.getPopularCars(periodViews);

    const viewsByPeriod = this.getViewsByPeriod(periodViews, start, end);

    return {
      totalCars: this.cars.length,
      avgPrice: this.cars.reduce((sum, car) => sum + car.valor, 0) / this.cars.length,
      totalViews: periodViews.length,
      brandStats,
      popularCars,
      viewsByPeriod,
    };
  }

  private getBrandStats(): BrandStats[] {
    const brandCounts = this.cars.reduce((acc, car) => {
      acc[car.marca] = (acc[car.marca] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(brandCounts).map(([marca, quantidade]) => ({
      marca,
      quantidade,
    }));
  }

  private getPopularCars(views: CarView[]): PopularCar[] {
    const viewCounts = views.reduce((acc, view) => {
      acc[view.carId] = (acc[view.carId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(viewCounts)
      .map(([carId, viewCount]) => {
        const car = this.cars.find(c => c.id === parseInt(carId));
        return car ? { car, views: viewCount } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.views - a!.views)
      .slice(0, 5) as PopularCar[];
  }

  private getViewsByPeriod(views: CarView[], start: Date, end: Date): { date: string; views: number }[] {
    const dailyCounts: Record<string, number> = {};
    
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      dailyCounts[dateStr] = 0;
      current.setDate(current.getDate() + 1);
    }

    views.forEach(view => {
      const dateStr = view.timestamp.toISOString().split('T')[0];
      if (dailyCounts.hasOwnProperty(dateStr)) {
        dailyCounts[dateStr]++;
      }
    });

    return Object.entries(dailyCounts)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
