import { writable, readable } from 'svelte/store'

export let user = writable(undefined)
export let twoauth = writable(undefined)

export const useMediaQuery = query =>
	readable(null, (set) => {
		const match = window.matchMedia(query)
		set(match.matches)
		const change = e => set(e.matches)
		match.addEventListener("change", change)
		return () => { match.removeEventListener("change", change) }
	})