<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import { user } from '@lib/store'
	import { logIn } from '@lib/utils'
</script>

<style>
	.container {
		display: flex;
		gap: 20px;
		justify-content: center;
	}
	button {
		padding: 60px 30px;
		border-radius: 10px;
		overflow: hidden;
		border: none;
		background: #0000;
		cursor: pointer;
		transition: .3s;
		flex: 1;

		position: relative;
	}
	button:before,
	button:after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: linear-gradient(0deg, #2336eb, var(--color));
		z-index: -1;
		transition: 1s;
	}
	button:before { background: linear-gradient(30deg, #3a48c3, var(--color)) }
	button:hover:after { opacity: 0 }
	button :is(h4, p, svg) {
		margin: 0;
	}
	button h4 {
		font-size: 30px;
	}
	button p {
		color: var(--grey);
	}
	button svg {
		filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.15));
		width: 120px;
		height: 120px;
		opacity: .7;
	}
	button:hover {
		flex: 1.5;
	}
	@media only screen and (max-width: 700px) {
		.container {
			flex-direction: column;
		}
		button {
			width: 100%;
			padding: 5px;
			display: flex;
			align-items: center;
			gap: 20px;
			text-align: left;
		}
		button svg {
			width: 80px;
			height: 80px;
		}
		button h4 {
			font-size: 25px;
		}
	}
</style>

<Head title="Play" />

<Layout>
	<div>
		<h1>Play<span class="dim">.</span></h1>
		
		{#if ($user)}
			<div class="container">
				<button style="--color: #9e51e0">
					<svg width="50" height="50" viewBox="0 0 50 50" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M28.7487 7.53554C26.7961 5.58292 23.6303 5.58292 21.6777 7.53554L7.53554 21.6777C5.58292 23.6303 5.58292 26.7961 7.53554 28.7487L21.6777 42.8909C23.6303 44.8435 26.7961 44.8435 28.7487 42.8909L42.8909 28.7487C44.8435 26.7961 44.8435 23.6303 42.8909 21.6777L28.7487 7.53554ZM33 20V22C34.66 22 36 23.34 36 25C36 26.66 34.66 28 33 28V32C33 33.1 32.1 34 31 34H19C17.9 34 17 33.1 17 32V28C15.34 28 14 26.66 14 25C14 23.34 15.34 22 17 22V20C17 18.9 17.9 18 19 18H22C22 16.34 23.34 15 25 15C26.66 15 28 16.34 28 18H31C32.1 18 33 18.9 33 20ZM19 32H31V20H19V32ZM20.5 24.5C20.5 25.33 21.17 26 22 26C22.83 26 23.5 25.33 23.5 24.5C23.5 23.67 22.83 23 22 23C21.17 23 20.5 23.67 20.5 24.5ZM28 26C28.83 26 29.5 25.33 29.5 24.5C29.5 23.67 28.83 23 28 23C27.17 23 26.5 23.67 26.5 24.5C26.5 25.33 27.17 26 28 26ZM29 30V28H21V30H29Z" fill="currentColor"/></svg>
					<div>
						<h4>Solo</h4>
						<p>Play against a bot</p>
					</div>
				</button>
				<button style="--color: #5ae29f">
					<svg width="50" height="50" viewBox="0 0 50 50" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M28.7487 7.53554C26.7961 5.58292 23.6303 5.58292 21.6777 7.53554L7.53554 21.6777C5.58292 23.6303 5.58292 26.7961 7.53554 28.7487L21.6777 42.8909C23.6303 44.8435 26.7961 44.8435 28.7487 42.8909L42.8909 28.7487C44.8435 26.7961 44.8435 23.6303 42.8909 21.6777L28.7487 7.53554ZM27 21C27 19.9 26.1 19 25 19C23.9 19 23 19.9 23 21C23 22.1 23.9 23 25 23C26.1 23 27 22.1 27 21ZM31 31C30.8 30.29 27.7 29 25 29C22.31 29 19.23 30.28 19 31H31ZM21 21C21 18.79 22.79 17 25 17C27.21 17 29 18.79 29 21C29 23.21 27.21 25 25 25C22.79 25 21 23.21 21 21ZM17 31C17 28.34 22.33 27 25 27C27.67 27 33 28.34 33 31V33H17V31Z" fill="currentColor"/></svg>
					<div>
						<h4>Dual</h4>
						<p>Play against your friend</p>
					</div>
				</button>
				<button style="--color: #d84d8e">
					<svg width="50" height="50" viewBox="0 0 50 50" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M28.7487 7.53554C26.7961 5.58292 23.6303 5.58292 21.6776 7.53554L7.53551 21.6777C5.58289 23.6303 5.58289 26.7961 7.53551 28.7487L21.6776 42.8909C23.6303 44.8435 26.7961 44.8435 28.7487 42.8909L42.8908 28.7487C44.8435 26.7961 44.8435 23.6303 42.8908 21.6777L28.7487 7.53554ZM15 25C15 19.48 19.47 15 24.99 15C30.52 15 35 19.48 35 25C35 30.52 30.52 35 24.99 35C19.47 35 15 30.52 15 25ZM28.97 21H31.92C30.96 19.35 29.43 18.07 27.59 17.44C28.19 18.55 28.65 19.75 28.97 21ZM26.91 21C26.48 19.57 25.83 18.24 25 17.04C24.17 18.24 23.52 19.57 23.09 21H26.91ZM17 25C17 25.69 17.1 26.36 17.26 27H20.64C20.56 26.34 20.5 25.68 20.5 25C20.5 24.32 20.56 23.66 20.64 23H17.26C17.1 23.64 17 24.31 17 25ZM21.03 29H18.08C19.04 30.66 20.57 31.93 22.41 32.56C21.81 31.45 21.35 30.25 21.03 29ZM18.08 21H21.03C21.35 19.75 21.81 18.55 22.41 17.44C20.57 18.07 19.04 19.34 18.08 21ZM23.09 29C23.52 30.43 24.17 31.76 25 32.96C25.83 31.76 26.48 30.43 26.91 29H23.09ZM22.5 25C22.5 25.68 22.57 26.34 22.66 27H27.34C27.43 26.34 27.5 25.68 27.5 25C27.5 24.32 27.43 23.65 27.34 23H22.66C22.57 23.65 22.5 24.32 22.5 25ZM28.97 29C28.65 30.25 28.19 31.45 27.59 32.56C29.43 31.93 30.96 30.65 31.92 29H28.97ZM29.5 25C29.5 25.68 29.44 26.34 29.36 27H32.74C32.9 26.36 33 25.69 33 25C33 24.31 32.9 23.64 32.74 23H29.36C29.44 23.66 29.5 24.32 29.5 25Z" fill="currentColor"/></svg>
					<div>
						<h4>Online</h4>
						<p>Play with stranger</p>
					</div>
				</button>
			</div>
		{:else}
			<p>You need to login first</p>
			<Button primary on:click={logIn}>Login</Button>
		{/if}
	</div>
</Layout>
