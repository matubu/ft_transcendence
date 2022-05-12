<script>
	let theme = localStorage.getItem('theme') ?? '90'

	$: localStorage.setItem('theme', theme)
</script>

<style>
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
	<label>
		<input type=radio bind:group={theme} value="90">
		<span>90</span>
	</label>

	<label>
		<input type=radio bind:group={theme} value="beach">
		<span>Beach</span>
	</label>

	<label>
		<input type=radio bind:group={theme} value="pocker">
		<span>Pocker</span>
	</label>
</div>