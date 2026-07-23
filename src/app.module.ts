import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChallengesModule } from './challenges/challenges.module';
import { ParticipationsModule } from './participations/participations.module';
import { CheckInsModule } from './check-ins/check-ins.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChallengesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URI'),
        autoLoadEntities: true,
        synchronize: true, // only in development
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    ParticipationsModule,
    CheckInsModule,
    LeaderboardModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}