<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import { send, getjson, postjson, fetchUser } from '@lib/utils'
	import { user } from '@lib/store'
	import IconButton from '@components/IconButton.svelte'
	import Message from '@components/Message.svelte'
	import Modal from '@components/Modal.svelte'
	import Button from '@components/Button.svelte'
	import User from '@components/User.svelte'
	import Toggle from '@components/Toggle.svelte'
	import { onMount, afterUpdate, tick } from 'svelte'
	import { get } from 'svelte/store'
	import { stores, goto } from '@sapper/app'
	
	const { page } = stores()

	let settings
	let settingsAdmin;
	let deleteConfirmation
	let leaveConfirmation
	let askPassword
	let askPasswordField

	let hasAccess = false

	let msg
	let id_room: string = get(page).params.id
	let container: HTMLDivElement

	let messages = []
	let userInfo = new Map<number, any>()

	let userTyping: Set<number> = new Set();

	const loadChat = async (password = undefined) => {
		let res = await postjson(`/api/channel/${id_room}`, { password })
		if (!res.ok) return false
		let json = await res.json()
		messages = json.msgs
		let infos = json.users
		for (const info of infos)
			userInfo.set(info.id, info)
		return true
	}
	const addMessage = (msg) => {
		userInfo.set(msg.userId, msg.user)
		userInfo = userInfo
		messages = [...messages, msg]
	}

	afterUpdate(() => container.scrollTo(0, container.scrollHeight))

	if (typeof document !== 'undefined')
	{
		onMount(async () => {
			if (await loadChat()) {
				await tick()
				msg.focus()
			}
			else {
				askPassword.open()
			}
		})
	}

	let typing = false
	let timeout
	const updateTyping = type => {
		typing = type
		send('typing', { room: id_room, typing })
	}
	function isTyping() {
		if (!typing)
			updateTyping(true)
		clearTimeout(timeout)
		timeout = setTimeout(() => updateTyping(false), 1000)
	}

	const isAdmin = (user: any) => user.adminChannels.some(channel => channel.id == id_room)
	const isOwner = (user: any) => user.ownerChannels.some(channel => channel.id == id_room)

	let name: string = '';
	let desc: string = '';
	let isPrivate: boolean = false;
	let hasPassword: boolean = false;
	let password: string = '';

	async function infoChannel(): Promise<any> {
		let channel = await getjson(`/api/channel/${id_room}/infoChannel`)
		name = channel.name
		desc = channel.description
		isPrivate = channel.private
		hasPassword = channel.password_is_set
		return channel
	}

	async function changeValueChannel(url: string, value: any = {}): Promise<void> {
		await postjson(`/api/channel/${id_room}/${url}`, value)
	}

	async function saveSettingOwner(channel): Promise<void> {
		if (name !== undefined && channel.name !== name)
			await changeValueChannel('changeName', { name })
		if (channel.description !== desc)
			await changeValueChannel('changeDescription', { description: desc })
		if (isPrivate !== channel.private)
			await changeValueChannel(`changeTo${isPrivate ? '' : 'Not'}Private`)
		if (hasPassword)
			password && await changeValueChannel("setPassword", { password })
		else
			await fetch(`/api/channel/${id_room}/deletePassword`, { method: 'DELETE' })
		settings.close();
	}

	async function leaveChannel(): Promise<void> {
		await fetch(`/api/channel/${id_room}/leaveAccess`, { method: 'DELETE' })
		goto('/chat')
	}
	async function deleteChannel(): Promise<void> {
		await fetch(`/api/channel/${id_room}`, { method: 'DELETE' })
		goto('/chat')
	}

	async function removeAdminAccess(): Promise<void> {
		await fetch(`/api/channel/${id_room}/removeMeAdmin`, { method: 'DELETE' })
		settings.close();
	}

	async function addAdmin(id: number): Promise<void> {
		await postjson(`/api/channel/${id_room}/addAdmin`, {id_user: id})
	}

	async function removeAdmin(id: number): Promise<void> {
		await fetch(`/api/channel/${id_room}/removeAdmin`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ id_user: id })
		})
	}

	async function expulseUser(id: number): Promise<void> {
		await fetch(`/api/channel/${id_room}/removeAccess`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ id_user: id })
		})
	}

	let dateBan;

	async function banUser(id: number, date: string = null): Promise<void> {
		/*
			if date et inferieu a date courant et que elle et pas null
			ne rien faire
		*/
		await postjson(`/api/channel/${id_room}/ban`, {id_user: id, date})
	}

	async function unbanUser(id: number): Promise<void> {
		await fetch(`/api/channel/${id_room}/unban`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ id_user: id })
		})
	}

	async function blockUser(id: number): Promise<void> {
		await postjson(`/api/block`, {blocked: true, blockedId: id})
	}

	async function unblockUser(id: number): Promise<void> {
		await postjson(`/api/block`, {blocked: false, blockedId: id})
	}

	async function addFriend(id: number): Promise<void> {
		await postjson(`/api/friend`, {friend: id})
	}

	async function removeFriend(id: number): Promise<void> {
		await fetch(`/api/friend`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ friend: id })
		})
	}

	function isBlocked(user: any, blockedId: number): boolean {
		const blockedUser: any[] = user.blockList;
		for (let i = 0; i < blockedUser.length; i++)
		{
			if (blockedUser[i].blockedId == blockedId)
				return true;
		}
		return false;
	}

	function isFriend(user: any, friendId: number): boolean {
		const friendUser: any[] = user.friends;
		for (let i = 0; i < friendUser.length; i++)
		{
			if (friendUser[i].friend.id == friendId)
				return true;
		}
		return false;
	}

	async function getUserBan(): Promise<any> {
		return await getjson(`/api/channel/${id_room}/usersBan`);
	}

	async function getAdmin(): Promise<any> {
		return await getjson(`/api/channel/${id_room}/usersAdmin`);
	}

	async function getBanAdmin(): Promise<any[]> {
		return [await getUserBan(), await getAdmin()];
	}

	function isBan(banList: any[], banId: number): boolean {
		if (banList === undefined)
			return false;
		for (let i = 0; i < banList.length; i++) {
			if (banList[i].id == banId)
				return true;
		}
		return false;
	}

	function isAdminList(adminList: any[], adminId: number) {
		if (adminList === undefined)
			return false;
		for (let i = 0; i < adminList.length; i++) {
			if (adminList[i].id == adminId)
				return true;
		}
		return false;
	}
</script>

<style>
	.container {
		flex: 1;
		overflow-y: auto;
	}

	form {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	form > input {
		flex: 1;
		max-width: none;
	}

	.is-typing {
		margin: 3px 0 0 7px;
		height: 1.3em;
		font-size: .75rem;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
</style>

<Head title="Chat" />

<svelte:window on:wsmsg={e => {
	const { channel, data } = e.detail;
	if (data.room !== id_room)
		return ;
	channel === 'chat' && addMessage(data);
	if (channel === 'typing')
	{
		userInfo.set(data.user.id, data.user)
		userInfo = userInfo
		if (data.isTyping == false)
			userTyping.delete(data.user.id)
		else
			userTyping.add(data.user.id)
		userTyping = userTyping
	}
}}/>

<Layout>
	<div class="flex-between">
		<IconButton on:click={() => goto('/chat')}>
			<svg height="35" width="35" viewBox="0 0 48 48"><path fill="currentColor" d="M24 40 8 24 24 8 26.1 10.1 13.7 22.5H40V25.5H13.7L26.1 37.9Z"/></svg>
		</IconButton>
		{#await infoChannel()}
			<span class="dim">...</span>
		{:then res}
			{#if !(res.name === "Private Message" && res.private === true)}
				<IconButton alt="Settings" on:click={() => settings.open()}>
					<svg height="35" width="35" viewBox="0 0 48 48"><path fill="currentColor" d="M19.4 44 18.4 37.7Q17.45 37.35 16.4 36.75Q15.35 36.15 14.55 35.5L8.65 38.2L4 30L9.4 26.05Q9.3 25.6 9.275 25.025Q9.25 24.45 9.25 24Q9.25 23.55 9.275 22.975Q9.3 22.4 9.4 21.95L4 18L8.65 9.8L14.55 12.5Q15.35 11.85 16.4 11.25Q17.45 10.65 18.4 10.35L19.4 4H28.6L29.6 10.3Q30.55 10.65 31.625 11.225Q32.7 11.8 33.45 12.5L39.35 9.8L44 18L38.6 21.85Q38.7 22.35 38.725 22.925Q38.75 23.5 38.75 24Q38.75 24.5 38.725 25.05Q38.7 25.6 38.6 26.1L44 30L39.35 38.2L33.45 35.5Q32.65 36.15 31.625 36.775Q30.6 37.4 29.6 37.7L28.6 44ZM24 30.5Q26.7 30.5 28.6 28.6Q30.5 26.7 30.5 24Q30.5 21.3 28.6 19.4Q26.7 17.5 24 17.5Q21.3 17.5 19.4 19.4Q17.5 21.3 17.5 24Q17.5 26.7 19.4 28.6Q21.3 30.5 24 30.5ZM24 27.5Q22.55 27.5 21.525 26.475Q20.5 25.45 20.5 24Q20.5 22.55 21.525 21.525Q22.55 20.5 24 20.5Q25.45 20.5 26.475 21.525Q27.5 22.55 27.5 24Q27.5 25.45 26.475 26.475Q25.45 27.5 24 27.5ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24ZM21.8 41H26.2L26.9 35.4Q28.55 35 30.025 34.15Q31.5 33.3 32.7 32.1L38 34.4L40 30.8L35.3 27.35Q35.5 26.5 35.625 25.675Q35.75 24.85 35.75 24Q35.75 23.15 35.65 22.325Q35.55 21.5 35.3 20.65L40 17.2L38 13.6L32.7 15.9Q31.55 14.6 30.1 13.725Q28.65 12.85 26.9 12.6L26.2 7H21.8L21.1 12.6Q19.4 12.95 17.925 13.8Q16.45 14.65 15.3 15.9L10 13.6L8 17.2L12.7 20.65Q12.5 21.5 12.375 22.325Q12.25 23.15 12.25 24Q12.25 24.85 12.375 25.675Q12.5 26.5 12.7 27.35L8 30.8L10 34.4L15.3 32.1Q16.5 33.3 17.975 34.15Q19.45 35 21.1 35.4Z"/></svg>
				</IconButton>
			{/if}
		{/await}
	</div>
	<div class="vflex container" bind:this={container}>
		{#each messages as msg}
			<Message user={userInfo.get(msg.userId)} message={msg.msg} blocked={$user.blockList.find(({ blockedId }) => blockedId === msg.userId)}/>
		{/each}
	</div>
	<form on:submit={async e => {
		e.preventDefault()
		msg.value = msg.value.trim();
		if (!msg.value) return;
		send('chat', { room: id_room, msg: msg.value });
		msg.value = ''
		updateTyping(false)
	}}>
		<input on:keydown={isTyping} type="text" bind:this={msg} placeholder="Write a message">
		<IconButton>
			<svg height="35" width="35" viewBox="0 0 24 24" fill="var(--primary)"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>
		</IconButton>
	</form>
	<p class="is-typing dim">
		{#if userTyping.size}
			{[...userTyping.keys()].map(id => userInfo.get(id).nickname ?? userInfo.get(id).fullname.split(' ')[0]).join(', ')} {userTyping.size > 1 ? 'are' : 'is'} typing...	
		{/if}
	</p>
</Layout>

<Modal bind:this={settings}>
	<h2>Settings</h2>
	{#await infoChannel()}
		<p class="dim">loading...</p>
	{:then channel}
		{#if isOwner($user)}
			<label>Name<input type="text" bind:value={name} placeholder="Name"/></label>
			<label>Description<input type="text" bind:value={desc} placeholder="Description"/></label>
			<Toggle desc="Private" bind:checked={isPrivate}/>
			<div class="vflex">
				<Toggle desc="Password" bind:checked={hasPassword}/>
				{#if hasPassword}<input type="password" bind:value={password} placeholder="Password"/>{/if}
			</div>
			<Button primary on:click={() => {
				saveSettingOwner(channel)
				settings.close()
			}}>Save</Button>
			<Button on:click={() => settingsAdmin.open()}>Admin settings</Button>
		{/if}

		{#await getjson(`/api/channel/${id_room}/users`)}
			Loading users
		{:then users}
			{#if users.length > 1}
				{#await getBanAdmin()}
					loading...
				{:then [ banList, adminList ]}
					{#each users as usr}
						{#if usr.id != $user.id}
							<div class="flex-between">
								<p>{usr.fullname}</p>
								{#if isAdmin($user) || isOwner($user)}
									{#if isBan(banList, usr.id)}
										<Button on:click={() => unbanUser(usr.id)}>Unban</Button>
									{:else}
										{#if !isAdminList(adminList, usr.id)
										|| (isAdminList(adminList, usr.id) && isOwner($user))}
											<input type="datetime-local" bind:value={dateBan}>
											<Button on:click={() => banUser(usr.id)}>Ban forever</Button>
											<Button on:click={() => banUser(usr.id, dateBan)}>Ban duration</Button>
											<Button on:click={() => expulseUser(usr.id)}>Expulser</Button>
										{/if}
									{/if}
								{/if}
								{#if isBlocked($user, usr.id)}
									<Button on:click={() => unblockUser(usr.id)}>Unblock</Button>
								{:else}
									<Button on:click={() => blockUser(usr.id)}>Block</Button>
								{/if}
								{#if isFriend($user, usr.id)}
									<Button on:click={() => removeFriend(usr.id)}>Unfollow</Button>
								{:else}
									<Button on:click={() => addFriend(usr.id)}>Follow</Button>
								{/if}
							</div>
						{/if}
					{/each}
				{/await}
			{:else}
				<p class="dim">No user found in this channel</p>
			{/if}
		{/await}

		{#if isOwner($user)}
			<Button danger on:click="{() => deleteConfirmation.open()}">Delete channel</Button>
		{/if}
		{#if isAdmin($user) && !isOwner($user)}
			<p class="dim">You must remove your admin access to leave channel</p>
			<Button danger on:click="{removeAdminAccess}">Remove my access administrator</Button>
		{/if}
		{#if !isAdmin($user) && !isOwner($user)}
			<p class="dim">Your messages will not be deleted</p>
			<Button danger on:click="{leaveConfirmation.open()}">Leave channel</Button>
		{/if}
	{/await}
</Modal>

<Modal bind:this={deleteConfirmation}>
	{#await infoChannel()}
		<p class="dim">loading...</p>
	{:then channel}
		<h2>Delete channel</h2>
		<p class="dim">
			Are you sure you want to delete <b>{channel.name}</b> chat ?
		</p>
		<div class="vflex">
			<Button on:click={() => deleteConfirmation.close()}>Cancel</Button>
			<Button danger on:click={deleteChannel}>Delete</Button>
		</div>
	{/await}
</Modal>

<!-- Reload this modal after click button -->
<Modal bind:this={settingsAdmin}>
	<h2>Administrator Settings</h2>

	<h3>Actual administrator</h3>
	{#await getjson(`/api/channel/${id_room}/usersAdmin`)}
		<p class="dim">Loading administrator</p>
	{:then admins}
		{#if admins.length}
			<div class="vflex">
				{#each admins as admin}
					<div class="flex-between">
						<p>{admin.fullname}</p>
						<Button on:click={() => removeAdmin(admin.id)}>Remove admin</Button>
					</div>
				{/each}
			</div>
		{:else}
			<p class="dim">No Admin in this chat</p>
		{/if}
	{/await}

	<h3>Other users</h3>
	{#await getjson(`/api/channel/${id_room}/usersAccess`)}
		<p class="dim">Loading Others users</p>
	{:then UsersAccess}
		{#if UsersAccess.length}
			<div class="vflex">
				{#each UsersAccess as usr}
					<div class="flex-between">
						<p>{usr.fullname}</p>
						<Button on:click={() => addAdmin(usr.id)}>Add admin</Button>
					</div>
				{/each}
			</div>
		{:else}
			<p class="dim">No users</p>
		{/if}
	{/await}

	<Button on:click={settingsAdmin.close()}>Close</Button>
</Modal>

<Modal bind:this={leaveConfirmation}>
	{#await infoChannel()}
		<p class="dim">loading...</p>
	{:then channel}
		<h2>Leave channel</h2>
		<p class="dim">
			Are you sure you want to leave <b>{channel.name}</b> chat ?
		</p>
		<div class="vflex">
			<Button on:click={() => leaveConfirmation.close()}>Cancel</Button>
			<Button danger on:click={leaveChannel}>Leave</Button>
		</div>
	{/await}
</Modal>

<Modal bind:this={askPassword} on:close={(e) => {
	console.log('test', e)
}}>
	<h2>This channel require a password</h2>
	<form on:submit={async e => {
		e.preventDefault()
		if (await loadChat(askPasswordField.value)) {
			askPassword.close()
			msg.focus()
			fetchUser()
		}
	}}>
		<input type="password" placeholder="Password" bind:this={askPasswordField} >
		<div class="vflex" style="width: 100%">
			<Button on:click={e => {
				e.preventDefault()
				goto('/chat')
			}}>Cancel</Button>
			<Button primary>Enter</Button>
		</div>
	</form>
</Modal>
