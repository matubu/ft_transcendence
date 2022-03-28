import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channels
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { array: true, default: {} })
  users: number[];

  @Column()
  name?: string;

  @Column()
  password?: string;

  @Column()
  grade?: string;
}
