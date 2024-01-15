import { User } from '@/users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRestorePasswordLink(user: User, token: string) {
    const url = `localhost:3000/restore?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Restore your password',
      template: './restore',
      context: {
        name: user.firstName + ' ' + user.lastName,
        url,
      },
    });
  }
}
