import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('challenges')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') challengeId: string, @Req() req: any) {
    return await this.leaderboardService.getLeaderboard(
      challengeId,
      req.user?.id,
    );
  }
}
