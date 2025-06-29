import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: '$2b$10$9q2viS4YNZ2wBlwyASTiE.bkbpaeJkTbzSJHt3uPBK0MmYW6L1kuq', // senha: admin123
    },
  ];

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...user }) => user);
  }

  async findById(id: number): Promise<Omit<User, 'password'> | undefined> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOne(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async createUser(username: string, password: string): Promise<Omit<User, 'password'>> {
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: Math.max(...this.users.map(u => u.id), 0) + 1,
      username,
      password: hashedPassword,
    };
    this.users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(id: number, updateData: { username?: string; password?: string }): Promise<Omit<User, 'password'>> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateData.username) {
      const existingUser = await this.findOne(updateData.username);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Nome de usuário já existe');
      }
      this.users[userIndex].username = updateData.username;
    }

    if (updateData.password) {
      this.users[userIndex].password = await bcrypt.hash(updateData.password, 10);
    }

    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  async deleteUser(id: number): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (id === 1) {
      throw new Error('Não é possível deletar o usuário administrador');
    }

    this.users.splice(userIndex, 1);
  }
}
