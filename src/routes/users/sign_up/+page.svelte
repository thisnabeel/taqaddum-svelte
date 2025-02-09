<script>
	import { onMount } from 'svelte';
	import AvatarPicker from '$lib/components/Avatar/AvatarPicker.svelte'; // Importing the avatar picker component
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';
	import Search from '$lib/components/Skills/Search.svelte';
	import {
		avatar_cropped,
		avatar_cropped_blob_url,
		avatar_original
	} from '$lib/stores/signingUpStore';
	import { modals } from 'svelte-modals';
	import SkillsModal from '$lib/components/Skills/SkillsModal.svelte';
	import Swal from 'sweetalert2';
	import Comic from '$lib/components/Buttons/comic.svelte';

	let first_name = '';
	let last_name = '';
	let email = '';
	let password = '';
	let password_confirmation = '';
	let profession = '';
	let company = '';
	let errorMessage = '';
	let successMessage = '';

	onMount(() => {});
	let avatar = null;
	let avatarPreview = '/default-avatar.png'; // Placeholder image

	let formPart = 1;
	let formFor = '';

	let mentorSkills = [null, null, null];
	let menteeSkills = [null, null, null];

	$: console.log(mentorSkills);
	$: console.log(menteeSkills);

	async function register() {
		errorMessage = '';
		successMessage = '';

		if (!first_name || !last_name || !email || !password || !password_confirmation || !profession) {
			raiseError('All fields are required.');
			return;
		}

		if (!$avatar_cropped_blob_url) {
			raiseError('Avatar Image is Required.');
			return;
		}

		if (password !== password_confirmation) {
			raiseError('Passwords do not match.');
			return;
		}

		if (formFor === 'Mentor' && mentorSkills.filter((s) => s).length < 1) {
			raiseError('No Skills selected.');
			return;
		}

		if (formFor === 'Mentee' && mentorSkills.filter((s) => s).length < 1) {
			raiseError('No Skills selected.');
			return;
		}

		Swal.fire({
			title: `Creating your ${formFor} Account...`,
			text: 'Please stay on page...',
			showCloseButton: false,
			showConfirmButton: false,
			allowOutsideClick: false
		});

		try {
			const response = await API.post('/users', {
				user: {
					first_name: first_name,
					last_name: last_name,
					email: email,
					password: password,
					password_confirmation: password_confirmation,
					profession: profession,
					company: company,
					mentor_skills: mentorSkills.filter((s) => s),
					mentee_skills: menteeSkills.filter((s) => s)
				}
			});

			console.log(response);

			if (response.id) {
				successMessage = 'Account created successfully! Redirecting...';
				response.mode = formFor;

				user.set(response);

				Swal.close();
				Swal.fire({
					title: 'Please Hold...',
					text: 'Uploading your Profile Picture...',
					showCloseButton: false,
					showConfirmButton: false,
					allowOutsideClick: false
				});
				let fd = new FormData();

				const avatar_res = await API.post(
					'/upload_avatar',
					{
						avatar_original: $avatar_original,
						avatar_cropped: $avatar_cropped,
						user_id: response.id
					},
					{
						'Content-Type': 'multipart/form-data'
					}
				);
				console.log(avatar_res);

				Swal.close();
				setTimeout(() => (window.location.href = '/'), 2000);
			} else {
				const data = await response.json();
				raiseError(data.error || 'Something went wrong. Please try again.');
			}
		} catch (error) {
			raiseError('Network error. Please try again.');
		}
	}

	function raiseError(msg) {
		errorMessage = msg;
		alert(msg);
	}

	function selectSkill(payload, index) {
		if (formFor === 'Mentor') {
			mentorSkills[index] = payload; // ✅ Update mentor skills at correct index
		} else {
			menteeSkills[index] = payload; // ✅ Update mentee skills at correct index
		}
		modals.close();
	}
</script>

<div class="container d-flex justify-content-center p-4">
	<div class="card shadow p-4" style="max-width: 500px;">
		{#if formFor === ''}
			<p>Let's get you signed up to Taqaddum</p>
			<h2>What best describes you...</h2>
			<div class="flex">
				<div
					class="flex-50 flex-grow shadow p-4 btn btn-outline-primary"
					on:click={() => {
						formFor = 'Mentor';
					}}
				>
					I'm a Mentor
				</div>
				<div
					class="flex-50 flex-grow shadow p-4 btn btn-outline-primary"
					on:click={() => {
						formFor = 'Mentee';
					}}
				>
					I'm a Mentee
				</div>
			</div>
		{:else}
			{#if formFor === 'Mentor'}
				<h3 class="text-center mb-3">Apply for a {formFor} Account</h3>
				<p>We will review your application and email you back.</p>
			{:else}
				<h3 class="text-center mb-3">Create a {formFor} Account</h3>
			{/if}

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
				<label class="form-label">Company</label>
				<input type="text" bind:value={company} class="form-control" placeholder="Your Company" />
			</div>

			{#if formFor === 'Mentor'}
				<div class="mb-3">
					<label class="form-label">Willing to Mentor In: (Select up to 3)</label>
					{#each mentorSkills as skill, index}
						<div
							class="flex"
							on:click={() => {
								modals.open(SkillsModal, {
									selectSkill: (payload) => selectSkill(payload, index)
								});
							}}
						>
							<div class="flex-grow flex-90" style="margin-bottom: 10px;">
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
			{:else}
				<div class="mb-3">
					<label class="form-label">Seeking Mentors In: (Select up to 3)</label>
					{#each menteeSkills as skill}
						<Search placeholder="Search Interest..." bind:selectedValue={skill}></Search>
					{/each}
				</div>
			{/if}

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
				Already have an account? <a href="/users/sign_in">Log in</a>
			</p>
		{/if}
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

	.gray {
		background-color: #e4e4e4;
	}
</style>
