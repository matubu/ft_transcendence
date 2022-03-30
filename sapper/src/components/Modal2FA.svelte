<script>
	import { fetchUser, getCookie } from '@lib/utils'

	import Modal from '@components/Modal.svelte'
	import { twoauth } from '@lib/store'

	let input

	let reset = () => {
		for (let elm of input.children)
			elm.value = ''
	}
	let submit = async () => {
		for (let elm of input.children)
			elm.disabled = true
		await fetch('/api/users/check_code', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				code: [...input.children].reduce((acc, elm) => acc + elm.value, '')
			})
		})
		reset()
		for (let elm of input.children)
			elm.disabled = false
		if (!getCookie('user'))
		{
			input.firstChild.focus()
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
		let elm = input.firstChild;
		while (elm?.value)
			elm = elm.nextElementSibling
		if (elm) elm.focus()
		else submit()
	}
</script>

<style>
	.input {
		display: flex;
		gap: 10px;
		font-size: 35px;
		align-items: center;
	}
	input {
		width: 50px;
	text-align: center;
	}
</style>

<Modal bind:this={$twoauth} on:open={() => {
		reset()
		input.firstChild.focus()
	}}>
	<h2>Two auth code</h2>
	<div class="input" bind:this={input}>
		<input type="text" on:keydown={backspace} on:input={listener}>
		<input type="text" on:keydown={backspace} on:input={listener}>
		<input type="text" on:keydown={backspace} on:input={listener}>
		<input type="text" on:keydown={backspace} on:input={listener}>
		<input type="text" on:keydown={backspace} on:input={listener}>
		<input type="text" on:keydown={backspace} on:input={listener}>
	</div>
</Modal>