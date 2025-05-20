<script>
	import { onMount } from 'svelte';
	import API from '$lib/api/api';
	import Swal from 'sweetalert2';
	import { modals } from 'svelte-modals';
	import SkillsModal from '$lib/components/Skills/SkillsModal.svelte';
	import Comic from '$lib/components/Buttons/comic.svelte';
	import { get } from 'svelte/store';
	import { user } from '$lib/stores/user'; // Assuming a user store exists to get the current user
	import InvitationEmail from '$lib/components/InvitationEmail.svelte';
	import { generateInvitationEmail } from '$lib/components/utils/emailUtils';

	let leads = [];
	let first_name = '';
	let last_name = '';
	let email = '';
	let profession = '';
	let company = '';
	let linkedin_url = '';
	let errorMessage = '';
	let successMessage = '';
	let formFor = ''; // Ensure this is initialized to an empty string
	let mentorSkills = [];
	let menteeSkills = [];
	let formStep = 1; // Track the current step of the form

	function formatLinkedInUrl(url) {
		if (!url) return '';
		// If it's already a full LinkedIn URL, return as is
		if (url.includes('linkedin.com')) return url;
		// Otherwise, assume it's a profile ID and format it
		return `https://www.linkedin.com/in/${url.replace(/^\/+|\/+$/g, '')}`;
	}

	onMount(async () => {
		await fetchLeads();
	});

	async function fetchLeads() {
		try {
			const response = await API.get('/users/leads');
			leads = response || [];
		} catch (error) {
			console.error('Error fetching leads:', error);
		}
	}

	async function createLead() {
		errorMessage = '';
		successMessage = '';

		if (!first_name || !last_name || !email || !linkedin_url) {
			errorMessage = 'All fields are required, including LinkedIn URL.';
			return;
		}

		if (!validateSkills()) {
			return;
		}

		try {
			const response = await API.post('/users/registrations/create_with_preapproval', {
				user: {
					first_name,
					last_name,
					email,
					profession,
					company,
					linkedin_url,
					mentorSkills,
					menteeSkills
				}
			});

			if (response.id) {
				successMessage = 'Lead created successfully!';
				await fetchLeads();
				resetForm();
			} else {
				errorMessage = 'Failed to create lead. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Network error. Please try again.';
		}
	}

	async function deleteLead(id) {
		try {
			await API.delete(`/users/leads/${id}`);
			await fetchLeads();
		} catch (error) {
			console.error('Error deleting lead:', error);
		}
	}

	function resetForm() {
		first_name = '';
		last_name = '';
		email = '';
		profession = '';
		company = '';
		linkedin_url = '';
	}

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
		modals.close();
	}

	function validateSkills() {
		if (formFor === 'Mentor' && mentorSkills.length < 1) {
			errorMessage = 'At least one skill is required for Mentors.';
			return false;
		}
		if (formFor === 'Mentee' && menteeSkills.length < 1) {
			errorMessage = 'At least one skill is required for Mentees.';
			return false;
		}
		return true;
	}

	function goToStep2() {
		if (!first_name || !last_name || !email || !linkedin_url) {
			errorMessage = 'All fields are required, including LinkedIn URL.';
			return;
		}
		errorMessage = '';
		formStep = 2; // Move to the skills selection step
	}

	function goBackToStep1() {
		formStep = 1; // Go back to the basic information step
	}

	async function sendInvitation(lead) {
		try {
			const currentUser = get(user);
			const token = lead.preapproval_token;
			const emailBody = generateInvitationEmail(lead, token);

			const response = await API.post('/users/send_invitation', {
				inviter_id: currentUser.id,
				invitee_id: lead.id,
				body: emailBody
			});
			Swal.fire('Success', response.message, 'success');
		} catch (error) {
			Swal.fire('Error', error.message || 'Failed to send invitation.', 'error');
		}
	}
</script>

<div class="container">
	<h1>Manage Leads</h1>

	<div class="card p-4 mb-4">
		{#if formFor === ''}
			<p>Let's get started with your lead profile</p>
			<h2>What best describes them...</h2>
			<div class="flex">
				<button class="btn btn-outline-primary w-100 mb-2" on:click={() => (formFor = 'Mentor')}>
					A Mentor
				</button>
				<button class="btn btn-outline-primary w-100 mb-2" on:click={() => (formFor = 'Mentee')}>
					A Mentee
				</button>
			</div>
		{:else if formStep === 1}
			<h3 class="text-center mb-3">Create a {formFor} Lead Profile</h3>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="mb-3">
				<label class="form-label">First Name</label>
				<input
					type="text"
					bind:value={first_name}
					class="form-control"
					placeholder="Enter first name"
				/>
			</div>
			<div class="mb-3">
				<label class="form-label">Last Name</label>
				<input
					type="text"
					bind:value={last_name}
					class="form-control"
					placeholder="Enter last name"
				/>
			</div>
			<div class="mb-3">
				<label class="form-label">Email</label>
				<input type="email" bind:value={email} class="form-control" placeholder="Enter email" />
			</div>
			<div class="mb-3">
				<label class="form-label">LinkedIn URL</label>
				<input
					type="url"
					bind:value={linkedin_url}
					class="form-control"
					placeholder="Enter LinkedIn profile URL"
				/>
			</div>

			<button class="btn btn-primary w-100" on:click={goToStep2}> Next: Select Skills </button>
		{:else if formStep === 2}
			<h3 class="text-center mb-3">Select Skills for {formFor}</h3>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

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

			<div class="flex">
				<button class="btn btn-secondary w-50 me-2" on:click={goBackToStep1}> Back </button>
				<button class="btn btn-primary w-50" on:click={createLead}> Submit </button>
			</div>
		{/if}
	</div>

	<h3>Active Leads</h3>
	<table class="table">
		<thead>
			<tr>
				<th>First Name</th>
				<th>Last Name</th>
				<th>Email</th>
				<th>Invite Profile</th>
				<th>LinkedIn</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each leads.filter((lead) => !lead.converted_at) as lead}
				<tr>
					<td>{lead.first_name}</td>
					<td>{lead.last_name}</td>
					<td>{lead.email}</td>
					<td><a href={'/users/leads/' + lead.preapproval_token} target="_blank">View Invite</a></td
					>
					<td>
						<a href={formatLinkedInUrl(lead.linkedin_url)} target="_blank" rel="noopener noreferrer"
							>{lead.linkedin_url}</a
						>
					</td>
					<td>
						<button class="btn btn-danger btn-sm" on:click={() => deleteLead(lead.id)}
							>Delete</button
						>
						<button class="btn btn-primary btn-sm" on:click={() => sendInvitation(lead)}
							>Invite</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h3 class="mt-5">Closed Leads</h3>
	<table class="table">
		<thead>
			<tr>
				<th>First Name</th>
				<th>Last Name</th>
				<th>Email</th>
				<th>LinkedIn</th>
				<th>Converted At</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each leads.filter((lead) => lead.converted_at) as lead}
				<tr>
					<td>{lead.first_name}</td>
					<td>{lead.last_name}</td>
					<td>{lead.email}</td>
					<td
						><a
							href={formatLinkedInUrl(lead.linkedin_url)}
							target="_blank"
							rel="noopener noreferrer">{lead.linkedin_url}</a
						></td
					>
					<td>{new Date(lead.converted_at).toLocaleDateString()}</td>
					<td>
						<button class="btn btn-danger btn-sm" on:click={() => deleteLead(lead.id)}
							>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.container {
		padding: 20px;
	}
	.card {
		border-radius: 10px;
		background: #f8f9fa;
	}
	.table {
		margin-top: 20px;
	}
	.form-control:focus {
		border-color: #0d6efd;
		box-shadow: 0 0 5px rgba(13, 110, 253, 0.5);
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

	.mt-5 {
		margin-top: 3rem;
	}
</style>
