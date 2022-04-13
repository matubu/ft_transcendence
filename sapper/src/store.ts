import { onMount } from 'svelte'
import { writable, readable } from 'svelte/store'

export let user = writable(undefined)
export let waitingLogin = writable(false)
export let twoauth = writable(undefined)

export const useMediaQuery = query =>
	readable(null, (set) => {
		let match
		const change = e => set(e.matches)
		onMount(() => {
			const match = window.matchMedia(query)
			set(match.matches)
			match.addEventListener("change", change)
		})
		return () => { match?.removeEventListener?.("change", change) }
	})