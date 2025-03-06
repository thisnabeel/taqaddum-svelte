<script>
	import Hero from '$lib/components/Hero/Index.svelte';
	import MentorCard from '$lib/components/MentorCard/Index.svelte';
	import API from '$lib/api/api';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import MentorDashboard from '$lib/components/Mentor/Dashboard/Dashboard.svelte';
	import MenteeDashboard from '$lib/components/Mentee/Dashboard/Dashboard.svelte';
	import Fundraiser from '$lib/components/Fundraiser/Fundraiser.svelte';
	import Features from '$lib/components/Hero/Features.svelte';

	let mentors = [];

	onMount(() => {
		getMentors();
	});

	async function getMentors() {
		mentors = await API.get('/top_mentors');
	}
</script>

{#if $user && $user.type === 'Mentor'}
	<MentorDashboard></MentorDashboard>
{:else if $user && $user.type === 'Mentee'}
	<MenteeDashboard></MenteeDashboard>
{:else}
	<!-- Landing Page -->
	<!-- in desktop make heor and fundraiser side by side -->

	<Hero />

	<section class="mentors" id="scroll-learn-more">
		<h1 class="text-center">Vetted Mentors:</h1>
		<div class="list">
			{#each mentors as mentorship}
				<MentorCard mentor={mentorship.user} {mentorship} />
			{/each}
		</div>
	</section>

	<!-- Website Explanation and Features -->
	<Features></Features>
{/if}

<style>
	.mentors .list {
		display: flex;
		gap: 20px;
		padding: 20px;
		flex-wrap: nowrap;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		justify-content: center;
	}

	.mentors .list > * {
		flex: 0 0 300px;
		max-width: 300px;
		height: 400px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		scroll-snap-align: start;
	}

	@media (max-width: 768px) {
		.mentors .list {
			overflow-x: auto;
			white-space: nowrap;
			padding-bottom: 10px;
			justify-content: flex-start;
		}

		.mentors .list::-webkit-scrollbar {
			display: none;
		}
	}

	.landing-layout {
		width: 100%;
	}

	/* Stack them vertically on smaller screens */
	@media (max-width: 1024px) {
		/* .landing-layout {
			flex-direction: column;
			gap: 10px;
			padding: 20px;
		} */
	}
</style>
