import { user } from '@lib/store'

export const getCookiesFromString = s => s && Object.fromEntries(s.split?.(';').map(v => v.split('=')))

export const getCookies = () => getCookiesFromString(document.cookie)

export const getCookieFromString = (s, key) => {
	let value = getCookiesFromString(s)?.[key]
	return (value && decodeURIComponent(value.split('.').slice(0, -1).join('.')))
}

export const getCookie = key => getCookieFromString(document.cookie, key)

export const updateUser = () => {
	let cookie = getCookie('user')
	user.set(cookie ? JSON.parse(cookie) : undefined)
}

export const logIn = () => {
	window
		.open(`https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=${encodeURIComponent(location.origin)}%2Fapi%2Fauth&response_type=code`, 'Auth 42', 'width=500,height=700')
		.onunload = () => setTimeout(updateUser, 100)
}
export const logOut = () => {
	user.set(undefined)
	document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:01 GMT`
}

if (typeof document !== 'undefined')
	updateUser()