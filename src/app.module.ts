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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: process.env.NODE_ENV === 'production' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get('DB_HOST');
        const port = configService.get('DB_PORT');
        const username = configService.get('DB_USER');
        const password = configService.get('DB_PASSWORD');
        const database = configService.get('DB_NAME');

        console.log({ isProduction: process.env.NODE_ENV === 'production', host, port, username, password, database });

        return ({
        type: 'postgres',
        // url: configService.get('DATABASE_URL'),
        host,
        port,
        username,
        password,
        database,
        entities: [User],
        // synchronize: true,
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
