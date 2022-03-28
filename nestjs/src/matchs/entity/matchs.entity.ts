import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Matchs
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1: number;

  @Column()
  player2: number;

  @Column()
  player1_score: number;

  @Column()
  player2_score: number;

  @Column()
  victory?: number;
}
