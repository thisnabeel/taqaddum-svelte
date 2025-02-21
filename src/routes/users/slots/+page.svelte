<script>
	import API from '$lib/api/api';
	import Header from '$lib/components/Mentor/Header.svelte';
	import Slots from '$lib/components/Mentorships/Slots.svelte';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';

	onMount(() => {
		fetchUser();
	});

	let list = {};
	let mentor;
	let loadingMeetups = true;
	let mentorships = [];

	async function fetchUser() {
		const res = await API.get('/open_slots?user_id=' + $user.id);
		console.log({ res });
		list.potential_meetups = res.slots;
		mentor = res.user;
		loadingMeetups = false;
	}

	$: fetchMentorships(mentor);

	async function fetchMentorships(mentor) {
		if (!mentor) return;
		try {
			const endpoint = mentor.id ? `/mentorships?user_id=${mentor.id}` : '/mentorships';
			mentorships = await API.get(endpoint);

			// user.set({ ...user, mentorships: response });
			// mentorSkills = response || [];
		} catch (error) {
			console.error('Error fetching mentorships:', error);
		}
	}
</script>

{#if mentor}
	<!-- 🔹 Mentor Profile Spotlight Section -->
	<Header {mentor} {mentorships}></Header>
{/if}

<!-- 🔹 Available Slots Section -->
{#if loadingMeetups}
	<div class="mentor-card">
		<div class="mentor-profile">
			<h1><img src="/spinner.svg" alt="" /> Loading Available Slots...</h1>
		</div>
	</div>
{:else}
	<Slots meetups={list.potential_meetups} {mentorships} slotsAdmin={true}></Slots>
{/if}

<style>
	.mentor-profile {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 40px 20px;
		background: linear-gradient(135deg, #007bff, #6610f2);
		color: white;
		border-radius: 12px;
		margin-bottom: 20px;
		width: 100%;
	}

	.mentor-card {
		display: flex;
		align-items: center;
		gap: 20px;
		width: 100%;
	}
</style>
