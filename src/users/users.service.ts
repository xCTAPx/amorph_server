import { Injectable } from '@nestjs/common';
import { IUser } from './types';

@Injectable()
export class UsersService {
  private readonly users = [];

  async findOne(email: string): Promise<IUser | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async addOne(user: IUser): Promise<IUser> {
    this.users.push(user);
    return user;
  }

  async getAll(): Promise<IUser[]> {
    return this.users;
  }
}
