<script>
	import { onMount } from 'svelte';
	import TimezonePicker from '../Slots/TimezonePicker.svelte';
	import { DateTime } from 'luxon';
	import { user } from '$lib/stores/user';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';

	export let mentorships = [];
	export let slot;
	let formattedDate;
	let formattedStartTime;
	let formattedEndTime;
	let formattedTimezone;

	const timeZoneMap = {
		'America/Los_Angeles': 'PST',
		'America/Denver': 'MST',
		'America/Chicago': 'CST',
		'America/New_York': 'EST',
		UTC: 'UTC'
	};

	onMount(() => {
		const st = DateTime.fromISO(slot.start_time, { zone: 'utc' }).setZone(slot.timezone);
		const et = DateTime.fromISO(slot.end_time, { zone: 'utc' }).setZone(slot.timezone);
		formattedDate = st.toFormat('MMM d');
		formattedStartTime = st.toFormat('h:mm a');
		formattedEndTime = et.toFormat('h:mm a');
		const tz = DateTime.now().setZone(slot.timezone);
		formattedTimezone = tz.toFormat('z');
	});

	async function startChatRoom() {
		if (!$user) {
			Swal.fire('You must Sign In to book a meeting');
			return;
		}
		const code = await generateChatRoomId();
		goto('/video/' + code + '/2');
	}

	async function generateChatRoomId() {
		// Extract relevant fields
		const keyData = JSON.stringify({
			title: slot.title.trim().toLowerCase(),
			date: slot.start_time,
			start_time: slot.start_time,
			mentor_id: slot.user_id,
			skill_id: slot.skill.id
		});

		// Encode data as Uint8Array
		const encoder = new TextEncoder();
		const data = encoder.encode(keyData);

		// Hash using SHA-256
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));

		// Convert to hex and return first 10 chars for uniqueness
		return hashArray
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('')
			.slice(0, 10);
	}
</script>

<div class="editable-slot">
	<h5>{slot.skill.title}</h5>

	<h4>{slot.title}</h4>
	<p>{slot.description}</p>

	<div style="position:relative; display: inline-block;">
		<!-- <TimezonePsicker {slot}></TimezonePicker> -->
	</div>

	<small class="flex time-selector" style="align-items: baseline;">
		<div class="flex-70 flex-grow">
			<b class="time">
				<div class="ib">
					{formattedDate}
				</div>
				@
				<div class="range ib">
					<div class="ib">{formattedStartTime}</div>
					-
					<div class="ib">
						{formattedEndTime}
						{timeZoneMap[slot.timezone]}
					</div>
				</div>
			</b>
		</div>
		<div
			class="btn btn-outline-primary flex-30 flex-grow create-btn"
			on:click={() => startChatRoom()}
		>
			{#if $user && $user.id === slot.user_id}
				Enter Meeting
			{:else}
				Book Meeting
			{/if}
		</div>
	</small>
</div>

<style>
	.time {
		font-size: 24px;
	}
	.ib {
		position: relative;
		display: inline-block;
	}
	.skills {
		padding: 6px;
		display: inline-block;
		background-color: rgb(255, 255, 146);
		border-radius: 4px;
		margin-bottom: 10px;
		pointer-events: none;
	}
	.editable-slot {
		background: #fff;
		padding: 10px;
		border-radius: 6px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
		position: relative;
	}
	.title-input,
	.description-input {
		border: 0;
		font-size: 16px;
		background: #f3f3f3;
		width: 100%;
		padding: 5px;
	}

	h5 {
		padding: 6px;
		display: inline-block;
		background-color: rgb(255, 255, 146);
		border-radius: 4px;
	}

	@media (max-width: 740px) {
		.time .range.ib {
			display: block;
			font-size: 20px;
		}
	}
</style>
