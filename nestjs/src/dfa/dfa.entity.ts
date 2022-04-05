import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dfa
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
