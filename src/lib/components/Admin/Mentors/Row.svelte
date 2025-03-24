<script>
	import API from '$lib/api/api';

	export let mentorship;
	export let toggleStatus;
	export let removeMentorship;
	export let category;

	let toggling = false;
	let showSettings = false;
	let showDeleteConfirmation = false;

	function toggle() {
		// toggling = true;
		toggleStatus(mentorship);
		// toggling = false;
	}

	function toggleSettings() {
		showSettings = !showSettings;
		if (!showSettings) {
			showDeleteConfirmation = false;
		}
	}

	function confirmDelete() {
		showDeleteConfirmation = true;
	}

	function cancelDelete() {
		showDeleteConfirmation = false;
	}

	async function deleteMentorship() {
		// Here you would add the API call to delete the mentorship

		// Example API call:
		// fetch(`/api/mentorships/${mentorship.id}`, {
		//   method: 'DELETE',
		//   headers: {
		//     'Content-Type': 'application/json',
		//   },
		// })
		// .then(response => response.json())
		// .then(data => {
		//   console.log('Success:', data);
		//   // Handle success (e.g., remove row or refresh data)
		// })
		// .catch((error) => {
		//   console.error('Error:', error);
		//   // Handle error
		// });
		await removeMentorship(mentorship);
		// Reset state
		showDeleteConfirmation = false;
		showSettings = false;
	}
</script>

<tr>
	<td>
		<a href="/mentors/{mentorship.user.id}"
			>{mentorship.user.first_name} {mentorship.user.last_name}</a
		>
	</td>
	<td><b>{mentorship.profession}</b> <br />@ {mentorship.company}</td>
	<td>{mentorship.skill.title}</td>
	<td>
		{#if toggling}
			<button class="btn btn-primary">
				<div class="spinner-border text-primary" role="status"></div>
			</button>
		{:else if category === 'approve'}
			<button class="btn btn-info btn-sm" on:click={toggle}>Approve</button>
		{:else}
			<button class="btn btn-danger btn-sm" on:click={toggle}>Deny</button>
		{/if}
		<slot></slot>
		<div class="button btn btn-outline-warning" on:click={toggleSettings}>
			<i class="fa fa-cog"></i>
		</div>
	</td>
</tr>

{#if showSettings}
	<tr class="settings-row">
		<td colspan="4">
			<div class="settings-container p-3 bg-light border">
				<h6>Mentorship Settings</h6>

				{#if showDeleteConfirmation}
					<div class="alert alert-danger">
						<p>Are you sure you want to delete this mentorship?</p>
						<div class="d-flex gap-2">
							<button class="btn btn-sm btn-danger" on:click={() => deleteMentorship(mentorship)}>
								Confirm Delete
							</button>
							<button class="btn btn-sm btn-secondary" on:click={cancelDelete}> Cancel </button>
						</div>
					</div>
				{:else}
					<button class="btn btn-sm btn-outline-danger" on:click={confirmDelete}>
						<i class="fa fa-trash"></i> Delete Mentorship
					</button>
				{/if}
			</div>
		</td>
	</tr>
{/if}

<style>
	.settings-container {
		border-radius: 4px;
		margin-bottom: 10px;
	}
</style>
