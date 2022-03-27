import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Users
{
	@PrimaryColumn()
	id: number;

	@Column()
	fullname: string;

	@Column({ default: null })
	nickname?: string;

	@Column({ default: false })
	twoauth: boolean;

	@Column({ default: null })
	code2FA?: string;

	@Column()
	img: string;

	@Column()
	elo: number;

	@Column("int", { array: true, default: {} })
	friends?: number[];
}
