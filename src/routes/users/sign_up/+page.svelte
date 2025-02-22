<script>
	import { onMount } from 'svelte';
	import AvatarPicker from '$lib/components/Avatar/AvatarPicker.svelte';
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

	let formFor = '';
	let mentorSkills = [];
	let menteeSkills = [];

	function addSkill() {
		modals.open(SkillsModal, {
			selectSkill: (payload) => selectSkill(payload)
		});
	}

	function selectSkill(payload) {
		if (formFor === 'Mentor') {
			mentorSkills = [...mentorSkills, payload];
		} else {
			menteeSkills = [...menteeSkills, payload];
		}
		console.log({ mentorSkills });
		modals.close();
	}

	async function register() {
		errorMessage = '';
		successMessage = '';

		if (!$avatar_cropped_blob_url) {
			raiseError('Avatar Image is Required.');
			return;
		}

		if (!first_name || !last_name || !email || !password || !password_confirmation) {
			raiseError('All fields are required.');
			return;
		}

		if (password !== password_confirmation) {
			raiseError('Passwords do not match.');
			return;
		}

		if (formFor === 'Mentor') {
			if (mentorSkills.length < 1) {
				raiseError('At least one skill is required.');
				return;
			}

			for (let skill of mentorSkills) {
				if (
					!skill.company ||
					!skill.company.length > 1 ||
					!skill.profession ||
					!skill.profession.length > 1
				) {
					raiseError('Each selected skill must have an associated company and profession.');
					return;
				}
			}
		}

		if (formFor === 'Mentee' && menteeSkills.length < 1) {
			raiseError('At least one skill is required.');
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
					first_name,
					last_name,
					email,
					password,
					password_confirmation,
					profession,
					company,
					mentor_skills: mentorSkills.filter((s) => s),
					mentee_skills: menteeSkills.filter((s) => s),
					type: formFor
				}
			});

			if (response.id) {
				successMessage = 'Account created successfully! Redirecting...';

				user.set({ ...response, mode: formFor });

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
				user.set({ ...avatar_res, mode: formFor });
				Swal.close();
				// Account created successfully! Redirecting...
				Swal.fire({
					title: 'Account created successfully!...',
					text: 'Redirecting...',
					showCloseButton: false,
					showConfirmButton: false,
					allowOutsideClick: false
				});
				setTimeout(() => (window.location.href = '/'), 2000);
			} else {
				const data = await response.json();
				raiseError(data.error || 'Something went wrong. Please try again.');
			}
		} catch (error) {
			Swal.close();
			raiseError('Network error. Please try again.');
		}
	}

	function raiseError(msg) {
		errorMessage = msg;
		alert(msg);
	}
</script>

<div class="container d-flex justify-content-center p-4">
	<div class="card shadow p-4" style="max-width: 500px;">
		{#if formFor === ''}
			<p>Let's get you signed up to Taqaddum</p>
			<h2>What best describes you...</h2>
			<div class="flex">
				<button class="btn btn-outline-primary w-100 mb-2" on:click={() => (formFor = 'Mentor')}>
					I'm a Mentor
				</button>
				<button class="btn btn-outline-primary w-100 mb-2" on:click={() => (formFor = 'Mentee')}>
					I'm a Mentee
				</button>
			</div>
		{:else}
			<h3 class="text-center mb-3">Create a {formFor} Account</h3>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}
			{#if successMessage}
				<div class="alert alert-success">{successMessage}</div>
			{/if}

			<AvatarPicker signingUp={true} />

			<input
				type="text"
				bind:value={first_name}
				class="form-control mb-3"
				placeholder="First Name"
			/>
			<input type="text" bind:value={last_name} class="form-control mb-3" placeholder="Last Name" />
			<input type="email" bind:value={email} class="form-control mb-3" placeholder="Email" />

			<div class="mb-3">
				<label class="form-label"
					>{formFor === 'Mentor' ? 'Willing to Mentor In:' : 'Seeking Mentors In:'}</label
				>

				{#each formFor === 'Mentor' ? mentorSkills : menteeSkills as skill, index}
					<div class="skill-box">
						<div class="skill-header">
							<Comic>{skill.title}</Comic>
							<label
								for=""
								style="text-align: left;display: block;margin-top: 20px;margin-left: 6px;"
								>Title/Role/Profession</label
							>
							<input
								type="text"
								bind:value={skill.profession}
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
								bind:value={skill.company}
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

			<input
				type="password"
				bind:value={password}
				class="form-control mb-3"
				placeholder="Password"
			/>
			<input
				type="password"
				bind:value={password_confirmation}
				class="form-control mb-3"
				placeholder="Confirm Password"
			/>

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
	}

	.skill-header :global(button) {
		width: 100%;
	}
</style>
