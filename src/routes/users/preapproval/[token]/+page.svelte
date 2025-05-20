<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import FinishRegistration from '$lib/components/PreApprovals/FinishRegistration.svelte';
	import API from '$lib/api/api';

	let token = $page.params.token;
	let lead = null;
	let skills = [];

	onMount(async () => {
		// Fetch lead details using the token
		try {
			lead = await API.get(`/users/leads/${token}`);
			skills = lead?.mentorships?.map((item) => item.skill?.title) || [];
		} catch (error) {
			console.error('Error fetching lead details:', error);
		}
	});
</script>

{#if lead}
	<FinishRegistration {lead} {token}></FinishRegistration>
{/if}
