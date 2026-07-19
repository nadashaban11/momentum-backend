import { Injectable } from '@nestjs/common';
import { ChallengesService } from 'src/challenges/challenges.service';
import { ParticipationsService } from 'src/participations/participations.service';
import { LeaderboardResponseDto } from './dtos';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly participationsService: ParticipationsService, 
    private readonly challengesService: ChallengesService,       
  ) {}

  async getLeaderboard(challengeId: string): Promise<LeaderboardResponseDto> {
    const challenge = await this.challengesService.findById(challengeId);
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

    const rawData = await this.participationsService.getLeaderboardData(challengeId, totalDays);

    return {
      challengeId,
      leaderboard: rawData.map((item, index) => ({
        rank: index + 1,
        username: item.username,
        currentStreak: Number(item.currentStreak || 0),
        completionRate: Number(Number(item.completionRate || 0).toFixed(2)),
      })),
    };
  }
}
