<script>
	import API from '$lib/api/api';
	import AdminWall from '$lib/components/Admin/AdminWall.svelte';
	import MentorRow from '$lib/components/Admin/Mentors/Row.svelte';
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

	async function toggleStatus(mentorship) {
		const newStatus = mentorship.status === 'pending approval' ? 'approved' : 'pending approval';

		try {
			await API.put(`/mentorships/${mentorship.id}`, { id: mentorship.id, status: newStatus });
			fetchMentors(); // Refresh list after update
		} catch (error) {
			console.error('Error updating status:', error);
		}
	}

	async function removeMentorship(mentorship) {
		try {
			console.log('Deleting mentorship:', mentorship.id);
			await API.delete('/mentorships/' + mentorship.id);
			mentors.set({
				pending: $mentors.pending.filter((m) => m.id !== mentorship.id),
				approved: $mentors.approved.filter((m) => m.id !== mentorship.id)
			});
			return Promise.resolve('Deleted');
		} catch (error) {
			return Promise.reject(error);
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
					on:click={() => (activeTab = 'pending')}>Pending Approval</a
				>
			</li>
			<li class="nav-item">
				<a
					class="nav-link {activeTab === 'approved' ? 'active' : ''}"
					href="#"
					on:click={() => (activeTab = 'approved')}>Approved</a
				>
			</li>
		</ul>

		<!-- Mentor Table -->
		<div class="table-responsive mt-4">
			<table class="table table-striped table-bordered">
				<thead class="table-dark">
					<tr>
						<th>Name</th>
						<th>Profession</th>
						<th>Skill</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#if activeTab === 'pending'}
						{#each $mentors.pending || [] as mentorship}
							<MentorRow {mentorship} {toggleStatus} {removeMentorship} category={'approve'}
							></MentorRow>
						{/each}
					{:else}
						{#each $mentors.approved || [] as mentorship}
							<MentorRow {mentorship} {toggleStatus} {removeMentorship} category={'deny'}
							></MentorRow>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</AdminWall>

<style>
	.container {
		max-width: 1400px;
	}
</style>
