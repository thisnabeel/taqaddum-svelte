<script lang="ts">
	import { goto } from '$app/navigation';
	import API from '$lib/api/api';
	import Comic from '$lib/components/Buttons/comic.svelte';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import SkillFilter from '$lib/components/Skills/SkillFilter.svelte';
	import QuestionCard from '$lib/components/CareerQuestions/QuestionCard.svelte';

	interface Mentee {
		user: {
			first_name: string;
			last_name: string;
			avatar_cropped_url: string;
		};
		profession: string;
		company: string;
		skill: {
			id: number;
			title: string;
		};
		menteeships: Array<{
			skill: {
				id: number;
			};
			profession: string;
		}>;
		first_name: string;
		last_name: string;
		avatar_cropped_url: string;
	}

	interface Slot {
		id: number;
		title: string;
		description?: string;
		start_time: string;
		end_time: string;
		timezone: string;
		user_id: number;
		skill: {
			id: number;
			title: string;
		};
		mentees: Mentee[];
	}

	interface Dashboard {
		bookings: Slot[];
		mentees: {
			pool: Mentee[];
		};
		mentorships: {
			approved: any[];
			pending: any[];
		};
	}

	let dashboard: Dashboard | null = null;
	let selectedSkill: string | null = null;
	let uniqueSkills: string[] = [];
	let mentorQuestions: any[] = [];
	let loadingMentorQuestions = false;
	let selectedTab = 0;

	onMount(() => {
		getDashboard();
		fetchMentorQuestions();
	});

	async function getDashboard() {
		dashboard = await API.get(`/mentors/${$user.id}/dashboard`);
		if (dashboard?.mentees?.pool) {
			uniqueSkills = [...new Set(dashboard.mentees.pool.map((mentee) => mentee.skill.title))];
		}
	}

	async function fetchMentorQuestions() {
		if (!$user?.id) return;
		loadingMentorQuestions = true;
		try {
			mentorQuestions = await API.get(`/questions/for/${$user.id}`);
		} catch (error) {
			console.error('Error fetching mentor questions:', error);
			mentorQuestions = [];
		} finally {
			loadingMentorQuestions = false;
		}
	}

	$: filteredMentees = dashboard?.mentees?.pool
		? selectedSkill
			? dashboard.mentees.pool.filter((mentee) => mentee.skill.title === selectedSkill)
			: dashboard.mentees.pool
		: [];

	async function startChatRoom(slot: Slot) {
		const code = await generateChatRoomId(slot);
		goto('/video/' + code + '/2');
	}

	async function generateChatRoomId(slot: Slot) {
		const keyData = JSON.stringify({
			title: slot.title.trim().toLowerCase(),
			date: slot.start_time,
			start_time: slot.start_time,
			mentor_id: slot.user_id,
			skill_id: slot.skill.id
		});

		const encoder = new TextEncoder();
		const data = encoder.encode(keyData);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));

		return hashArray
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('')
			.slice(0, 10);
	}
</script>

<div class="container py-4">
	{#if dashboard}
		<!-- <div class="row"> -->
		<!-- <div class="col-12 mb-4"> -->
		<!-- <h2 class="display-6 mb-3">My Mentorship Dashboard</h2> -->
		<!-- </div> -->
		<!-- </div> -->

		<!-- I want tabs based on mentorships i have -->
		{#if dashboard && dashboard.mentorships && dashboard.mentorships.approved.length > 0}
			<div class="mentorship-tabs">
				{#each dashboard.mentorships.approved as mentorship, i}
					<button
						class:selected={selectedTab === i}
						on:click={() => (selectedTab = i)}
						type="button"
					>
						{mentorship.skill.title}
					</button>
				{/each}
			</div>
			<div class="tab-content">
				{#each dashboard.mentorships.approved as mentorship, i}
					{#if selectedTab === i}
						<div>
							<h4>{mentorship.profession} @ {mentorship.company}</h4>
							<!-- Add more mentorship-specific content here -->
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-warning bg-opacity-10">
						<h3 class="h5 mb-0">Career Questions Pool</h3>
					</div>
					<div class="card-body">
						{#if loadingMentorQuestions}
							<div class="text-center py-3">
								<div class="spinner-border text-primary" role="status">
									<span class="visually-hidden">Loading...</span>
								</div>
								<p class="text-muted mt-2">Loading questions for you...</p>
							</div>
						{:else if mentorQuestions.length > 0}
							<div class="questions-list">
								{#each mentorQuestions as question (question.id)}
									<QuestionCard {question} />
								{/each}
							</div>
						{:else}
							<div class="no-questions text-center py-4">
								<div class="text-muted">
									<i class="fa fa-question-circle fa-2x mb-2"></i>
									<p>No career questions for you yet.</p>
									<p class="small">You'll see mentee questions here as they come in.</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Booked Sessions -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header bg-primary bg-opacity-10">
						<h3 class="h5 mb-0">My Upcoming Sessions</h3>
					</div>
					<div class="card-body">
						{#if dashboard.bookings && dashboard.bookings.some((slot) => (slot.mentees || []).length > 0)}
							<!-- Mobile view - card based layout -->
							<div class="mobile-cards d-block d-lg-none">
								{#each dashboard.bookings.filter((slot) => (slot.mentees || []).length > 0) as slot}
									<div class="session-card p-3 mb-3">
										<div class="d-flex justify-content-between align-items-start mb-3">
											<div>
												<div class="fw-bold">{slot.title}</div>
												<div class="text-muted small">{slot.skill.title}</div>
												{#if slot.description}
													<div class="text-muted small">{slot.description}</div>
												{/if}
											</div>
											<a
												class="btn btn-info btn-sm"
												on:click={() => {
													startChatRoom(slot);
												}}>Enter Meeting</a
											>
										</div>

										<div class="mb-3">
											<div class="fw-bold mb-1">Mentees:</div>
											<div class="d-flex gap-1 align-items-center flex-wrap">
												{#each slot.mentees || [] as mentee}
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
																?.profession || 'No Experience listed'}
														</span>
													</div>
												{/each}
											</div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Desktop view - table layout -->
							<div class="table-responsive d-none d-lg-block">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Session Details</th>
											<th>Mentees</th>
											<th>Date & Time</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{#each dashboard.bookings.filter((slot) => (slot.mentees || []).length > 0) as slot}
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
														{#each slot.mentees || [] as mentee}
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
																		?.profession || 'No Experience listed'}
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

		<!-- Mentee Pool -->
		{#if false}
			<div class="row mb-4">
				<div class="col-12">
					<div class="card">
						<div class="card-header bg-info bg-opacity-10">
							<h3 class="h5 mb-0">Available Mentees</h3>
						</div>
						<div class="card-body">
							{#if dashboard?.mentees?.pool?.length > 0}
								<SkillFilter bind:selectedSkill skills={uniqueSkills} />

								<div class="mentees-scroll-container">
									{#each filteredMentees as mentee}
										<div class="mentee-card">
											<div class="mentee-connect-btn">
												<button
													class="btn btn-outline-primary btn-sm rounded-circle"
													title="Connect with mentee"
												>
													<i class="fa fa-user-plus"></i>
												</button>
											</div>
											<div class="mentee-avatar-wrapper mb-3">
												<img
													src={mentee.user.avatar_cropped_url || '/placeholder.png'}
													class="mentor-avatar"
													alt={`${mentee.user.first_name} ${mentee.user.last_name}`}
												/>
											</div>
											<div class="mentee-info">
												<div class="fw-bold text-center mb-2 blurred-text">
													<!-- {mentee.user.first_name} -->
													<!-- {mentee.user.last_name} -->
													Name Hidden
												</div>

												<div class="text-muted text-center mb-2">
													{mentee.profession} <br />@ {mentee.company}
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-muted mb-0">No mentees available in the pool.</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Mentorships Section -->
			<div class="row mb-4">
				<div class="col-12">
					<div class="card">
						<div class="card-header bg-success bg-opacity-10">
							<h3 class="h5 mb-0">My Mentorships</h3>
						</div>
						<div class="card-body">
							{#if dashboard.mentorships.approved.length > 0 || dashboard.mentorships.pending.length > 0}
								<div class="mentorships-scroll-container">
									{#each dashboard.mentorships.approved as mentorship}
										<div class="mentorship-card">
											<div class="mentorship-status">
												<span class="badge bg-success">Active</span>
											</div>
											<div class="mentorship-info">
												<div class="skill-title mb-3">
													<Comic>{mentorship.skill.title}</Comic>
												</div>
												<div class="text-muted">
													{mentorship.profession} <br />@ {mentorship.company}
												</div>
											</div>
										</div>
									{/each}

									{#each dashboard.mentorships.pending as mentorship}
										<div class="mentorship-card pending">
											<div class="mentorship-status">
												<span class="badge bg-warning text-dark">{mentorship.status}</span>
											</div>
											<div class="mentorship-info">
												<div class="skill-title mb-3">
													<Comic status={mentorship.status}>{mentorship.skill.title}</Comic>
												</div>
												<div class="text-muted">
													{mentorship.profession} <br />@ {mentorship.company}
												</div>
												<div class="tagline">
													<textarea class="form-control" placeholder="Add a tagline" />
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-muted mb-0">No mentorships at the moment.</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
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

	/* Tooltip styling */
	.mentee-avatar-container {
		position: relative;
	}

	.mentee-info-tooltip {
		position: absolute;
		left: 50%;
		bottom: 100%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		white-space: nowrap;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s,
			visibility 0.2s;
		z-index: 100;
	}

	.mentee-avatar-container:hover .mentee-info-tooltip {
		opacity: 1;
		visibility: visible;
	}

	/* Mobile-specific adjustments */
	@media (max-width: 380px) {
		.mentor-avatar {
			width: 40px;
			height: 40px;
			border-width: 2px;
		}
	}

	.mentees-scroll-container {
		display: flex;
		overflow-x: scroll;
		gap: 1rem;
		padding: 0.5rem 0.25rem 1rem;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thin;
		margin: 0 -0.25rem;
	}

	.mentees-scroll-container::-webkit-scrollbar {
		height: 8px;
		display: block;
	}

	.mentees-scroll-container::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
		margin: 0 0.25rem;
	}

	.mentees-scroll-container::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 4px;
		min-width: 40px;
	}

	.mentees-scroll-container::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	.mentee-card {
		position: relative;
		flex: 0 0 auto;
		width: 280px;
		padding: 1.5rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.mentee-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.mentee-avatar-wrapper {
		display: flex;
		justify-content: center;
	}

	.mentee-avatar-wrapper .mentor-avatar {
		width: 100px;
		height: 100px;
		border-width: 4px;
	}

	.mentee-info {
		text-align: center;
	}

	/* Mentorship Cards Styling */
	.mentorships-scroll-container {
		display: flex;
		overflow-x: scroll;
		gap: 1rem;
		padding: 0.5rem 0.25rem 1rem;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thin;
		margin: 0 -0.25rem;
	}

	.mentorships-scroll-container::-webkit-scrollbar {
		height: 8px;
		display: block;
	}

	.mentorships-scroll-container::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
		margin: 0 0.25rem;
	}

	.mentorships-scroll-container::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 4px;
		min-width: 40px;
	}

	.mentorships-scroll-container::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	.mentorship-card {
		flex: 0 0 auto;
		width: 260px;
		padding: 1.5rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		position: relative;
	}

	.mentorship-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.mentorship-status {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	.mentorship-info {
		text-align: center;
	}

	.mentorship-info .skill-title {
		margin-top: 2.5rem;
	}

	.blurred-text {
		filter: blur(4px);
	}

	@media (max-width: 576px) {
		.btn-sm {
			padding: 0.25rem 0.5rem;
			font-size: 0.75rem;
		}

		.smaller {
			font-size: 0.7rem;
		}

		.mentee-card {
			width: 240px;
			padding: 1rem;
		}

		.mentee-avatar-wrapper .mentor-avatar {
			width: 80px;
			height: 80px;
		}
	}

	/* Add these styles */
	.mentee-connect-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1;
	}

	.mentee-connect-btn button {
		width: 32px;
		height: 32px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.mentee-connect-btn button:hover {
		transform: scale(1.1);
	}

	.mentee-connect-btn i {
		font-size: 1rem;
	}

	.mentorship-tabs {
		display: flex;
		gap: 0.5rem;
		border-bottom: 2px solid #e9ecef;
		margin-bottom: 1rem;
	}

	.mentorship-tabs button {
		background: none;
		border: none;
		border-radius: 0.5rem 0.5rem 0 0;
		padding: 0.75em 1.5em;
		font-size: 1rem;
		font-weight: 600;
		color: #495057;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
		border-bottom: 2px solid transparent;
	}

	.mentorship-tabs button.selected,
	.mentorship-tabs button:focus {
		background: #fff;
		color: #007bff;
		border-bottom: 2px solid #007bff;
		outline: none;
	}

	.tab-content {
		padding: 1.5em 0 0.5em 0;
	}
</style>
