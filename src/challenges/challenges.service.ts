import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
} from 'typeorm';
import { Challenge } from './challenge.entity';
import { CreateChallengeDto } from './dtos';
import { ParticipationsService } from 'src/participations/participations.service';
import { randomBytes } from 'crypto';

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
      // Private gets a code immediately so owner can share without a 2nd call.
      ...(dto.isPublic === false
        ? { inviteCode: randomBytes(6).toString('hex') }
        : {}),
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
  // Public -> anyone. Private -> owner/participant only, anonymous gets 404 to hide existence.
  async findById(id: string, userId?: string): Promise<any> {
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

    if (!challenge.isPublic) {
      if (!userId) {
        throw new NotFoundException('Challenge not found');
      }
      const isOwner = challenge.ownerId === userId;
      const isMember = challenge.participations.some(
        (p) => p.userId === userId,
      );
      if (!isOwner && !isMember) {
        throw new ForbiddenException(
          'You do not have access to this private challenge',
        );
      }
    }

    return {
      ...challenge,
      // Only owner sees the code. Members see details but no code,
      // so they can't re-share without owner consent.
      // Joining still works because joinByInviteCode looks it up internally.
      inviteCode:
        userId && challenge.ownerId === userId
          ? challenge.inviteCode
          : undefined,
      participantsCount: challenge.participations.length,
    };
  }

  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { id: challengeId },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (!challenge.isPublic) {
      throw new ForbiddenException(
        'This is a private challenge. Use an invite code to join.',
      );
    }

    return await this.participationsService.join(userId, challengeId);
  }

  async leaveChallenge(userId: string, challengeId: string): Promise<void> {
    return await this.participationsService.leave(userId, challengeId);
  }

  async getHomeFeed() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const format = (challenges: Challenge[]) =>
      challenges.map((ch) => {
        const { participations, ...rest } = ch; // no need to return array of participations for each challenge I will return only total number of them
        return {
          ...rest,
          participantsCount: participations?.length || 0,
        };
      });

    const active = await this.challengeRepository.find({
      where: {
        isPublic: true,
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: { participations: true },
      order: { startDate: 'DESC' },
      take: 5, // top recent active 5 challenges
    });

    const upcoming = await this.challengeRepository.find({
      where: {
        isPublic: true,
        startDate: MoreThan(today),
      },
      relations: { participations: true },
      order: { startDate: 'ASC' },
      take: 5,
    });

    const allPublic = await this.challengeRepository.find({
      where: { isPublic: true },
      relations: { participations: true },
    });
    const featured = allPublic
      .sort(
        (a, b) =>
          (b.participations?.length || 0) - (a.participations?.length || 0),
      )
      .slice(0, 5);

    return {
      featuredChallenges: format(featured),
      activeChallenges: format(active),
      upcomingChallenges: format(upcoming),
    };
  }

  async generateInviteCode(ownerId: string, challengeId: string): Promise<{ inviteCode: string }> {
    const challenge = await this.challengeRepository.findOne({
      where: { id: challengeId },
    });
  
    if (!challenge) throw new NotFoundException('Challenge not found');
  
    if (challenge.ownerId !== ownerId) {
      throw new ForbiddenException('Only the owner can generate an invite code');
    }
  
    const code = randomBytes(6).toString('hex'); // 12 hex chars, unguessable
    challenge.inviteCode = code;
    await this.challengeRepository.save(challenge);
  
    return { inviteCode: code };
  }
  
  async joinByInviteCode(userId: string, code: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { inviteCode: code },
    });
  
    if (!challenge) {
      throw new NotFoundException('Invalid or expired invite code');
    }
  
    return await this.participationsService.join(userId, challenge.id);
  }
}
