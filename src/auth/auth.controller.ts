import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './types';
import { PublicRoute } from 'src/Decorators/PublicRoute';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signInDto: SignUpDTO) {
    return this.authService.signUp(signInDto);
  }

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Get('confirm')
  confirm(@Query() query: { token: string }) {
    return this.authService.confirm(query.token);
  }

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Get('restore')
  restore(@Query() token: string) {}
}
