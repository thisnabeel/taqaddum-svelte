<script>
	import { onMount } from 'svelte';

	export let dateChange;
	export let label;
	export let timezone = 'PST'; // Default timezone

	let form = {
		date: ''
	};

	let today = new Date();
	let selectedMonth, selectedDay, selectedYear;

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

	let days = [];
	let years = [];

	// Function to get current date in specified timezone
	const getDateInTimezone = (tz) => {
		let formatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			timeZone: tz
		});
		let parts = formatter.formatToParts(new Date());

		return {
			year: parseInt(parts.find((p) => p.type === 'year').value),
			month: parseInt(parts.find((p) => p.type === 'month').value) - 1,
			day: parseInt(parts.find((p) => p.type === 'day').value)
		};
	};

	const updateDays = () => {
		days = Array.from(
			{ length: getDaysInMonth(selectedMonth, selectedYear) },
			(_, i) => i + 1
		).filter(
			(day) =>
				selectedYear > today.getFullYear() ||
				selectedMonth > today.getMonth() ||
				day >= today.getDate()
		);
		if (selectedDay > days.length) {
			selectedDay = days[0];
		}
	};

	const updateDate = () => {
		form.date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
		dateChange(form.date);
	};

	const updateMonth = (event) => {
		selectedMonth = parseInt(event.target.value);
		updateDays();
		updateDate();
	};

	const updateDay = (event) => {
		selectedDay = parseInt(event.target.value);
		updateDate();
	};

	const updateYear = (event) => {
		selectedYear = parseInt(event.target.value);
		updateDays();
		updateDate();
	};

	onMount(() => {
		let currentDate = getDateInTimezone(timezone);
		selectedYear = currentDate.year;
		selectedMonth = currentDate.month;
		selectedDay = currentDate.day;

		years = Array.from({ length: 100 }, (_, i) => selectedYear + i);

		updateDays();
		updateDate();
	});
</script>

<label for="">{label}</label>
<div class="date-picker">
	<select on:change={updateMonth} bind:value={selectedMonth}>
		{#each months as month, index}
			{#if selectedYear > today.getFullYear() || index >= today.getMonth()}
				<option value={index}>{month}</option>
			{/if}
		{/each}
	</select>

	<select on:change={updateDay} bind:value={selectedDay}>
		{#each days as day}
			<option value={day}>{day}</option>
		{/each}
	</select>

	<select on:change={updateYear} bind:value={selectedYear}>
		{#each years as year}
			<option value={year}>{year}</option>
		{/each}
	</select>
</div>

<style>
	.date-picker {
		display: flex;
		gap: 8px;
		margin-top: 10px;
	}

	select {
		padding: 6px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		font-size: 16px;
	}
</style>
