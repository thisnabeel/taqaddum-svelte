<script>
	// @ts-nocheck

	import { modals } from 'svelte-modals';
	import OutClick from 'svelte-outclick';
	import { onMount } from 'svelte';
	import API from '$lib/api/api';

	// Modal Props
	export let isOpen;
	export let selectSkill;
	let closable = true;
	const handleOutsideClick = () => {
		if (closable) {
			modals.close();
		}
	};

	let skills = [];
	let groupedSkills = {};
	let letters = [];
	let selectedLetter = null;

	onMount(() => {
		getSkills();
	});

	async function getSkills() {
		const fetchedSkills = await API.get('/skills');
		skills = fetchedSkills.sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically

		// Group by first letter
		groupedSkills = skills.reduce((acc, skill) => {
			const firstLetter = skill.title[0].toUpperCase();
			if (!acc[firstLetter]) acc[firstLetter] = [];
			acc[firstLetter].push(skill);
			return acc;
		}, {});

		// Create an index of available letters
		letters = Object.keys(groupedSkills).sort();
		selectedLetter = letters[0]; // Default to first letter
	}
</script>

{#if isOpen}
	<div role="dialog" class="modal" on:click|stopPropagation>
		<div class="barrier" on:click|stopPropagation>
			<OutClick on:outclick={handleOutsideClick}>
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
								<li on:click={() => selectSkill(skill)}>{skill.title}</li>
							{/each}
						{:else}
							<p>No skills available.</p>
						{/if}
					</ul>
				</div>
			</OutClick>
		</div>
	</div>
{/if}

<style>
	.skills {
		max-height: 60vh;
		overflow-y: auto;
		margin-top: 10px;
		list-style: none;
		padding: 0;
	}

	.contents {
		padding: 1em;
		border-radius: 8px;
		background: white;
		width: 400px;
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

	.modal {
		position: fixed;
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
</style>
