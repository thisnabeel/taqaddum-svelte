<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import API from '$lib/api/api';
	import Comic from '$lib/components/Buttons/comic.svelte';

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
	}

	let skill: any = null;
	let mentees: Mentee[] = [];
	let loading = true;
	let error: string | null = null;

	async function fetchMentees(skillId: number) {
		try {
			mentees = await API.get(`/skills/${skillId}/mentees`);
		} catch (e) {
			console.error('Failed to load mentees:', e);
		}
	}

	onMount(async () => {
		try {
			const slug = $page.params.slug;
			skill = await API.get(`/skills/${slug.toLowerCase()}`);
			if (skill?.id) {
				await fetchMentees(skill.id);
			}
		} catch (e) {
			error = 'Failed to load skill details';
		} finally {
			loading = false;
		}
	});
</script>

<div class="container py-4">
	{#if loading}
		<div class="text-center">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	{:else if error}
		<div class="alert alert-danger" role="alert">
			{error}
		</div>
	{:else if skill}
		<div class="row">
			<div class="col-12">
				<h1 class="display-5 mb-4">
					<Comic>{skill.title}</Comic>
				</h1>

				{#if skill.description}
					<div class="card mb-4">
						<div class="card-body">
							<p class="card-text">{skill.description}</p>
						</div>
					</div>
				{/if}

				<!-- Mentees Section -->
				<div class="card">
					<div class="card-header bg-info bg-opacity-10">
						<h3 class="h5 mb-0">Available Mentees</h3>
					</div>
					<div class="card-body">
						{#if mentees.length > 0}
							<div class="mentees-scroll-container">
								{#each mentees as mentee}
									<div class="mentee-card">
										<div class="mentee-avatar-wrapper mb-3">
											<img
												src={mentee.avatar_cropped_url}
												class="mentor-avatar"
												alt={`${mentee.first_name} ${mentee.last_name}`}
											/>
										</div>
										<div class="mentee-info">
											<div class="fw-bold text-center mb-2">
												{mentee.first_name}
												{mentee.last_name}
											</div>
											<div class="text-muted text-center mb-2">
												{mentee.menteeship.profession} <br />@ {mentee.menteeship.company}
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-muted mb-0">No mentees available for this skill.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="alert alert-info" role="alert">Skill not found</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
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

	.mentor-avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid white;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
	}

	.mentee-info {
		text-align: center;
	}

	@media (max-width: 576px) {
		.mentee-card {
			width: 240px;
			padding: 1rem;
		}

		.mentor-avatar {
			width: 80px;
			height: 80px;
		}
	}
</style>
