<script>
	let selectedTimezone = null;
	export let form;
	export let timezoneChange;
	export let label = 'Then... Select Time Zone:';

	const timezones = [
		{ label: 'Pacific Standard Time (PST)', value: 'PST' },
		{ label: 'Mountain Standard Time (MST)', value: 'MST' },
		{ label: 'Central Standard Time (CST)', value: 'CST' },
		{ label: 'Eastern Standard Time (EST)', value: 'EST' },
		{ label: 'Atlantic Standard Time (AST)', value: 'AST' },
		{ label: 'Newfoundland Standard Time (NST)', value: 'NST' },
		{ label: 'Alaska Standard Time (AKST)', value: 'AKST' },
		{ label: 'Hawaii-Aleutian Standard Time (HST)', value: 'HST' },
		{ label: 'Coordinated Universal Time (UTC)', value: 'UTC' }
	];

	const updateTimezone = (event) => {
		selectedTimezone = event.target.value;
		timezoneChange(selectedTimezone);
	};
</script>

{#if !selectedTimezone}
	<label for="timezone">{label}</label>
{/if}
<div class="timezone-picker">
	<select on:change={updateTimezone} bind:value={form.timezone}>
		{#each timezones as tz}
			<option value={tz.value}>{tz.label}</option>
		{/each}
	</select>
</div>

<style>
	.timezone-picker {
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
