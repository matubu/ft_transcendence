<style>
	.glass-card {
		background: hsl(216deg 75% 77% / 20%);
		border: 1px solid rgb(142 140 144 / 5%);
		box-shadow: inset 1px 1px 0 hsl(0deg 0% 100% / 11%);
		backdrop-filter: blur(52px);
		padding: 30px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 30px;
		box-sizing: border-box;
		width: 60px;
		height: 60px;
		padding: 10px;
		min-width: 0;
		flex-shrink: 0;
	}
</style>

<div class="glass-card">
	<slot />
</div>