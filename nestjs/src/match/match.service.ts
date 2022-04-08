import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchService {
	constructor(
		@InjectRepository(Match)
		private matchRepository: Repository<Match>,
		private readonly userService: UserService
	) {}

	async get(id_match: number): Promise<Match>
	{
		return this.matchRepository.findOne({ id: id_match });
	}

	async create(id_player1: number, id_player2: number): Promise<Match>
	{
		const player1 = await this.userService.get(id_player1, []);
		const player2 = await this.userService.get(id_player2, []);
		return this.matchRepository.save({ player1: player1, player2: player2, victory: null });
	}

	async updateScore(id_match: number, player1_score: number, player2_score: number): Promise<Match>
	{
		return this.matchRepository.save(
			{ id: id_match,
				player1_score: player1_score,
				player2_score: player2_score
			})
	}

	async addVictory(id_match: number, id_player_victory: number): Promise<Match>
	{
		const user = await this.userService.get(id_player_victory, []);
		return this.matchRepository.save({ id: id_match, victory: user});
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
}
