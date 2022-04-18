import { user, twoauth, waitingLogin, status } from '@lib/store'
import { get } from 'svelte/store'
import { goto } from '@sapper/app'

export const getCookiesFromString = s => s && Object.fromEntries(s.split?.('; ').map(v => v.split('=')))

export const getCookies = () => getCookiesFromString(document.cookie)

export const getCookieFromString = (s, key) => {
	let value = getCookiesFromString(s)?.[key]
	return (value && decodeURIComponent(value.split('.').slice(0, -1).join('.')))
}

export const getCookie = key => getCookieFromString(document.cookie, key)

export const removeCookie = key => (document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`)

export const clearCookies = () => {
	for (let key in getCookies())
		removeCookie(key)
}

const setUser = (newUser) => {
	if (JSON.stringify(get(user)) !== JSON.stringify(newUser))
		user.set(newUser)
}

export const logIn = () => {
	waitingLogin.set(true)
	setUser(undefined)
	clearCookies()
	let win = window
		.open(`https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=${encodeURIComponent(location.origin)}%2Fapi%2Fauth&response_type=code`, 'Auth 42', 'width=500,height=700')
	let polling = async () => {
		if (!win.closed) return requestAnimationFrame(polling)

		if (getCookie('user') === '')
			get(twoauth).open()
		else
		{
			await fetchUser()
			if (getCookie('first_conn'))
				goto('/user')
			removeCookie('first_conn')
		}
		waitingLogin.set(false)
	}
	polling()
}
export const logOut = () => {
	setUser(undefined)
	localStorage.removeItem('user')
	clearCookies()
}

export const resolve = async (promise) => new Promise<any[]>(resolve =>
		promise
			.then(res => resolve([res, null]))
			.catch(err => resolve([null, err]))
	)

export const fetchUser = async () => {
	let noLogged = () => {
		setUser(undefined)
		if (typeof document !== 'undefined')
			localStorage.removeItem('user')
	}

	const [res, ferr] = await resolve(fetch(`/api/user`))
	if (ferr || !res.ok) return noLogged()
	const [json, jerr] = await resolve(res.json())
	if (jerr) return noLogged()
	setUser(json)
	if (typeof document !== 'undefined')
		localStorage.setItem('user', JSON.stringify(json))
}

export const localStorageUser = () => {
	if (localStorage.getItem('user'))
		setUser(JSON.parse(localStorage.getItem('user')))
	else
		setUser(undefined)
}

export const removeFriend = async (friend) => {
	await fetch('/api/friend', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ friend })
	})
	fetchUser()
}

export const addFriend = async (friend) => {
	await fetch('/api/friend', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ friend })
	})
	fetchUser()
}

let sock
let userId

export const send = async (channel, data: any = '') => {
	if (!sock) return ;
	(await sock)?.send?.(`${channel}:${JSON.stringify(data)}`)
}

export const addStatusListener = (userId) => {
	if (get(status)[userId] === undefined) {
		status.set({ ...get(status),  userId: 'offline' })
		send('addStatusListener', userId)
	}
}

if (typeof document !== 'undefined')
{
	if (getCookie('user'))
	{
		localStorage.getItem('user') && localStorageUser()
		fetchUser()
	}
	else
	{
		setUser(undefined)
		localStorage.removeItem('user')
	}

	window.onunload = () => send('disconnect')
	window.onstorage = localStorageUser
	user.subscribe(async data => {
		if (userId === data?.id) return ;
		(await sock)?.close?.()
		userId = data?.id
		if (!data)
			return (sock = undefined)
		let ws = new WebSocket(`ws://${location.host}:3001`)
		sock = new Promise(resolve => (ws.onopen = _ => resolve(ws)))
		ws.onmessage = ({ data: msg }) => {
			let idx = msg.indexOf(':')
			if (idx === -1) return ;
		
			const channel = msg.slice(0, idx)
			const data = JSON.parse(msg.slice(idx + 1))

			if (channel === 'matchfound')
				return (goto(`/play/match/${data.id}`))
			if (channel === 'userstatus')
			{
				let updateStatus = get(status)
				updateStatus[data[0]] = data[1]
				status.set(updateStatus)
				return ;
			}


			window.dispatchEvent(new CustomEvent('wsmsg', {
				detail: {
					channel,
					data
				}
			}))
		}
	})
}
