<script>
	async function f() { let rest = await fetch("http://localhost:3000/", {method: 'GET', credentials: "include"})
	console.log(await rest.text());
	}
	f();

</script>

<a href="https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code">connect</a>