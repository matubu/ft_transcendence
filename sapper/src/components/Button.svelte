<script>
	import { createEventDispatcher, onMount } from 'svelte'

	export let primary: boolean = false
	export let full: boolean = false
	export let float: boolean = false
	export let href: string = undefined
	export let loading: boolean = false
	const dispatch = createEventDispatcher()

	let button

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
	* {
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
	*:hover {
		background: #A6CFD508;
	}
	*.primary {
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
	*.loading {
		color: #0000
	}
	@keyframes loader {
		0% { transform: translate(-50%, -50%) rotate(0deg); }
		to { transform: translate(-50%, -50%) rotate(360deg); }
	}
	.loading:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform-origin: center;
		animation: loader .5s linear infinite;
		width: 20px;
		height: 20px;
		box-sizing: border-box;
		border: 3px solid #0000;
		border-top-color: var(--back);
		border-right-color: var(--back);
		border-radius: 50%;
	}
</style>
{#if href}
<a
	class="{primary !== false && 'primary'} {float !== false && 'float'} {loading !== false && 'loading'}"
	style="{full !== false && 'width: 100%; text-align: center'}"
	rel=prefetch
	href="{href}"
	on:click={() => dispatch('click')}
	bind:this={button}
>
	<slot />
</a>
{:else}
<button
	class="{primary !== false && 'primary'} {float !== false && 'float'} {loading !== false && 'loading'}"
	style="{full !== false && 'width: 100%; text-align: center'}"
	on:click={() => dispatch('click')}
	bind:this={button}
>
	<slot />
</button>
{/if}