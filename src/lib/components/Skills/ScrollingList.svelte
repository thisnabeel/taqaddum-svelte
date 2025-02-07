<script>
	import API from '$lib/api/api';
	import { onMount } from 'svelte';

	let skills = [];
	let values = [];
	let extendedList = [...skills, ...skills];
	let extendedValuesList = [...values, ...values];

	onMount(() => {
		getSkills();
		getValues();
	});

	async function getSkills() {
		skills = await API.get('/skills');
		console.log(skills);
		extendedList = [...skills, ...skills];
	}

	async function getValues() {
		values = await API.get('/islamic_values');
		console.log(values);
		extendedValuesList = [...values, ...values];
	}

	// Adjust the speed of sliding (lower value = faster)
	let animationDuration = 60; // Seconds
</script>

<div class="slider-container">
	<div class="slider">
		<ul>
			{#each extendedList as item}
				<li>{item.title}</li>
			{/each}
		</ul>
	</div>
</div>

<div class="slider-container values">
	<div class="slider">
		<ul>
			{#each extendedValuesList as item}
				<li>{item.title} <i>+</i></li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.slider-container {
		margin-top: 24px;
		overflow: hidden;
		white-space: nowrap;
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		padding: 1rem 0;
	}

	.values {
		top: -20px;
	}

	.values .slider li {
		background-color: #c9ffe1;
		font-style: italic;
		font-weight: 100;
		position: relative;
	}

	.values i {
		position: absolute;
		top: -25px;
		right: 0;
		left: 0;
		font-weight: 400;
		font-size: 29px;
		font-style: normal;
		color: #73eda9;
	}

	.slider {
		display: flex;
		gap: 2rem;
		min-width: 200%;
		animation: scroll var(--animation-duration) linear infinite;
	}

	@keyframes scroll {
		from {
			transform: translateX(0%);
		}
		to {
			transform: translateX(-50%);
		}
	}

	/* Pause animation on hover */
	.slider-container:hover .slider {
		animation-play-state: paused;
	}

	.slider ul {
		display: flex;
		gap: 2rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.slider li {
		font-size: 1.2rem;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		white-space: nowrap;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
	}

	:root {
		--animation-duration: 60s; /* Adjustable animation speed */
	}
</style>
