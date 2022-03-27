<script context="module" lang="ts">
	export const preload = () =>
		fetch(`blog.json`).then((res: { json: () => any; }) => res.json()).then((posts: { slug: string; title: string, html: any }[]) => ({ posts }))
</script>

<script lang="ts">
	import Layout from '@components/Layout.svelte'
	import Head from '../../components/Head.svelte'
	export let posts: { slug: string; title: string, html: any }[]
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>

<Head title="Blog" />

<Layout>
	<h1>Recent posts</h1>

	<ul>
		{#each posts as post}
			<li><a rel="prefetch" href="blog/{post.slug}">{post.title}</a></li>
		{/each}
	</ul>
</Layout>