import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Participation } from './participation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from 'src/challenges/challenge.entity';


@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
    @InjectRepository(Challenge) 
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async join(userId: string, challengeId: string) {
    const challenge = await this.challengeRepository.findOne({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');
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

  async leave(userId: string, challengeId: string): Promise<void> {
    const challenge = await this.challengeRepository.findOne({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

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