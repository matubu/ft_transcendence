<script>
	import { fetchUser, getCookie, postjson } from '@lib/utils'
	import Modal from '@components/Modal.svelte'
	import { twoauth } from '@lib/store'
	import { useMediaQuery } from '@lib/store'

	let mediaQuery = useMediaQuery('(max-width: 600px)')

	let input

	let reset = () => {
		for (let elm of input.querySelectorAll('input'))
			elm.value = ''
	}
	let submit = async () => {
		for (let elm of input.querySelectorAll('input'))
			elm.disabled = true
		await postjson('/api/user/checkCode', {
				code: [...input.querySelectorAll('input')].reduce((acc, elm) => acc + elm.value, '')
			})
		reset()
		for (let elm of input.querySelectorAll('input'))
			elm.disabled = false
		if (!getCookie('user'))
		{
			input.querySelector('input').focus()
			return ;
		}
		$twoauth.close()
		fetchUser()
	}
	let backspace = e => {
		e.code === 'Backspace'
			&& e.target.previousElementSibling?.focus?.()
	}
	let listener = e => {
		let elm = input.querySelector('input')
		while (elm?.value)
			elm = elm.nextElementSibling
		if (elm) elm.focus()
		else submit()
	}
</script>

<style>
	.input {
		display: flex;
		gap: 5px;
		font-size: 35px;
		align-items: center;
	}
	.input input {
		width: 50px;
		padding: 10px;
		text-align: center;
	}
</style>

<Modal bind:this={$twoauth} on:open={() => {
		reset()
		input.querySelector('input').focus()
	}}>
	<h2>Two auth code</h2>
	<div bind:this={input}>
		{#if ($mediaQuery)}
		<input
			type="text"
			inputmode="numeric"
			pattern="[0-9]{6}"
			autocomplete="one-time-code"
			aria-label="two factor authentification"
			on:input={e => e.target.value.length === 6 && submit()}
		/>
		{:else}
		<div class="input">
			<input type="text" on:keydown={backspace} on:input={listener} aria-label="two factor authentification">
			<input type="text" on:keydown={backspace} on:input={listener} aria-label="two factor authentification">
			<input type="text" on:keydown={backspace} on:input={listener} aria-label="two factor authentification">
			<input type="text" on:keydown={backspace} on:input={listener} aria-label="two factor authentification">
			<input type="text" on:keydown={backspace} on:input={listener} aria-label="two factor authentification">
			<input type="text" on:keydown={backspace} on:input={listener} aria-label="two factor authentification">
		</div>
		{/if}
	</div>
</Modal>