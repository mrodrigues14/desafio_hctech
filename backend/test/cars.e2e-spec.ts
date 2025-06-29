import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('CarsController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin123',
      })
      .expect(201);

    jwtToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /cars', () => {
    it('should return array of cars', () => {
      return request(app.getHttpServer())
        .get('/cars')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should return cars with correct properties', () => {
      return request(app.getHttpServer())
        .get('/cars')
        .expect(200)
        .expect((res) => {
          const car = res.body[0];
          expect(car).toHaveProperty('id');
          expect(car).toHaveProperty('modelo');
          expect(car).toHaveProperty('marca');
          expect(car).toHaveProperty('imagemUrl');
          expect(car).toHaveProperty('cor');
          expect(car).toHaveProperty('valor');
        });
    });
  });

  describe('GET /cars/:id', () => {
    it('should return a specific car', () => {
      return request(app.getHttpServer())
        .get('/cars/1')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(1);
          expect(res.body).toHaveProperty('modelo');
          expect(res.body).toHaveProperty('marca');
        });
    });

    it('should return 404 for non-existent car', () => {
      return request(app.getHttpServer())
        .get('/cars/999')
        .expect(404);
    });
  });

  describe('POST /cars', () => {
    it('should create a new car when authenticated', () => {
      const newCar = {
        modelo: 'Test Model',
        marca: 'Test Brand',
        imagemUrl: 'https://example.com/test.jpg',
        cor: 'Test Color',
        valor: 50000,
      };

      return request(app.getHttpServer())
        .post('/cars')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newCar)
        .expect(201)
        .expect((res) => {
          expect(res.body.modelo).toBe(newCar.modelo);
          expect(res.body.marca).toBe(newCar.marca);
          expect(res.body.id).toBeDefined();
        });
    });

    it('should return 401 when not authenticated', () => {
      const newCar = {
        modelo: 'Test Model',
        marca: 'Test Brand',
        imagemUrl: 'https://example.com/test.jpg',
        cor: 'Test Color',
        valor: 50000,
      };

      return request(app.getHttpServer())
        .post('/cars')
        .send(newCar)
        .expect(401);
    });

    it('should return 400 for invalid data', () => {
      const invalidCar = {
        modelo: '', // Empty modelo should be invalid
        marca: 'Test Brand',
      };

      return request(app.getHttpServer())
        .post('/cars')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidCar)
        .expect(400);
    });
  });

  describe('PUT /cars/:id', () => {
    it('should update an existing car when authenticated', () => {
      const updateData = {
        modelo: 'Updated Model',
        marca: 'Updated Brand',
      };

      return request(app.getHttpServer())
        .put('/cars/1')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.modelo).toBe(updateData.modelo);
          expect(res.body.marca).toBe(updateData.marca);
          expect(res.body.id).toBe(1);
        });
    });

    it('should return 401 when not authenticated', () => {
      const updateData = {
        modelo: 'Updated Model',
      };

      return request(app.getHttpServer())
        .put('/cars/1')
        .send(updateData)
        .expect(401);
    });

    it('should return 404 for non-existent car', () => {
      const updateData = {
        modelo: 'Updated Model',
      };

      return request(app.getHttpServer())
        .put('/cars/999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /cars/:id', () => {
    it('should delete an existing car when authenticated', async () => {
      const newCar = {
        modelo: 'To Delete',
        marca: 'Test Brand',
        imagemUrl: 'https://example.com/test.jpg',
        cor: 'Test Color',
        valor: 50000,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/cars')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newCar)
        .expect(201);

      const carId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/cars/${carId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .delete('/cars/1')
        .expect(401);
    });

    it('should return 404 for non-existent car', () => {
      return request(app.getHttpServer())
        .delete('/cars/999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});
