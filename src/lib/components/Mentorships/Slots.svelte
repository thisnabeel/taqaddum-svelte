<script>
	import { user } from '$lib/stores/user';
	import Offering from './Offerings/Offering.svelte';

	export let meetups = [];
	export let slotsAdmin = false;
	let showGuide = false;

	// Filters for status
	let filters = {
		potential: true,
		locked: true,
		denied: true
	};

	// Filtered meetups based on selected statuses
	$: filteredMeetups = meetups.filter((meetup) => filters[meetup.status]);
</script>

<div class="container">
	<!-- Toggleable Guide -->
	{#if slotsAdmin}
		<div class="accordion">
			<button class="accordion-header" on:click={() => (showGuide = !showGuide)}>
				{showGuide ? 'Click here to hide ' : 'Click here to show '}
				<b style="margin-left: 4px">Guide to Meeting Slots</b>
			</button>
			{#if showGuide}
				<div class="accordion-content">
					<!-- Explanation -->
					<div class="explanation">
						<h3>How Your Meetup Slots Are Generated</h3>
						<p>
							Potential meetups are automatically created based on your offerings and
							availabilities. These are not confirmed bookings yet—only placeholders for possible
							sessions.
						</p>
					</div>

					<!-- Status Legend (Table) -->
					<div class="legend-container">
						<table class="legend-table">
							<thead>
								<tr>
									<th>Status</th>
									<th>Icon</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><span class="legend-text">Locked</span></td>
									<td><i class="fa fa-lock legend-icon locked" /></td>
									<td>Confirmed and scheduled meetings.</td>
								</tr>
								<tr>
									<td><span class="legend-text">Potential</span></td>
									<td><i class="fa fa-circle-o legend-icon" /></td>
									<td>Unbooked slots based on your availability.</td>
								</tr>
								<tr>
									<td><span class="legend-text">Blocked Potential</span></td>
									<td><i class="fa fa-times-circle legend-icon blocked" /></td>
									<td>Slots that are unavailable for booking.</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</div>

		<!-- Filter Bar -->
		<div class="filter-bar">
			<label>
				<input type="checkbox" bind:checked={filters.locked} />
				Locked
			</label>
			<label>
				<input type="checkbox" bind:checked={filters.potential} />
				Potential
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
				<h2>No matching slots available.</h2>
				<h4>Try changing the filters above.</h4>
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

	/* Accordion */
	.accordion {
		margin-bottom: 15px;
	}

	.accordion-header {
		width: 100%;
		background: #f8f9fa;
		border: 1px solid #ddd;
		padding: 10px;
		font-size: 16px;
		text-align: left;
		cursor: pointer;
		display: flex;
		justify-content: initial;
		align-items: center;
		border-radius: 6px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
	}

	.accordion-content {
		padding: 10px;
		background: #ffffff;
		border-radius: 6px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
		animation: fadeIn 0.3s ease-in-out;
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

	/* Legend Table */
	.legend-container {
		overflow-x: auto;
		margin-bottom: 10px;
	}

	.legend-table {
		width: 100%;
		border-collapse: collapse;
		background: #f8f9fa;
		border-radius: 6px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
	}

	.legend-table th,
	.legend-table td {
		padding: 10px;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}

	.legend-table th {
		background: #e9ecef;
	}

	.legend-text {
		font-weight: bold;
	}

	.legend-icon {
		font-size: 20px;
		vertical-align: middle;
	}

	/* Colors for status */
	.potential {
		color: #000;
	}

	.blocked {
		color: #ccc;
	}

	.locked {
		color: #2ecc71;
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

		.legend-table {
			font-size: 14px;
		}

		.legend-table th,
		.legend-table td {
			padding: 8px;
		}
	}
</style>
