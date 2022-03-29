<script context="module">
	import { fetchUser } from '@lib/utils'

	export async function preload(page, session) {
		if (typeof document === 'undefined')
		{
			if (session.user === undefined)
				user.set(undefined)
			else
				fetchUser(session.user, this.fetch)
		}
	}
</script>

<script>
	import Header from '@components/Header.svelte'
	import Modal2FA from '@components/Modal2FA.svelte'
	import { user } from '@lib/store'

	export let segment: string
</script>

<Header {segment} />

<slot />

<Modal2FA />