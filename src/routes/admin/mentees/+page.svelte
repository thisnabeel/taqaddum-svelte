<script>
	import API from '$lib/api/api';
	import AdminWall from '$lib/components/Admin/AdminWall.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let activeTab = 'pending';
	let mentees = writable({ pending: [], approved: [] });

	async function fetchMentees() {
		try {
			const response = await API.get('/list/mentees');

			mentees.set({
				pending: response['pending approval'] || [],
				approved: response['approved'] || []
			});
		} catch (error) {
			console.error('Error fetching mentees:', error);
		}
	}

	async function toggleStatus(menteeship) {
		const newStatus = menteeship.status === 'pending approval' ? 'approved' : 'pending approval';

		try {
			await API.put(`/menteeships/${menteeship.id}`, { id: menteeship.id, status: newStatus });
			fetchMentees(); // Refresh list after update
		} catch (error) {
			console.error('Error updating status:', error);
		}
	}

	onMount(fetchMentees);
</script>

<AdminWall>
	<div class="container mt-4">
		<h1 class="text-center">Mentees Management</h1>

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
						{#each $mentees.pending || [] as menteeship}
							<tr>
								<td>
									<a href="/mentees/{menteeship.user.id}"
										>{menteeship.user.first_name} {menteeship.user.last_name}</a
									>
								</td>
								<td><b>{menteeship.profession}</b> <br />@ {menteeship.company}</td>
								<td>{menteeship.skill.title}</td>
								<td>
									<button class="btn btn-primary btn-sm" on:click={() => toggleStatus(menteeship)}
										>Approve</button
									>
								</td>
							</tr>
						{/each}
					{:else}
						{#each $mentees.approved || [] as menteeship}
							<tr>
								<td>
									<a href="/mentees/{menteeship.user.id}"
										>{menteeship.user.first_name} {menteeship.user.last_name}</a
									>
								</td>
								<td><b>{menteeship.profession}</b> <br />@ {menteeship.company}</td>
								<td>{menteeship.skill.title}</td>
								<td>
									<button
										class="btn btn-outline-danger btn-sm"
										on:click={() => toggleStatus(menteeship)}>Revoke</button
									>
								</td>
							</tr>
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
