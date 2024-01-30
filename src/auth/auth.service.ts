import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDTO } from './types';
import { IUser } from '../users/types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/mail/mail.service';
import { prepareUser } from '@/utils/users';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailSerice: MailService,
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
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await this.userService.addOne(
      {
        ...user,
        password: hashedPassword,
      },
      confirmationToken,
    );

    await this.mailSerice.sendConfirmationEmailLink(newUser, confirmationToken);

    return prepareUser(newUser);
  }

  async confirm(token: string): Promise<undefined> {
    await this.userService.confirm(token);
  }
}
