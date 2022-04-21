<script>
	import Modal2FA from '@components/Modal2FA.svelte'
	import Guard from '@components/Guard.svelte'

	import { stores } from '@sapper/app'
	const { page } = stores()
</script>

<Guard>
	{#key $page}
		<slot />
	{/key}
</Guard>

<Modal2FA />