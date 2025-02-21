<script>
	import { page } from '$app/state';
	import API from '$lib/api/api';
	import Header from '$lib/components/Mentor/Header.svelte';
	import Slots from '$lib/components/Mentorships/Slots.svelte';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';

	let list = {};
	let mentor = null;
	let loadingMeetups = true;
	let mentorships = [];

	let loading = true;

	onMount(() => {
		fetchUser();
	});

	async function fetchUser() {
		const res = await API.get('/open_slots?user_id=' + page.params.id);
		console.log({ res });
		// list = res;
		list.potential_meetups = res.slots;
		mentor = res.user;

		mentorships = Array.from(
			new Map(list.potential_meetups.map((m) => [m.skill.id, { skill: m.skill }])).values()
		);
		loadingMeetups = false;
	}
</script>

{#if mentor}
	<!-- 🔹 Mentor Profile Spotlight Section -->
	<Header {mentor} {mentorships}></Header>
{/if}

{#if loadingMeetups}
	<div class="mentor-card">
		<div class="mentor-profile">
			<h1><img src="/spinner.svg" alt="" /> Loading Available Slots...</h1>
		</div>
	</div>
{:else}
	<Slots meetups={list.potential_meetups.filter((s) => s.status !== 'denied')} slotsAdmin={false}
	></Slots>
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
