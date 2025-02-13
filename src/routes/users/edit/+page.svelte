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
	let expandedMentorhips = [];

	let mentorSkills = [];
	let menteeSkills = [];
	let mentorSkillsToAdd = [];
	let menteeSkillsToAdd = [];

	onMount(async () => {});

	user.subscribe((response) => {
		if (response) {
			first_name = response.first_name;
			last_name = response.last_name;
			email = response.email;
			profession = response.profession;
			company = response.company;
			avatarPreview = response.avatar_cropped_url || avatarPreview;
			mentorSkills = response.mentor_skills || [];
			menteeSkills = response.mentee_skills || [];
			console.log({ response });
			fetchMentorships();
		}
	});

	function toggleMentorship(mentorship) {
		expandedMentorhips = expandedMentorhips.includes(mentorship)
			? expandedMentorhips.filter((m) => m !== mentorship) // Remove if already expanded
			: [...expandedMentorhips, mentorship]; // Add if not expanded
	}

	async function fetchMentorships() {
		try {
			const endpoint = $user.id ? `/mentorships?user_id=${$user.id}` : '/mentorships';
			const response = await API.get(endpoint);
			console.log({ response });
			mentorSkills = response;
			console.log({ mentorSkills });
			// mentorSkills = response || [];
		} catch (error) {
			console.error('Error fetching mentorships:', error);
		}
	}
	async function updateUser() {
		errorMessage = '';
		successMessage = '';

		if (!first_name || !last_name || !email) {
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
					mentor_skills_to_add: mentorSkillsToAdd,
					mentee_skills_to_add: menteeSkillsToAdd,
					update_mentorships: mentorSkills,
					update_menteeships: menteeSkills
				}
			});

			if (response.id) {
				successMessage = 'Profile updated successfully!';
				Swal.fire('Success', 'Profile updated successfully!', 'success');
				mentorSkillsToAdd = [];
				menteeSkillsToAdd = [];
				user.set({ ...$user, ...response });
			} else {
				errorMessage = 'Something went wrong. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Network error. Please try again.';
		}
	}

	function addSkill() {
		modals.open(SkillsModal, {
			selectSkill: (payload) => selectSkill(payload)
		});
	}

	function selectSkill(payload) {
		if ($user.mode === 'Mentor') {
			mentorSkillsToAdd = [
				...mentorSkillsToAdd,
				{ status: 'pending approval', skill: payload, company: '', profession: '' }
			];
			console.log({ mentorSkillsToAdd });
		} else {
			menteeSkillsToAdd = [
				...menteeSkillsToAdd,
				{ status: 'pending approval', skill: payload, company: '', profession: '' }
			];
			console.log({ menteeSkillsToAdd });
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

		{#if $user && $user.mode === 'Mentor'}
			<div class="mb-3">
				<label class="form-label"
					>{$user.mode === 'Mentor' ? 'Willing to Mentor In:' : 'Seeking Mentors In:'}</label
				>

				{#each $user.mode === 'Mentor' ? mentorSkills : menteeSkills as mentorship, index}
					<div class="skill-box">
						<div class="skill-header {mentorship.status.replace(' ', '_')}">
							{#if mentorship.status === 'approved'}
								<i class="fa fa-check-circle approved approval-badge"></i>
							{:else}
								<span class="fa fa-clock waiting approval-badge"></span>
							{/if}
							<div on:click={() => toggleMentorship(mentorship.id)}>
								<Comic>{mentorship.skill.title}</Comic>
							</div>
							{#if expandedMentorhips.includes(mentorship.id)}
								<label
									for=""
									style="text-align: left;display: block;margin-top: 20px;margin-left: 6px;"
									>Title/Role/Profession</label
								>
								<input
									type="text"
									bind:value={mentorship.profession}
									class="form-control mt-2"
									placeholder="Example: Software Engineer, Researcher"
								/>
								<label
									for=""
									style="text-align: left;display: block;margin-top: 20px;margin-left: 6px;"
									>Applied at: (Company Name)</label
								>
								<input
									type="text"
									bind:value={mentorship.company}
									class="form-control mt-2"
									placeholder="Example: Paypal, Stanford University"
								/>
							{/if}
						</div>
					</div>
				{/each}

				{#each $user.mode === 'Mentor' ? mentorSkillsToAdd : menteeSkillsToAdd as mentorship, index}
					<div class="skill-box">
						<div class="skill-header pending_approval">
							<span class="fa fa-clock waiting approval-badge"></span>

							<Comic>{mentorship.skill.title}</Comic>
							<label
								for=""
								style="text-align: left;display: block;margin-top: 20px;margin-left: 6px;"
								>Title/Role/Profession</label
							>
							<input
								type="text"
								bind:value={mentorship.profession}
								class="form-control mt-2"
								placeholder="Example: Software Engineer, Researcher"
							/>
							<label
								for=""
								style="text-align: left;display: block;margin-top: 20px;margin-left: 6px;"
								>Applied at: (Company Name)</label
							>
							<input
								type="text"
								bind:value={mentorship.company}
								class="form-control mt-2"
								placeholder="Example: Paypal, Stanford University"
							/>
						</div>
					</div>
				{/each}

				<button class="btn btn-outline-secondary w-100 mt-2" on:click={addSkill}
					>Add another skill +</button
				>
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

	.skill-box {
		background: #f1f1f1;
		padding: 10px;
		border-radius: 8px;
		margin-bottom: 10px;
	}
	.skill-header {
		cursor: pointer;
		background: white;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid #ccc;
		text-align: center;
		position: relative;
	}

	.approval-badge {
		display: none;
		position: absolute;
		top: -13px;
		right: -30px;
		font-size: 10px;
		width: 84px;
		z-index: 99;
	}

	.approval-badge.waiting {
		font-size: 34px;
		color: #787878;
		top: -9px;
		right: -34px;
		z-index: 99;
	}

	.approval-badge.approved {
		font-size: 34px;
		color: green;
		top: -9px;
		right: -34px;
		z-index: 99;
	}

	.skill-header :global(button) {
		width: 100%;
	}

	.pending_approval :global(button) {
		--yellow-400: #ccc;
	}
</style>
