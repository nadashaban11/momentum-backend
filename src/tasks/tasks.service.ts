import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ParticipationsService } from 'src/participations/participations.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly participationsService: ParticipationsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'daily-streak-reset',
    timeZone: 'Africa/Cairo',
  })
  async handleDailyStreakReset() {
    this.logger.log('[Cron Job] Starting daily streak reset...');

    try {
      const affectedRows = await this.participationsService.resetMissedStreaks();

      this.logger.log(
        `✅ [Cron Job] Completed! Reset streaks for ${affectedRows} participations.`,
      );
    } catch (error) {
      this.logger.error('❌ [Cron Job] Failed to reset streaks:', error);
    }
  }
}