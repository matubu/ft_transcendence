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

<svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect x="0" height="50" width="15" rx="5" fill="#F1F1F1">
		<animate
			attributeName="y"
			dur="1000ms"
			values="35;15;35"
			repeatCount="indefinite"
			keySplines="1 1 1 1"
		/>
	</rect>
	<ellipse cy="50" rx="15" ry="15" fill="#F1F1F1">
		<animate
			attributeName="cx"
			dur="1000ms"
			values="30;70;30"
			repeatCount="indefinite"
			keySplines="1 1 1 1"
		/>
	</ellipse>
	<rect x="85" height="50" width="15" rx="5" fill="#F1F1F1">
		<animate
			attributeName="y"
			dur="1000ms"
			values="15;35;15"
			repeatCount="indefinite"
			keySplines="1 1 1 1"
		/>
	</rect>
</svg>
<p class="dim" />