import { user } from './store'

export const getCookies = () => 
	Object.fromEntries(document.cookie.split(';').map(s => s.split('=')))

export const getCookie = key => {
	let value = getCookies()[key]
	return (value && decodeURIComponent(value))
}

export const setCookie = (key, value) =>
{
	if (getCookie(key) === value) return ;
	if (value === undefined) document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`
	else document.cookie = `${key}=${value ? encodeURIComponent(value) : ''};`
}

export const updateUser = () => {
	let cookie = getCookie('user')
	user.set(cookie ? JSON.parse(cookie) : undefined)
}

export const logIn = () => {
	window
		.open('https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth&response_type=code', 'Auth 42', 'width=500,height=700')
		.onunload = updateUser
}
export const logOut = () => {
	user.set(undefined)
}

if (typeof document !== 'undefined')
{
	updateUser()
	user.subscribe(value => setCookie('user', value ? JSON.stringify(value) : undefined))
}