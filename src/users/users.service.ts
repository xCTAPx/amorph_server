import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { transformDbUserToIUser } from '@/utils/users';

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

  async addOne(
    user: Omit<IUser, 'id'>,
    confirmationToken: string,
  ): Promise<IUser> {
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
      first_name: user.firstName,
      last_name: user.lastName,
      age: user.age,
      birth_date: user.birthDate,
      phone_number: user.phoneNumber,
      sex: user.sex,
      confirmation_token: confirmationToken,
    });

    return transformDbUserToIUser(newUser);
  }

  async getAll(): Promise<IUser[]> {
    const users = await this.usersRepository.find();
    return users.map(transformDbUserToIUser);
  }

  async confirm(token: string): Promise<undefined> {
    const user = await this.usersRepository.findOne({
      where: {
        confirmation_token: token,
        is_active: false,
      },
    });

    if (!user)
      throw new BadRequestException(
        `Token is invalid or user has been activated before`,
      );

    await this.usersRepository.update(
      {
        confirmation_token: token,
        is_active: false,
      },
      { is_active: true, confirmation_token: null },
    );
  }

  async requestRestore(email: string, token: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user)
      throw new BadRequestException(`User with email ${email} not found`);

    await this.usersRepository.update(
      {
        email,
      },
      { restore_token: token },
    );

    return user;
  }

  async restore(
    email: string,
    password: string,
    token: string,
  ): Promise<undefined> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user)
      throw new BadRequestException(`User with email ${email} not found`);

    if (user.restore_token !== token)
      throw new BadRequestException('Invalid token');

    await this.usersRepository.update(
      {
        email,
      },
      { restore_token: null, password },
    );
  }
}
