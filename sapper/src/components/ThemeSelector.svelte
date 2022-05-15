<script>
	let theme = localStorage.getItem('theme') ?? '90'

	$: localStorage.setItem('theme', theme)
</script>

<style>
	.flex {
		flex-wrap: wrap;
	}
	input {
		display: none;
	}
	span {
		display: block;
		cursor: pointer;
		padding: 10px;
		border: 1px solid var(--bord);
		border-radius: 5px;
		background: var(--bhov);
		transition: .5s;
	}
	span:hover { background: var(--hove) }
	span:active { background: var(--acti) }
	input:checked + span {
		border-color: #557cff;
		background: #25f5;
		color: #7f9cff;
	}
</style>

<div class="flex">
	{#each ["90", "beach", "computer1", "dontpanic", "poker", "yourname"] as name}
		<label>
			<input type=radio bind:group={theme} value="{name}">
			<span>{name}</span>
		</label>
	{/each}
</div>