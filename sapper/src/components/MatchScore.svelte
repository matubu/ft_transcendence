<script>
	import User from '@components/User.svelte'

	export let player1: [any, number]
	let [user1, score1] = player1

	export let player2: [any, number]
	let [user2, score2] = player2

	export let diff: number = score1 - score2
</script>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 15px 20px;
		border-right: 3px solid var(--color);
		background: linear-gradient(90deg, #fff0, var(--color) 500%);
	}
	.vflex
	{
		gap: 5px;
		font-size: 12px;
	}
	h4 {
		margin: 0;
		font-size: 16px
	}
</style>

<div class="container" style="--color: {diff >= 0 ? 'var(--gree)' : 'var(--red)'}">
	<a href="/user/{user2.id}">
		<User user="{user2}" nostatus />
	</a>
	<div class="vflex">
		<h4>
			{user2.nickname ?? user2.fullname.split(' ')[0]}
		</h4>
		<div>
			<span class="{diff == 0 ? 'equal' : (diff < 0 ? 'winning' : 'losing')}">
				{score2}
			</span>
			:
			<span class="{diff == 0 ? 'equal' : (diff > 0 ? 'winning' : 'losing')}">
				{score1}
			</span>
		</div>
	</div>
</div>