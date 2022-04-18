<style>
	@keyframes loading {
		0% { content:  '   ' }
		25% { content: '.  ' }
		50% { content: '.. ' }
		75% { content: '...' }
	}
	p:before {
		content: '   ';
		display: block;
		white-space: pre;
		height: 1.5em;
		font-size: 5rem;
		animation: loading .75s linear infinite;
		font-family: "Fira mono";
	}
</style>

<svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
	<ellipse cx="50" rx="15" ry="15" fill="#F1F1F1">
		<animate
			attributeName="cy"
			dur="700ms"
			values="85;53;85"
			repeatCount="indefinite"
			keySplines="1 1 1 1"
		/>
	</ellipse>
	<rect y="23" width="50" height="15" rx="5" fill="#F1F1F1">
		<animate
			attributeName="x"
			dur="1000ms"
			values="20;30;20"
			repeatCount="indefinite"
			keySplines="1 1 1 1"
		/>
	</rect>
</svg>
<p class="dim" />