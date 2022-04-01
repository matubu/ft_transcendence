<script context="module">
	export async function preload(page, session) {
		if (typeof document === 'undefined' && session.user === undefined)
			this.redirect(307, '/')
	}
</script>

<script>
	import Layout from '@components/Layout.svelte'
	import Modal from '@components/Modal.svelte'
	import Head from '@components/Head.svelte'
	import { goto } from '@sapper/app'
	import Button from '@components/Button.svelte'
	import User from '@components/User.svelte'
	import { logOut, fetchUser } from '@lib/utils'
	import { user } from '@lib/store'
	import { get } from 'svelte/store'

	typeof document !== 'undefined'
		&& user.subscribe(data => data === undefined && goto('/'))

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
		flex-wrap: wrap;
		gap: 30px;
		padding: 20px;
		margin-bottom: 30px;
	}
	.card {
		flex: 1;
		border: 1px solid var(--fore);
		border-radius: 5px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		max-width: 500px;
	}
	.card h2 {
		margin: 0;
		margin-bottom: 15px;
	}
	.card > div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		flex: 1;
	}
	@media (max-width: 800px) {
		.card > div {
			flex-direction: column-reverse;
		}
	}
	h1 {
		overflow-wrap: anywhere;
		font-size: clamp(40px, 10vw, 60px);
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
				<div class="card" style="background: linear-gradient(107.56deg,#74cabe,#1d9dba,#0d214e)">
					<div>
						<div>
							<h2>2FA</h2>
							<p>Each time you sign in to your Transcendence, you'll need your password and a verification code.</p>
						</div>
						<div>
							<img width="70" height="70" src="https://cdn-icons-png.flaticon.com/512/3643/3643948.png" alt="">
						</div>
					</div>
					<Button on:click={() => {
						qrCode2FA = undefined
						modal2FA.open()
					}}>{$user?.twoauth ? "Disable" : "Enable"} 2fa</Button>
				</div>
				<div class="card" style="background: linear-gradient(107.56deg,#ca748c,#ba1d65,#7e092a)">
					<div>
						<div>
							<h2>Personal information</h2>
							<p>Change your nickname</p>
						</div>
						<div>
							<img width="70" height="70" src="https://cdn-icons-png.flaticon.com/512/5956/5956503.png" alt="">
						</div>
					</div>
					<Button on:click={() => modalNickname.open()}>Change your nickname</Button>
				</div>
			</div>

			<Button primary on:click={() => {
				logOut()
				goto('/')
			}}>Logout</Button>
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
			await fetch('/api/users/picture', {
				method: "POST", 
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
			await fetch('/api/users/update', {
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
	<h2>{$user?.twoauth ? "Disable" : "Enable"} 2FA</h2>
	{#if qrCode2FA}
	<p>You will never see the QR code again, please scan it</p>
	<img width="150" height="150" src="{qrCode2FA}" alt="">
	{/if}
	<div style="text-align: right">
		{#if qrCode2FA}
		<Button primary on:click={() => modal2FA.close()}>Close</Button>
		{:else}
		<Button on:click={() => modal2FA.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			let res = await fetch(`/api/users/${get(user)?.twoauth ? "disable" : "activate"}_2fa`, {
				method: "PUT"
			})
			if (get(user)?.twoauth)
				modal2FA.close()
			qrCode2FA = await res.text()
			fetchUser()
		}}>{$user?.twoauth ? "Disable" : "Enable"}</Button>
		{/if}
	</div>
</Modal>