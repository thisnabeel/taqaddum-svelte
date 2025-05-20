<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import { page } from '$app/stores';
	import API from '$lib/api/api';
	import AvatarPicker from '$lib/components/Avatar/AvatarPicker.svelte';
	import Comic from '$lib/components/Buttons/comic.svelte';

	import SkillSelectorModal from '$lib/components/Skills/SkillsModal.svelte';
	import FinishRegistration from '$lib/components/PreApprovals/FinishRegistration.svelte';

	let activeTab = 'email';
	let token = $page.params.token;
	let lead = null;
	let avatar = null;
	let password = '';
	let skills = [];
	let newSkill = '';
	let errorMessage = '';
	let showSkillModal = false;

	onMount(async () => {
		// Fetch lead details using the token
		try {
			lead = await API.get(`/users/leads/${token}`);
			skills = lead?.mentorships?.map((item) => item.skill?.title) || [];
		} catch (error) {
			console.error('Error fetching lead details:', error);
		}
	});

	function addSkill() {
		if (newSkill && !skills.includes(newSkill)) {
			skills = [...skills, newSkill];
			newSkill = '';
		}
	}

	function removeSkill(skill) {
		skills = skills.filter((s) => s !== skill);
	}

	function handleSubmit() {
		if (!avatar) {
			errorMessage = 'Avatar is required.';
			return;
		}
		if (!password) {
			errorMessage = 'Password is required.';
			return;
		}
		if (skills.length === 0) {
			errorMessage = 'At least one skill is required.';
			return;
		}
		errorMessage = '';
		// Submit the data (avatar, password, skills)
		console.log({ avatar, password, skills });
	}

	function openSkillModal() {
		showSkillModal = true;
	}

	$: console.log({ $user });

	function updateUser() {}
</script>

{#if $user?.roles?.includes('admin')}
	<div class="tabs">
		<button
			class="tab-button {activeTab === 'email' ? 'active' : ''}"
			on:click={() => (activeTab = 'email')}
		>
			Invitation Email
		</button>
		<button
			class="tab-button {activeTab === 'preapproval' ? 'active' : ''}"
			on:click={() => (activeTab = 'preapproval')}
		>
			Pre-Approval Page
		</button>
	</div>

	<div class="tab-content">
		{#if activeTab === 'email'}
			<h2>Invitation Email Preview</h2>
			<p>Assalamualikum {lead?.first_name || 'User'},</p>
			<p>You have been pre-approved to be a mentor on Taqaddum for:</p>
			<ul>
				{#each lead?.mentorships || lead?.menteeships as item}
					<li>{item.skill?.title}</li>
				{/each}
			</ul>
			<p>All you have to do is click the link below to complete your registration:</p>
			<a href={`https://taqaddum.com/preapproval/${token}`} target="_blank">
				Complete Registration
			</a>
			<hr />
			<p>JazakAllah Khayr for your time,<br />Assalamualikum</p>
		{:else if activeTab === 'preapproval'}
			<FinishRegistration {lead} {token} />
		{/if}
	</div>
{:else}
	<h1>Loading...</h1>
{/if}

<style>
	.tabs {
		display: flex;
		margin-bottom: 20px;
	}
	.tab-button {
		flex: 1;
		padding: 10px;
		text-align: center;
		cursor: pointer;
		background: #f8f9fa;
		border: 1px solid #ddd;
	}
	.tab-button.active {
		background: #0d6efd;
		color: white;
	}
	.tab-content {
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 5px;
		background: #fff;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	ul li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 5px;
	}
	ul li button {
		background: #dc3545;
		color: white;
		border: none;
		padding: 5px 10px;
		cursor: pointer;
	}
	ul li button:hover {
		background: #c82333;
	}

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
