<script>
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';
	import MeetingSlotsGuide from '../Guide/MeetingSlots.svelte';
	import Offering from './Offerings/Offering.svelte';
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';
	import NewSlot from './NewSlot.svelte';

	export let meetups = [];
	export let slotsAdmin = false;
	export let mentorName = '';
	export let mentorships = [];

	let showInterestForm = false;
	let interestText = '';

	async function submitInterest() {
		try {
			await API.post('/mentor-interest', {
				mentor_id: $user.id,
				interest_text: interestText
			});
			alert('Your interest has been submitted!');
			showInterestForm = false;
			interestText = '';
		} catch (error) {
			console.error('Error submitting interest:', error);
			alert('Failed to submit interest. Please try again.');
		}
	}

	let filters = {
		open: true,
		denied: false
	};

	$: filteredMeetups = meetups.filter((meetup) => filters[meetup.status]);

	let showAccordion = false;
	let newSlotDate = '';
	let newSlotTime = '';
	let newSlotTitle = '';
	let newSlotDescription = '';
	let newSlotDuration = 30;
	let newSlotMinAttendees = 2;
	let newSlotMaxAttendees = 4;
	let selectedOffering = null;

	let meetingOfferings = [];

	let calculatedEndTime = '';

	user.subscribe((u) => {
		fetchMeetingOfferings();
	});

	async function fetchMeetingOfferings() {
		try {
			const endpoint = $user.id ? `/meeting_offerings?user_id=${$user.id}` : '/meeting_offerings';
			const response = await API.get(endpoint);
			meetingOfferings = response || [];
		} catch (error) {
			console.error('Error fetching meeting offerings:', error);
		}
	}

	function updateEndTime() {
		console.log({ newSlotTime });
		if (newSlotDate && newSlotTime && selectedOffering) {
			try {
				// Create the start date in Pacific time
				const startDateTime = DateTime.fromFormat(
					`${newSlotDate}T${newSlotTime}`,
					'yyyy-MM-ddTHH:mm'
				).setZone('America/Los_Angeles'); // Set timezone after creation

				const durationMinutes = parseInt(selectedOffering.duration, 10);
				const endDateTime = startDateTime.plus({ minutes: durationMinutes });

				// Format end time while keeping it in Pacific time
				calculatedEndTime = endDateTime.toFormat('h:mm a');
			} catch (error) {
				console.error(error);
				alert('error');
			}
		}
	}

	function generateTimeOptions() {
		const options = [];
		let now = DateTime.local().setZone('America/Los_Angeles').startOf('day');
		const endOfDay = now.endOf('day');

		while (now <= endOfDay) {
			options.push({
				readable: now.toFormat('h:mm a'),
				time: now.toFormat('HH:mm')
			});
			now = now.plus({ minutes: 30 });

			if (now.day !== endOfDay.day) break;
		}

		return options;
	}

	async function createNewSlot() {
		console.log({ selectedOffering });
		if (!newSlotDate || !newSlotTime || !selectedOffering || !selectedOffering.duration) return;

		const startDateTime = DateTime.fromISO(`${newSlotDate}T${newSlotTime}`, {
			zone: 'local'
		}).toUTC();
		if (!startDateTime.isValid) {
			console.error('Invalid start date or time');
			return;
		}

		const durationMinutes = parseInt(selectedOffering.duration, 10);
		const endDateTime = startDateTime.plus({ minutes: durationMinutes });
		console.log({ startDateTime: startDateTime.toISO(), endDateTime: endDateTime.toISO() });

		const newSlot = {
			user_id: $user.id,
			meeting_offering_id: selectedOffering.id,
			start_time: startDateTime.toISO(),
			end_time: endDateTime.toISO(),
			status: 'open'
		};

		try {
			await API.post('/slots', newSlot);
			alert('New slot created successfully!');
		} catch (error) {
			console.error('Error creating slot:', error);
			alert('Failed to create slot.');
		}
	}
</script>

<div class="container">
	{#if slotsAdmin}
		<MeetingSlotsGuide />
		<div class="filter-bar">
			<label>
				<input type="checkbox" bind:checked={filters.open} />
				Open
			</label>
			<label>
				<input type="checkbox" bind:checked={filters.denied} />
				Cancelled
			</label>
		</div>

		<!-- Accordion for Adding Slots -->
		<div class="accordion">
			<button
				class="btn"
				class:btn-info={showAccordion}
				class:btn-outline-info={!showAccordion}
				on:click={() => (showAccordion = !showAccordion)}
			>
				{showAccordion ? 'Hide Slot Creator' : 'Create New Slot'}
			</button>
			{#if showAccordion}
				<div class="accordion-content">
					<!-- Inline Slot Creator -->
					<NewSlot {mentorships}></NewSlot>
				</div>
			{/if}
		</div>
	{/if}

	<ul class="meetup-list">
		{#if filteredMeetups.length < 1}
			<div class="jumbotron">
				{#if slotsAdmin}
					<h2>No matching slots available.</h2>
					<h4>Try changing the filters above.</h4>
				{:else}
					<h1>Uh-oh</h1>
					<h2>This mentor has no meetings available yet, please check back at a later time.</h2>
					<div>
						<button class="btn btn-warning" on:click={() => (showInterestForm = !showInterestForm)}>
							{showInterestForm ? 'Hide Interest in Mentorship' : 'Show Interest in Mentorship'}
						</button>

						{#if showInterestForm}
							<div class="interest-form mt-3">
								<label for="interest-text"
									>Why would you appreciate {mentorName}'s mentorship?</label
								>
								<textarea
									id="interest-text"
									class="form-control"
									bind:value={interestText}
									rows="4"
									placeholder="Share why you're interested in being mentored..."
								></textarea>
								<button
									class="btn btn-primary mt-2"
									on:click={submitInterest}
									disabled={!interestText.trim()}
								>
									Submit Interest
								</button>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
		{#each filteredMeetups as meetup}
			<Offering
				{slotsAdmin}
				offering={meetup.offering}
				slotDetails={meetup}
				status={meetup.status}
			/>
		{/each}
	</ul>
</div>

<style>
	.container {
		max-width: 700px;
		margin: auto;
		padding: 20px;
		border-radius: 8px;
		background: white;
	}

	.filter-bar {
		display: flex;
		gap: 15px;
		background: #f8f9fa;
		padding: 10px;
		border-radius: 6px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 15px;
		justify-content: center;
	}

	.filter-bar label {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 14px;
		cursor: pointer;
	}

	.meetup-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.accordion {
		margin-bottom: 15px;
	}

	.accordion-content {
		background: #f8f9fa;
		padding: 10px;
		border-radius: 6px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
	}

	.accordion-content label {
		display: block;
		margin-bottom: 10px;
	}

	.interest-form {
		background: #f8f9fa;
		padding: 15px;
		border-radius: 6px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
	}

	.interest-form label {
		display: block;
		margin-bottom: 8px;
		font-weight: 500;
	}
</style>
