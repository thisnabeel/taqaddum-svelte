<script>
	import { user } from '$lib/stores/user';
	import MeetingSlotsGuide from '../Guide/MeetingSlots.svelte';
	import Offering from './Offerings/Offering.svelte';

	export let meetups = [];
	export let slotsAdmin = false;

	// Filters for status
	let filters = {
		open: true,
		denied: true
	};

	// Filtered meetups based on selected statuses
	$: filteredMeetups = meetups.filter((meetup) => filters[meetup.status]);
</script>

<div class="container">
	<!-- Toggleable Guide -->
	{#if slotsAdmin}
		<MeetingSlotsGuide></MeetingSlotsGuide>

		<!-- Filter Bar -->
		<div class="filter-bar">
			<label>
				<input type="checkbox" bind:checked={filters.open} />
				Open
			</label>
			<label>
				<input type="checkbox" bind:checked={filters.denied} />
				Denied
			</label>
		</div>
	{/if}

	<!-- Meetup List -->
	<ul class="meetup-list">
		{#if filteredMeetups.length < 1}
			<div class="jumbotron">
				{#if slotsAdmin}
					<h2>No matching slots available.</h2>
					<h4>Try changing the filters above.</h4>
				{:else}
					<h1>Uh-oh</h1>
					<h2>This mentor has no slots available yet, please check back at a later time.</h2>
					<h3><div class="btn btn-warning">Click to send Encouragement</div></h3>
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

	/* Filter Bar */
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

	/* Meetup List */
	.meetup-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	/* Animation */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.filter-bar {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
