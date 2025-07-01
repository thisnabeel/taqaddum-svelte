<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';

	export let menteeships: Array<{
		id: number;
		skill: { id: number; title: string };
		profession: string;
		company: string;
	}> = [];

	const dispatch = createEventDispatcher();

	let selectedPrefix: string | null = null;
	let selectedPlaceholder: string | null = null;
	let questionText = '';
	let showTextBox = false;
	let selectedMenteeshipId: number;
	let loadingQuestions = false;

	onMount(() => {
		// Auto-select menteeship if there's only one
		if (menteeships.length === 1) {
			selectedMenteeshipId = menteeships[0].id;
		}
	});

	const questionPrefixes = [
		{
			category: '🔍 Self-awareness & Challenge-Oriented',
			prefixes: [
				{
					text: "I'm struggling with...",
					description: 'Shows vulnerability and invites actionable advice.',
					placeholder:
						'e.g., balancing work and personal development, or communicating complex ideas to different audiences'
				},
				{
					text: "I'm trying to decide between...",
					description: 'Frames a specific dilemma that mentors love helping with.',
					placeholder:
						'e.g., staying at my current company vs. exploring new opportunities, or pursuing different career paths'
				},
				{
					text: 'I feel stuck on...',
					description: "Indicates you're working on something but need guidance.",
					placeholder:
						'e.g., advancing to the next level in my career, or developing a specific skill set'
				},
				{
					text: "I'm unsure how to approach...",
					description: 'Signals thoughtfulness and opens space for frameworks or strategy tips.',
					placeholder:
						'e.g., a major project or decision, or building relationships with key stakeholders'
				}
			]
		},
		{
			category: '📈 Growth & Development',
			prefixes: [
				{
					text: 'What helped you when...',
					description: 'Leverages their experience while making the question relatable.',
					placeholder:
						'e.g., you were transitioning to a new role or industry, or facing a major career challenge'
				},
				{
					text: 'How did you handle...',
					description: 'Invites storytelling, which makes the answer stick.',
					placeholder:
						'e.g., imposter syndrome in your early career, or a major setback that taught you important lessons'
				},
				{
					text: 'What would you do differently if...',
					description: 'Encourages mentors to reflect on past mistakes — gold for mentees.',
					placeholder:
						'e.g., you could go back to your early career days, or you were starting your current role again'
				}
			]
		},
		{
			category: '🛠️ Execution & Application',
			prefixes: [
				{
					text: 'Can I get your feedback on...',
					description: 'Turns the mentor into an active guide.',
					placeholder:
						"e.g., my approach to solving this problem, or the strategy I'm considering for my goals"
				},
				{
					text: "Do you think it's worth...",
					description: 'Helps weigh trade-offs — a major skill for professionals.',
					placeholder:
						'e.g., investing time in learning this new skill, or pursuing this opportunity for my career'
				},
				{
					text: 'What should I watch out for when...',
					description: "Helps avoid common pitfalls and shows you're thinking ahead.",
					placeholder:
						'e.g., negotiating my next role, or leading my first major project with a team'
				}
			]
		}
	];

	function selectPrefix(prefix: string, placeholder: string) {
		selectedPrefix = prefix;
		selectedPlaceholder = placeholder;
		showTextBox = true;
		questionText = '';
	}

	async function submitQuestion() {
		if (questionText.trim() && selectedMenteeshipId) {
			const fullQuestion = selectedPrefix.replace('...', '') + ' ' + questionText.trim();
			const menteeship = menteeships.find((m) => m.id === selectedMenteeshipId);

			const payload = {
				user_id: $user.id,
				questionable_id: menteeship?.skill.id,
				questionable_type: 'Skill',
				body: fullQuestion
			};

			try {
				await dispatch('submit', payload);
				// Reset form only after successful submission
				selectedPrefix = null;
				selectedPlaceholder = null;
				questionText = '';
				selectedMenteeshipId = null;
				showTextBox = false;
			} catch (error) {
				console.error('Error submitting question:', error);
				// Handle error - could show a toast notification here
			}
		}
	}

	function cancelQuestion() {
		selectedPrefix = null;
		selectedPlaceholder = null;
		questionText = '';
		selectedMenteeshipId = null;
		showTextBox = false;
	}
</script>

<div class="career-questions-component">
	{#if !showTextBox}
		<!-- Prefix Selection View -->
		<div class="prefix-selection">
			<div class="header mb-4">
				<h3 class="h5 mb-2">Ask a Career Question</h3>
				<p class="text-muted">Choose a question starter that fits your situation:</p>
			</div>

			<div class="prefix-categories">
				{#each questionPrefixes as category}
					<div class="category-section mb-4">
						<h6 class="category-title mb-3">{category.category}</h6>
						<div class="prefix-options">
							{#each category.prefixes as prefix}
								<button
									class="prefix-option"
									on:click={() => selectPrefix(prefix.text, prefix.placeholder)}
								>
									<div class="prefix-text">{prefix.text}</div>
									<div class="prefix-description">{prefix.description}</div>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- Question Input View -->
		<div class="question-input">
			<div class="header mb-4">
				<h3 class="h5 mb-2">Complete Your Question</h3>
				<p class="text-muted">
					Finish your question with specific details and select the area you want advice on:
				</p>
			</div>

			<div class="question-form">
				<div class="form-group mb-3">
					<label class="form-label">Area of Focus:</label>
					<select class="form-select" bind:value={selectedMenteeshipId} required>
						<option value="" disabled selected>Select an area...</option>
						{#each menteeships as menteeship}
							<option value={menteeship.id}
								>{menteeship.skill.title} ({menteeship.profession} @ {menteeship.company})</option
							>
						{/each}
					</select>
				</div>
				<div class="form-group mb-3">
					<label class="form-label">Your Question:</label>
					<div class="question-input-container">
						<div class="prefix-display">{selectedPrefix}</div>
						<textarea
							bind:value={questionText}
							class="form-control question-textarea"
							rows="4"
							placeholder={selectedPlaceholder}
						></textarea>
					</div>
				</div>
				<div class="question-actions">
					<button class="btn btn-secondary me-2" on:click={cancelQuestion}> Cancel </button>
					<button
						class="btn btn-primary"
						on:click={submitQuestion}
						disabled={!questionText.trim() || !selectedMenteeshipId}
					>
						Submit Question
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Existing Questions Section -->
</div>

<style>
	.career-questions-component {
		max-width: 800px;
		margin: 0 auto;
	}

	.prefix-selection {
		animation: fadeIn 0.3s ease-in-out;
	}

	.category-title {
		font-weight: 600;
		color: #495057;
		border-bottom: 2px solid #e9ecef;
		padding-bottom: 0.5rem;
	}

	.prefix-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.prefix-option {
		background: white;
		border: 2px solid #e9ecef;
		border-radius: 0.75rem;
		padding: 1rem;
		text-align: left;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.prefix-option:hover {
		border-color: #007bff;
		background-color: #f8f9fa;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
	}

	.prefix-text {
		font-weight: 600;
		color: #212529;
		margin-bottom: 0.25rem;
		font-size: 1rem;
	}

	.prefix-description {
		font-size: 0.875rem;
		color: #6c757d;
		line-height: 1.4;
	}

	.question-input {
		animation: slideIn 0.3s ease-in-out;
	}

	.question-textarea {
		border: 2px solid #e9ecef;
		border-radius: 0.75rem;
		font-size: 1rem;
		line-height: 1.5;
		resize: vertical;
		transition: border-color 0.2s ease;
	}

	.question-textarea:focus {
		border-color: #007bff;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}

	.question-input-container {
		position: relative;
	}

	.prefix-display {
		background-color: #f8f9fa;
		border: 2px solid #e9ecef;
		border-bottom: none;
		border-radius: 0.75rem 0.75rem 0 0;
		padding: 0.75rem 1rem;
		font-weight: 600;
		color: #495057;
		font-size: 1rem;
		line-height: 1.5;
	}

	.question-textarea {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		border-top: none;
	}

	.question-textarea:focus {
		border-color: #007bff;
		border-top-color: #e9ecef;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}

	.question-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (max-width: 768px) {
		.prefix-option {
			padding: 0.75rem;
		}

		.question-actions {
			flex-direction: column;
		}

		.question-actions .btn {
			width: 100%;
			margin: 0.25rem 0;
		}
	}

	.form-select {
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
	}

	/* Existing Questions Styling */
	.existing-questions-section {
		border-top: 1px solid #e9ecef;
		padding-top: 1.5rem;
	}

	.questions-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.question-item {
		background: white;
		border: 1px solid #e9ecef;
		border-radius: 0.75rem;
		padding: 1rem;
		transition: all 0.2s ease;
	}

	.question-item:hover {
		border-color: #007bff;
		box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
	}

	.question-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
	}

	.question-meta {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.question-date {
		font-size: 0.875rem;
		color: #6c757d;
		font-weight: 500;
	}

	.question-area {
		font-size: 0.75rem;
		color: #007bff;
		background-color: #e7f3ff;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		display: inline-block;
	}

	.question-status {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
	}

	.status-pending {
		background-color: #fff3cd;
		color: #856404;
	}

	.status-answered {
		background-color: #d1edff;
		color: #0c5460;
	}

	.status-resolved {
		background-color: #d4edda;
		color: #155724;
	}

	.question-content {
		font-size: 1rem;
		line-height: 1.5;
		color: #212529;
		margin-bottom: 0.75rem;
	}

	.question-answers {
		border-top: 1px solid #e9ecef;
		padding-top: 0.75rem;
	}

	.answers-count {
		font-size: 0.875rem;
		color: #6c757d;
		font-weight: 500;
	}

	.no-questions {
		background-color: #f8f9fa;
		border-radius: 0.75rem;
		border: 2px dashed #dee2e6;
	}

	@media (max-width: 768px) {
		.question-header {
			flex-direction: column;
			gap: 0.5rem;
		}

		.question-meta {
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
		}

		.question-item {
			padding: 0.75rem;
		}
	}
</style>
