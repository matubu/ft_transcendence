import { user } from './store'

export const getCookies = () => 
	Object.fromEntries(document.cookie.split(';').map(s => s.split('=')))

export const getCookie = key => {
	let value = getCookies()[key]
	return (value && decodeURIComponent(value.split('.').slice(0, -1).join('.')))
}

export const updateUser = () => {
	let cookie = getCookie('user')
	user.set(cookie ? JSON.parse(cookie) : undefined)
}

export const logIn = () => {
	window
		.open('https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=http%3A%2F%2Flocalhost%2Fapi%2Fauth&response_type=code', 'Auth 42', 'width=500,height=700')
		.onunload = () => setTimeout(updateUser, 1000)
}
export const logOut = () => {
	user.set(undefined)
	document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:01 GMT`
}

if (typeof document !== 'undefined')
	updateUser()