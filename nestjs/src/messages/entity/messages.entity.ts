import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Messages
{
  @PrimaryColumn()
  id: number;

  @Column()
  id_user: number;

  @Column()
  id_channel: number;

  @Column()
  msg: string;
}
