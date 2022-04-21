<script>
	import User from '@components/User.svelte'

	export let player1: [any, number]
	let [user1, score1] = player1

	export let player2: [any, number]
	let [user2, score2] = player2

	export let diff: number = score1 - score2
</script>

<style>
	.bord-card > a {
		display: flex;
		align-items: center;
		gap: 20px;
	}
</style>

<div class="bord-card">
	<a href="/user/{user1.id}">
		<User user="{user1}" />
		{user1.nickname ?? user1.fullname.split(' ')[0]}
	</a>
	<div>
		<span class="{diff == 0 ? 'equal' : (diff > 0 ? 'winning' : 'losing')}">
			{score1}
		</span>
		-
		<span class="{diff == 0 ? 'equal' : (diff < 0 ? 'winning' : 'losing')}">
			{score2}
		</span>
	</div>
	<a href="/user/{user2.id}">
		<User user="{user2}" />
		{user2.nickname ?? user2.fullname.split(' ')[0]}
	</a>
</div>