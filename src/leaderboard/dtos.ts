export class LeaderboardDto {
  rank!: number;
  username!: string;
  currentStreak!: number;
  completionRate!: number;
}

export class LeaderboardResponseDto {
  challengeId!: string;
  leaderboard!: LeaderboardDto[];
}