<script lang="ts" context="module">
	export async function preload(page, session) {
		if (typeof document === 'undefined' && session.user === undefined)
			this.redirect(307, '/')
	}
</script>

<script lang="ts">
	import Layout from '@components/Layout.svelte'
	import Head from '../components/Head.svelte'
	import { goto } from '@sapper/app'
	import Button from '../components/Button.svelte'
	import User from '../components/User.svelte'
	import { logOut } from '../utils'
	import { user } from '../store'
</script>

<style>
	.container {
		display: grid;
		place-items: center;
	}
	.profile {
		cursor: pointer;
		border-radius: 50%;
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
			<div class="profile">
				<User user={$user} size=150 />
			</div>
			<h1>Welcome, {$user.nickname ?? $user.fullname}</h1>

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
					<button>Change your nickname</button>
				</div>
			</div>

			<Button primary on:click={() => {
				logOut()
				goto('/')
			}}>Logout</Button>
		</div>
	{/if}
</Layout>