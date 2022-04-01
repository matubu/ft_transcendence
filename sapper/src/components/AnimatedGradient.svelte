<script>
	import { onMount } from "svelte";

	let container: HTMLDivElement

	let ball = (color): HTMLDivElement => {
		let elm = document.createElement('div')
		elm.style.setProperty('--color', color)
		return elm
	}

	let vel = (): number[] => [Math.random() * 2 - 1, Math.random() * 2 - 1]
	let pos = (): number[] => [Math.random() * window.innerWidth, Math.random() * window.innerHeight]

	onMount(() => {
		let balls: HTMLDivElement[] = [ball('#c55273'), ball('#424db3')]
		let velocity = [vel(), vel()]
		let position = [pos(), pos()]

		let anim = () => {
			for (let i in balls)
			{
				if (position[i][0] > window.innerWidth || position[i][0] < 0) velocity[i][0] *= -1
				if (position[i][1] > window.innerHeight || position[i][1] < 0) velocity[i][1] *= -1
				balls[i].style.transform = `translate3d(${position[i][0]}px,${position[i][1]}px,0)`
				position[i][0] += velocity[i][0] * 5
				position[i][1] += velocity[i][1] * 5
			}
			requestAnimationFrame(anim)
		}

		anim()

		container.append(...balls)
	})
</script>

<style>
	.animated-gradient {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: blur(50px);
		overflow: hidden;
	}
	.animated-gradient :global(div) {
		position: absolute;
		top: -50vmax;
		left: -50vmax;
		width: 100vmax;
		height: 100vmax;
		border-radius: 50%;
		background: radial-gradient(var(--color), #0000);
	}
</style>

<div class="animated-gradient" bind:this={container}></div>