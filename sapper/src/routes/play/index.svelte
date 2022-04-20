<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import MatchScore from '@components/MatchScore.svelte'
	import Button from '@components/Button.svelte'
	import User from '@components/User.svelte'
	import Icon from '@components/Icon.svelte'
	import { goto } from '@sapper/app'
	import { onMount } from 'svelte'
	import { fetchUser, getjson, send } from '@lib/utils'
	import { user } from '@lib/store'

	onMount(() => {
		send('play')
		fetchUser()
	})

	let fmtDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format
</script>

<style>
	.date {
		text-align: center;
		margin-top: 10px;
	}

	progress {
		width: 100%;
		margin: 30px 0;
		-webkit-appearance: none;
		border: 0;
		background: var(--red);
		border-radius: 5px;
		overflow: hidden;
	}
	::-webkit-progress-bar {
		background: var(--blue);
	}
</style>

<Head title="Play" />

<Layout>
	<div class="grid-layout">
		<div class="grad-card" style="background:var(--grad-purp)">
			<div>
				<Icon>
					<svg enable-background="new 0 0 24 24" height="40" viewBox="0 0 24 24" width="40" fill="currentColor"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><path d="M20,9V7c0-1.1-0.9-2-2-2h-3c0-1.66-1.34-3-3-3S9,3.34,9,5H6C4.9,5,4,5.9,4,7v2c-1.66,0-3,1.34-3,3s1.34,3,3,3v4 c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4c1.66,0,3-1.34,3-3S21.66,9,20,9z M18,19L6,19V7h12V19z M9,13c-0.83,0-1.5-0.67-1.5-1.5 S8.17,10,9,10s1.5,0.67,1.5,1.5S9.83,13,9,13z M16.5,11.5c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S14.17,10,15,10 S16.5,10.67,16.5,11.5z M8,15h8v2H8V15z"/></g></g></svg>
				</Icon>
				<h2>Solo</h2>
			</div>
			<Button>Play with bots</Button>
		</div>
		<div class="grad-card" style="background:var(--grad-gree)">
			<div>
				<Icon>
					<svg height="40" viewBox="0 0 24 24" width="40" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
				</Icon>
				<h2>Dual</h2>
			</div>
			<Button>Play with friends</Button>
		</div>
		<div class="grad-card" style="background:var(--grad-blue)">
			<div>
				<Icon>
					<svg height="40" viewBox="0 0 24 24" width="40" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
				</Icon>
				<h2>Ranked</h2>
			</div>
			<Button on:click={() => goto('/play/ranked')}>Play with strangers</Button>
		</div>
	</div>
	<div>
		<h2>Match</h2>
		{#await getjson("/api/rank")}
			<div class="bord-card">loading...</div>
		{:then ranks}
			<div class="vflex">
				{#each ranks as user, i}
					<a class="bord-card" style="{[
							'background: var(--grad-gree); border: none',
							'background: var(--grad-blue); border: none',
							'background: var(--grad-purp); border: none']
						[i]}" href="/user/{user.id}">
						<div>
							<div>{i + 1}</div>
							<User {user} nostatus />
							{user.nickname ?? user.fullname.split(' ')[0]}
						</div>
						<div>
							{user.elo}
						</div>
					</a>
				{/each}
			</div>
		{:catch err}
			<p>Error: {err.message}</p>
		{/await}
		<progress max={$user.matchs.length} value={$user.matchs.filter(({ victory }) => victory.id === $user.id).length}/>
		<div class="vflex">
			{#if ($user.matchs.length)}
				{#each ($user.matchs) as { player1_score, player2_score, player1, player2, date }, i}
					{#if fmtDate(new Date($user.matchs[i - 1]?.date ?? null)) !== fmtDate(new Date(date))}
						<span class="date dim">{fmtDate(new Date(date))}</span>
					{/if}
					<MatchScore 
						player1={
							$user.id === player1.id
								? [player1, player1_score]
								: [player2, player2_score]
						}
						player2={
							$user.id !== player1.id
								? [player1, player1_score]
								: [player2, player2_score]
						}
					/>
				{/each}
			{:else}
				<p class="dim">No match history yet</p>
			{/if}
		</div>
	</div>
</Layout>
