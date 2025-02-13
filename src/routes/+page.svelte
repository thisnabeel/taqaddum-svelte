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
		justify-content: center;
		gap: 20px;
		padding: 20px;
	}

	@media (max-width: 768px) {
		.mentors .list {
			display: flex;
			/* justify-content: center; */
			gap: 20px;
			padding: 20px;
			overflow-y: scroll;
			width: 100%;
		}
	}
</style>
