import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Matchs
{
  @PrimaryColumn()
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
