<script>
	import User from '@components/User.svelte'
	import { getjson } from '@lib/utils'
</script>

<style>
	p
	{ width: 100% }
	.player {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.player h4 {
		margin: 0;
	}
	[class^="idx-"] {
		color: var(--grey);
		background: var(--acti);
		border-radius: 50%;
		flex-shrink: 0;
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
	}
	.vflex { width: 100% }
	.idx-1,
	.idx-2,
	.idx-3 {
		color: var(--whit);
		clip-path: url(/star.svg#clip);
	}
	.idx-1 {
		background: radial-gradient(circle at top center, #f7cc84, #bd9030);
	}
	.idx-2 {
		background: radial-gradient(circle at top center, #dadada, #939393);
	}
	.idx-3 {
		background: radial-gradient(circle at top center, #e59d86, #8d4f3e);
	}

	.score {
		margin-left: auto;
		background: #386bda70;
		color: #6a94ec;
		padding: 2px 10px;
		border-radius: 99px;
	}

	.dim {
		font-size: 13px;
	}
</style>

<div class="card">
	<h2>Leaderboard</h2>
	{#await getjson("/api/rank")}
		<p class="dim">Loading...</p>
	{:then ranks}
		<div class="vflex">
			{#each ranks as user, i}
				<a href="/user/{user.id}" class="player">
					<div class="idx-{i+1}">{i + 1}</div>
					<User {user} nostatus />
					<div>
						<h4>{user.nickname ?? user.fullname.split(' ')[0]}</h4>
						<span class="dim">Nice</span>
					</div>
					<div class="score">{user.elo}</div>
				</a>
			{/each}
		</div>
	{:catch err}
		<p>Error: {err.message}</p>
	{/await}
</div>