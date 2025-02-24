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
		dashboard = await API.get(`/mentees/${$user.id}/dashboard`);
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
				<h2 class="display-6 mb-3">My Dashboard</h2>
			</div>
		</div>

		<!-- Scheduled Sessions -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-primary bg-opacity-10">
						<h3 class="h5 mb-0">My Schedule</h3>
					</div>
					<div class="card-body">
						{#if dashboard.bookings && dashboard.bookings.length > 0}
							<div class="mobile-cards">
								{#each dashboard.bookings as booking}
									<div class="session-card p-3 mb-3">
										<div class="d-flex justify-content-between align-items-start mb-3">
											<div>
												<div class="fw-bold">{booking.slot.title}</div>
												<div class="text-muted small">{booking.slot.skill.title}</div>
											</div>
											<a
												class="btn btn-info btn-sm"
												on:click={() => {
													startChatRoom(booking.slot);
												}}>Enter Meeting</a
											>
										</div>

										<div class="d-flex align-items-center gap-2 mb-2">
											<img
												src={booking.slot.user_id === booking.user.id
													? booking.user.avatar_cropped_url
													: dashboard.mentors.pool.find((m) => m.user.id === booking.slot.user_id)
															?.user.avatar_cropped_url}
												class="mentor-avatar"
												alt="mentor avatar"
											/>
											<div>
												{booking.slot.user_id === booking.user.id
													? `${booking.user.first_name} ${booking.user.last_name}`
													: dashboard.mentors.pool.find((m) => m.user.id === booking.slot.user_id)
															?.user.first_name}
											</div>
										</div>

										<div class="text-muted">
											<div>
												{new Date(booking.slot.start_time).toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric',
													year: 'numeric'
												})}
											</div>
											<div class="small">
												{new Date(booking.slot.start_time).toLocaleTimeString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
													timeZone: booking.slot.timezone
												})} -
												{new Date(booking.slot.end_time).toLocaleTimeString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
													timeZone: booking.slot.timezone
												})}
												({booking.slot.timezone})
											</div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Desktop table, hidden on mobile -->
							<div class="table-responsive d-none d-lg-block">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Session</th>
											<th>Mentor</th>
											<th>Date & Time</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.bookings as booking}
											<tr>
												<td>
													<div class="fw-bold">{booking.slot.title}</div>
													<div class="text-muted small">{booking.slot.skill.title}</div>
												</td>
												<td>
													<div class="d-flex align-items-center gap-2">
														<img
															src={booking.slot.user_id === booking.user.id
																? booking.user.avatar_cropped_url
																: dashboard.mentors.pool.find(
																		(m) => m.user.id === booking.slot.user_id
																	)?.user.avatar_cropped_url}
															class="mentor-avatar"
															alt="mentor avatar"
														/>
														<div>
															{booking.slot.user_id === booking.user.id
																? `${booking.user.first_name} ${booking.user.last_name}`
																: dashboard.mentors.pool.find(
																		(m) => m.user.id === booking.slot.user_id
																	)?.user.first_name}
														</div>
													</div>
												</td>
												<td>
													<div>
														{new Date(booking.slot.start_time).toLocaleDateString('en-US', {
															weekday: 'short',
															month: 'short',
															day: 'numeric',
															year: 'numeric'
														})}
													</div>
													<div class="text-muted small">
														{new Date(booking.slot.start_time).toLocaleTimeString('en-US', {
															hour: '2-digit',
															minute: '2-digit',
															timeZone: booking.slot.timezone
														})} -
														{new Date(booking.slot.end_time).toLocaleTimeString('en-US', {
															hour: '2-digit',
															minute: '2-digit',
															timeZone: booking.slot.timezone
														})}
														({booking.slot.timezone})
													</div>
												</td>
												<td>
													<a
														class="btn btn-info"
														on:click={() => {
															startChatRoom(booking.slot);
														}}>Enter Meeting</a
													>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No sessions scheduled yet.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Approved Menteeships -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-success bg-opacity-10">
						<h3 class="h5 mb-0">Actively Seeking Mentors in:</h3>
					</div>
					<div class="card-body">
						{#if dashboard.menteeships.approved.length > 0}
							<div class="mobile-cards d-block d-lg-none">
								{#each dashboard.menteeships.approved as menteeship}
									<div class="session-card p-3 mb-3">
										<div class="fw-bold mb-2"><Comic>{menteeship.skill.title}</Comic></div>
										<div class="text-muted mb-2">
											{menteeship.profession} @ {menteeship.company}
										</div>
										<span class="badge bg-success">Active</span>
									</div>
								{/each}
							</div>

							<div class="table-responsive d-none d-lg-block">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Learning Area</th>
											<th>Mentee Experience</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.menteeships.approved as menteeship}
											<tr>
												<td><Comic>{menteeship.skill.title}</Comic></td>
												<td>{menteeship.profession} @ {menteeship.company}</td>
												<td>
													<span class="badge bg-success">Active</span>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No active learning relationships at the moment.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Pending Menteeships -->
		{#if dashboard.menteeships.pending.length > 0}
			<div class="row mb-4">
				<div class="col-12">
					<div class="card">
						<div class="card-header bg-warning bg-opacity-10">
							<h3 class="h5 mb-0">Pending Requests</h3>
						</div>
						<div class="card-body">
							<div class="mobile-cards d-block d-lg-none">
								{#each dashboard.menteeships.pending as menteeship}
									<div class="session-card p-3 mb-3">
										<div class="fw-bold mb-2">
											<Comic status={menteeship.status}>{menteeship.skill.title}</Comic>
										</div>
										<div class="text-muted mb-2">
											{menteeship.profession} @ {menteeship.company}
										</div>
										<span class="badge bg-warning text-dark">Pending</span>
									</div>
								{/each}
							</div>

							<div class="table-responsive d-none d-lg-block">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Learning Area</th>
											<th>Mentor Experience</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.menteeships.pending as menteeship}
											<tr>
												<td><Comic status={menteeship.status}>{menteeship.skill.title}</Comic></td>
												<td>{menteeship.profession} @ {menteeship.company}</td>
												<td>
													<span class="badge bg-warning text-dark">Pending</span>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Available Mentors -->
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-info bg-opacity-10">
						<h3 class="h5 mb-0">Available Mentors</h3>
					</div>
					<div class="card-body">
						{#if dashboard.mentors.pool.length > 0}
							<div class="mobile-cards d-block d-lg-none">
								{#each dashboard.mentors.pool as mentor}
									<div class="session-card p-3 mb-3">
										<a
											href="/mentors/{mentor.user.id}"
											class="d-flex align-items-center gap-2 mb-2"
											style="text-decoration: none; color: inherit;"
										>
											<img
												src={mentor.user.avatar_cropped_url}
												class="mentor-avatar"
												alt="mentor avatar"
											/>
											<div class="fw-bold">
												{mentor.user.first_name}
												{mentor.user.last_name}
											</div>
										</a>
										<div class="text-muted">{mentor.profession} @ {mentor.company}</div>
									</div>
								{/each}
							</div>

							<div class="table-responsive d-none d-lg-block">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Mentor</th>
											<th>Mentor Experience</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.mentors.pool as mentor}
											<tr>
												<td style="font-weight: bold;">
													<a href="/mentors/{mentor.user.id}">
														<img src={mentor.user.avatar_cropped_url} class="mentor-avatar" />
														{mentor.user.first_name}
														{mentor.user.last_name}
													</a>
												</td>
												<td>{mentor.profession} @ {mentor.company}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No mentors available at the moment.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-primary bg-opacity-10">
						<h3 class="h5 mb-0">Upcoming Sessions</h3>
					</div>
					<div class="card-body">
						{#if dashboard.mentors.sessions && dashboard.mentors.sessions.length > 0}
							<div class="mobile-cards">
								{#each dashboard.mentors.sessions as session}
									<div class="session-card p-3 mb-3">
										<div class="d-flex justify-content-between align-items-start mb-3">
											<div>
												<div class="fw-bold">{session.title}</div>
												<div class="text-muted small">{session.skill.title}</div>
											</div>
											<a class="btn btn-info btn-sm" on:click={() => {}}>Book Meeting</a>
										</div>

										<div class="d-flex align-items-center gap-2 mb-2">
											<img
												src={session.user.avatar_cropped_url}
												class="mentor-avatar"
												alt="mentor avatar"
											/>
											<div>
												{session.user.first_name}
											</div>
										</div>

										<div class="text-muted">
											<div>
												{new Date(session.start_time).toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric',
													year: 'numeric'
												})}
											</div>
											<div class="small">
												{new Date(session.start_time).toLocaleTimeString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
													timeZone: session.timezone
												})} -
												{new Date(session.end_time).toLocaleTimeString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
													timeZone: session.timezone
												})}
												({session.timezone})
											</div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Desktop table, hidden on mobile -->
							<div class="table-responsive d-none d-lg-block">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Session</th>
											<th>Mentor</th>
											<th>Date & Time</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.mentors.sessions as session}
											<tr>
												<td>
													<div class="fw-bold">{session.title}</div>
													<div class="text-muted small">{session.skill.title}</div>
												</td>
												<td>
													<div class="d-flex align-items-center gap-2">
														<img
															src={session.user.avatar_cropped_url}
															class="mentor-avatar"
															alt="mentor avatar"
														/>
														<div>
															{session.user.first_name}
														</div>
													</div>
												</td>
												<td>
													<div>
														{new Date(session.start_time).toLocaleDateString('en-US', {
															weekday: 'short',
															month: 'short',
															day: 'numeric',
															year: 'numeric'
														})}
													</div>
													<div class="text-muted small">
														{new Date(session.start_time).toLocaleTimeString('en-US', {
															hour: '2-digit',
															minute: '2-digit',
															timeZone: session.timezone
														})} -
														{new Date(session.end_time).toLocaleTimeString('en-US', {
															hour: '2-digit',
															minute: '2-digit',
															timeZone: session.timezone
														})}
														({session.timezone})
													</div>
												</td>
												<td>
													<a
														class="btn btn-info"
														on:click={() => {
															startChatRoom(session);
														}}>Enter Meeting</a
													>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{:else}
							<p class="text-muted mb-0">No sessions scheduled yet.</p>
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
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid white;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
	}

	.session-card {
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 0.5rem;
		background-color: #fff;
	}

	/* Reduce avatar size on very small screens */
	@media (max-width: 380px) {
		.mentor-avatar {
			width: 40px;
			height: 40px;
		}
	}

	/* Make sure buttons don't overflow on small screens */
	@media (max-width: 576px) {
		.btn-sm {
			padding: 0.25rem 0.5rem;
			font-size: 0.75rem;
		}
	}

	@media (min-width: 992px) {
		.mobile-cards {
			display: none;
		}
	}
</style>
