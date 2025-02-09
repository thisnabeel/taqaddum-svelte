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

	let loading = true;

	onMount(() => {
		fetchUser();
	});

	async function fetchUser() {
		const res = await API.get('/open_slots?user_id=' + page.params.id);
		console.log({ res });
		list = res;
		mentor = res.mentor;
		loadingMeetups = false;
	}
</script>

{#if mentor}
	<!-- 🔹 Mentor Profile Spotlight Section -->
	<Header {mentor}></Header>
{/if}

{#if loadingMeetups}
	<div class="mentor-card">
		<div class="mentor-profile">
			<h1><img src="/spinner.svg" alt="" /> Loading Available Slots...</h1>
		</div>
	</div>
{:else}
	<Slots potentialMeetups={list.potential_meetups}></Slots>
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
