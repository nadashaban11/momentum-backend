import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create (name: string, username: string, email: string, password: string, avatarUrl: string | null) : Promise<User> {
        const exist = await this.userRepository.findOne({
            where: [
                {username},
                {email},
            ]
        });
        if(exist){
            throw new ConflictException('email or username already exists');
        }

        const salt = await bcrypt.genSalt();

        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            name,
            username,
            email,
            passwordHash,
            avatarUrl,
        });

        return this.userRepository.save(user);
    }
    async findByEmail(email: string): Promise<User | null>{
        return await this.userRepository.findOne({
            where: {email}
        })
    }
}
