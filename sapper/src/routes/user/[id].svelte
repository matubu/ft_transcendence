<script context="module">
	import Layout from '@components/Layout.svelte'
	import User from '@components/User.svelte'
	import Button from '@components/Button.svelte'

	let data
	let ok: boolean

	export async function preload({ params }) {
		const res = await this.fetch(`/api/users/${params.id}`)
		if ((ok = res.ok))
			data = await res.json()
	}
</script>

<Layout>
	{#if ok}
	<User size=100 user={data} />
	<h1>{data.nickname ?? data.fullname.split(' ')[0]}</h1>
	<p>Fullname: {data.fullname}</p>
	<p>Elo: {data.elo}</p>
	<Button primary>Add friend</Button>
	{:else}
	<h1>User not found</h1>
	{/if}
</Layout>