import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CarsService } from './cars.service';

describe('CarsService', () => {
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of cars', () => {
      const result = service.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return cars with correct properties', () => {
      const result = service.findAll();
      const car = result[0];
      expect(car).toHaveProperty('id');
      expect(car).toHaveProperty('modelo');
      expect(car).toHaveProperty('marca');
      expect(car).toHaveProperty('imagemUrl');
      expect(car).toHaveProperty('cor');
      expect(car).toHaveProperty('valor');
    });
  });

  describe('findOne', () => {
    it('should return car by id', () => {
      const id = 1;
      const result = service.findOne(id);
      expect(result).toBeDefined();
      expect(result.id).toBe(id);
    });

    it('should throw NotFoundException for non-existent id', () => {
      const id = 999;
      expect(() => service.findOne(id)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new car', () => {
      const newCar = {
        modelo: 'Test Model',
        marca: 'Test Brand',
        imagemUrl: 'https://example.com/test.jpg',
        cor: 'Test Color',
        valor: 50000,
      };

      const result = service.create(newCar);
      expect(result).toBeDefined();
      expect(result.modelo).toBe(newCar.modelo);
      expect(result.marca).toBe(newCar.marca);
      expect(result.cor).toBe(newCar.cor);
      expect(result.valor).toBe(newCar.valor);
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('number');
    });

    it('should generate unique id for new car', () => {
      const initialCount = service.findAll().length;
      const newCar = {
        modelo: 'Test Model',
        marca: 'Test Brand',
        imagemUrl: 'https://example.com/test.jpg',
        cor: 'Test Color',
        valor: 50000,
      };

      const result = service.create(newCar);
      const finalCount = service.findAll().length;
      
      expect(finalCount).toBe(initialCount + 1);
      expect(result.id).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update an existing car', () => {
      const id = 1;
      const updateData = {
        modelo: 'Updated Model',
        marca: 'Updated Brand',
      };

      const result = service.update(id, updateData);
      expect(result).toBeDefined();
      expect(result.modelo).toBe(updateData.modelo);
      expect(result.marca).toBe(updateData.marca);
      expect(result.id).toBe(id);
    });

    it('should throw NotFoundException for non-existent car', () => {
      const id = 999;
      const updateData = {
        modelo: 'Updated Model',
      };

      expect(() => service.update(id, updateData)).toThrow(NotFoundException);
    });

    it('should partially update car properties', () => {
      const id = 1;
      const originalCar = service.findOne(id);
      const updateData = {
        valor: 150000,
      };

      const result = service.update(id, updateData);
      expect(result.valor).toBe(updateData.valor);
      expect(result.modelo).toBe(originalCar.modelo); 
      expect(result.marca).toBe(originalCar.marca); 
    });
  });

  describe('remove', () => {
    it('should remove an existing car', () => {
      const id = 1;
      const initialCount = service.findAll().length;
      
      service.remove(id);
      
      const finalCount = service.findAll().length;
      expect(finalCount).toBe(initialCount - 1);
      
      expect(() => service.findOne(id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent car', () => {
      const id = 999;
      expect(() => service.remove(id)).toThrow(NotFoundException);
    });
  });
});
