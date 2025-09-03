import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDTO, UserDTO } from './types';
import { IUser } from '../users/types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/mail/mail.service';
import { prepareUser, transformDbUserToIUser } from '@/utils/users';

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

    if (user.confirmation_token)
      throw new UnauthorizedException('Your email is not confirmed');

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

  async requestRestore(email: string): Promise<undefined> {
    const restoreToken = crypto.randomBytes(32).toString('hex');

    const user = await this.userService.requestRestore(email, restoreToken);

    await this.mailSerice.sendRestorePasswordLink(transformDbUserToIUser(user), restoreToken);
  }

  async restore(signInDto: SignInDTO, token: string): Promise<undefined> {
    const hashedPassword = await bcrypt.hash(signInDto.password, SALT_ROUNDS);

    await this.userService.restore(signInDto.email, hashedPassword, token);
  }
}
