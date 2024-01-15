import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const existedUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!existedUser)
      throw new BadRequestException(`User ${email} does not exist`);
    return existedUser;
  }

  async addOne(user: IUser): Promise<IUser> {
    const existedUser = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (existedUser)
      throw new BadRequestException(`User ${user.email} already exists`);

    const newUser = await this.usersRepository.save({
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber,
      sex: user.sex,
    });

    return newUser;
  }

  async getAll(): Promise<IUser[]> {
    const users = await this.usersRepository.find();
    return users;
  }
}
