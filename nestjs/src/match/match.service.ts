import { Inject, forwardRef, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class MatchService {
	constructor(
		@InjectRepository(Match)
		private matchRepository: Repository<Match>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService
	) {}

	async get(id_match: number): Promise<Match>
	{
		return this.matchRepository.findOne({ id: id_match });
	}

	async saveMatch(
		winner_id: number,
		id_player1: number,
		id_player2: number,
		player1_score: number,
		player2_score: number): Promise<Match>
	{
		const player1 = await this.userService.get(id_player1, []);
		const player2 = await this.userService.get(id_player2, []);
		return this.matchRepository.save({
			players: [player1, player2],
			player1,
			player2,
			player1_score,
			player2_score,
			victory: winner_id === id_player1 ? player1 : player2
		});
	}

	async getMatchs(id_user: number): Promise<Match[]>
	{
		const user = await this.userService.get(id_user, ["matchs"]);
		return user.matchs;
	}

	async getVictorys(id_user: number): Promise<Match[]>
	{
		const user = await this.userService.get(id_user, []);
		return this.matchRepository.find({ where: {victory: user} });
	}

	async getDefaites(id_user: number): Promise<Match[]>
	{
		const matchs = await this.getMatchs(id_user);
		let defaite: Match[] = [];
		for (let i = 0; i < matchs.length; i++)
			defaite.push(matchs[i]);
		return (defaite);
	}

	async removeAll(user: User): Promise<void> {
		await this.matchRepository.delete({ player1: user });
		await this.matchRepository.delete({ player2: user });
	}
}
