import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('challenges')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService
  ){}

  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') challengeId: string){
    return await this.leaderboardService.getLeaderboard(challengeId);
  }
}
