import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Challenge } from './challenge.entity';
import { Participation } from '../participations/participation.entity';
import { CreateChallengeDto } from './dtos';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
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

  // join Chllenge 
  async joinChallenge(userId: string, challengeId: string): Promise<Participation> {
    const challenge = await this.challengeRepository.findOne({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    // user cannot join challenge after it ends
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(challenge.endDate);

    if (today > endDate) {
      throw new BadRequestException('challenge has already ended');
    }

    try {
      const participation = this.participationRepository.create({
        userId,
        challengeId,
      });
      return await this.participationRepository.save(participation);
    } catch (error: any) {
      if (error.code === '23505') { 
        throw new ConflictException('You have already joined this challenge');
      }
      throw error;
    }
  }

  // 5. leave challenge 
  async leaveChallenge(userId: string, challengeId: string): Promise<void> {
    const challenge = await this.challengeRepository.findOne({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    // User cannot leave challenge after it starts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(challenge.startDate);

    if (today >= startDate) {
      throw new BadRequestException('Cannot leave a challenge after it has started');
    }

    const result = await this.participationRepository.delete({
      userId,
      challengeId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('You are not a participant in this challenge');
    }
  }
}