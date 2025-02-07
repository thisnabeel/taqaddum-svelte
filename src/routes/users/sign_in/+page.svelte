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

	async function register() {
		if (successStatus) return;
		errorMessage = '';
		successMessage = '';

		if (!email || !password) {
			errorMessage = 'All fields are required.';
			return;
		}

		try {
			if (avatar) {
				formData.append('user[avatar]', avatar);
			}

			const response = await API.post('/users/sign_in', {
				user: {
					email: email,
					password: password
				}
			});

			console.log(response);

			if (response.id) {
				successMessage = 'Signed In successfully! Redirecting...';
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
	<div class="card shadow p-4" style="width: 400px;">
		<h2 class="text-center mb-3">Sign In</h2>

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
			Don't have an account? <a href="/sign_up">Sign Up</a>
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
