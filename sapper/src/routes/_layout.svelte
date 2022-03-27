<script lang="ts" context="module">
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

<script lang="ts">
	import Header from '@components/Header.svelte'
	import { user } from '@lib/store';

	export let segment: string
</script>

<Header {segment} />

<slot />