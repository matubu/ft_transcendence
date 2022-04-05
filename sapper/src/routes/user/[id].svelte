<script context="module">
	import Layout from '@components/Layout.svelte'
	import User from '@components/User.svelte'
	import Button from '@components/Button.svelte'

	async function load() {
		const res = await fetch(`/api/users/${+location.pathname.split('/')[2]}`)
		if (!res.ok)
			throw 'cannot fetch'
		return await res.json()
	}
</script>

<Layout>
	{#await load()}
		<p>...waiting</p>
	{:then data}
		<User size=100 user={data} />
		<h1>{data.nickname ?? data.fullname.split(' ')[0]}</h1>
		<p>Fullname: {data.fullname}</p>
		<p>Elo: {data.elo}</p>
		<Button primary>Add friend</Button>
	{:catch err}
		<p>Error: {err}</p>
	{/await}
</Layout>