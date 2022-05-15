<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import GamePreview from '@components/GamePreview.svelte'

	let gamesId = []
	let gamesIdPlayers = new Map()
</script>

<svelte:window on:wsmsg={e => {
	const { channel, data } = e.detail
	if (channel !== 'GameData') return ;
	if (gamesId.includes(data.id)) return ;
	console.log('GameData', data)
	gamesIdPlayers.set(data.id, data.players)
	gamesId = [...gamesId, data.id]
}}/>

<Head title="Watch" />

<Layout>
	<div class="grid-layout">
		{#if gamesId.length}
			{#each gamesId as gameId}
				<GamePreview
					{gameId}
					players={gamesIdPlayers.get(gameId)}
					end={() => {
						gamesId = gamesId.filter(id => id !== gameId)
						gamesIdPlayers.delete(gameId)
					}}
				/>
			{/each}
		{:else}
			<p class="dim">No game ongoing</p>
		{/if}
	</div>
</Layout>