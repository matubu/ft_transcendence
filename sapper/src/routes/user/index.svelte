<script>
	import Layout from '@components/Layout.svelte'
	import Modal from '@components/Modal.svelte'
	import Head from '@components/Head.svelte'
	import Icon from '@components/Icon.svelte'
	import Button from '@components/Button.svelte'
	import User from '@components/User.svelte'
	import { goto } from '@sapper/app'
	import { logOut, fetchUser } from '@lib/utils'
	import { user } from '@lib/store'
	import { get } from 'svelte/store'

	let modalAvatar
	let fileAvatar

	let modalNickname
	let inputNickname

	let modal2FA
	let qrCode2FA: string
</script>

<style>
	.container {
		display: grid;
		place-items: center;
	}
	.profile {
		position: relative;
		cursor: pointer;
		border-radius: 50%;
		overflow: hidden;
	}
	.profile div {
		margin-top: 100px;
		height: 50px;
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		display: grid;
		place-items: center;
		background: #0007;
		transition: .3s;
	}
	.profile:not(:hover) div {
		opacity: 0;
	}
	.card-container {
		display: flex;
		gap: 30px;
		padding: 20px;
		margin-bottom: 30px;
	}
	@media (max-width: 800px) {
		.card-container { flex-direction: column; }
	}
	h1 {
		overflow-wrap: anywhere;
	}
</style>

<Head title="User" />

<Layout>
	{#if $user}
		<div class="container">
			<div class="profile" on:click={() => modalAvatar.open()}>
				<User user={$user} size=150 />
				<div>
					<svg height="30" width="30" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
				</div>
			</div>
			<h1>Hi, {$user.nickname ?? $user.fullname.split(' ')[0]}</h1>

			<div class="card-container">
				<div class="grad-card" style="background: var(--grad-blue)">
					<Icon>
						<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
					</Icon>
					<h2>2FA</h2>
					<p>Each time you sign in to your Transcendence, you'll need your password and a verification code.</p>
					<Button on:click={() => {
						qrCode2FA = undefined
						modal2FA.open()
					}}>{$user?.dfa ? "Disable" : "Enable"} 2fa</Button>
				</div>
				<div class="grad-card" style="background:var(--grad-purp)">
					<Icon>
						<svg width="40" height="40" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><rect height="1.5" width="4" x="14" y="12"/><rect height="1.5" width="4" x="14" y="15"/><path d="M20,7h-5V4c0-1.1-0.9-2-2-2h-2C9.9,2,9,2.9,9,4v3H4C2.9,7,2,7.9,2,9v11c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V9 C22,7.9,21.1,7,20,7z M11,7V4h2v3v2h-2V7z M20,20H4V9h5c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2h5V20z"/><circle cx="9" cy="13.5" r="1.5"/><path d="M11.08,16.18C10.44,15.9,9.74,15.75,9,15.75s-1.44,0.15-2.08,0.43C6.36,16.42,6,16.96,6,17.57V18h6v-0.43 C12,16.96,11.64,16.42,11.08,16.18z"/></g></g></svg>
					</Icon>
					<h2>Personal information</h2>
					<p>Change your nickname</p>
					<Button on:click={() => modalNickname.open()}>Change nickname</Button>
				</div>
			</div>

			<div>
				<Button on:click={async () => {
					await fetch('/api/user', {
						method: 'DELETE'
					})
					logOut()
					goto('/')
				}}>Delete</Button>
				<Button primary on:click={() => {
					logOut()
					goto('/')
				}}>Logout</Button>
			</div>
		</div>
	{/if}
</Layout>

<Modal bind:this={modalAvatar}>
	<h2>Change avatar</h2>
	<input bind:this={fileAvatar} type="file" accept="image/png, image/jpeg, image/jpg, image/bmp, image/tiff, image/gif">
	<div style="text-align: right">
		<Button on:click={() => modalAvatar.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			modalAvatar.close()
			let formData = new FormData();
			formData.append("file", fileAvatar.files[0]);
			await fetch('/api/user/changePicture', {
				method: 'POST', 
				body: formData
			})
			fetchUser()
		}}>Change avatar</Button>
	</div>
</Modal>

<Modal bind:this={modalNickname}>
	<h2>Change nickname</h2>
	<input bind:this={inputNickname} type="text" required>
	<div style="text-align: right">
		<Button on:click={() => modalNickname.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			modalNickname.close()
			await fetch('/api/user/changeNickname', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nickname: inputNickname.value
				})
			})
			fetchUser()
		}}>Change nickname</Button>
	</div>
</Modal>


<Modal bind:this={modal2FA}>
	<h2>{$user?.dfa ? "Disable" : "Enable"} 2FA</h2>
	{#if qrCode2FA}
	<p>You will never see the QR code again, please scan it</p>
	<img width="150" height="150" src="{qrCode2FA.qr}" alt="">
	{/if}
	<div style="text-align: right">
		{#if qrCode2FA}
		<Button primary on:click={() => modal2FA.close()}>Close</Button>
		{:else}
		<Button on:click={() => modal2FA.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			let res = await fetch(`/api/user/${get(user)?.dfa ? "disable" : "activate"}2FA`, {
				method: "PUT"
			})
			if (get(user)?.dfa)
				modal2FA.close()
			qrCode2FA = await res.json()
			fetchUser()
		}}>{$user?.dfa ? "Disable" : "Enable"}</Button>
		{/if}
	</div>
</Modal>