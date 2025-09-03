import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/guard';
import { APP_GUARD } from '@nestjs/core';
import { User } from './users/entities/user.entity';

const isProduction = process.env.NODE_ENV === 'production'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const host = process.env.DB_HOST;
        const port = +process.env.DB_PORT;
        const username = process.env.DB_USER;
        const password = process.env.DB_PASSWORD;
        const database = process.env.DB_NAME;

        console.log({ isProduction: process.env.NODE_ENV === 'production', host, port, username, password, database });

        return ({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [User],
        synchronize: !isProduction,
        ssl: {
          rejectUnauthorized: false, // важно для Railway
        },
      });
    },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
