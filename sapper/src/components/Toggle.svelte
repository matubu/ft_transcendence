<script>
	export let checked: boolean = false
	export let desc: string
	export let name: string = undefined
</script>

<style>
	label {
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}
	input {
		display: none;
	}
	i {
		display: inline-block;
		width: 64px;
		height: 40px;
		border-radius: 20px;
		vertical-align: middle;
		transition: .25s .09s;
		position: relative;
		background: #33374a;
	}
	i:after {
		content: ' ';
		display: block;
		width: 30px;
		height: 30px;
		top: 5px;
		left: 5px;
		border-radius: 50%;
		background: #696a77;
		position: absolute;
		box-shadow: 1px 2px 4px 0 #0004;
		transition: .15s;
	}
	input:checked + i {
		background: #2778b7;
	}
  
	input:checked + i + span {
		color: var(--prim);
	}
  
	input:checked + i:after {
		transform: translateX(25px);
		background: #8cc4f0;
	}
</style>

<label>
	<input type="checkbox" bind:checked={checked} {name}>
	<i></i>
	<span class="dim">
		{desc}
	</span>
</label>