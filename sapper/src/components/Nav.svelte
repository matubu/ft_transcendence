<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let vertical: boolean = false
	export let segment: string
</script>

<style>
	ul {
		padding: 0;
		display: flex;
	}
	li {
		display: block;
	}

	a {
		display: block;
		color: var(--grey);
		text-decoration: none;
		font-size: 20px;
		transition: .2s;
	}
	
	a:hover { color: var(--whit) }

	a:before {
		content: '';
		width: calc(1em);
		height: 2px;
		display: block;
		margin: 0 auto 3px auto;
	}
	[aria-current] { color: var(--whit) }
	[aria-current]:before { background: var(--whit) }
	:not(.vertical) > ul {
		gap: 15px;
	}
	.vertical a:before {
		display: none;
	}
	.vertical {
		flex-direction: column;
	}
	.vertical a {
		padding: 1rem .25rem;
	}
</style>

<nav>
	<ul class="{vertical !== false && 'vertical'}">
		<li><a on:mouseup={e => dispatch('mouseup', e)} rel=prefetch aria-current="{segment == 'play' ? 'page' : undefined}" href="/play">Play</a></li>
		<li><a on:mouseup={e => dispatch('mouseup', e)} rel=prefetch aria-current="{segment == 'chat' ? 'page' : undefined}" href="/chat">Chat</a></li>
		<li><a on:mouseup={e => dispatch('mouseup', e)} rel=prefetch aria-current="{segment == 'watch' ? 'page' : undefined}" href="/watch">Watch</a></li>
	</ul>
</nav>