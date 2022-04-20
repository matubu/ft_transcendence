<script>
	import Layout from '@components/Layout.svelte'
	import User from '@components/User.svelte'
	import Button from '@components/Button.svelte'
	import Head from '@components/Head.svelte'
	import { user } from '@lib/store'
	import { removeFriend, addFriend, fetchUser, postjson, getjson } from '@lib/utils'
</script>

<Head title="User profile"/>

<Layout>
	{#await getjson(`/api/user/${+location.pathname.split('/')[2]}`)}
		<p>Loading ...</p>
	{:then data}
		<User size=100 user={data} />
		<h1>{data.nickname ?? data.fullname.split(' ')[0]}</h1>
		<p>{data.fullname}</p>
		<p>Elo: {data.elo}</p>
		{#if ($user?.id !== data.id)}
			<div>
				<Button href="/api/channel/friend/{data.id}">Chat</Button>
				<Button>Duel</Button>
				{#if ($user.blockList.find(({ blockedId }) => blockedId === data.id))}
					<Button on:click={async () => {
						await postjson('/api/block', {
								blocked: false,
								blockedId: data.id
							})
						fetchUser()
					}}>Unblock</Button>
				{:else}
					<Button on:click={async () => {
						await postjson('/api/block', {
								blocked: true,
								blockedId: data.id
							})
						fetchUser()
					}}>Block</Button>
				{/if}
				{#if ($user.friends.find(({ friend }) => friend.id === data.id))}
					<Button primary on:click={() => removeFriend(data.id)}>Remove friend</Button>
				{:else}
					<Button primary on:click={() => addFriend(data.id)}>Add friend</Button>
				{/if}
			</div>
		{/if}
	{:catch err}
		<p>Error: {err.message}</p>
	{/await}
</Layout>