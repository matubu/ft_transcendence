<script>
	import Layout from '@components/Layout.svelte'
	import User from '@components/User.svelte'
	import Button from '@components/Button.svelte'
	import { user } from '@lib/store'
	import { fetchUser } from '@lib/utils'

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
		{#if $user?.id !== data.id}
			{#if ($user.friends.find(({ friend }) => friend.id === data.id))}
			<Button primary on:click={async () => {
				await fetch('/api/friend', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ friend: data.id })
				})
				fetchUser()
			}}>Remove friend</Button>
			{:else}
				<Button primary on:click={async () => {
					await fetch('/api/friend', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ friend: data.id })
					})
					fetchUser()
				}}>Add friend</Button>
			{/if}
		{/if}
	{:catch err}
		<p>Error: {err}</p>
	{/await}
</Layout>