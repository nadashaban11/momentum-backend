import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Participation } from '../participations/participation.entity';

@Entity('check_ins')
@Unique(['participationId', 'date']) // only one check-in per day.
export class CheckIn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  participationId!: string;

  @Column({ type: 'date' })
  date!: string; 

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Participation, (participation) => participation.checkIns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'participationId' })
  participation!: Participation;
}