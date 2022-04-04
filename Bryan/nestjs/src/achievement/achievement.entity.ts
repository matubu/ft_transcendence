import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'achievement', synchronize: false })
export class Achievement
{
	@PrimaryColumn({ unique: true })
	id: number;

	@Column({ type: "text", unique: true })
	title: string;

	@Column({ type: "text", unique: true })
	description: string;

	@Column({ unique: true, default: false })
	private: boolean;
}
