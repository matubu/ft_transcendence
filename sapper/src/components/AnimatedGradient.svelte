<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	let container: HTMLDivElement

	let ball = (color): HTMLDivElement => {
		let elm = document.createElement('div')
		elm.style.setProperty('--color', color)
		elm.style.top = `${Math.random() * 100}%`
		elm.style.left = `${Math.random() * 100}%`
		return elm
	}

	let vel = (): number[] => [Math.random() * 2 - 1, Math.random() * 2 - 1]

	onMount(() => {
		container = document.createElement('div')
		container.className = 'animated-gradient'

		let balls: HTMLDivElement[] = [ball('#c55273'), ball('#424db3')]
		let velocity = [vel(), vel()]

		let anim = () => {
			for (let i in balls)
			{
				let x = +balls[i].style.left.slice(0, -1) + velocity[i][0] * .2
				let y = +balls[i].style.top.slice(0, -1) + velocity[i][1] * .3
				if (x > 90 || x < 10) velocity[i][0] *= -1
				if (y > 90 || y < 10) velocity[i][1] *= -1
				balls[i].style.left = `${x}%`
				balls[i].style.top = `${y}%`
			}
			requestAnimationFrame(anim)
		}

		requestAnimationFrame(anim)

		container.append(...balls)

		document.body.append(container)
	})
	onDestroy(() => {
		container?.remove?.()
	})
</script>

<style>
	:global(.animated-gradient) {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		filter: blur(50px);
	}
	:global(.animated-gradient div) {
		position: fixed;
		width: 110vmax;
		height: 110vmax;
		border-radius: 50%;
		background: radial-gradient(var(--color), #0000);
		transform: translate(-50%, -50%);
	}
</style>