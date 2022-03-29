<script lang="ts" context="module">
	export async function preload(page, session) {
		if (typeof document === 'undefined' && session.user === undefined)
			this.redirect(307, '/')
	}
</script>

<script lang="ts">
	import Layout from '@components/Layout.svelte'
	import Modal from '@components/Modal.svelte'
	import Head from '@components/Head.svelte'
	import { goto } from '@sapper/app'
	import Button from '@components/Button.svelte'
	import User from '@components/User.svelte'
	import { logOut, fetchUser, getCookie } from '../utils'
	import { user } from '../store'

	user.subscribe(data => data === undefined && goto('/'))

	let avatarModal
	let avatarFile
	let nicknameModal
	let nicknameInput
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
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		max-width: 500px;
	}
	.card h2 {
		margin: 0;
		margin-bottom: 15px;
	}
	.card p {
		color: var(--grey);
		margin: 0;
	}
	.card > div {
		display: flex;
		justify-content: space-between;
		padding: 20px;
		gap: 20px;
		flex: 1;
	}
	.card > div > :last-child {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
	.card button {
		background: none;
		border: none;
		color: var(--prim);
		text-align: left;
		cursor: pointer;
		padding: 15px 20px;
		border-top: 1px solid var(--fore);
		transition: .5s;
	}
	.card button:hover {
		background: var(--bhov);
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
			<div class="profile" on:click={() => avatarModal.open()}>
				<User user={$user} size=150 />
				<div>
					<svg height="30" width="30" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
				</div>
			</div>
			<h1>Hi, {$user.nickname ?? $user.fullname.split(' ')[0]}</h1>

			<div class="card-container">
				<div class="card">
					<div>
						<div>
							<h2>2FA</h2>
							<p>Each time you sign in to your Transcendence, you'll need your password and a verification code.</p>
						</div>
						<div>
							<img width="70" height="70" src="https://cdn-icons-png.flaticon.com/512/3643/3643948.png" alt="">
						</div>
					</div>
					<button>Enable 2fa</button>
				</div>
				<div class="card">
					<div>
						<div>
							<h2>Personal information</h2>
							<p>Change your nickname</p>
						</div>
						<div>
							<img width="70" height="70" src="https://cdn-icons-png.flaticon.com/512/5956/5956503.png" alt="">
						</div>
					</div>
					<button on:click={() => nicknameModal.open()}>Change your nickname</button>
				</div>
			</div>

			<Button primary on:click={() => {
				logOut()
				goto('/')
			}}>Logout</Button>
		</div>
	{/if}
</Layout>

<Modal bind:this={avatarModal}>
	<h1>Change avatar</h1>
	<input bind:this={avatarFile} type="file" accept="image/png, image/jpeg, image/jpg, image/bmp, image/tiff, image/gif">
	<div style="text-align: right;">
		<Button on:click={() => avatarModal.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			avatarModal.close()
			let formData = new FormData();
			formData.append("file", avatarFile.files[0]);
			await fetch('/api/users/picture', {
				method: "POST", 
				body: formData
			})
			fetchUser()
		}}>Change avatar</Button>
	</div>
</Modal>

<Modal bind:this={nicknameModal}>
	<h1>Change nickname</h1>
	<input bind:this={nicknameInput} type="text">
	<div style="text-align: right;">
		<Button on:click={() => nicknameModal.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			nicknameModal.close()
			await fetch('/api/users/update', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nickname: nicknameInput.value
				})
			})
			fetchUser()
		}}>Change nickname</Button>
	</div>
</Modal>