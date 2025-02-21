<script>
	import { onMount } from 'svelte';
	import API from '$lib/api/api';
	import Swal from 'sweetalert2';
	import DatePicker from '../Slots/DatePicker.svelte';
	import HalfHourTimePicker from '../Slots/HalfHourTimePicker.svelte';
	import TimezonePicker from '../Slots/TimezonePicker.svelte';
	import { DateTime } from 'luxon';
	import { current_page } from '$lib/stores/main';
	import { user } from '$lib/stores/user';

	export let mentorships = [];
	export let readOnly = false;
	export let editing = true;
	export let appendToList;

	let window = { datePicker: false, startTimePicker: false, endTimePicker: false };

	let showDatePicker = false;
	let showStartTimePicker = false;
	let form = {
		timezone: null,
		title: null,
		duration: 30,
		description: null,
		date: new Date().toISOString().split('T')[0], // Default to today
		startTime: '1:00 AM', // Default start time
		endTime: '1:30 AM', // Default end time (30 min later),
		mentorship_id: null
	};
	$: console.log(form);

	const saveChanges = () => {};
	const deleteMeetingOffering = () => {};

	async function createMeeting() {
		convertToRailsTimestamp();
		console.log(form);
		try {
			Swal.fire({
				title: 'Please Hold...',
				text: 'Creating your Meeting...',
				showCloseButton: false,
				showConfirmButton: false,
				allowOutsideClick: false
			});
			const payload = {
				start_time: convertToRailsTimestamp().start_time,
				end_time: convertToRailsTimestamp().end_time,
				status: 'open',
				mentorship_id: form.mentorship_id,
				description: form.description,
				title: form.title,
				timezone: convertToRailsTimestamp().timezone,
				user_id: $user.id
			};

			console.log({ payload });
			const res = await API.post('/slots', payload);
			console.log({ res });
			appendToList(res);
			Swal.close();
			Swal.fire({
				title: 'Success!',
				text: 'Your Meeting has been created...',
				icon: 'success',
				showCloseButton: true,
				showConfirmButton: false
			});
		} catch (error) {
			Swal.fire({
				title: 'Uh oh...',
				text: 'Seems like there was an error, please contact admin...',
				icon: 'error',
				showCloseButton: false,
				showConfirmButton: false,
				allowOutsideClick: true
			});
		}
	}

	const updateField = (field, event) => {
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const cursorPosition = range.startOffset;

		form[field] = event.target.innerText;

		// Restore cursor position
		setTimeout(() => {
			const newRange = document.createRange();
			const newSelection = window.getSelection();
			newRange.setStart(event.target.childNodes[0] || event.target, cursorPosition);
			newRange.collapse(true);
			newSelection.removeAllRanges();
			newSelection.addRange(newRange);
		}, 0);
	};

	const updateDate = (event) => {
		form.date = event.target.value;
	};

	const updateStartTime = (event) => {
		form.startTime = event.target.value;
		let [hours, minutes] = event.target.value.split(':').map(Number);
		minutes += 30;
		if (minutes >= 60) {
			hours += 1;
			minutes -= 60;
		}
		form.endTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
	};

	function togglePicker(picker) {
		closeAllExcept(picker);
		window[picker] = !window[picker];
	}

	function closeAllExcept(picker) {
		for (let key in window) {
			if (key !== picker) {
				window[key] = false;
			}
		}
	}

	function dateChange(payload) {
		console.log(payload);
		form.date = new Date(payload).toISOString().split('T')[0];
	}

	function startTimeChange(payload) {
		console.log(payload);
		form.startTime = payload;
	}

	function endTimeChange(payload) {
		console.log(payload);
		form.endTime = payload;
	}

	const timeZoneMap = {
		PST: 'America/Los_Angeles',
		MST: 'America/Denver',
		CST: 'America/Chicago',
		EST: 'America/New_York',
		UTC: 'UTC'
	};

	function convertToRailsTimestamp() {
		// Convert the given timezone abbreviation to IANA format
		const luxonTimeZone = timeZoneMap[form.timezone] || 'UTC';

		// Combine date and time strings into a full datetime
		const startDateTime = DateTime.fromFormat(
			`${form.date} ${form.startTime}`,
			'yyyy-MM-dd h:mm a',
			{ zone: luxonTimeZone }
		);

		const endDateTime = DateTime.fromFormat(`${form.date} ${form.endTime}`, 'yyyy-MM-dd h:mm a', {
			zone: luxonTimeZone
		});

		return {
			start_time: startDateTime.toUTC().toISO(),
			end_time: endDateTime.toUTC().toISO(),
			timezone: timeZoneMap[form.timezone]
		};
	}

	function timezoneChange(payload) {
		console.log(payload);
		form.timezone = payload;
	}
</script>

<div class="editable-form editing">
	{#if !form.mentorship_id}
		<h3>First... Select Certified Mentorship</h3>
	{/if}
	<select bind:value={form.mentorship_id} class="skills" placeholder="Click to select...">
		<option value={null}></option>
		{#each mentorships || [] as mentorship}
			<option value={mentorship.id}>{mentorship.skill.title}</option>
		{/each}
	</select>

	{#if form.mentorship_id}
		<input
			type="text"
			class="title-input"
			placeholder="Type title of meeting here..."
			bind:value={form.title}
		/>
		<textarea
			type="text"
			class="description-input"
			placeholder="Type description of meeting here..."
			bind:value={form.description}
		></textarea>

		<div style="position:relative; display: inline-block;">
			<TimezonePicker {form} {timezoneChange}></TimezonePicker>
		</div>
		{#if form.timezone}
			<small class="flex time-selector" style="align-items: baseline;">
				<div class="flex-70 flex-grow">
					<b>
						<div style="position:relative; display: inline-block;">
							<span
								on:click={() => {
									togglePicker('datePicker');
								}}
								class="editable"
								class:yellow={window['datePicker']}
							>
								{form.date}
							</span>
							{#if window['datePicker']}
								<div class="date-picker">
									<DatePicker {dateChange} label={'Meeting Date:'}></DatePicker>
								</div>
							{/if}
						</div>
						@
						<div style="position:relative; display: inline-block;">
							<span
								on:click={() => {
									togglePicker('startTimePicker');
								}}
								class="editable"
								class:yellow={window['startTimePicker']}
							>
								{form.startTime}
							</span>
							{#if window['startTimePicker']}
								<div class="date-picker">
									<HalfHourTimePicker
										timeChange={startTimeChange}
										time={form.startTime}
										label={'Meeting Start Time:'}
									></HalfHourTimePicker>
								</div>
							{/if}
						</div>

						-
						<div style="position:relative; display: inline-block;">
							<span
								on:click={() => {
									togglePicker('endTimePicker');
								}}
								class="editable"
								class:yellow={window['endTimePicker']}
							>
								{form.endTime}
							</span>
							{#if window['endTimePicker']}
								<div class="date-picker">
									<HalfHourTimePicker
										timeChange={endTimeChange}
										time={form.endTime}
										label={'Meeting End Time:'}
									></HalfHourTimePicker>
								</div>
							{/if}
						</div>
					</b>
				</div>
				<div
					class="btn btn-outline-primary flex-30 flex-grow create-btn"
					on:click={() => createMeeting()}
				>
					Create Meeting
				</div>
			</small>
		{/if}
	{/if}
</div>

<style>
	.date-picker {
		position: absolute;
		left: -20px;
		top: 20px;
		background: #ffff93;
		padding: 10px;

		border-radius: 8px;
		z-index: 999;
		box-shadow: 1px 5px 9px 1px #cdbfbf;
		border-radius: 10px;
	}
	.skills {
		padding: 6px;
		display: inline-block;
		background-color: rgb(255, 255, 146);
		border-radius: 4px;
		margin-bottom: 10px;
	}
	.editable-form {
		background: #fff;
		padding: 10px;
		border-radius: 6px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
		transition: 0.3s ease-in-out;
		position: relative;
	}

	.editable {
		background: #f3f3f3;
		padding: 2px 5px;
		border-radius: 4px;
		cursor: pointer;
	}
	.durations span {
		margin-right: 8px;
		cursor: pointer;
	}
	.yellow {
		background: #ffff93;
	}
	.actions {
		display: flex;
		gap: 5px;
	}
	.actions button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		transition: color 0.2s ease;
	}
	.actions .delete {
		color: red;
	}
	.actions .cancel {
		color: gray;
	}

	input:focus-visible,
	input:focus,
	textarea:focus-visible,
	textarea:focus {
		border: none !important;
		background-color: #ffff93;
		outline: none;
	}

	.title-input {
		border: 0;
		font-size: 24px;
		font-weight: 400;
		background: #f3f3f3;
		width: 100%;
	}

	.description-input {
		border: 0;
		font-size: 16px;
		font-weight: 400;
		background: #f3f3f3;
		width: 100%;
	}
	@media (max-width: 768px) {
		.time-selector.flex {
			display: block;
		}

		.create-btn {
			display: block;
			margin-top: 10px;
		}
	}
</style>
