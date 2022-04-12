<script>
	import { user } from '@lib/store'
	import { goto } from '@sapper/app'

	typeof document !== 'undefined'
		&& user.subscribe(data => data === undefined && goto('/'))
</script>

{#if ($user)}
	<slot />
{/if}