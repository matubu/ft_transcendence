import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id42: number;

  @Column()
  fullname: string;

  @Column({ default: null })
  nickname: string;

  @Column({ default: false })
  twoauth: boolean;

  @Column()
  img: string;

  @Column()
  elo: number;
}
