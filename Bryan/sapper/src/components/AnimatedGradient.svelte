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
	let neg = (val: number, sign: boolean): number => Math.abs(val) * (sign ? 1 : -1)

	onMount(() => {
		let balls: HTMLDivElement[] = [ball('#c55273'), ball('#424db3')]
		const speed = 4
		let v = [vel(), vel()]
		let p = [pos(), pos()]

		let anim = () => {
			for (let i in balls)
			{
				if (p[i][0] > window.innerWidth || p[i][0] < 0) v[i][0] = neg(v[i][0], p[i][0] < 0)
				if (p[i][1] > window.innerHeight || p[i][1] < 0) v[i][1] = neg(v[i][1], p[i][1] < 0)
				balls[i].style.transform = `translate(${p[i][0]}px,${p[i][1]}px)`
				p[i][0] += v[i][0] * speed
				p[i][1] += v[i][1] * speed
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
		transform: translate3d(0, 0, 0);
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