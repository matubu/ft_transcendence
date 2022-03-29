<script>
	import { fetchUser, getCookie } from '@lib/utils'

	import Modal from '@components/Modal.svelte'
	import Button from '@components/Button.svelte'
	import { twoauth } from '@lib/store'

	let input
</script>

<Modal bind:this={$twoauth}>
	<h2>Two auth code</h2>
	<div class="input" bind:this={input}>
		<input type="text">
		<input type="text">
		<input type="text">
		-
		<input type="text">
		<input type="text">
		<input type="text">
	</div>
	<div style="text-align: right">
		<Button on:click={() => $twoauth.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			await fetch('/api/users/check_code', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					code: [...input.children].reduce((acc, elm) => acc + elm.value, '')
				})
			})
			if (!getCookie('user'))
				return ;
			$twoauth.close()
			fetchUser()
		}}>Verify</Button>
	</div>
</Modal>