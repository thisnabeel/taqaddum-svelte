<script>
	import API from '$lib/api/api';
	import AdminWall from '$lib/components/Admin/AdminWall.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let activeTab = 'pending';
	let mentors = writable({ pending: [], approved: [] });

	async function fetchMentors() {
		try {
			const response = await API.get('/list/mentors');

			mentors.set({
				pending: response['pending approval'] || [],
				approved: response['approved'] || []
			});
		} catch (error) {
			console.error('Error fetching mentors:', error);
		}
	}

	async function toggleStatus(user) {
		const newStatus = user.status === 'pending approval' ? 'approved' : 'pending approval';

		try {
			await API.put(`/users/update`, { id: user.id, status: newStatus });
			fetchMentors(); // Refresh list after update
		} catch (error) {
			console.error('Error updating status:', error);
		}
	}

	onMount(fetchMentors);
</script>

<AdminWall>
	<div class="container mt-4">
		<h1 class="text-center">Mentors Management</h1>
		<!-- Tabs -->
		<ul class="nav nav-tabs justify-content-center">
			<li class="nav-item">
				<a
					class="nav-link {activeTab === 'pending' ? 'active' : ''}"
					href="#"
					on:click={() => (activeTab = 'pending')}
				>
					Pending Approval
				</a>
			</li>
			<li class="nav-item">
				<a
					class="nav-link {activeTab === 'approved' ? 'active' : ''}"
					href="#"
					on:click={() => (activeTab = 'approved')}
				>
					Approved
				</a>
			</li>
		</ul>

		<!-- User List -->
		<div class="row justify-content-center mt-4">
			<div class="col-md-6">
				{#if activeTab === 'pending'}
					<div class="list-group">
						{#each $mentors.pending as user}
							<div class="list-group-item d-flex justify-content-between align-items-center">
								<a href="/mentors/{user.id}">{user.id}: {user.first_name} {user.last_name}</a>
								<button class="btn btn-primary btn-sm" on:click={() => toggleStatus(user)}
									>Approve</button
								>
							</div>
						{/each}
					</div>
				{:else}
					<div class="list-group">
						{#each $mentors.approved as user}
							<div class="list-group-item d-flex justify-content-between align-items-center">
								<a href="/mentors/{user.id}">{user.id}: {user.first_name} {user.last_name}</a>
								<button class="btn btn-outline-danger btn-sm" on:click={() => toggleStatus(user)}
									>Revert</button
								>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</AdminWall>

<style>
	.container {
		max-width: 600px;
	}
</style>
