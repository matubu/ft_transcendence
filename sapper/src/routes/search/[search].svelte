<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import User from '@components/User.svelte'
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.bord-card {
		gap: 20px;
	}
	h3 {
		flex: 1;
		margin: 0
	}
</style>

<Head title="Search" />

<Layout>
	{#if typeof document !== 'undefined'}
		{#await fetch(`/api/search/${location.pathname.split('/')[2]}`)}
			loading...
		{:then res}
			{#await res.json()}
				loading...
			{:then results} 
				<div class="container">
					{#each results as result}
						<a class="bord-card" href="/user/{result.id}">
							<User user={result} />
							<h3>{result.nickname ?? result.fullname.split(' ')[0]}</h3>
						</a>
					{/each}
				</div>
			{/await}
		{/await}
	{/if}
</Layout>