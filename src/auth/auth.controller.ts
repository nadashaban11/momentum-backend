import { Body, Request, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, SignUpDto } from './dtos';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpdto: SignUpDto){
    return this.authService.signUp(
      signUpdto.name,
      signUpdto.username,
      signUpdto.email,
      signUpdto.password,
      signUpdto.avatarUrl || null,
    )
  }

  @Post('login')
  async login(@Body() signInDto: loginDto){
    return this.authService.login(
      signInDto.email,
      signInDto.password,
    )
  }
}
