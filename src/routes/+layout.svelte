<script>
	import '../app.css';
	import { Modals } from 'svelte-modals';

	import Navbar from '$lib/components/Navbar/Index.svelte';
	import { modals } from 'svelte-modals';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';

	let show = false;

	onMount(() => {
		show = true; // Ensures it starts closed
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	/>

	<script src="https://kit.fontawesome.com/94a3ae6c52.js"></script>

	<!-- Favicon -->
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<main>
	<Navbar />

	<div class="wrapper" class:sticky-under={!$user}>
		<slot />
	</div>
</main>

{#if show}
	<Modals>
		<div slot="backdrop" class="backdrop" transition:fade on:click={() => modals.close()} />
	</Modals>
{/if}

<style>
	.wrapper {
		padding: 1em 0;
	}
</style>
