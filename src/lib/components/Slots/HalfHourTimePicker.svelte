<script>
	export let startingFrom = new Date();
	export let label;

	export let time;

	let selectedHour = 12;
	let selectedMinute = 0;
	let selectedPeriod = 'AM';
	export let timeChange;

	const now = new Date(startingFrom);
	let currentHour = now.getHours();
	const currentMinute = now.getMinutes();
	const isPM = currentHour >= 12;

	if (currentHour === 0) {
		currentHour = 12;
	} else if (currentHour > 12) {
		currentHour -= 12;
	}

	let hours = Array.from({ length: 12 }, (_, i) => i + 1);
	let minutes = [0, 30];
	let periods = ['AM', 'PM'];

	const formatTime = (hour, minute, period) => {
		return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
	};

	const updateTime = () => {
		time = formatTime(selectedHour, selectedMinute, selectedPeriod);
		timeChange(time);
	};

	const updateHour = (event) => {
		selectedHour = parseInt(event.target.value);
		updateTime();
	};

	const updateMinute = (event) => {
		selectedMinute = parseInt(event.target.value);
		updateTime();
	};

	const updatePeriod = (event) => {
		selectedPeriod = event.target.value;
		updateTime();
	};

	// Initialize default time to next available time
	if (currentMinute < 30) {
		selectedHour = currentHour;
		selectedMinute = 30;
		selectedPeriod = isPM ? 'PM' : 'AM';
	} else {
		selectedHour = currentHour === 12 ? 1 : currentHour + 1;
		selectedMinute = 0;
		if (currentHour === 11 && selectedMinute === 0) {
			selectedPeriod = isPM ? 'AM' : 'PM';
		} else {
			selectedPeriod = isPM ? 'PM' : 'AM';
		}
	}
	updateTime();
</script>

<label for="">{label}</label>
<div class="time-picker">
	<select on:change={updateHour} bind:value={selectedHour}>
		{#each hours as hour}
			<option value={hour}>{String(hour).padStart(2, '0')}</option>
		{/each}
	</select>

	<span>:</span>

	<select on:change={updateMinute} bind:value={selectedMinute}>
		{#each minutes as minute}
			<option value={minute}>{String(minute).padStart(2, '0')}</option>
		{/each}
	</select>

	<select on:change={updatePeriod} bind:value={selectedPeriod}>
		{#each periods as period}
			<option value={period}>{period}</option>
		{/each}
	</select>
</div>

<style>
	.time-picker {
		display: flex;
		gap: 8px;
		margin-top: 10px;
		align-items: center;
	}

	select {
		padding: 6px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		font-size: 16px;
	}
</style>
