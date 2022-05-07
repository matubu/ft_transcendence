<script>
	import { getjson } from "@lib/utils"
	import User from '@components/User.svelte'
	import { onMount } from "svelte";

	let results = []
	let searchValue

	export let onPick: Function

	const getValue = () => {
		searchValue = search?.value?.trim?.()
	}
	onMount(getValue)
</script>

<style>
	form { position: relative }
	form > .vflex { display: none }
	form:focus-within > .vflex { display: flex }
	.vflex {
		position: absolute;
		right: 0;
		background: var(--fore);
		padding: 10px;
		border-radius: 5px;
		z-index: 999999;
		margin-top: 10px;
		min-width: 100%;
		box-sizing: border-box;
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
	if (results.length)
	{
		onPick(results.id)
		searchValue = ''
	}
}}>
	<input type="text" bind:value={searchValue} on:input={getValue}>
	
	{#if searchValue}
		<div class="vflex">
			{#await getjson(`/api/search/${searchValue}`)}
				<p>loading...</p>
			{:then results} 
				{#if results.length}
					{#each results as result, i}
						<div class="bord-card" on:click={onPick(result.id)} data-id={result.id}>
							<div>
								<User user={result} size="40" />
								<h3>{@html (result.nickname ?? result.fullname.split(' ')[0])
									.replaceAll('&', '&#38;')
									.replaceAll?.('<', '&lt;')
									.replaceAll?.('>', '&gt;')
									.replaceAll(new RegExp(
										searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'
									), `<b>$&</b>`)}</h3>
							</div>
						</div>
					{/each}
				{:else}
					<p class="dim" bind:this={searchResult[0]}>No result</p>
				{/if}
			{:catch err}
				<p>Error: {err.message}</p>
			{/await}
		</div>
	{/if}
</form>
