<script>
	import { onMount } from 'svelte';
	import TimezonePicker from '../Slots/TimezonePicker.svelte';
	import { DateTime } from 'luxon';
	import { user } from '$lib/stores/user';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';
	import API from '$lib/api/api';

	export let mentorships = [];
	export let slot;
	let formattedDate;
	let formattedStartTime;
	let formattedEndTime;
	let formattedTimezone;
	let editMode = false;

	$: console.log('mentees', slot);
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

	async function bookMeeting() {
		Swal.fire('Booking your spot...', 'Please hold');
		await API.post('/slot_bookings', {
			user_id: $user.id,
			slot_id: slot.id
		});
		Swal.close();
		Swal.fire('Done', 'Your spot has been booked', 'success');
	}

	async function saveChanges() {
		Swal.fire('Saving your meeting changes', 'Please hold...');

		await API.put(`/slots/${slot.id}`, {
			title: slot.title,
			description: slot.description
		});

		Swal.close();
		Swal.fire('Done', 'Your changes have been saved', 'success');
		editMode = false;
	}
</script>

<div class="editable-slot">
	{#if $user && $user.id === slot.user_id}
		<div class="lil-nav">
			<i class="fa fa-pen edit-slot" on:click={() => (editMode = !editMode)}></i>
			<i class="fa fa-trash remove-slot"></i>
		</div>
	{/if}
	<div class="flex">
		<div class="flex-70 flex-grow" style="padding-right: 10px">
			<h5>{slot.skill.title}</h5>

			{#if editMode}
				<input type="text" class="title-input" bind:value={slot.title} />
				<textarea name="" id="" class="description-input" bind:value={slot.description}></textarea>
				<button class="btn btn-outline-primary" on:click={() => saveChanges()}>Save Changes</button>
			{:else}
				<h4>{slot.title}</h4>
				<p>{slot.description}</p>
			{/if}
		</div>

		<div class="flex-30 flex-grow">
			<div class="block">
				<p style="margin-bottom: -2px">The Host:</p>
				<div class="d-flex gap-1 align-items-center flex-wrap">
					<div
						class="position-relative mentee-avatar-container host"
						title={`${slot.user.first_name} ${slot.user.last_name}`}
					>
						<div>
							<img
								src={slot.user.avatar_cropped_url}
								class="mentor-avatar"
								alt={`${slot.user.first_name} ${slot.user.last_name}`}
							/>
						</div>
						<div>
							<b>{slot.user.first_name} {slot.user.last_name}</b>
						</div>
					</div>
				</div>
			</div>
			{#if slot.mentees && slot.mentees.length > 0}
				<p style="margin-bottom: -2px">Attendees:</p>
				<div class="d-flex gap-1 align-items-center flex-wrap">
					{#each slot.mentees as mentee}
						<div
							class="position-relative mentee-avatar-container"
							title={`${mentee.first_name} ${mentee.last_name}`}
						>
							<img
								src={mentee.avatar_cropped_url}
								class="mentor-avatar"
								alt={`${mentee.first_name} ${mentee.last_name}`}
							/>
							<span class="mentee-info-tooltip">
								{mentee.first_name}
								{mentee.last_name}
								<br />
								{mentee.menteeships.find((m) => m.skill.id === slot.skill.id).profession ||
									'No Experience listed'}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

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
		{#if $user && $user.id === slot.user_id}
			<div
				class="btn btn-outline-primary flex-30 flex-grow create-btn"
				on:click={() => startChatRoom()}
			>
				Enter Meeting
			</div>
		{:else}
			<div
				class="btn btn-outline-primary flex-30 flex-grow create-btn"
				on:click={() => {
					if ($user) {
						bookMeeting();
					} else {
						Swal.fire("Not Signed In, 'Please Sign in to book your spot','error");
					}
				}}
			>
				{#if !$user}
					<i class="fa fa-lock"></i>{' '}
				{/if}
				Book Meeting
			</div>
		{/if}
	</small>
</div>

<style>
	/* Tooltip styling */
	.mentee-avatar-container {
		position: relative;
	}

	.mentee-info-tooltip {
		position: absolute;
		left: 50%;
		bottom: 100%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		white-space: nowrap;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s,
			visibility 0.2s;
		z-index: 100;
	}

	.mentee-avatar-container:hover .mentee-info-tooltip {
		opacity: 1;
		visibility: visible;
	}
	.mentor-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid white;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
	}

	.host {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: flex-start;
	}

	.session-card {
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 0.5rem;
		background-color: #fff;
	}

	/* Mobile-specific adjustments */
	@media (max-width: 380px) {
		.mentor-avatar {
			width: 40px;
			height: 40px;
			border-width: 2px;
		}
	}

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

	.title-input {
		border: 0;
		font-size: 24px !important;
		font-weight: 400;
		background: #f3f3f3;
		width: 100%;

		border-bottom: 1px dashed #cacaca !important;
	}

	.description-input {
		border: 0;
		font-size: 16px;
		font-weight: 400;
		background: #f3f3f3;
		width: 100%;
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

	.lil-nav {
		position: absolute;
		right: -50px;
		width: 34px;
	}
	.lil-nav > * {
		display: block;
		margin-bottom: 10px;
		color: #ccc;
	}

	.lil-nav > *:hover {
		color: #000;
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
