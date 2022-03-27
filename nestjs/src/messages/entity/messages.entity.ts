import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Messages
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user: number;

  @Column()
  id_channel: number;

  @Column()
  msg: string;
}
