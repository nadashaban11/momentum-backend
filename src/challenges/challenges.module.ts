import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './challenge.entity';
import { Participation } from '../participations/participation.entity';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Participation])],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService], 
})
export class ChallengesModule {}