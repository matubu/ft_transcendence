<script>
	import User from '@components/User.svelte'
	export let user
	export let message: string
</script>

<p>
	<User user={user}/>
	{message}
</p>
