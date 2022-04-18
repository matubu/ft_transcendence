<script>
	import { user } from '@lib/store'
	import Home from '@lib/routes/index.svelte'
</script>

{#if ($user)}
	<slot />
{:else}
	<Home />
{/if}