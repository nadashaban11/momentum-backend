import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Challenge } from '../challenges/challenge.entity';
import { CheckIn } from '../check-ins/check-in.entity';

@Entity('participations')
@Unique(['userId', 'challengeId']) // to prevent double join from db level
export class Participation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  challengeId!: string;

  @Column({ default: 0 })
  currentStreak!: number;

  @Column({ default: 0 })
  longestStreak!: number;

  @Column({ default: 0 })
  totalCheckins!: number;

  @CreateDateColumn()
  joinedAt!: Date;

  @ManyToOne(() => User, (user) => user.participations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Challenge, (challenge) => challenge.participations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challengeId' })
  challenge!: Challenge;

  @OneToMany(() => CheckIn, (checkIn) => checkIn.participation)
  checkIns!: CheckIn[];
}