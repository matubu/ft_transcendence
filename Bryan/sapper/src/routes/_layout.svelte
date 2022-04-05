<script>
	import Header from '@components/Header.svelte'
	import Modal2FA from '@components/Modal2FA.svelte'

	export let segment: string
</script>

<Header {segment} />

<slot />

<Modal2FA />