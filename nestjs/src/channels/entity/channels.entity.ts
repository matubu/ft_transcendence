import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Channels
{
  @PrimaryColumn()
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
