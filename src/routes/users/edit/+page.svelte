<script>
	import { onMount } from 'svelte';
	import AvatarPicker from '$lib/components/Avatar/AvatarPicker.svelte';
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';
	import Search from '$lib/components/Skills/Search.svelte';
	import { modals } from 'svelte-modals';
	import SkillsModal from '$lib/components/Skills/SkillsModal.svelte';
	import Swal from 'sweetalert2';
	import Comic from '$lib/components/Buttons/comic.svelte';

	let first_name = '';
	let last_name = '';
	let email = '';
	let profession = '';
	let errorMessage = '';
	let successMessage = '';
	let avatar = null;
	let company = '';
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
			company = response.company;
			avatarPreview = response.avatar_cropped_url || avatarPreview;
			mentorSkills = response.mentor_skills || [null, null, null];
			menteeSkills = response.mentee_skills || [null, null, null];
			console.log({ response });
			fetchMentorships();
		}
	});

	async function fetchMentorships() {
		try {
			const endpoint = $user.id ? `/mentorships?user_id=${$user.id}` : '/mentorships';
			const response = await API.get(endpoint);
			console.log({ response });
			mentorSkills = response.map((r) => r.skill);
			console.log({ mentorSkills });
			// mentorSkills = response || [];
		} catch (error) {
			console.error('Error fetching mentorships:', error);
		}
	}
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
					id: $user.id,
					first_name,
					last_name,
					profession,
					company,
					mentor_skills: mentorSkills.filter((s) => s),
					mentee_skills: menteeSkills.filter((s) => s)
				}
			});

			if (response.id) {
				successMessage = 'Profile updated successfully!';
				Swal.fire('Success', 'Profile updated successfully!', 'success');
				user.set({ ...$user, ...response });
			} else {
				errorMessage = 'Something went wrong. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Network error. Please try again.';
		}
	}

	function selectSkill(payload, index) {
		if ($user && $user.mode === 'Mentor') {
			mentorSkills[index] = payload; // ✅ Update mentor skills at correct index
		} else {
			menteeSkills[index] = payload; // ✅ Update mentee skills at correct index
		}
		modals.close();
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
			<label class="form-label">Company</label>
			<input type="text" bind:value={company} class="form-control" placeholder="Your Company" />
		</div>

		{#if $user && $user.mode === 'Mentor'}
			<div class="mb-3">
				<label class="form-label">Willing to Mentor In: (Select up to 3)</label>
				{#each Array(3) as _, index}
					<div
						class="flex"
						on:click={() => {
							modals.open(SkillsModal, {
								selectSkill: (payload) => selectSkill(payload, index)
							});
						}}
					>
						<div class="flex-grow flex-90" style="margin-bottom: 10px;">
							{#if mentorSkills[index] && mentorSkills[index].title}
								<Comic>{mentorSkills[index].title}</Comic>
							{:else}
								<div
									class="form-control"
									class:gray={!mentorSkills[index] || !mentorSkills[index].title}
								>
									Select Expertise...
								</div>
							{/if}
						</div>
						<div class="flex-grow flex-10 btn">
							<i class="fa fa-wrench"></i>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="mb-3">
				<label class="form-label">Seeking Mentors In: (Select up to 3)</label>
				{#each menteeSkills as skill, index}
					<div
						class="flex"
						on:click={() => {
							modals.open(SkillsModal, {
								selectSkill: (payload) => selectSkill(payload, index)
							});
						}}
					>
						<div class="flex-grow flex-90">
							{#if skill && skill.title}
								<Comic>{skill.title}</Comic>
							{:else}
								<div class="form-control" class:gray={!skill || !skill.title}>
									{skill ? skill.title : 'Select Expertise...'}
								</div>
							{/if}
						</div>
						<div class="flex-grow flex-10 btn">
							<i class="fa fa-expand"></i>
						</div>
					</div>
				{/each}
			</div>
		{/if}

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

	.gray {
		background-color: #e4e4e4;
	}
</style>
