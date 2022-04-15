<script>
	import Layout from '@components/Layout.svelte'
	import User from '@components/User.svelte'
	import Button from '@components/Button.svelte'
	import { user } from '@lib/store'

	async function load() {
		const res = await fetch(`/api/user/${+location.pathname.split('/')[2]}`)
		if (!res.ok)
			throw 'cannot fetch'
		return await res.json()
	}

	console.log($user?.friends)
</script>

<Layout>
	{#await load()}
		<p>Loading ...</p>
	{:then data}
		<User size=100 user={data} />
		<h1>{data.nickname ?? data.fullname.split(' ')[0]}</h1>
		<p>Fullname: {data.fullname}</p>
		<p>Elo: {data.elo}</p>
		<Button primary on:click={() => {
			fetch('/api/friend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ friend: data.id })
			})
		}}>
			{#if (true)}
				Add friend
			{:else}
				Remove friend
			{/if}
		</Button>
	{:catch err}
		<p>Error: {err}</p>
	{/await}
</Layout>