import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
}
