import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1784905805511 implements MigrationInterface {
    name = 'InitialSchema1784905805511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "check_ins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "participationId" uuid NOT NULL, "date" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9d34d4af873f81b55b7bea9b140" UNIQUE ("participationId", "date"), CONSTRAINT "PK_fac7f27bc829a454ad477c13f62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "challengeId" uuid NOT NULL, "currentStreak" integer NOT NULL DEFAULT '0', "longestStreak" integer NOT NULL DEFAULT '0', "totalCheckins" integer NOT NULL DEFAULT '0', "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastCheckInDate" TIMESTAMP, CONSTRAINT "UQ_497e4919f8348df377a5a130e5d" UNIQUE ("userId", "challengeId"), CONSTRAINT "PK_7aa63b8dcd3d6f8aef8a98bb14a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "avatarUrl" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "isPublic" boolean NOT NULL DEFAULT true, "ownerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e664e93171e20fe4d6125466af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "check_ins" ADD CONSTRAINT "FK_9f68d648e52aadfcda28e01e4fe" FOREIGN KEY ("participationId") REFERENCES "participations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participations" ADD CONSTRAINT "FK_b96d1e076744a3081adbb791c48" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participations" ADD CONSTRAINT "FK_d2b8cf8fe859bde0c3f2d6b70e9" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_14970a8a7cba5ff7b0488e513e6" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_14970a8a7cba5ff7b0488e513e6"`);
        await queryRunner.query(`ALTER TABLE "participations" DROP CONSTRAINT "FK_d2b8cf8fe859bde0c3f2d6b70e9"`);
        await queryRunner.query(`ALTER TABLE "participations" DROP CONSTRAINT "FK_b96d1e076744a3081adbb791c48"`);
        await queryRunner.query(`ALTER TABLE "check_ins" DROP CONSTRAINT "FK_9f68d648e52aadfcda28e01e4fe"`);
        await queryRunner.query(`DROP TABLE "challenges"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "participations"`);
        await queryRunner.query(`DROP TABLE "check_ins"`);
    }

}
