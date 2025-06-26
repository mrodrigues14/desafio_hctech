import { Injectable } from '@nestjs/common';
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

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: this.users.length + 1,
      username,
      password: hashedPassword,
    };
    this.users.push(newUser);
    return newUser;
  }
}
