<script>
	import AvatarPicker from '$lib/components/Avatar/AvatarPicker.svelte';
	import {
		avatar_cropped_blob_url,
		avatar_cropped,
		avatar_original
	} from '$lib/stores/signingUpStore';

	import SkillSelectorModal from '$lib/components/Skills/SkillsModal.svelte';
	import { modals } from 'svelte-modals';
	import SkillsModal from '$lib/components/Skills/SkillsModal.svelte';
	import API from '$lib/api/api';
	export let lead = null;
	export let token = '';
	let password = '';
	let password_confirmation = '';
	let skills = [];
	let newSkill = '';
	let errorMessage = '';
	let showSkillModal = false;

	function capitalizeFirstLetter(string) {
		if (!string) return '';
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}

	function openSkillModal() {
		showSkillModal = true;
	}

	function closeSkillModal(selectedSkills) {
		showSkillModal = false;
		if (selectedSkills) {
			skills = [...new Set([...skills, ...selectedSkills])];
		}
	}

	function removeSkill(skill) {
		skills = skills.filter((s) => s !== skill);
	}

	async function handleSubmit() {
		console.log({ avatar_cropped: $avatar_cropped, avatar_original: $avatar_original });
		if (!$avatar_cropped && !$avatar_original) {
			errorMessage = 'Avatar is required.';
			return;
		}
		if (!password) {
			errorMessage = 'Password is required.';
			return;
		}
		if (password !== password_confirmation) {
			errorMessage = 'Passwords do not match.';
			return;
		}
		if (lead.mentorships === 0) {
			errorMessage = 'At least one skill is required.';
			return;
		}
		errorMessage = '';
		// Submit the data (avatar, password, skills)
		console.log({
			avatar_original: $avatar_original,
			avatar_cropped: $avatar_cropped,
			password,
			mentoships: lead.mentorships
		});
		const res = await API.patch('/users/preapprovals/' + token, {
			avatar_original: $avatar_original,
			avatar_cropped: $avatar_cropped,
			password,
			mentorships: lead.mentorships,
			converted_at: new Date().toISOString()
		});
		console.log({ res });
	}

	function addSkill() {
		modals.open(SkillsModal, {
			selectSkill: (payload) => selectSkill(payload)
		});
	}
	$: console.log({ lead });
</script>

<div class="wrapper">
	<div class="form-container">
		<h2>Complete Your Profile</h2>
		<p class="welcome-text">Assalamualikum, {capitalizeFirstLetter(lead?.first_name) || 'User'}!</p>
		<p class="subtitle">
			You have been pre-approved to join Taqaddum as a mentor. Please complete your profile to get
			started.
		</p>

		<div class="form-section">
			<label for="avatar" class="form-label">Profile Picture</label>
			<AvatarPicker signingUp={true} />
		</div>

		<div class="form-section">
			<label class="form-label">Skills</label>
			<div class="skills-container">
				<ul class="skills-list">
					{#each lead.mentorships as mentorships}
						<li class="skill-item">
							<span>{mentorships.skill.title}</span>
							<button class="remove-btn" on:click={() => removeSkill(mentorship)}>×</button>
						</li>
					{/each}
				</ul>
				<button class="add-skill-btn" on:click={addSkill}>+ Add Skills</button>
			</div>
		</div>

		<div class="form-section">
			<label for="password" class="form-label">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				class="form-input"
				placeholder="Enter your password"
			/>
		</div>

		<div class="form-section">
			<label for="password_confirmation" class="form-label">Confirm Password</label>
			<input
				type="password"
				id="password_confirmation"
				bind:value={password_confirmation}
				class="form-input"
				placeholder="Confirm your password"
			/>
		</div>

		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{/if}

		<button class="submit-btn" on:click={handleSubmit}>Complete Profile</button>
	</div>
</div>

<SkillSelectorModal bind:visible={showSkillModal} on:close={closeSkillModal} />

<style>
	.wrapper {
		padding: 2em;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f7fa;
	}

	.form-container {
		background: white;
		padding: 2.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 600px;
	}

	h2 {
		color: #2d3748;
		margin-bottom: 1rem;
		font-size: 1.8rem;
	}

	.welcome-text {
		font-size: 1.2rem;
		color: #4a5568;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #718096;
		margin-bottom: 2rem;
	}

	.form-section {
		margin-bottom: 1.5rem;
	}

	.form-label {
		display: block;
		margin-bottom: 0.5rem;
		color: #4a5568;
		font-weight: 500;
	}

	.form-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.form-input:focus {
		outline: none;
		border-color: #4299e1;
		box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
	}

	.skills-container {
		background: #f7fafc;
		padding: 1rem;
		border-radius: 6px;
	}

	.skills-list {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-item {
		background: #ebf8ff;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: #2b6cb0;
	}

	.remove-btn {
		background: none;
		border: none;
		color: #2b6cb0;
		cursor: pointer;
		padding: 0;
		font-size: 1.2rem;
		line-height: 1;
	}

	.add-skill-btn {
		background: #4299e1;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.2s;
	}

	.add-skill-btn:hover {
		background: #3182ce;
	}

	.submit-btn {
		width: 100%;
		background: #4299e1;
		color: white;
		border: none;
		padding: 0.75rem;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-btn:hover {
		background: #3182ce;
	}

	.error-message {
		color: #e53e3e;
		margin: 1rem 0;
		padding: 0.75rem;
		background: #fff5f5;
		border-radius: 6px;
		border: 1px solid #feb2b2;
	}
</style>
