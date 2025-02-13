<script>
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import { DateTime as Luxon } from 'luxon';
	import { DateTime } from 'luxon';
	import MeetingSlotsGuide from '$lib/components/Guide/MeetingSlots.svelte';

	let current_user = { id: null };
	let loading = true;
	let availability = {
		Monday: [],
		Tuesday: [],
		Wednesday: [],
		Thursday: [],
		Friday: [],
		Saturday: [],
		Sunday: []
	};

	let openDay = null;
	let timeSlots = generateTimeSlots(8, 22, 30); // Generate 30 min slots from 8 AM to 10 PM

	user.subscribe((p) => {
		if (!p) return;
		current_user = p;
		getCalendar();
	});

	function categorizeSlots(slots) {
		let morning = [];
		let afternoon = [];
		let evening = [];

		slots
			.slice() // Clone array to avoid modifying original
			.sort((a, b) => convertToSortableTime(a) - convertToSortableTime(b)) // Sort
			.forEach((time) => {
				let sortable = convertToSortableTime(time);
				if (sortable < 720) {
					morning.push(time);
				} else if (sortable < 1080) {
					afternoon.push(time);
				} else {
					evening.push(time);
				}
			});

		return { morning, afternoon, evening };
	}

	async function getCalendar() {
		try {
			const res = await API.get(`/user_availabilities?user_id=${current_user.id}`);
			if (res) {
				populateAvailability(res);
			}
		} catch (error) {
			console.error('Error fetching availability:', error);
			loading = false;
		}
	}

	function populateAvailability(data) {
		let formattedAvailability = {
			Monday: [],
			Tuesday: [],
			Wednesday: [],
			Thursday: [],
			Friday: [],
			Saturday: [],
			Sunday: []
		};

		data.forEach((slot) => {
			const day = slot.day;
			const startTime = convertToLocalTime(slot.start_time, slot.timezone);
			formattedAvailability[day].push(startTime);
		});

		availability = formattedAvailability;
		loading = false;
	}

	function convertToLocalTime(utcTime, timezone) {
		let date = new Date(utcTime);
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			timeZone: timezone
		});
	}

	function toggleAccordion(day) {
		openDay = openDay === day ? null : day;
	}

	function generateTimeSlots(startHour, endHour, interval) {
		let slots = [];
		for (let hour = startHour; hour < endHour; hour++) {
			for (let min = 0; min < 60; min += interval) {
				let formattedTime = new Date(2022, 0, 1, hour, min).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
					hour12: true
				});
				slots.push(formattedTime);
			}
		}
		return slots;
	}

	function toggleSlot(day, slot) {
		if (availability[day].includes(slot)) {
			availability[day] = availability[day].filter((s) => s !== slot);
		} else {
			availability[day] = [...availability[day], slot];
		}
	}

	async function saveAvailability() {
		let formattedAvailability = [];

		Object.keys(availability).forEach((day) => {
			availability[day].forEach((slot) => {
				let startUTC = formatTimeSlot(slot);
				let endUTC = formatTimeSlot(addDuration(slot, 30));

				formattedAvailability.push({ day, start_time: startUTC, end_time: endUTC });
			});
		});

		const response = await API.post('/user_availabilities?user_id=' + current_user.id, {
			user: {
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				availability: formattedAvailability
			}
		});

		if (response) {
			alert('Availability saved successfully!');
		} else {
			alert('Error saving availability.');
		}
	}

	// Helper: Add 30 minutes to start time
	function addDuration(startTime, durationMinutes) {
		const [time, period] = startTime.split(' ');
		let [hours, minutes] = time.split(':').map(Number);
		if (period === 'PM' && hours !== 12) hours += 12;
		if (period === 'AM' && hours === 12) hours = 0;

		let date = new Date();
		date.setHours(hours, minutes + durationMinutes, 0, 0);

		return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
	}

	function formatTimeSlot(slot, userTimezone = 'America/Los_Angeles') {
		const [time, period] = slot.split(' ');
		let [hours, minutes] = time.split(':').map(Number);

		// ✅ Fix AM/PM Conversion
		if (period === 'PM' && hours !== 12) hours += 12;
		if (period === 'AM' && hours === 12) hours = 0;

		// ✅ Create a DateTime in user's timezone
		let localDate = DateTime.fromObject({ hour: hours, minute: minutes }, { zone: userTimezone });

		// ✅ Convert to UTC before saving
		let utcDate = localDate.toUTC();

		console.log({
			selectedTime: slot,
			localDate: localDate.toFormat('EEE, MMM d @ h:mm a ZZZZ'),
			utcDate: utcDate.toFormat('EEE, MMM d @ h:mm a ZZZZ'),
			utcISO: utcDate.toISO()
		});

		return utcDate.toISO(); // Store in ISO UTC format
	}

	function convertToSortableTime(time) {
		const [hourMinute, period] = time.split(' ');
		let [hour, minute] = hourMinute.split(':').map(Number);

		if (period === 'PM' && hour !== 12) hour += 12;
		if (period === 'AM' && hour === 12) hour = 0;

		return hour * 60 + minute; // Convert to minutes for easy sorting
	}
</script>

<div class="availability-container">
	<MeetingSlotsGuide></MeetingSlotsGuide>
	<h3>My Weekly Availability</h3>

	{#each Object.keys(availability) as day}
		<div>
			<!-- Accordion Header -->
			<div class="accordion" on:click={() => toggleAccordion(day)}>
				<span>{day}</span>
				<span class="selected-slots" class:empty={availability[day].length < 1}>
					{#if availability[day].length > 0}
						{availability[day]
							.slice() // Clone array to avoid mutating the original
							.sort((a, b) => convertToSortableTime(a) - convertToSortableTime(b)) // Sort
							.join(', ')}
					{:else if loading}
						<img src="/spinner.svg" alt="" />
					{:else}
						No Slots Available
					{/if}
				</span>
			</div>

			<!-- Accordion Body (Hidden by default) -->
			<div class="slots-container {openDay === day ? 'open' : ''}">
				<div class="slots">
					{#each timeSlots as slot}
						<div
							class="slot {availability[day].includes(slot) ? 'selected' : ''}"
							on:click={() => toggleSlot(day, slot)}
						>
							{slot}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}

	<button class="save-button" on:click={saveAvailability}>Save Availability</button>
</div>

<style>
	.selected-slots.empty {
		color: #ccc;
	}
	.availability-container {
		max-width: 600px;
		margin: auto;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
		background: #fff;
	}

	.accordion {
		border-bottom: 1px solid #ddd;
		cursor: pointer;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f8f9fa;
		transition: background 0.3s;
	}

	.accordion:hover {
		background: #e9ecef;
	}

	.selected-slots {
		font-size: 14px;
		color: #007bff;
	}

	.slots-container {
		max-height: 0;
		overflow-y: scroll;
		transition:
			max-height 0.3s ease-out,
			padding 0.3s ease-out;
		padding: 0 10px;
	}

	.slots-container.open {
		max-height: 300px;
		padding: 10px 10px;
	}

	.slots {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}

	.slot {
		padding: 8px 12px;
		border-radius: 6px;
		border: 1px solid #007bff;
		background: #f8f9fa;
		cursor: pointer;
		transition: 0.3s;
		font-size: 0.9rem;
	}

	.slot.selected {
		background: #007bff;
		color: white;
	}

	.save-button {
		width: 100%;
		padding: 10px;
		background: #28a745;
		color: white;
		font-weight: bold;
		border: none;
		cursor: pointer;
		border-radius: 6px;
		margin-top: 20px;
	}
</style>
