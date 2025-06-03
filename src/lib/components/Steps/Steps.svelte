<script>
	import { goto } from '$app/navigation';
	let activeTab = 'mentee';

	const menteeSteps = [
		"Tell us what you're pursuing.",
		'Our team will verify your pursuit.',
		"Once approved, you'll start receiving Mentor Matches in your inbox."
	];

	const mentorSteps = [
		'Tell us about your professional experience.',
		'Our team will verify your experience.',
		"Once approved, you'll start receiving Mentee Matches in your inbox."
	];

	function handleGetStarted() {
		const role = activeTab === 'mentee' ? 'Mentee' : 'Mentor';
		goto(`/users/sign_up?type=${role}`);
	}
</script>

<div class="steps-container">
	<div class="tabs">
		<button class:active={activeTab === 'mentee'} on:click={() => (activeTab = 'mentee')}>
			Mentee
		</button>
		<button class:active={activeTab === 'mentor'} on:click={() => (activeTab = 'mentor')}>
			Mentor
		</button>
	</div>

	<div class="steps-content">
		<h3>How it Works:</h3>
		<div class="steps-list">
			{#if activeTab === 'mentee'}
				{#each menteeSteps as step, i}
					<div class="step">
						<div class="step-number">Step {i + 1}</div>
						<div class="step-text">{step}</div>
					</div>
				{/each}
			{:else}
				{#each mentorSteps as step, i}
					<div class="step">
						<div class="step-number">Step {i + 1}</div>
						<div class="step-text">{step}</div>
					</div>
				{/each}
			{/if}
		</div>
		<div class="button-container">
			<button class="get-started" on:click={handleGetStarted}>Get Started</button>
		</div>
	</div>
</div>

<style>
	.steps-container {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.tabs {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.tabs button {
		padding: 0.75rem 2rem;
		border: none;
		background: #f5f5f5;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1.1rem;
		transition: all 0.3s ease;
	}

	.tabs button.active {
		background: black;
		color: white;
	}

	.steps-content {
		text-align: left;
	}

	h3 {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
	}

	.steps-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.step {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 8px;
		transition: transform 0.2s ease;
	}

	.step:hover {
		transform: translateX(10px);
	}

	.step-number {
		font-weight: bold;
		color: black;
		min-width: 80px;
	}

	.step-text {
		flex: 1;
	}

	@media (max-width: 768px) {
		.steps-container {
			padding: 1rem;
		}

		.step {
			flex-direction: column;
			gap: 0.5rem;
		}

		.step-number {
			min-width: auto;
		}
	}

	.button-container {
		text-align: center;
		margin-top: 2rem;
	}

	.get-started {
		background: black;
		color: white;
		padding: 1rem 3rem;
		border: none;
		border-radius: 5px;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.get-started:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
</style>
