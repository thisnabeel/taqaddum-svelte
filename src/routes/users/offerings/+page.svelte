<script>
	import API from '$lib/api/api';
	import { onMount } from 'svelte';
	import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { user } from '$lib/stores/user';
	import Offering from '$lib/components/Mentorships/Offerings/Offering.svelte';
	import uuid from '$lib/components/functions/uuid';
	import Comic from '$lib/components/Buttons/comic.svelte';
	import MeetingSlotsGuide from '$lib/components/Guide/MeetingSlots.svelte';

	onMount(() => {
		fetchSlots();
	});

	let loading = true;
	let meetingOfferings = [];
	let formData = {
		title: '',
		mentorship_id: null,
		description: '',
		duration: 30,
		position: null,
		max_attendees: 6,
		min_attendees: 1
	};
	let editingId = null;
	let durations = [30, 60, 90, 120]; // Allowed durations

	let current_user = { id: null };
	let mentorships = [];

	let slots = [];

	async function fetchSlots() {
		slots = await API.get('/slots?user_id=' + $user.id);
	}
	user.subscribe((p) => {
		if (!p) return;
		current_user = p;
		fetchMeetingOfferings();
		fetchMentorships();
		fetchSlots();
	});

	async function fetchMentorships() {
		try {
			const endpoint = current_user.id ? `/mentorships?user_id=${current_user.id}` : '/mentorships';
			const response = await API.get(endpoint);
			mentorships = response || [];
		} catch (error) {
			console.error('Error fetching mentorships:', error);
		}
	}

	async function fetchMeetingOfferings() {
		try {
			const endpoint = current_user.id
				? `/meeting_offerings?user_id=${current_user.id}`
				: '/meeting_offerings';
			const response = await API.get(endpoint);
			meetingOfferings = response || [];
			loading = false;
		} catch (error) {
			console.error('Error fetching meeting offerings:', error);
			loading = false;
		}
	}

	async function saveMeetingOffering() {
		try {
			let response;
			if (editingId) {
				response = await API.put(`/meeting_offerings/${editingId}`, { meeting_offering: formData });
			} else {
				response = await API.post('/meeting_offerings', { meeting_offering: formData });
			}

			if (response) {
				fetchMeetingOfferings();
				resetForm();
			}
		} catch (error) {
			console.error('Error saving meeting offering:', error);
		}
	}

	function editMeetingOffering(offering) {
		formData = { ...offering };
		editingId = offering.id;
	}

	function removeOffering(id, type) {
		console.log({ meetingOfferings });
		console.log(id, type);
		if (type === 'code') {
			meetingOfferings = meetingOfferings.filter((m) => m.uuid !== id);
		} else if (type === 'id') {
			meetingOfferings = meetingOfferings.filter((m) => m.id !== id);
		}
	}

	function resetForm() {
		formData = {
			title: '',
			mentorship_id: null,
			description: '',
			duration: 30,
			position: null,
			max_attendees: 6,
			min_attendees: 1
		};
		editingId = null;
	}
</script>

<div class="container">
	<MeetingSlotsGuide></MeetingSlotsGuide>
	<h2>Meeting Offerings:</h2>

	{#if loading}
		<div><img src="/spinner.svg" alt="" /> Loading...</div>
	{:else}
		<!-- List of Meeting Offerings -->

		<p>Click a skill to add a mentor offering...</p>
		<ul class="clean-list mentorships">
			{#each mentorships as m}
				<li
					on:click={() => {
						meetingOfferings = [
							{
								id: -1,
								mentorship_id: m.id,
								title: 'Edit Title...',
								description: 'Edit Description..',
								duration: 30,
								uuid: uuid(meetingOfferings.map((m) => m.uuid))
							},
							...meetingOfferings
						];
						console.log({ meetingOfferings });
					}}
				>
					<Comic>+ {m.skill.title}</Comic>
				</li>
			{/each}
		</ul>
		<br /><br />
		<ul class="offerings">
			{#each meetingOfferings as offering}
				<Offering
					editing={offering.id < 0}
					{slots}
					{offering}
					{mentorships}
					{removeOffering}
					readOnly={false}
				></Offering>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.mentorships > li {
		display: inline-block;
		margin-right: 10px;
	}
	.container {
		max-width: 600px;
		margin: auto;
		padding: 20px;
		border-radius: 8px;

		background: white;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 20px;
		padding: 15px;
		border: 1px solid #ddd;
		border-radius: 6px;
		background: #f9f9f9;
	}

	input,
	textarea,
	select {
		width: 100%;
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #ccc;
		font-size: 14px;
	}

	textarea {
		min-height: 80px;
	}

	button {
		padding: 10px;
		background: #007bff;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 4px;
	}

	.cancel {
		background: #dc3545;
	}

	.offerings {
		list-style: none;
		padding: 0;
	}
</style>
