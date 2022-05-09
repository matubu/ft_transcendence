<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import Icon from '@components/Icon.svelte'
	import Modal from '@lib/components/Modal.svelte';
	import SearchBar from '@components/SearchBar.svelte'
	import StatsOverview from '@components/stats/StatsOverview.svelte'
	import MatchHistory from '@components/stats/MatchHistory.svelte'
	import Leaderboard from '@components/stats/Leaderboard.svelte'
	import { goto } from '@sapper/app'
	import { onMount } from 'svelte'
	import { fetchUser, send } from '@lib/utils'

	onMount(() => {
		send('play')
		fetchUser()
	})

	let modalDuel
</script>

<style>
	.noscroll-modal :global(.card) {
		overflow: visible;
	}

	.container {
		display: grid;
		gap: 10px;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-areas:
			"solo dual ranked"
			"overview overview history"
			"overview overview history";
		max-width: 900px;
		margin: 0 auto;
	}
	.overview { grid-area: overview; }
	.history { grid-area: history; }
	.solo { grid-area: solo; }
	.dual { grid-area: dual; }
	.ranked { grid-area: ranked; }
	@media (max-width: 800px) {
		.container {
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				"solo dual"
				"ranked ranked"
				"overview overview"
				"overview overview"
				"history history";
		}
	}
	@media (max-width: 500px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-areas:
				"solo"
				"dual"
				"ranked"
				"overview"
				"history";
		}
	}
</style>

<Head title="Play" />

<Layout>
	<!-- <div class="grid-layout"> -->
	<!-- </div> -->
	<div class="container">
		<div class="solo grad-card" style="background:var(--grad-purp)">
			<div>
				<Icon>
					<svg enable-background="new 0 0 24 24" height="40" viewBox="0 0 24 24" width="40" fill="currentColor"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><path d="M20,9V7c0-1.1-0.9-2-2-2h-3c0-1.66-1.34-3-3-3S9,3.34,9,5H6C4.9,5,4,5.9,4,7v2c-1.66,0-3,1.34-3,3s1.34,3,3,3v4 c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4c1.66,0,3-1.34,3-3S21.66,9,20,9z M18,19L6,19V7h12V19z M9,13c-0.83,0-1.5-0.67-1.5-1.5 S8.17,10,9,10s1.5,0.67,1.5,1.5S9.83,13,9,13z M16.5,11.5c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S14.17,10,15,10 S16.5,10.67,16.5,11.5z M8,15h8v2H8V15z"/></g></g></svg>
				</Icon>
				<h2>Solo</h2>
			</div>
			<Button href="/play/solo">Play with bots</Button>
		</div>
		<div class="dual grad-card" style="background:var(--grad-gree)">
			<div>
				<Icon>
					<svg height="40" viewBox="0 0 24 24" width="40" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
				</Icon>
				<h2>Dual</h2>
			</div>
			<Button on:click={modalDuel.open()}>Play with friends</Button>
			<!-- add search bar to find opponent -->
		</div>
		<div class="ranked grad-card" style="background:var(--grad-blue)">
			<div>
				<Icon>
					<svg height="40" viewBox="0 0 24 24" width="40" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
				</Icon>
				<h2>Ranked</h2>
			</div>
			<Button href="/play/ranked">Play with strangers</Button>
		</div>
		<div class="overview vflex">
			<StatsOverview />
			<Leaderboard />
		</div>
		<div class="history">
			<MatchHistory />
		</div>
	</div>
</Layout>

<div class="noscroll-modal">
	<Modal bind:this={modalDuel}>
		<h2>Choose your opponent</h2>
		<SearchBar onPick={id => goto(`/play/duel/${id}`)} />
	</Modal>
</div>