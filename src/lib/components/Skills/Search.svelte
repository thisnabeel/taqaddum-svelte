<script>
	import API from '$lib/api/api';

	export let placeholder;
	export let selectedValue;

	let searchInput = '';
	let results = [];

	async function search() {
		selectedValue = null;
		if (searchInput.length < 2) {
			results = [];
			return;
		}
		results = await API.get(`/skills?search=${searchInput}`);
	}

	function selectSkill(skill) {
		searchInput = skill.title;
		selectedValue = skill;
		results = [];
	}
</script>

<div class="relative">
	<input
		type="text"
		class="form-control"
		{placeholder}
		class:gray={searchInput.length < 2}
		bind:value={searchInput}
		on:keyup={search}
	/>
	{#if results}
		<ul class="clean-list blocky">
			{#each results as result}
				<li on:click={() => selectSkill(result)}>{result.title}</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	input {
		background-color: #e5ffa5;
	}
	.gray {
		background-color: #eee;
	}
</style>
