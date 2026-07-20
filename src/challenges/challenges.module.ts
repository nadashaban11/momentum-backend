import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './challenge.entity';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ParticipationsModule } from 'src/participations/participations.module';
import { HomeController } from './home.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge]), ParticipationsModule],
  controllers: [ChallengesController, HomeController],
  providers: [ChallengesService],
  exports: [ChallengesService], 
})
export class ChallengesModule {}