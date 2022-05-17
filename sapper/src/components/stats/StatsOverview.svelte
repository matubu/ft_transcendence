<script>
	import { onMount } from "svelte";

	export let user

	let total
	let wins
	let lose
	let winratio

	$: total = user.matchs.length
	$: wins = user.matchs.filter(({ victory }) => victory.id === user.id).length
	$: lose = total - wins
	$: winratio = wins / total
</script>

<style>
	.progress {
		width: 150px;
		height: 150px;

		position: relative;

		display: grid;
		place-items: center;
		text-align: center;

		stroke-width: 16px;
		stroke-linecap: round;
		stroke: var(--bord);
		fill: #0000;
	}
	.progress > svg
	{ position: absolute }
	.progress .dim
	{ font-size: 15px }
	.progress h3 {
		font-size: 25px;
		margin: 0;
	}
	.progress-fill
	{ stroke: var(--gree) }
</style>

<div class="card">
	<h2>Overview</h2>

	<div class="progress">
		<svg width="100%" viewBox="0 0 150 150">
			<circle cx="75" cy="75" r="67"></circle>
			<circle cx="75" cy="75" r="67" class="progress-fill" style="
				stroke-dasharray: 421;
				stroke-dashoffset: {(1 - winratio) * 421};
			"></circle>
		</svg>
		<div>
			<div class="dim">Win Rate</div>
			<h3>{(winratio * 100).toFixed(1)}%</h3>
		</div>
	</div>

	<div class="stats">
		<div>
			<h3>{wins}</h3>
			<h4 class="dim">Wins</h4>
		</div>
		<div>
			<h3>{total}</h3>
			<h4 class="dim">Total</h4>
		</div>
		<div>
			<h3>{lose}</h3>
			<h4 class="dim">Lose</h4>
		</div>
		<div>
			<h3>{user.elo}</h3>
			<h4 class="dim">Elo</h4>
		</div>
	</div>
</div>