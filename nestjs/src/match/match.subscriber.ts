import { UserAchievementService } from 'src/user-achievement/user-achievement.service';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { Match } from './match.entity';
import { MatchService } from './match.service';

@EventSubscriber()
export class MatchSubscriber implements EntitySubscriberInterface<Match> {
	constructor(connection: Connection,
				private readonly userAchievementService: UserAchievementService,
				private readonly matchService: MatchService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return Match;
	}

	async afterInsert(event: InsertEvent<Match>): Promise<void> {
		const idPlayer1 = event.entity.player1.id;
		const idPlayer2 = event.entity.player2.id;
		const scorePlayer1 = event.entity.player1_score;
		const scorePlayer2 = event.entity.player2_score;
		const victoryPlayer1 = await this.matchService.getVictorys(idPlayer1);
		const victoryPlayer2 = await this.matchService.getVictorys(idPlayer2);
		const defaitePlayer1 = await this.matchService.getDefaites(idPlayer1);
		const defaitePlayer2 = await this.matchService.getDefaites(idPlayer2);
		this.userAchievementService.insert(idPlayer1, "Small player");
		this.userAchievementService.insert(idPlayer2, "Small player");
		if (victoryPlayer1.length >= 42)
			this.userAchievementService.insert(idPlayer1, "Win");
		if (victoryPlayer2.length >= 42)
			this.userAchievementService.insert(idPlayer2, "Win");
		if (defaitePlayer1.length >= 42)
			this.userAchievementService.insert(idPlayer1, "Losing");
		if (defaitePlayer2.length >= 42)
			this.userAchievementService.insert(idPlayer2, "Losing");
		if ((scorePlayer1 == 11 && scorePlayer2 == 0) || (scorePlayer2 == 11 && scorePlayer1 == 0))
		{
			this.userAchievementService.insert(
				(scorePlayer1 == 11 && scorePlayer2 == 0) ?
					idPlayer1 : idPlayer2, "Under the table");
			this.userAchievementService.insert(
				(scorePlayer1 == 11 && scorePlayer2 == 0) ?
					idPlayer2 : idPlayer1, "Fanny");
		}
	}
}