import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDTO } from './types';
import { IUser } from '../users/types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.userService.findOne(email);

    const isValidCredentials = await bcrypt.compare(pass, user.password);

    if (!isValidCredentials)
      throw new UnauthorizedException('Invalid password');

    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signUp(user: Omit<IUser, 'id'>): Promise<UserDTO> {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    const newUser = await this.userService.addOne({
      ...user,
      password: hashedPassword,
      id: Math.floor(Math.random() * (1000 - 2) + 1),
    });

    return newUser;
  }
}
