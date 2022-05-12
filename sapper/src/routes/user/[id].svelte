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
	import { goto } from '@sapper/app'
	
	const { page } = stores()
</script>

<style>
	h1, p {
		margin: 0;
	}
	h1 {
		font-size: 50px;
	}
	@media (max-width: 800px) {
		.flex-v800 {
			flex-direction: column;
		}
	}
</style>

<Head title="User profile"/>

<Layout maxwidth="900px">
	{#await getjson(`/api/user/${$page.path.split('/')[2]}`)}
		<p class="dim">Loading ...</p>
	{:then data}
		<User size=100 user={data} />
		<div>
			<h1>{data.nickname ?? data.fullname.split(' ')[0]}</h1>
			<p class="dim">{data.fullname}</p>
		</div>
		{#if ($user?.id !== data.id)}
			<div class="flex">
				<Button href="/play/duel/{$user.id}-{data.id}">Duel</Button>
				<IconButton on:click={() => goto(`/api/channel/friend/${data.id}`)} alt="Chat">
					<svg height="35" width="35" viewBox="0 0 48 48"><path fill="currentColor" d="M12 28.05H27.65V25.05H12ZM12 21.55H36V18.55H12ZM12 15.05H36V12.05H12ZM4 44V7Q4 5.85 4.9 4.925Q5.8 4 7 4H41Q42.15 4 43.075 4.925Q44 5.85 44 7V33Q44 34.15 43.075 35.075Q42.15 36 41 36H12ZM7 36.75 10.75 33H41Q41 33 41 33Q41 33 41 33V7Q41 7 41 7Q41 7 41 7H7Q7 7 7 7Q7 7 7 7ZM7 7Q7 7 7 7Q7 7 7 7Q7 7 7 7Q7 7 7 7V33Q7 33 7 33Q7 33 7 33V36.75Z"/></svg>
				</IconButton>
				{#if ($user.blockList.find(({ blockedId }) => blockedId === data.id))}
					<IconButton on:click={async () => {
						await postjson('/api/block', {
								blocked: false,
								blockedId: data.id
							})
						fetchUser()
					}} alt="Unblock">
						<svg height="35" width="35" viewBox="0 0 48 48"><path fill="currentColor" d="M16 17.5Q15.4 17.5 14.95 17.05Q14.5 16.6 14.5 16Q14.5 15.4 14.95 14.95Q15.4 14.5 16 14.5Q16.6 14.5 17.05 14.95Q17.5 15.4 17.5 16Q17.5 16.6 17.05 17.05Q16.6 17.5 16 17.5ZM21.35 22.85Q20.75 22.85 20.3 22.4Q19.85 21.95 19.85 21.35Q19.85 20.75 20.3 20.3Q20.75 19.85 21.35 19.85Q21.95 19.85 22.4 20.3Q22.85 20.75 22.85 21.35Q22.85 21.95 22.4 22.4Q21.95 22.85 21.35 22.85ZM26.65 28.15Q26.05 28.15 25.6 27.7Q25.15 27.25 25.15 26.65Q25.15 26.05 25.6 25.6Q26.05 25.15 26.65 25.15Q27.25 25.15 27.7 25.6Q28.15 26.05 28.15 26.65Q28.15 27.25 27.7 27.7Q27.25 28.15 26.65 28.15ZM32 33.5Q31.4 33.5 30.95 33.05Q30.5 32.6 30.5 32Q30.5 31.4 30.95 30.95Q31.4 30.5 32 30.5Q32.6 30.5 33.05 30.95Q33.5 31.4 33.5 32Q33.5 32.6 33.05 33.05Q32.6 33.5 32 33.5ZM24 44Q19.75 44 16.1 42.475Q12.45 40.95 9.75 38.25Q7.05 35.55 5.525 31.9Q4 28.25 4 24Q4 19.8 5.525 16.15Q7.05 12.5 9.75 9.8Q12.45 7.1 16.1 5.55Q19.75 4 24 4Q28.2 4 31.85 5.55Q35.5 7.1 38.2 9.8Q40.9 12.5 42.45 16.15Q44 19.8 44 24Q44 28.25 42.45 31.9Q40.9 35.55 38.2 38.25Q35.5 40.95 31.85 42.475Q28.2 44 24 44ZM24 41Q31.25 41 36.125 36.125Q41 31.25 41 24Q41 16.75 36.125 11.875Q31.25 7 24 7Q16.75 7 11.875 11.875Q7 16.75 7 24Q7 31.25 11.875 36.125Q16.75 41 24 41Z"/></svg>
					</IconButton>
				{:else}
					<IconButton on:click={async () => {
						await postjson('/api/block', {
								blocked: true,
								blockedId: data.id
							})
						fetchUser()
					}} alt="Block">
						<svg height="35" width="35" viewBox="0 0 48 48"><path fill="currentColor" d="M7 24Q7 27.05 8.1 29.875Q9.2 32.7 11.05 34.95L34.95 11.05Q32.65 9.1 29.85 8.05Q27.05 7 24 7Q16.9 7 11.95 11.95Q7 16.9 7 24ZM13.05 37Q15.3 38.95 18.125 39.975Q20.95 41 24 41Q31.1 41 36.05 36.05Q41 31.1 41 24Q41 20.95 39.95 18.15Q38.9 15.35 37 13.05ZM4 24Q4 19.85 5.575 16.2Q7.15 12.55 9.85 9.85Q12.55 7.15 16.2 5.575Q19.85 4 24 4Q28.15 4 31.8 5.575Q35.45 7.15 38.15 9.85Q40.85 12.55 42.425 16.2Q44 19.85 44 24Q44 28.15 42.425 31.8Q40.85 35.45 38.15 38.15Q35.45 40.85 31.8 42.425Q28.15 44 24 44Q19.85 44 16.2 42.425Q12.55 40.85 9.85 38.15Q7.15 35.45 5.575 31.8Q4 28.15 4 24Z"/></svg>
					</IconButton>
				{/if}
				{#if ($user.friends.find(({ friend }) => friend.id === data.id))}
					<IconButton on:click={() => removeFriend(data.id)} alt="Remove friend">
						<svg height="35" width="35" viewBox="0 0 48 48"><path fill="currentColor" d="M32.4 20.9V17.9H44V20.9ZM18 23.95Q14.7 23.95 12.6 21.85Q10.5 19.75 10.5 16.45Q10.5 13.15 12.6 11.05Q14.7 8.95 18 8.95Q21.3 8.95 23.4 11.05Q25.5 13.15 25.5 16.45Q25.5 19.75 23.4 21.85Q21.3 23.95 18 23.95ZM2 40V35.3Q2 33.55 2.875 32.125Q3.75 30.7 5.4 30Q9.15 28.35 12.075 27.675Q15 27 18 27Q21 27 23.9 27.675Q26.8 28.35 30.55 30Q32.2 30.75 33.1 32.15Q34 33.55 34 35.3V40ZM5 37H31V35.3Q31 34.5 30.55 33.775Q30.1 33.05 29.35 32.7Q25.8 31.05 23.35 30.525Q20.9 30 18 30Q15.1 30 12.625 30.525Q10.15 31.05 6.6 32.7Q5.85 33.05 5.425 33.775Q5 34.5 5 35.3ZM18 20.95Q19.95 20.95 21.225 19.675Q22.5 18.4 22.5 16.45Q22.5 14.5 21.225 13.225Q19.95 11.95 18 11.95Q16.05 11.95 14.775 13.225Q13.5 14.5 13.5 16.45Q13.5 18.4 14.775 19.675Q16.05 20.95 18 20.95ZM18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45ZM18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Z"/></svg>
					</IconButton>
				{:else}
					<IconButton on:click={() => addFriend(data.id)} alt="Add friend">
						<svg height="35" width="35" viewBox="0 0 48 48"><path fill="currentColor" d="M36.5 28V21.5H30V18.5H36.5V12H39.5V18.5H46V21.5H39.5V28ZM18 23.95Q14.7 23.95 12.6 21.85Q10.5 19.75 10.5 16.45Q10.5 13.15 12.6 11.05Q14.7 8.95 18 8.95Q21.3 8.95 23.4 11.05Q25.5 13.15 25.5 16.45Q25.5 19.75 23.4 21.85Q21.3 23.95 18 23.95ZM2 40V35.3Q2 33.55 2.9 32.125Q3.8 30.7 5.4 30Q9.15 28.35 12.075 27.675Q15 27 18 27Q21 27 23.925 27.675Q26.85 28.35 30.55 30Q32.15 30.75 33.075 32.15Q34 33.55 34 35.3V40ZM5 37H31V35.3Q31 34.5 30.6 33.775Q30.2 33.05 29.35 32.7Q25.85 31 23.375 30.5Q20.9 30 18 30Q15.1 30 12.625 30.525Q10.15 31.05 6.6 32.7Q5.85 33.05 5.425 33.775Q5 34.5 5 35.3ZM18 20.95Q19.95 20.95 21.225 19.675Q22.5 18.4 22.5 16.45Q22.5 14.5 21.225 13.225Q19.95 11.95 18 11.95Q16.05 11.95 14.775 13.225Q13.5 14.5 13.5 16.45Q13.5 18.4 14.775 19.675Q16.05 20.95 18 20.95ZM18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45Q18 16.45 18 16.45ZM18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Q18 30 18 30Z"/></svg>
					</IconButton>
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
