<script>
	import MatchScore from '@components/MatchScore.svelte'

	export let user

	let fmtDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format
</script>

<style>
	.card {
		padding: 0;
		height: 100%;
	}
	h2
	{ padding: 30px 30px 0 30px }

	.vflex
	{ width: 100% }

	.date
	{ margin: 10px 30px }
</style>

<div class="card">
	<h2>Last Match</h2>

	<div class="vflex">
		{#if (user.matchs.length)}
			{#key user.matchs}
				{#each (user.matchs) as { player1_score, player2_score, player1, player2, date, victory }, i}
					{#if fmtDate(new Date(user.matchs[i - 1]?.date ?? null)) !== fmtDate(new Date(date))}
						<span class="date">{fmtDate(new Date(date))}</span>
					{/if}
					<MatchScore 
						player1={
							user.id === player1.id
								? [player1, player1_score]
								: [player2, player2_score]
						}
						player2={
							user.id !== player1.id
								? [player1, player1_score]
								: [player2, player2_score]
						}
						diff={victory.id === user.id ? 1 : -1}
					/>
				{/each}
			{/key}
		{:else}
			<p class="dim">No match history yet</p>
		{/if}
	</div>
</div>