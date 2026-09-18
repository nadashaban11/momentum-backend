import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInviteCodeToChallenges1784905900000
  implements MigrationInterface
{
  name = 'AddInviteCodeToChallenges1784905900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "challenges" ADD "inviteCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenges" ADD CONSTRAINT "UQ_challenges_inviteCode" UNIQUE ("inviteCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "challenges" DROP CONSTRAINT "UQ_challenges_inviteCode"`,
    );
    await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "inviteCode"`);
  }
}
