<script>
	import Hero from '$lib/components/Hero/Index.svelte';
	import MentorCard from '$lib/components/MentorCard/Index.svelte';
	import API from '$lib/api/api';
	import { onMount } from 'svelte';

	let mentors = [];

	onMount(() => {
		getMentors();
	});

	async function getMentors() {
		mentors = await API.get('/top_mentors');
	}
</script>

<Hero />
<section class="mentors">
	<h1 class="text-center">Vetted Mentors:</h1>
	<div class="list">
		{#each mentors as mentorship}
			<MentorCard mentor={mentorship.user} {mentorship} />
		{/each}
	</div>
</section>

<style>
	.mentors .list {
		display: flex;

		gap: 20px;
		padding: 20px;
		flex-wrap: nowrap; /* Prevent wrapping */
		overflow-x: auto; /* Enable horizontal scrolling */
		scroll-snap-type: x mandatory; /* Smooth scrolling */
		justify-content: center;
	}

	.mentors .list > * {
		flex: 0 0 300px; /* Fixed width for each card */
		max-width: 300px;
		height: 400px; /* Equal height */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		scroll-snap-align: start;
	}

	@media (max-width: 768px) {
		.mentors .list {
			overflow-x: auto; /* Ensure horizontal scroll */
			white-space: nowrap; /* Prevent stacking */
			padding-bottom: 10px; /* Prevent scrollbar overlap */
			justify-content: flex-start; /* Align from left */
		}

		.mentors .list::-webkit-scrollbar {
			display: none; /* Hide scrollbar on Webkit browsers */
		}
	}
</style>
