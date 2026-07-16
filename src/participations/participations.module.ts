import { Module } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './participation.entity';
import { Challenge } from 'src/challenges/challenge.entity';
import { CheckIn } from 'src/check-ins/check-in.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participation, Challenge, CheckIn])],
  providers: [ParticipationsService],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}
