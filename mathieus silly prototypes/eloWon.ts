import assert from 'assert';

//winner +eloWon, loser -eloWon
function eloWon(elo_diff: number, K: number = 42): number
{
	assert(elo_diff >= 0, "elo_diff must be positive!")
	const proba = 1 / (1 + Math.pow(10, elo_diff / 400))
	return K * (1 - proba)
}
