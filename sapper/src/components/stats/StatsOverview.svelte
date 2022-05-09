<script>
	import { user } from '@lib/store'

	let wins = 0
	let lose = 0
	let total
	let winratio = 0

	user.subscribe(user => {
		if (!user)
			return (wins = lose = total = winratio = 0)
		wins = user.matchs.filter(({ victory }) => victory.id === user.id).length
		total = user.matchs.length
		lose = total - wins
		winratio = wins / total
	})
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

	.wins {
		width: 100%;
	}
	.wins > h4 {
		text-align: center;
	}
	.wins > .flex {
		align-items: center;
		gap: 20px;
	}
	progress {
		width: 100%;
		margin: 0;
		-webkit-appearance: none;
		border: 0;
		background: var(--bord);
		border-radius: 99px;
		overflow: hidden;
		height: 16px;
	}
	::-webkit-progress-bar
	{ background: var(--bord) }
	::-webkit-progress-value
	{ background: var(--gree) }
	::-moz-progress-bar
	{ background: var(--gree) }
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

	<div class="wins">
		<h4 class="dim">Total Matchs</h4>
		<div class="flex">
			<span>{wins}</span>
			<progress max={total} value={wins} />
			<span>{lose}</span>
		</div>
	</div>
</div>