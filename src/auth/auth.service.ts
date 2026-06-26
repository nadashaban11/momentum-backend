import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor (
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ){}
    async signUp(name: string, username: string, email: string, password: string, avatarUrl: string | null) {
        const user = await this.userService.create(name, username, email, password, avatarUrl);
        const payload = { id: user.id, email: user.email, username: user.username };
        return {
            message: 'User registered successfully',
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
            }
        };
    }
}
