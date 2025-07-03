<script lang="ts">
	import API from '$lib/api/api';
	import { onMount } from 'svelte';

	let clubs: Array<any> = [];
	let loading = false;
	let error = '';
	let newClubTitle = '';
	let creating = false;

	async function fetchClubs() {
		loading = true;
		error = '';
		try {
			clubs = await API.get('/clubs');
		} catch (e) {
			error = 'Failed to load clubs.';
		} finally {
			loading = false;
		}
	}

	async function createClub() {
		if (!newClubTitle.trim()) return;
		creating = true;
		error = '';
		try {
			const res = await API.post('/clubs', { club: { title: newClubTitle.trim() } });
			clubs = [res, ...clubs];
			newClubTitle = '';
		} catch (e) {
			error = 'Failed to create club.';
		} finally {
			creating = false;
		}
	}

	onMount(fetchClubs);
</script>

<div class="container py-4">
	<h2 class="display-6 mb-4">Clubs</h2>

	<form class="mb-4 d-flex gap-2" on:submit|preventDefault={createClub}>
		<input
			type="text"
			class="form-control"
			placeholder="New club title..."
			bind:value={newClubTitle}
			disabled={creating}
		/>
		<button class="btn btn-primary" type="submit" disabled={creating || !newClubTitle.trim()}>
			{creating ? 'Creating...' : 'Create Club'}
		</button>
	</form>

	{#if loading}
		<div>Loading clubs...</div>
	{:else if error}
		<div class="text-danger">{error}</div>
	{:else if clubs.length === 0}
		<div>No clubs found.</div>
	{:else}
		<div class="clubs-list">
			{#each clubs as club}
				<div class="club-card">
					<button class="btn btn-outline-primary btn-sm request-entry-btn">Request Entry</button>
					<h4>{club.title}</h4>
					<!-- <div class="text-muted small">
						Created: {new Date(club.created_at).toLocaleDateString()}
					</div> -->
					<div class="text-muted small">Members: {club.club_members?.length || 0}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.clubs-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}
	.club-card {
		background: #fff;
		border: 1px solid #e9ecef;
		border-radius: 0.75rem;
		padding: 1.25rem 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		min-width: 220px;
		max-width: 320px;
		flex: 1 1 220px;
		position: relative;
	}
	.club-card h4 {
		margin-bottom: 0.5rem;
	}
	.request-entry-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 2;
	}
</style>
