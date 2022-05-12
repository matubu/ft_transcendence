<script>
	let theme = localStorage.getItem('theme') ?? '90'

	$: console.log(theme)
	$: localStorage.setItem('theme', theme)
</script>

<div>
	<label>
		<input type=radio bind:group={theme} value="90">
		90
	</label>

	<label>
		<input type=radio bind:group={theme} value="beach">
		Beach
	</label>

	<label>
		<input type=radio bind:group={theme} value="pocker">
		Pocker
	</label>
</div>
<div>
	{theme}
</div>