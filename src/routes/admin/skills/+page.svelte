<script>
	import { modals } from 'svelte-modals';
	import OutClick from 'svelte-outclick';
	import { onMount } from 'svelte';
	import API from '$lib/api/api';
	import AdminWall from '$lib/components/Admin/AdminWall.svelte';

	let skills = [];
	let groupedSkills = {};
	let letters = [];
	let selectedLetter = null;
	let isOpen = false;
	let newSkill = '';
	let editingSkill = null;
	let updatedSkill = '';

	onMount(() => {
		getSkills();
	});

	async function getSkills() {
		const fetchedSkills = await API.get('/skills');
		skills = fetchedSkills.sort((a, b) => a.title.localeCompare(b.title));

		groupSkills(skills);
	}

	function groupSkills(skills) {
		groupedSkills = skills.reduce((acc, skill) => {
			const firstLetter = skill.title[0].toUpperCase();
			if (!acc[firstLetter]) acc[firstLetter] = [];
			acc[firstLetter].push(skill);
			return acc;
		}, {});

		letters = Object.keys(groupedSkills).sort();
		selectedLetter = letters[0] || null;
	}

	async function addSkill() {
		if (!newSkill.trim()) return;
		const createdSkill = await API.post('/skills', { title: newSkill });
		skills = [...skills, createdSkill].sort((a, b) => a.title.localeCompare(b.title));
		newSkill = '';
		groupSkills(skills);
	}

	async function deleteSkill(id) {
		await API.delete(`/skills/${id}`);
		skills = skills.filter((skill) => skill.id !== id);
		groupSkills(skills);
	}

	async function updateSkill(id) {
		if (!updatedSkill.trim()) return;
		const updated = await API.put(`/skills/${id}`, { title: updatedSkill });
		skills = skills.map((skill) => (skill.id === id ? updated : skill));
		editingSkill = null;
		updatedSkill = '';
		groupSkills(skills);
	}

	const handleOutsideClick = () => {
		isOpen = false;
	};
</script>

<AdminWall>
	<h1 class="title">Skills Management</h1>

	<div class="input-container">
		<input type="text" bind:value={newSkill} placeholder="Add a new skill..." />
		<button on:click={addSkill}>Add</button>
	</div>

	<div class="contents">
		<h3>Select a Letter:</h3>
		<div class="letter-index">
			{#each letters as letter}
				<button
					class="letter-button {selectedLetter === letter ? 'active' : ''}"
					on:click={() => (selectedLetter = letter)}
				>
					{letter}
				</button>
			{/each}
		</div>

		<h3>Skills ({selectedLetter}):</h3>
		<ul class="skills">
			{#if groupedSkills[selectedLetter]}
				{#each groupedSkills[selectedLetter] as skill}
					<li>
						{#if editingSkill === skill.id}
							<input type="text" bind:value={updatedSkill} placeholder="Update skill..." />
							<button on:click={() => updateSkill(skill.id)}>Save</button>
							<button on:click={() => (editingSkill = null)}>Cancel</button>
						{:else}
							<span>{skill.title}</span>
							<div class="actions">
								<button
									on:click={() => {
										editingSkill = skill.id;
										updatedSkill = skill.title;
									}}
								>
									<i class="fa fa-pen"></i>
								</button>
								<button on:click={() => deleteSkill(skill.id)}>Delete</button>
							</div>
						{/if}
					</li>
				{/each}
			{:else}
				<p>No skills available.</p>
			{/if}
		</ul>
	</div>
</AdminWall>

<style>
	.title {
		text-align: center;
		margin-bottom: 20px;
		font-size: 1.8rem;
	}

	.input-container {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 20px;
	}

	.input-container input {
		padding: 10px;
		width: 250px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.input-container button {
		padding: 10px 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.open-modal {
		background-color: #28a745;
	}

	.skills {
		max-height: 50vh;
		overflow-y: auto;
		margin-top: 10px;
		list-style: none;
		padding: 0;
	}

	.skills li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 10px;
		background: #f9f9f9;
		border-radius: 5px;
		margin-bottom: 5px;
	}

	.contents {
		padding: 1em;
		border-radius: 8px;
		background: white;
		width: 450px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.letter-index {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		justify-content: center;
		margin-bottom: 15px;
	}

	.letter-button {
		border: none;
		background: #ddd;
		padding: 6px 10px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.2s;
	}

	.letter-button:hover {
		background: #bbb;
	}

	.letter-button.active {
		background: #003eff;
		color: white;
	}

	.skills {
		width: 100%;
	}
	.modal {
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.5);
	}

	.barrier {
		background: white;
		padding: 20px;
		border-radius: 10px;
	}

	h3 {
		margin: 10px 0;
	}

	.contents {
		display: block;
		margin: 0 auto;
	}

	.actions {
		display: flex;
		gap: 10px;
	}

	.actions button {
		background-color: #28a745;
		color: white;
		border: none;
		padding: 5px 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.actions button:last-child {
		background-color: #dc3545;
	}
</style>
