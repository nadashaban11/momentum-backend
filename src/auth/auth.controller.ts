import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';

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

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto){
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
    )
  }
}
