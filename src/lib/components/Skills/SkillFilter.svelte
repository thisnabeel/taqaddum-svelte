<script lang="ts">
	export let skills: string[] = [];
	export let selectedSkill: string | null = null;

	function selectSkill(skill: string) {
		selectedSkill = selectedSkill === skill ? null : skill;
	}

	// Set first skill as selected by default
	$: if (skills.length > 0 && !selectedSkill) {
		selectedSkill = skills[0];
	}
</script>

<div class="skill-filter">
	<div class="skill-list">
		{#each skills as skill}
			<button
				class="skill-button {selectedSkill === skill ? 'active' : ''}"
				on:click={() => selectSkill(skill)}
			>
				{skill}
			</button>
		{/each}
	</div>
</div>

<style>
	.skill-filter {
		width: 100%;
		overflow-x: auto;
		padding: 1rem 0;
	}

	.skill-filter::-webkit-scrollbar {
		display: none;
	}

	.skill-list {
		display: flex;
		gap: 0.5rem;
		padding: 0 1rem;
	}

	.skill-button {
		white-space: nowrap;
		padding: 0.5rem 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 9999px;
		background: white;
		color: #4a5568;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.skill-button:hover {
		background: #f7fafc;
		border-color: #cbd5e0;
	}

	.skill-button.active {
		background: #003eff;
		color: white;
		border-color: #003eff;
	}
</style>
