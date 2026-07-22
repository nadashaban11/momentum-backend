import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckIn } from './check-in.entity';
import { DataSource, Repository } from 'typeorm';
import { ParticipationsService } from 'src/participations/participations.service';

@Injectable()
export class CheckInsService {
  constructor(
    private readonly participationService: ParticipationsService,
    private readonly dataSource: DataSource,
    @InjectRepository(CheckIn)
    private readonly CheckInRepository: Repository<CheckIn>,
  ) {}

  async createCheck(participationId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const participation = await this.participationService.findOne(
        participationId,
        queryRunner,
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = today.toISOString().split('T')[0];

      const checkFromDb = await queryRunner.manager.findOne(CheckIn, {
        where: { participationId, date },
      });
      if (checkFromDb) {
        throw new ConflictException('You have already checked in today!');
      }

      const newCheck = queryRunner.manager.create(CheckIn, {
        participationId,
        date,
      });
      await queryRunner.manager.save(newCheck);
      await this.participationService.updateStreak(
        participationId,
        queryRunner,
      );
      await queryRunner.commitTransaction();

      return {
        message: 'Check-in successful, keep the amazing work!',
        streakUpdated: true,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async getCheckInHistory(participationId: string) {
    return await this.CheckInRepository.find({
      where: { participationId },
      select: {
        id: true,
        date: true,
        createdAt: true,
      },
      order: {
        date: 'ASC',
      },
    });
  }
}
