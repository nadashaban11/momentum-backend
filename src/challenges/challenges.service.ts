import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Challenge } from './challenge.entity';
import { Participation } from '../participations/participation.entity';
import { CreateChallengeDto } from './dtos';
import { ParticipationsService } from 'src/participations/participations.service';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    private readonly participationsService: ParticipationsService,
  ) {}

  async create(ownerId: string, dto: CreateChallengeDto): Promise<Challenge> {
    if (new Date(dto.startDate) > new Date(dto.endDate)) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    const challenge = this.challengeRepository.create({
      ...dto,
      ownerId,
    });

    return await this.challengeRepository.save(challenge);
  }

  // explore available public challenges
  async findAll(): Promise<Challenge[]> {
    return await this.challengeRepository.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
      relations: {
        owner: true,
      }, 
    });
  }

  // explore challenge details
  async findById(id: string): Promise<any> {
    const challenge = await this.challengeRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        participations: {
            user: true, 
        },
    },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    return {
      ...challenge,
      participantsCount: challenge.participations.length,
    };
  }

  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.challengeRepository.findOne({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    
    return await this.participationsService.join(userId, challengeId);
  }

  async leaveChallenge(userId: string, challengeId: string): Promise<void> {
    return await this.participationsService.leave(userId, challengeId);
  }
}