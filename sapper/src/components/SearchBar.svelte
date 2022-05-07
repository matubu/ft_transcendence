<script>
	import { getjson } from "@lib/utils"
	import User from '@components/User.svelte'
	import { onMount } from "svelte";
	import { goto } from '@sapper/app'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	let search
	let searchResult = []
	let searchValue

	const getValue = () => searchValue = search?.value?.trim?.()
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
	.bord-card { padding: 0 10px }
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
	if (searchResult[0]?.href)
	{
		goto(searchResult[0]?.href)
		// TODO
		// dispatch('pick', searchResult[0].userId)
		search = ''
	}
}}>
	<input type="text" bind:this={search} on:input={getValue}>
	
	{#if searchValue}
		<div class="vflex">
			{#await getjson(`/api/search/${searchValue}`)}
				<p bind:this={searchResult[0]}>loading...</p>
			{:then results} 
				{#if results.length}
					{#each results as result, i}
						<a class="bord-card" href="/user/{result.id}" bind:this={searchResult[i]}>
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
						</a>
					{/each}
				{:else}
					<p class="dim" bind:this={searchResult[0]}>No result</p>
				{/if}
			{:catch err}
				<p bind:this={searchResult[0]}>Error: {err.message}</p>
			{/await}
		</div>
	{/if}
</form>
