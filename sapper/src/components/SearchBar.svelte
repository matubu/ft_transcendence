<script>
	import { getjson } from "@lib/utils"
	import User from '@components/User.svelte'
	import { onMount } from "svelte";

	let results
	let searchValue

	export let onPick: Function
	export let resultFilter = result => {return true};

	let timeout
	const getValue = () => {
		clearTimeout(timeout)
		if (!searchValue)
			return results = undefined
		timeout = setTimeout(() => results = getjson(`/api/search/${encodeURIComponent(searchValue)}`).then(r => r.filter(resultFilter)), 1000)
	}
	onMount(getValue)
</script>

<style>
	form { position: relative }
	form > .vflex { display: none }
	form:focus-within > .vflex { display: flex }
	.vflex {
		position: absolute;
		left: 0;
		background: var(--fore);
		padding: 10px;
		border-radius: 5px;
		z-index: 999999;
		top: 55px;
		max-height: 35vh;
		overflow: auto;
	}
	.bord-card {
		cursor: pointer;
		padding: 0 10px
	}
	p { margin: 10px }
	h3 {
		font-weight: 200;
		color: var(--grey);
	}
	form :global(b) {
		font-weight: 700;
		color: var(--whit);
	}
</style>

<form on:submit={e => {
	e.preventDefault()
	results.then(res => {
		if (res.length)
		{
			onPick(res[0].id)
			searchValue = ''
		}
	})
}}>
	<input type="text" bind:value={searchValue} on:input={getValue}>
	{#if results}
		<div class="vflex">
			{#await results}
				<p>loading...</p>
			{:then res} 
				{#if res.length}
					{#each res as result}
						<div class="bord-card" on:click={onPick(result.id)} tabindex="0">
							<User user={result} size="40" />
							<h3>{result.nickname ?? result.fullname.split(' ')[0]}</h3>
						</div>
					{/each}
				{:else}
					<p class="dim">No result</p>
				{/if}
			{:catch err}
				<p>Error: {err.message}</p>
			{/await}
		</div>
	{/if}
</form>
