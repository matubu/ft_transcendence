<script>
	import User from '@components/User.svelte'
	import { user as current } from '@lib/store'

	export let user
	export let message: string
</script>

<style>
	p {
		display: block;
		border-radius: 20px;
		padding: 10px 17px;
		max-width: 400px;
		margin: 0;
    	word-break: break-word;
	}
	.self p {
		background: var(--fore);
	}
	.other p {
		background: var(--primary);
	}
	.other {
		flex-direction: row-reverse;
	}
	div {
		display: flex;
		gap: 10px;
	}
</style>

<div class="{$current.id === user.id ? 'self' : 'other'}">
	<a href="/user/{user.id}">
		<User user={user} size="40"/>
	</a>
	<p>
		{message}
	</p>
</div>
