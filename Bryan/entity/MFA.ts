import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MFA
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	secret: string;

	@Column()
	uri: string;

	@Column()
	qr: string;
}
