<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'

	export let status: number
	export let error: Error

	const dev = process.env.NODE_ENV === 'development'
</script>

<style>
	.container {
		flex: 1;
		display: grid;
		place-items: center;
	}
	.container > div {
		display: flex;
		flex-direction: column;
		gap: 25px;
		text-align: center;
	}

	h1 {
		font-size: 90px;
		font-weight: 700;
		margin: 0;
	}

	p {
		font-size: 20px;
		margin: 0;
	}

	pre {
		text-align: left;
		width: fit-content;
		margin: 0 auto;
    	white-space: break-spaces;
	}
</style>

<Head title="Error {status}" />

<Layout>
	<div class="container">
		<div>
			<h1>{status}</h1>
			
			<p>
			Ooops!<br>
			{error.message}
			</p>
			
			<span>
				<Button primary href="/">Back to home</Button>
			</span>
			
			{#if dev && error.stack}
				<pre>{error.stack}</pre>
			{/if}
		</div>
	</div>
</Layout>