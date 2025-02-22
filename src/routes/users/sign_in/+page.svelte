<script>
	import { onMount } from 'svelte';
	import AvatarPicker from '$lib/components/Avatar/Picker.svelte'; // Importing the avatar picker component
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';

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

	$: successStatus = successMessage === 'Signed In successfully! Redirecting...';

	let formFor = '';

	async function register() {
		if (successStatus) return;
		errorMessage = '';
		successMessage = '';

		if (!email || !password) {
			errorMessage = 'All fields are required.';
			return;
		}

		try {
			const response = await API.post('/users/sign_in', {
				user: {
					email: email,
					password: password,
					type: formFor
				}
			});

			console.log(response);

			if (response.id) {
				successMessage = 'Signed In successfully! Redirecting...';
				response.mode = formFor;
				user.set(response);
				setTimeout(() => (window.location.href = '/'), 1000);
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
	{#if formFor === ''}
		<div class="card shadow p-4" style="max-width: 500px;">
			<h2>Log In as...</h2>
			<div class="flex">
				<div
					class="flex-50 flex-grow shadow p-4 btn btn-outline-primary"
					on:click={() => {
						formFor = 'Mentor';
					}}
				>
					Mentor
				</div>
				<div
					class="flex-50 flex-grow shadow p-4 btn btn-outline-primary"
					on:click={() => {
						formFor = 'Mentee';
					}}
				>
					Mentee
				</div>
			</div>
		</div>
	{:else}
		<div class="card shadow p-4" style="width: 400px;">
			<h2 class="text-center mb-3">Signing In as a <u>{formFor}</u></h2>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}
			{#if successMessage}
				<div class="alert alert-success">{successMessage}</div>
			{/if}

			<div class="mb-3">
				<label class="form-label">Email</label>
				<input
					type="email"
					disabled={successStatus}
					bind:value={email}
					class="form-control"
					placeholder="Email"
				/>
			</div>

			<div class="mb-3">
				<label class="form-label">Password</label>
				<input
					type="password"
					disabled={successStatus}
					bind:value={password}
					class="form-control"
					placeholder="Password"
				/>
			</div>

			<button on:click={register} class="btn btn-primary w-100">Sign In</button>

			<p class="text-center mt-3">
				Don't have an account? <a href="/users/sign_up">Sign Up</a>
			</p>
		</div>
	{/if}
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
