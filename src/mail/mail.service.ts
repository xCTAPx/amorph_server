import { IUser } from '@/users/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRestorePasswordLink(user: IUser, token: string) {
    const url = `localhost:3000/auth/restore?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Restore your password',
      template: './restorePassword',
      context: {
        name: user.firstName + ' ' + user.lastName,
        url,
      },
    });
  }

  async sendConfirmationEmailLink(user: IUser, token: string) {
    const url = `localhost:3000/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your email',
      template: './confirmEmail',
      context: {
        name: user.firstName + ' ' + user.lastName,
        url,
      },
    });
  }
}
