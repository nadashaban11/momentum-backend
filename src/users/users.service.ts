import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    async findById(id: string): Promise<User | null>{
        return await this.userRepository.findOne({
            where: {id},
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
            }
        });
    }

    async update(id: string, updateData: { name?: string; avatarUrl?: string }): Promise<User> {
        const res = await this.userRepository.update(id, updateData);
        if(res.affected === 0){
            throw new NotFoundException('User not found');
        }
        const updatedUser = await this.findById(id);
        return updatedUser!;
    }

    async remove(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }
}
