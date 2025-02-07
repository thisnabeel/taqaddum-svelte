<script>
	import '../app.css';
	import { Modals } from 'svelte-modals';

	import Navbar from '$lib/components/Navbar/Index.svelte';
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

	<div class="wrapper">
		<slot />
	</div>
</main>

<Modals>
	<div slot="backdrop" class="backdrop" transition:fade on:click={() => modals.close()} />
</Modals>

<style>
	.wrapper {
		padding: 1em 0;
	}
</style>
