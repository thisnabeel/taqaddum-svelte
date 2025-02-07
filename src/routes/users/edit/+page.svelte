<script>
	import { onMount } from 'svelte';
	import AvatarPicker from '$lib/components/Avatar/AvatarPicker.svelte';
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';
	import Search from '$lib/components/Skills/Search.svelte';

	let first_name = '';
	let last_name = '';
	let email = '';
	let profession = '';
	let errorMessage = '';
	let successMessage = '';
	let avatar = null;
	let avatarPreview = '/default-avatar.png'; // Placeholder image

	let mentorSkills = [null, null, null];
	let menteeSkills = [null, null, null];

	onMount(async () => {});

	user.subscribe((response) => {
		if (response) {
			first_name = response.first_name;
			last_name = response.last_name;
			email = response.email;
			profession = response.profession;
			avatarPreview = response.avatar || avatarPreview;
			mentorSkills = response.mentor_skills || [null, null, null];
			menteeSkills = response.mentee_skills || [null, null, null];
		}
	});
	async function updateUser() {
		errorMessage = '';
		successMessage = '';

		if (!first_name || !last_name || !email || !profession) {
			errorMessage = 'All fields are required.';
			return;
		}

		try {
			const response = await API.put('/users/update', {
				user: {
					first_name,
					last_name,
					email,
					profession,
					mentor_skills: mentorSkills.filter((s) => s),
					mentee_skills: menteeSkills.filter((s) => s),
					avatar
				}
			});

			if (response.id) {
				successMessage = 'Profile updated successfully!';
				user.set(response);
			} else {
				errorMessage = 'Something went wrong. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Network error. Please try again.';
		}
	}
</script>

<div class="container d-flex justify-content-center p-4">
	<div class="card shadow p-4" style="width: 400px;">
		<h2 class="text-center mb-3">Edit Profile</h2>

		{#if errorMessage}
			<div class="alert alert-danger">{errorMessage}</div>
		{/if}
		{#if successMessage}
			<div class="alert alert-success">{successMessage}</div>
		{/if}

		<!-- Avatar Upload Component -->
		<AvatarPicker />

		<div class="mb-3">
			<label class="form-label">First Name</label>
			<input type="text" bind:value={first_name} class="form-control" placeholder="First Name" />
		</div>

		<div class="mb-3">
			<label class="form-label">Last Name</label>
			<input type="text" bind:value={last_name} class="form-control" placeholder="Last Name" />
		</div>

		<div class="mb-3">
			<label class="form-label">Email</label>
			<input disabled type="email" bind:value={email} class="form-control" placeholder="Email" />
		</div>

		<div class="mb-3">
			<label class="form-label">Profession</label>
			<input
				type="text"
				bind:value={profession}
				class="form-control"
				placeholder="Your Profession"
			/>
		</div>

		<div class="mb-3">
			<label class="form-label">Willing to Mentor In: (Select up to 3)</label>
			{#each mentorSkills as skill, index}
				<Search placeholder="Search Expertise..." bind:selectedValue={mentorSkills[index]}></Search>
			{/each}
		</div>

		<div class="mb-3">
			<label class="form-label">Seeking Mentors In: (Select up to 3)</label>
			{#each menteeSkills as skill, index}
				<Search placeholder="Search Interest..." bind:selectedValue={menteeSkills[index]}></Search>
			{/each}
		</div>

		<button on:click={updateUser} class="btn btn-primary w-100">Save Changes</button>

		<p class="text-center mt-3">
			<a href="/">Back to Home</a>
		</p>
	</div>
</div>

<style>
	.container {
		background: #f8f9fa;
	}

	.card {
		border-radius: 10px;
	}

	.form-control:focus {
		border-color: #0d6efd;
		box-shadow: 0 0 5px rgba(13, 110, 253, 0.5);
	}

	.btn-primary {
		background-color: #007bff;
		border: none;
	}

	.btn-primary:hover {
		background-color: #0056b3;
	}
</style>
