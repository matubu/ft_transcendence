import { user } from './store'

let uuid = () => [...window.crypto.getRandomValues(new Uint16Array(32))].map(n => '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'[n & 0xff]).join('')

if (typeof localStorage !== 'undefined')
{
	user.set(localStorage.getItem('user') || undefined)
	user.subscribe(value => {
		if (value === undefined)
			localStorage.removeItem('user')
		else
			localStorage.setItem('user', value)
	})
}

export const getCookie = (key) =>
	decodeURIComponent(Object.fromEntries(document.cookie.split(';').map(s => s.split('=')))[key])

export const logIn = () => {
	window
		.open('https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth&response_type=code', 'Auth 42', 'width=500,height=700')
		.onunload = e => {
			console.log('closed', JSON.parse(getCookie('user')))
			//user.set(uuid())
		}
}
export const logOut = () => {
	user.set(undefined)
}