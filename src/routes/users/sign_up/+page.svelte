<script>
	import { onMount } from 'svelte';
	import AvatarPicker from '$lib/components/Avatar/AvatarPicker.svelte'; // Importing the avatar picker component
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';
	import Search from '$lib/components/Skills/Search.svelte';
	import { avatar_cropped_blob_url } from '$lib/stores/signingUpStore';

	let first_name = '';
	let last_name = '';
	let email = '';
	let password = '';
	let password_confirmation = '';
	let profession = '';
	let errorMessage = '';
	let successMessage = '';
	let avatar = null;
	let avatarPreview = '/default-avatar.png'; // Placeholder image

	let mentorSkills = [null, null, null];
	let menteeSkills = [null, null, null];

	$: console.log(mentorSkills);
	$: console.log(menteeSkills);

	async function register() {
		errorMessage = '';
		successMessage = '';

		if (!first_name || !last_name || !email || !password || !password_confirmation || !profession) {
			errorMessage = 'All fields are required.';
			return;
		}

		if (!$avatar_cropped_blob_url) {
			errorMessage = 'Avatar Image is Required.';
			return;
		}

		if (password !== password_confirmation) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		try {
			const response = await API.post('/users', {
				user: {
					first_name: first_name,
					last_name: last_name,
					email: email,
					password: password,
					password_confirmation: password_confirmation,
					profession: profession,
					mentor_skills: mentorSkills.filter((s) => s),
					mentee_skills: menteeSkills.filter((s) => s)
				}
			});

			console.log(response);

			if (response.id) {
				successMessage = 'Account created successfully! Redirecting...';
				user.set(response);
				setTimeout(() => (window.location.href = '/'), 2000);
			} else {
				const data = await response.json();
				errorMessage = data.error || 'Something went wrong. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Network error. Please try again.';
		}
	}
</script>

<div class="container d-flex justify-content-center p-4">
	<div class="card shadow p-4" style="width: 400px;">
		<h2 class="text-center mb-3">Create an Account</h2>

		{#if errorMessage}
			<div class="alert alert-danger">{errorMessage}</div>
		{/if}
		{#if successMessage}
			<div class="alert alert-success">{successMessage}</div>
		{/if}

		<!-- Avatar Upload Component -->
		<AvatarPicker signingUp={true} />

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
			<input type="email" bind:value={email} class="form-control" placeholder="Email" />
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
			{#each mentorSkills as skill}
				<Search placeholder="Search Expertise..." bind:selectedValue={skill}></Search>
			{/each}
		</div>

		<div class="mb-3">
			<label class="form-label">Seeking Mentors In: (Select up to 3)</label>
			{#each menteeSkills as skill}
				<Search placeholder="Search Interest..." bind:selectedValue={skill}></Search>
			{/each}
		</div>

		<div class="mb-3">
			<label class="form-label">Password</label>
			<input type="password" bind:value={password} class="form-control" placeholder="Password" />
		</div>

		<div class="mb-3">
			<label class="form-label">Confirm Password</label>
			<input
				type="password"
				bind:value={password_confirmation}
				class="form-control"
				placeholder="Confirm Password"
			/>
		</div>

		<button on:click={register} class="btn btn-primary w-100">Sign Up</button>

		<p class="text-center mt-3">
			Already have an account? <a href="/sign_in">Log in</a>
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
</style>
