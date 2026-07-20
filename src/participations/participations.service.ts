import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Participation } from './participation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Challenge } from 'src/challenges/challenge.entity';


@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
    @InjectRepository(Challenge) 
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async findOne(id: string, queryRunner?: QueryRunner) :Promise<Participation>{

    const repo = queryRunner 
      ? queryRunner.manager.getRepository(Participation) 
      : this.participationRepository;

    const participation = await repo.findOne(
      {where: {id}}
    );
    if(!participation){
      throw new NotFoundException('Participation not found');
    }
    return participation;
  }

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

  async updateStreak(participationId: string, queryRunner?: QueryRunner) {
    const repo = queryRunner 
      ? queryRunner.manager.getRepository(Participation) 
      : this.participationRepository;

    const participation = await this.findOne(participationId, queryRunner);

    participation.currentStreak++; 

    participation.lastCheckInDate = new Date();

    if (participation.currentStreak > participation.longestStreak) {
      participation.longestStreak = participation.currentStreak;
    }
    
    await repo.save(participation);
  }

  async getLeaderboardData(challengeId: string, totalDays: number) {
    return await this.participationRepository
      .createQueryBuilder('participation')
      .leftJoin('participation.user', 'user')
      .where('participation.challengeId = :challengeId', { challengeId })
      .select([
        'user.username as username',
        'COALESCE(participation.currentStreak, 0) as currentStreak',
        'COALESCE(participation.longestStreak, 0) as longestStreak',
        'COALESCE((CAST(participation.totalCheckins AS FLOAT) / :totalDays) * 100, 0) as completionRate'
      ])
      .orderBy('currentStreak', 'DESC')
      .addOrderBy('completionRate', 'DESC')
      .addOrderBy('participation.totalCheckins', 'DESC')
      .setParameter('totalDays', totalDays)
      .getRawMany();
  }

  async resetMissedStreaks(): Promise<number> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const result = await this.participationRepository
      .createQueryBuilder()
      .update(Participation)
      .set({ currentStreak: 0 })
      .where('currentStreak > 0')
      .andWhere('(lastCheckInDate < :yesterday OR lastCheckInDate IS NULL)', {
        yesterday,
      })
      .execute();

    return result.affected || 0; // returns no of users who missed their streaks
  }
}