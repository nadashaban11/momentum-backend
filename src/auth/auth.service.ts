import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(
    name: string,
    username: string,
    email: string,
    password: string,
    avatarUrl: string | null,
  ) {
    const user = await this.userService.create(
      name,
      username,
      email,
      password,
      avatarUrl,
    );
    const payload = { id: user.id, email: user.email, username: user.username };
    return {
      message: 'User registered successfully',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user == null) {
      // to protect against timing attack:)
      await bcrypt.compare(password, '864tjkvsdhd;firurs,d');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isEqual = await bcrypt.compare(password, user.passwordHash);

    if (!isEqual) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, username: user.username };
    return {
      message: 'sign in successful',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  }
}
