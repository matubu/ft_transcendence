import { brotliDecompress } from "zlib";

interface User
{
	elo: number;
	//name
	//blabla...
}

let queue: User[];

function findMatch(user: User, max_diff: number): User | null
{
	let eloDiff = (userA: User, userB: User): number => Math.abs(userA.elo - userB.elo)
	let nearest: User = queue.reduce((prev, curr): User => eloDiff(prev, user) < eloDiff(curr, user) ? prev : curr)
	if (!nearest) return null;
	return eloDiff(user, nearest) <= max_diff ? nearest : null;
}

function searchMatch(user: User): User | null
{
	let max_diff: number = 0
	let delta: number = 42
	let waiting_time: number = 3;

	while (true)
	{
		max_diff += delta
		let adv = findMatch(user, max_diff)
		if (!adv)
		{
			//block while listening for new potential adv
			//after {waiting_time} continue
			continue;
		}
		return adv
	}
}
