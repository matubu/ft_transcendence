<script>
	import Modal2FA from '@components/Modal2FA.svelte'
	import Guard from '@components/Guard.svelte'
</script>

<Guard>
	<slot />
</Guard>

<Modal2FA />