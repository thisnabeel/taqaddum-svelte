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
