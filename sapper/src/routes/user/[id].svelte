<script>
	import Layout from '@components/Layout.svelte'
	import User from '@components/User.svelte'
	import Button from '@components/Button.svelte'
	import IconButton from '@components/IconButton.svelte'
	import Head from '@components/Head.svelte'
	import MatchHistory from '@components/stats/MatchHistory.svelte'
	import StatsOverview from '@components/stats/StatsOverview.svelte'
	import { user } from '@lib/store'
	import { removeFriend, addFriend, fetchUser, postjson, getjson } from '@lib/utils'
	import { stores } from '@sapper/app'
	const { page } = stores()
</script>

<style>
	h1, p {
		margin: 0;
	}
	h1 {
		font-size: 50px;
		align-items: center;
	}
	@media (max-width: 800px) {
		.flex-v800 {
			flex-direction: column;
		}
	}
</style>

<Head title="User profile"/>

<Layout maxwidth="900px">
	{#await getjson(`/api/user/${$page.params.id}`)}
		<p class="dim">Loading ...</p>
	{:then data}
		<User size=100 user={data} />
		<div>
			<h1 class="flex">
				{data.nickname ?? data.fullname.split(' ')[0]}
				{#if ($user.friends.find(({ friend }) => friend.id === data.id))}
					<IconButton iconSize={20} on:click={() => removeFriend(data.id)} alt="Remove friend">
						<svg height="20" width="20" viewBox="0 0 48 48"><path fill="currentColor" d="M32.4 20.9V17.9H44V20.9ZM18 23.95Q14.7 23.95 12.6 21.85Q10.5 19.75 10.5 16.45Q10.5 13.15 12.6 11.05Q14.7 8.95 18 8.95Q21.3 8.95 23.4 11.05Q25.5 13.15 25.5 16.45Q25.5 19.75 23.4 21.85Q21.3 23.95 18 23.95ZM2 40V35.3Q2 33.55 2.875 32.125Q3.75 30.7 5.4 30Q9.15 28.35 12.075 27.675Q15 27 18 27Q21 27 23.9 27.675Q26.8 28.35 30.55 30Q32.2 30.75 33.1 32.15Q34 33.55 34 35.3V40ZM5 37H31V35.3Q31 34.5 30.55 33.775Q30.1 33.05 29.35 32.7Q25.8 31.05 23.35 30.525Q20.9 30 18 30Q15.1 30 12.625 30.525Q10.15 31.05 6.6 32.7Q5.85 33.05 5.425 33.775Q5 34.5 5 35.3ZM18 20.95Q19.95 20.95 21.225 19.675Q22.5 18.4 22.5 16.45Q22.5 14.5 21.225 13.225Q19.95 11.95 18 11.95Q16.05 11.95 14.775 13.225Q13.5 14.5 13.5 16.45Q13.5 18.4 14.775 19.675Q16.05 20.95 18 20.95ZM18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45ZM18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Z"/></svg>
					</IconButton>
				{:else}
					<IconButton iconSize={20} on:click={() => addFriend(data.id)} alt="Add friend">
						<svg height="20" width="20" viewBox="0 0 48 48"><path fill="currentColor" d="M36.5 28V21.5H30V18.5H36.5V12H39.5V18.5H46V21.5H39.5V28ZM18 23.95Q14.7 23.95 12.6 21.85Q10.5 19.75 10.5 16.45Q10.5 13.15 12.6 11.05Q14.7 8.95 18 8.95Q21.3 8.95 23.4 11.05Q25.5 13.15 25.5 16.45Q25.5 19.75 23.4 21.85Q21.3 23.95 18 23.95ZM2 40V35.3Q2 33.55 2.9 32.125Q3.8 30.7 5.4 30Q9.15 28.35 12.075 27.675Q15 27 18 27Q21 27 23.925 27.675Q26.85 28.35 30.55 30Q32.15 30.75 33.075 32.15Q34 33.55 34 35.3V40ZM5 37H31V35.3Q31 34.5 30.6 33.775Q30.2 33.05 29.35 32.7Q25.85 31 23.375 30.5Q20.9 30 18 30Q15.1 30 12.625 30.525Q10.15 31.05 6.6 32.7Q5.85 33.05 5.425 33.775Q5 34.5 5 35.3ZM18 20.95Q19.95 20.95 21.225 19.675Q22.5 18.4 22.5 16.45Q22.5 14.5 21.225 13.225Q19.95 11.95 18 11.95Q16.05 11.95 14.775 13.225Q13.5 14.5 13.5 16.45Q13.5 18.4 14.775 19.675Q16.05 20.95 18 20.95ZM18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45ZM18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Z"/></svg>
					</IconButton>
				{/if}
			</h1>
			<p class="dim">{data.fullname}</p>
		</div>
		{#if ($user?.id !== data.id)}
			<div class="flex">
				<Button href="/play/duel/{$user.id}-{data.id}">Duel</Button>
				<Button href="/api/channel/friend/{data.id}">
					Chat
				</Button>
				{#if ($user.blockList.find(({ blockedId }) => blockedId === data.id))}
					<Button on:click={async () => {
						await postjson('/api/block', {
								blocked: false,
								blockedId: data.id
							})
						fetchUser()
					}}>
						Unblock
					</Button>
				{:else}
					<Button on:click={async () => {
						await postjson('/api/block', {
								blocked: true,
								blockedId: data.id
							})
						fetchUser()
					}}>
						Block
					</Button>
				{/if}
			</div>
		{/if}
		<div class="flex flex-v800">
			<div style="flex: 2">
				<StatsOverview user={data} />
			</div>
			<div style="flex: 1">
				<MatchHistory user={data} />
			</div>
		</div>
	{:catch err}
		<p>Error: {err.message}</p>
	{/await}
</Layout>
