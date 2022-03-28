<script lang="ts">
	import { fly } from 'svelte/transition';
	import { stores } from '@sapper/app'
	const { page } = stores()
</script>

<style>
	main {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}
</style>

{#key $page.path}
    <main in:fly={{ x: -30, duration: 300 }}>
        <slot />
    </main>
{/key}