import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Testos
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  ok: boolean;
}
