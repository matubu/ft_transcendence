<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import User from '@components/User.svelte'
	import { getjson } from '@lib/utils';
</script>

<style>
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
		{#await getjson(`/api/search/${location.pathname.split('/')[2]}`)}
			loading...
		{:then results} 
			<div class="vflex">
				{#each results as result}
					<a class="bord-card" href="/user/{result.id}">
						<User user={result} />
						<h3>{result.nickname ?? result.fullname.split(' ')[0]}</h3>
					</a>
				{/each}
			</div>
		{:catch err}
			<p>Error: {err.message}</p>
		{/await}
	{/if}
</Layout>