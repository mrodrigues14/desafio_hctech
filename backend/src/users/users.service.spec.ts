import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return users with correct properties', async () => {
      const result = await service.findAll();
      const user = result[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).not.toHaveProperty('password'); 
    });
  });

  describe('findOne', () => {
    it('should return user by username', async () => {
      const username = 'admin';
      const result = await service.findOne(username);
      expect(result).toBeDefined();
      expect(result?.username).toBe(username);
    });

    it('should return undefined for non-existent username', async () => {
      const username = 'nonexistent';
      const result = await service.findOne(username);
      expect(result).toBeUndefined();
    });

    it('should return user with password for authentication', async () => {
      const username = 'admin';
      const result = await service.findOne(username);
      expect(result).toHaveProperty('password');
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const id = 1;
      const result = await service.findById(id);
      expect(result).toBeDefined();
      expect(result?.id).toBe(id);
    });

    it('should throw NotFoundException for non-existent id', async () => {
      const id = 999;
      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });

    it('should not return password in public user data', async () => {
      const id = 1;
      const result = await service.findById(id);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('validateUser', () => {
    it('should return user for valid credentials', async () => {
      const username = 'admin';
      const password = 'admin123';
      const result = await service.validateUser(username, password);
      expect(result).toBeDefined();
      expect(result?.username).toBe(username);
    });

    it('should return null for invalid credentials', async () => {
      const username = 'admin';
      const password = 'wrongpassword';
      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      const username = 'nonexistent';
      const password = 'password';
      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const username = 'testuser';
      const password = 'testpassword';

      const result = await service.createUser(username, password);
      expect(result).toBeDefined();
      expect(result.username).toBe(username);
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('number');
    });

    it('should generate unique id for new user', async () => {
      const username = 'testuser2';
      const password = 'testpassword';

      const initialUsers = await service.findAll();
      const initialCount = initialUsers.length;

      const result = await service.createUser(username, password);
      
      const finalUsers = await service.findAll();
      const finalCount = finalUsers.length;
      
      expect(finalCount).toBe(initialCount + 1);
      expect(result.id).toBeGreaterThan(0);
    });

    it('should hash the password', async () => {
      const username = 'testuser3';
      const password = 'plainpassword';

      await service.createUser(username, password);
      
      const createdUser = await service.findOne(username);
      expect(createdUser?.password).not.toBe(password);
      expect(createdUser?.password).toMatch(/^\$2[aby]\$/);
    });

    it('should throw error for duplicate username', async () => {
      const username = 'admin';
      const password = 'testpassword';

      await expect(service.createUser(username, password)).rejects.toThrow('Usuário já existe');
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const id = 1;
      const updateData = {
        username: 'updatedadmin',
      };

      const result = await service.updateUser(id, updateData);
      expect(result).toBeDefined();
      expect(result.username).toBe(updateData.username);
      expect(result.id).toBe(id);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const id = 999;
      const updateData = {
        username: 'updateduser',
      };

      await expect(service.updateUser(id, updateData)).rejects.toThrow(NotFoundException);
    });

    it('should hash new password when updating', async () => {
      const id = 1;
      const updateData = {
        password: 'newpassword',
      };

      await service.updateUser(id, updateData);
      
      const updatedUser = await service.findOne('admin');
      expect(updatedUser?.password).not.toBe(updateData.password);
      expect(updatedUser?.password).toMatch(/^\$2[aby]\$/);
    });

    it('should not return password in response', async () => {
      const id = 1;
      const updateData = {
        username: 'updatedadmin2',
      };

      const result = await service.updateUser(id, updateData);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error when trying to update to existing username', async () => {
      await service.createUser('testuser4', 'testpassword');

      const id = 1;
      const updateData = {
        username: 'testuser4', 
      };

      await expect(service.updateUser(id, updateData)).rejects.toThrow('Nome de usuário já existe');
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const username = 'tobedeleted';
      const password = 'testpassword';
      
      const createdUser = await service.createUser(username, password);
      const initialUsers = await service.findAll();
      const initialCount = initialUsers.length;
      
      await service.deleteUser(createdUser.id);
      
      const finalUsers = await service.findAll();
      const finalCount = finalUsers.length;
      expect(finalCount).toBe(initialCount - 1);
      
      await expect(service.findById(createdUser.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const id = 999;
      await expect(service.deleteUser(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw error when trying to delete admin user', async () => {
      const id = 1;
      await expect(service.deleteUser(id)).rejects.toThrow('Não é possível deletar o usuário administrador');
    });
  });
});
