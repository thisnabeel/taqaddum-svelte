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

	async function fetchUser() {
		const res = await API.get('/open_slots?user_id=' + $user.id);
		console.log({ res });
		list = res;
		mentor = res.mentor;
	}
</script>

{#if mentor}
	<!-- 🔹 Mentor Profile Spotlight Section -->
	<Header {mentor}></Header>
{/if}

<!-- 🔹 Available Slots Section -->
<Slots potentialMeetups={list.potential_meetups}></Slots>

<style>
</style>
