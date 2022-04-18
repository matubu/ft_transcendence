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
	h2 {
		flex: 1;
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
							<h2>{result.nickname ?? result.fullname.split(' ')[0]}</h2>
						</a>
					{/each}
				</div>
			{/await}
		{/await}
	{/if}
</Layout>