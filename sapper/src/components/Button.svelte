<script>
	import { createEventDispatcher, onMount } from 'svelte'

	export let primary: boolean = false
	export let full: boolean = false
	export let float: boolean = false
	export let href: string = undefined
	export let loading: boolean = false
	export let type: string = undefined
	const dispatch = createEventDispatcher()

	let button

	onMount(() => {
		button.addEventListener('mousemove', e =>
			button.style.setProperty('--x', `${e.layerX}px`))
		button.addEventListener('mouseleave', e =>
			button.style.setProperty('--x', '0px'))
	})
</script>

<style>
	a, button {
		display: inline-block;
		position: relative;
		padding: 15px 20px;
		cursor: pointer;
		border-radius: 10px;
		font-size: 18px;
		border: none;
		user-select: none;
		color: var(--prim);
		background: linear-gradient(90deg, hsla(0,0%,100%,.3), rgba(255, 255, 255, 0.259), hsla(0,0%,100%,.3));
		background-clip: padding-box;
		box-sizing: border-box;
		font-weight: 500;
		background-position: var(--x, 0px) 0px;
		text-align: center;
	}
	:is(a, button).primary {
		background-image: linear-gradient(90deg, var(--prim), var(--seco), var(--prim));
		color: var(--back);
	}
	.float {
		position: fixed;
		bottom: 50px;
		right: 50px;
	}
	:is(a, button).loading {
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
	on:click={e => dispatch('click', e)}
	bind:this={button}
>
	<slot />
</a>
{:else}
<button
	class="{primary !== false && 'primary'} {float !== false && 'float'} {loading !== false && 'loading'}"
	style="{full !== false && 'width: 100%; text-align: center'}"
	on:click={e => dispatch('click', e)}
	{type}
	bind:this={button}
>
	<slot />
</button>
{/if}