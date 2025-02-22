<script>
	import { goto } from '$app/navigation';
	import API from '$lib/api/api';
	import Comic from '$lib/components/Buttons/comic.svelte';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';

	let dashboard;

	onMount(() => {
		getDashboard();
	});

	async function getDashboard() {
		dashboard = await API.get(`/mentors/${$user.id}/dashboard`);
	}

	async function startChatRoom(slot) {
		const code = await generateChatRoomId(slot);
		goto('/video/' + code + '/2');
	}

	async function generateChatRoomId(slot) {
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
</script>

<div class="container py-4">
	{#if dashboard}
		<div class="row">
			<div class="col-12 mb-4">
				<h2 class="display-6 mb-3">My Mentorship Dashboard</h2>
			</div>
		</div>

		<!--  -->

		<!-- Booked Sessions -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-primary bg-opacity-10">
						<h3 class="h5 mb-0">My Booked Sessions</h3>
					</div>
					<div class="card-body">
						{#if dashboard.bookings && dashboard.bookings.some((slot) => slot.mentees?.length > 0)}
							<div class="table-responsive">
								<table class="table table-hover align-middle">
									<thead>
										<tr>
											<th>Session Details</th>
											<th>Mentees</th>
											<th>Date & Time</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.bookings.filter((slot) => slot.mentees?.length > 0) as slot}
											<tr>
												<td>
													<div class="fw-bold">{slot.title}</div>
													<div class="text-muted small">{slot.skill.title}</div>
													{#if slot.description}
														<div class="text-muted small">{slot.description}</div>
													{/if}
												</td>
												<td>
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
																	{mentee.menteeships.find((m) => m.skill.id === slot.skill.id)
																		.profession || 'No Experience listed'}
																</span>
															</div>
														{/each}
													</div>
												</td>
												<td>
													<div>
														{new Date(slot.start_time).toLocaleDateString('en-US', {
															weekday: 'short',
															month: 'short',
															day: 'numeric',
															year: 'numeric'
														})}
													</div>
													<div class="text-muted small">
														{new Date(slot.start_time).toLocaleTimeString('en-US', {
															hour: '2-digit',
															minute: '2-digit',
															timeZone: slot.timezone
														})} -
														{new Date(slot.end_time).toLocaleTimeString('en-US', {
															hour: '2-digit',
															minute: '2-digit',
															timeZone: slot.timezone
														})}
														<div class="text-muted smaller">({slot.timezone})</div>
													</div>
												</td>
												<td>
													<a
														class="btn btn-info"
														on:click={() => {
															startChatRoom(slot);
														}}>Enter Meeting</a
													>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No booked sessions at the moment.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Approved Mentorships -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-success bg-opacity-10">
						<h3 class="h5 mb-0">Active Mentorships</h3>
					</div>
					<div class="card-body">
						{#if dashboard.mentorships.approved.length > 0}
							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Skill Area</th>
											<th>Experience</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.mentorships.approved as mentorship}
											<tr>
												<td><Comic>{mentorship.skill.title}</Comic></td>
												<td>{mentorship.profession} @ {mentorship.company}</td>
												<td>
													<span class="badge bg-success">Active</span>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No active mentorships at the moment.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Pending Mentorships -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-warning bg-opacity-10">
						<h3 class="h5 mb-0">Pending Approvals</h3>
					</div>
					<div class="card-body">
						{#if dashboard.mentorships.pending.length > 0}
							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Skill Area</th>
											<th>Experience</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.mentorships.pending as mentorship}
											<tr>
												<td><Comic status={mentorship.status}>{mentorship.skill.title}</Comic></td>
												<td>{mentorship.profession} @ {mentorship.company}</td>
												<td>
													<span class="badge bg-warning text-dark">Pending</span>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No pending mentorship requests.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Mentee Pool -->
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-info bg-opacity-10">
						<h3 class="h5 mb-0">Available Mentees</h3>
					</div>
					<div class="card-body">
						{#if dashboard.mentees.pool.length > 0}
							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Mentee</th>
											<th>Experience</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.mentees.pool as mentee}
											<tr>
												<td style="font-weight: bold;">
													<img src={$user.avatar_cropped_url} class="mentor-avatar" />

													{mentee.user.first_name}
													{mentee.user.last_name}</td
												>
												<td>{mentee.profession} @ {mentee.company}</td>

												<td>
													<Comic>{mentee.skill.title}</Comic>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No mentees available in the pool.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="row">
			<div class="col-12 text-center py-5">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.card) {
		border-radius: 0.5rem;
		border: 1px solid rgba(0, 0, 0, 0.125);
	}

	:global(.card-header) {
		border-top-left-radius: 0.5rem !important;
		border-top-right-radius: 0.5rem !important;
	}

	:global(.table) {
		margin-bottom: 0;
	}

	:global(.badge) {
		font-weight: 500;
	}

	.mentor-avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid white;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
	}
</style>
