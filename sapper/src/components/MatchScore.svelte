<script>
	import User from '@components/User.svelte'

	export let player1: [any, number]
	let [user1, score1] = player1

	export let player2: [any, number]
	let [user2, score2] = player2
</script>

<style>
	.match {
		display: flex;
		gap: 10px;
		align-items: center;
		justify-content: space-between;
		border-radius: 5px;
		border: 1px solid var(--bord);
		padding: 10px 15px;
	}
	.match > div {
		display: flex;
		align-items: center;
		gap: 20px;
	}
</style>

<div class="match">
	<div>
		<User user="{user1}" />
		{user1.nickname ?? user1.fullname.split(' ')[0]}
	</div>
	<div>
		<span class="{score1 == score2 ? 'equal' : (score1 > score2 ? 'winning' : 'losing')}">
			{score1}
		</span>
		-
		<span class="{score1 == score2 ? 'equal' : (score2 > score1 ? 'winning' : 'losing')}">
			{score2}
		</span>
	</div>
	<div>
		<User user="{user2}" />
		{user2.nickname ?? user2.fullname.split(' ')[0]}
	</div>
</div>