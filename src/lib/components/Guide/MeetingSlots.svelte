<script>
	// No need for showGuide
</script>

<div class="accordion">
	<div class="accordion-content">
		<!-- Explanation -->
		<div class="explanation">
			<h3>How Your Meetup Slots Are Generated</h3>
			<p>
				By providing your availability, our system can generate the best possible meetup times for
				you with mentors. The more accurate and flexible your availability, the more likely you'll
				be matched with mentors who fit your schedule and goals.
			</p>
		</div>

		{#if false}
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
							<td><span class="legend-text">Open</span></td>
							<td><i class="fa fa-circle-o legend-icon open" /></td>
							<td>Available for booking.</td>
						</tr>
						<tr>
							<td><span class="legend-text">Denied</span></td>
							<td><i class="fa fa-times-circle legend-icon denied" /></td>
							<td>Denied for booking by you.</td>
						</tr>
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
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
	.open {
		color: #2ecc71;
	}

	.denied {
		color: #e74c3c;
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

	@media (max-width: 768px) {
		.legend-table {
			font-size: 14px;
		}

		.legend-table th,
		.legend-table td {
			padding: 8px;
		}
	}
</style>
