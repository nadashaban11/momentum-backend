import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ParticipationsModule } from 'src/participations/participations.module';

@Module({
  imports: [ParticipationsModule],
  providers: [TasksService],
})
export class TasksModule {}
