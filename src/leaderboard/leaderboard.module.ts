import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { ParticipationsService } from 'src/participations/participations.service';
import { ParticipationsModule } from 'src/participations/participations.module';
import { ChallengesModule } from 'src/challenges/challenges.module';

@Module({
  imports: [ParticipationsModule, ChallengesModule],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}
