import { Module } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { CheckInsController } from './check-ins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckIn } from './check-in.entity';
import { ParticipationsService } from 'src/participations/participations.service';
import { ParticipationsModule } from 'src/participations/participations.module';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn]), ParticipationsModule],
  providers: [CheckInsService],
  controllers: [CheckInsController]
})
export class CheckInsModule {}
