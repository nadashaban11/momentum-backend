import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardDto {
  @ApiProperty({ example: 1, description: 'User ranking position' })
  rank!: number;

  @ApiProperty({ example: 'nadashaban11', description: 'Participant username' })
  username!: string;

  @ApiProperty({ example: 7, description: 'Current active streak' })
  currentStreak!: number;

  @ApiProperty({ example: 14, description: 'Longest streak achieved' })
  longestStreak!: number;

  @ApiProperty({ example: 85.5, description: 'Percentage of completed check-ins' })
  completionRate!: number;
}

export class LeaderboardResponseDto {
  @ApiProperty({ example: '93410db1-013f-4026-a8f5-7e7b9d56181a', description: 'Challenge UUID' })
  challengeId!: string;

  @ApiProperty({ type: [LeaderboardDto], description: 'Ranked list of participants' })
  leaderboard!: LeaderboardDto[];
}