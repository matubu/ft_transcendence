<script>
	import { createEventDispatcher, onMount } from 'svelte'

	export let primary: boolean = false
	export let full: boolean = false
	export let float: boolean = false
	export let href: string = undefined
	const dispatch = createEventDispatcher()

	let button: HTMLAnchorElement

	onMount(() => {
		if (primary !== false)
		{
			button.addEventListener('mousemove', e =>
				button.style.setProperty('--x', `${e.layerX}px`))
			button.addEventListener('mouseleave', e =>
				button.style.setProperty('--x', '0px'))
		}
	})
</script>

<style>
	a {
		display: inline-block;
		position: relative;
		padding: 15px 20px;
		border: none;
		cursor: pointer;
		border-radius: 8px;
		font-size: 20px;
		border: 2px solid var(--seco);
		transition: background-color .3s;
		text-decoration: none;
		user-select: none;
		font-weight: 500;
		color: var(--seco);
		background: #0000;
		box-sizing: border-box;
	}
	a:hover {
		background: #A6CFD508;
	}
	a.primary {
		background-image: linear-gradient(90deg, var(--seco), var(--prim), var(--seco));
		background-position: var(--x, 0px) 0px;
		border: #0000;
		color: var(--back);
	}
	.float {
		position: fixed;
		bottom: 50px;
		right: 50px;
	}
</style>

<a
	class="{primary !== false && 'primary'} {float !== false && 'float'}"
	style="{full !== false && 'width: 100%; text-align: center'}"
	rel=prefetch
	href="{href}"
	on:click={() => dispatch('click')}
	bind:this={button}
>
	<slot />
</a>