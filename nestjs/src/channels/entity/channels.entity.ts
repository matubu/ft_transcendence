import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channels
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_admin: number;

  @Column("int", { array: true, default: {} })
  users: number[];

  @Column({default: null})
  name?: string;

  @Column({default: null})
  password?: string;

  @Column({default: null})
  description?: string;

  @Column({default: false})
  private?: boolean;
}
