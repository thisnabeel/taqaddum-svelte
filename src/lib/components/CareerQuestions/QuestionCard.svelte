<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { inview } from 'svelte-inview';
	import { user, mentorships } from '$lib/stores/user';
	import API from '$lib/api/api';

	$: console.log($mentorships);
	export let question: {
		id: number;
		body: string;
		created_at: string;
		user: {
			id: number;
		};
		questionable?: {
			title: string;
		};
		answers?: Array<{ id: number; body: string; user_id: number; created_at: string }>;
	};

	const dispatch = createEventDispatcher();

	let showAnswerForm = false;
	let answerText = '';
	let submitting = false;
	let error = '';
	let submittedAnswer: null | { id: number; body: string; user_id: number; created_at: string } =
		null;

	let answers: Array<{ id: number; body: string; user_id: number; created_at: string }> = [];
	let loadingAnswers = false;
	let answersLoaded = false;
	let showReplies = false;

	async function loadAnswers() {
		if (answersLoaded) return;
		loadingAnswers = true;
		try {
			const res = await API.get(`/question_answers/for_question/${question.id}`);
			answers = res;
			answersLoaded = true;
		} catch (e) {
			// Optionally handle error
		} finally {
			loadingAnswers = false;
		}
	}

	function handleInViewChange(event: CustomEvent<any>) {
		const { inView } = event.detail;
		if (inView && !answersLoaded) {
			loadAnswers();
		}
	}

	function handleAnswer() {
		showAnswerForm = true;
		answerText = '';
		error = '';
	}

	async function submitAnswer() {
		if (!answerText.trim()) {
			error = 'Answer cannot be empty.';
			return;
		}
		submitting = true;
		error = '';
		try {
			const res = await API.post('/question_answers', {
				question_id: question.id,
				question_answer: {
					user_id: $user.id,
					body: answerText.trim(),
					question_id: question.id
				}
			});
			submittedAnswer = res;
			answers = [...answers, res];
			showAnswerForm = false;
			answerText = '';
		} catch (e) {
			error = 'Failed to submit answer. Please try again.';
		} finally {
			submitting = false;
		}
	}

	function cancelAnswer() {
		showAnswerForm = false;
		answerText = '';
		error = '';
	}

	function handleDelete() {
		if (confirm('Are you sure you want to delete this question?')) {
			dispatch('delete', { question: question });
		}
	}
</script>

<div
	class="question-card"
	use:inview={{ rootMargin: '0px 0px -50px 0px', unobserveOnEnter: false }}
	on:inview_change={handleInViewChange}
>
	<div class="card-body">
		<div class="question-content">
			{question.body}
		</div>

		{#if $user}
			<!-- <hr /> -->
			<div class="question-answers">
				<div class="answers-actions">
					{#if question.questionable}
						<div class="skill-badge">
							{question.menteeship.profession} @ {question.menteeship.company}
							{#if $user && question.user.id === $user.id}
								<span class="mentorship-info">You</span>
							{/if}
						</div>
					{/if}
					<div class="actions-row">
						<div class="answers-actions-spacer"></div>
						{#if answers.length > 0}
							<button class="replies-btn" on:click={() => (showReplies = !showReplies)}>
								<i class="fa fa-comments"></i>
								{answers.length}
								{answers.length === 1 ? 'Reply' : 'Replies'}
							</button>
						{:else if answers.length === 0}
							<button class="replies-btn" disabled>
								<i class="fa fa-clock"></i>
								Awaiting Response
							</button>
						{/if}
						{#if $user && $mentorships.find((m) => m.skill.id === question.questionable?.id)}
							{#if !showAnswerForm && !submittedAnswer}
								<button class="answer-btn" on:click={handleAnswer}>
									<i class="fa fa-reply"></i>
									Answer
								</button>
							{:else}
								<button class="answer-btn btn btn-danger" on:click={() => (showAnswerForm = false)}>
									<i class="fa fa-reply"></i>
									Cancel
								</button>
							{/if}
						{/if}
					</div>
				</div>

				{#if showAnswerForm}
					<div class="answer-form">
						<textarea
							bind:value={answerText}
							class="form-control"
							placeholder="Type your answer here..."
							rows="3"
							disabled={submitting}
						></textarea>
						{#if error}
							<div class="error-message">{error}</div>
						{/if}
						<div class="answer-actions">
							<button class="btn btn-success" on:click={submitAnswer} disabled={submitting}>
								{submitting ? 'Submitting...' : 'Submit'}
							</button>
							<button class="btn btn-secondary" on:click={cancelAnswer} disabled={submitting}>
								Cancel
							</button>
						</div>
					</div>
				{/if}

				{#if submittedAnswer}
					<div class="submitted-answer">
						<div class="answer-label"><i class="fa fa-check-circle"></i> Your Answer:</div>
						<div class="answer-body">{submittedAnswer.body}</div>
						<div class="answer-meta">
							<small>Answered just now</small>
						</div>
					</div>
				{/if}

				{#if loadingAnswers}
					<div class="loading-answers">Loading answers...</div>
				{:else if answers.length > 0 && showReplies}
					<div class="answers-list">
						{#each answers as ans}
							<div class="answer-item">
								<div class="answer-label-badge">
									<div class="answer-label">
										<i class="fa fa-user"></i>
										Answered by a
									</div>
									<span class="answer-badge">Software Engineer @ Paypal</span>
								</div>
								<div class="answer-body">{ans.body}</div>
								<div class="answer-meta">
									{new Date(ans.created_at).toLocaleString()}
								</div>
							</div>
						{/each}
					</div>
				{:else if answersLoaded && answers.length === 0}{/if}
			</div>
		{/if}
	</div>

	<!-- <div class="card-footer">
		{#if answers.length < 1}
			<div class="status-indicator">
				<i class="fa fa-clock"></i>
				<span>Awaiting response</span>
			</div>
		{/if}
	</div> -->
</div>

<style>
	.question-card {
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		border: 1px solid #e9ecef;
		border-radius: 16px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		position: relative;
		margin-bottom: 1.25rem;
	}

	.question-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
		border-color: #007bff;
	}

	/* .question-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #007bff, #0056b3);
	} */

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem 0.75rem;
		background: rgba(248, 249, 250, 0.5);
		gap: 0.5rem;
	}

	.meta-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.date-badge,
	.skill-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.375rem 0.75rem;
		border-radius: 20px;
		transition: all 0.2s ease;
	}

	.date-badge {
		background: rgba(0, 123, 255, 0.1);
		color: #007bff;
		border: 1px solid rgba(0, 123, 255, 0.2);
	}

	.date-badge i {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.skill-badge {
		background: rgba(40, 167, 69, 0.1);
		color: #28a745;
		border: 1px solid rgba(40, 167, 69, 0.2);
		align-self: flex-start;
	}

	.skill-badge i {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.question-icon {
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, #ffc107, #ff8c00);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
		transition: all 0.3s ease;
	}

	.question-icon:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4);
	}

	.question-icon i {
		color: white;
		font-size: 1.25rem;
	}

	.card-body {
		padding: 1rem 1.5rem;
	}

	.question-content {
		font-size: 1.3rem;
		line-height: 1.6;
		color: #2c3e50;
		font-weight: 400;
	}

	.card-footer {
		padding: 0.75rem 1.5rem 1.25rem;
		border-top: 1px solid #f1f3f4;
		background: rgba(248, 249, 250, 0.3);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #6c757d;
		font-weight: 500;
	}

	.status-indicator i {
		color: #ffc107;
		font-size: 1rem;
	}

	.header-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	.delete-btn {
		width: 36px;
		height: 36px;
		background: rgba(220, 53, 69, 0.1);
		border: 1px solid rgba(220, 53, 69, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #dc3545;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.delete-btn:hover {
		background: rgba(220, 53, 69, 0.2);
		border-color: #dc3545;
		transform: scale(1.05);
	}

	.delete-btn i {
		font-size: 0.875rem;
	}

	.question-answers {
		margin-top: 1rem;
	}

	.mentorship-info {
		background: #28a745;
		color: #fff;
		padding: 5px 10px;
		border-radius: 10px;
	}

	.answer-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		background: linear-gradient(90deg, #28a745 0%, #218838 100%);
		color: #fff;
		border: none;
		border-radius: 20px;
		padding: 0.5em 1.25em;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			background 0.2s,
			box-shadow 0.2s,
			transform 0.1s;
		box-shadow: 0 2px 8px rgba(40, 167, 69, 0.08);
		margin-left: 0.5em;
	}

	.answer-btn i {
		font-size: 1.1em;
	}

	.answer-btn:hover,
	.answer-btn:focus {
		background: linear-gradient(90deg, #218838 0%, #28a745 100%);
		box-shadow: 0 4px 16px rgba(40, 167, 69, 0.15);
		transform: translateY(-2px) scale(1.04);
		outline: none;
	}

	.answer-form {
		margin-top: 1em;
		background: #f8f9fa;
		border-radius: 0.75em;
		padding: 1em;
		box-shadow: 0 2px 8px rgba(40, 167, 69, 0.05);
	}

	.answer-form textarea {
		width: 100%;
		border-radius: 0.5em;
		border: 1px solid #e9ecef;
		padding: 0.75em;
		font-size: 1em;
		resize: vertical;
		margin-bottom: 0.5em;
	}

	.answer-actions {
		display: flex;
		gap: 0.5em;
	}

	.error-message {
		color: #dc3545;
		font-size: 0.95em;
		margin-bottom: 0.5em;
	}

	.submitted-answer {
		margin-top: 1em;
		background: #e6f9ed;
		border-radius: 0.75em;
		padding: 1em;
		box-shadow: 0 2px 8px rgba(40, 167, 69, 0.05);
	}

	.answer-label {
		color: #218838;
		font-weight: 600;
		margin-bottom: 0.5em;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.answer-label i {
		color: #28a745;
	}

	.answer-body {
		font-size: 1.05em;
		margin-bottom: 0.25em;
	}

	.answer-meta {
		color: #6c757d;
		font-size: 0.9em;
	}

	.loading-answers {
		color: #007bff;
		font-size: 0.95em;
		margin-top: 0.5em;
	}

	.answers-list {
		margin-top: 1em;
	}

	.answer-item {
		background: #f4f8fa;
		border-radius: 0.75em;
		padding: 1em 1.25em;
		margin-bottom: 1em;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.answer-label-badge {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.answer-label {
		color: #218838;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.5em;
		font-size: 1em;
	}

	.answer-badge {
		background: #22b455;
		color: #fff;
		border-radius: 1em;
		padding: 0.25em 1em;
		font-size: 0.95em;
		font-weight: 600;
		margin-left: 0.5em;
		display: inline-block;
	}

	.answer-body {
		font-size: 1.1em;
		color: #222;
		margin: 0.5em 0;
	}

	.answer-meta {
		color: #6c757d;
		font-size: 0.9em;
		margin-top: 0.25em;
	}

	.no-answers {
		color: #6c757d;
		font-size: 0.95em;
		margin-top: 0.5em;
	}

	.answers-actions {
		display: flex;
		align-items: center;
		gap: 1em;
		margin-bottom: 0.5em;
	}

	.actions-row {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-left: auto;
	}

	.answers-actions-spacer {
		flex: 1 1 auto;
	}

	.skill-badge {
		margin-right: 0.5em;
		font-weight: 600;
		background: rgba(40, 167, 69, 0.1);
		color: #28a745;
		border-radius: 1em;
		padding: 0.25em 1em;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.mentorship-info {
		background: #ffc108;
		color: #333;
		border-radius: 1em;
		padding: 0.15em 0.7em;
		font-size: 0.95em;
		margin-left: 0.5em;
	}

	.replies-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		background: #e9ecef;
		color: #007bff;
		border: none;
		border-radius: 20px;
		padding: 0.4em 1.1em;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s,
			box-shadow 0.2s;
		box-shadow: 0 1px 4px rgba(0, 123, 255, 0.06);
	}

	.replies-btn i {
		font-size: 1.1em;
	}

	.replies-btn:hover,
	.replies-btn:focus {
		background: #007bff;
		color: #fff;
		outline: none;
	}

	.replies-btn:disabled {
		background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
		color: #856404;
		border: 1px solid rgba(255, 193, 7, 0.3);
		cursor: not-allowed;
		opacity: 0.9;
		box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
	}

	.replies-btn:disabled:hover {
		background: linear-gradient(135deg, #ffb300 0%, #ffc107 100%);
		transform: none;
		box-shadow: 0 2px 8px rgba(255, 193, 7, 0.25);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.actions-row {
			display: flex;
			column-gap: 10px;
			margin-left: 0;
		}

		.question-card {
			border-radius: 12px;
			margin-bottom: 1.25rem;
		}

		.card-header {
			padding: 1rem 1.25rem 0.5rem;
			gap: 0.5rem;
		}

		.header-actions {
			gap: 0.5rem;
			justify-content: flex-end;
		}

		.question-icon {
			width: 40px;
			height: 40px;
		}

		.question-icon i {
			font-size: 1rem;
		}

		.delete-btn {
			width: 32px;
			height: 32px;
		}

		.delete-btn i {
			font-size: 0.8rem;
		}

		.card-body {
			padding: 0.75rem 1.25rem;
		}

		.card-footer {
			padding: 0.5rem 1.25rem 1rem;
		}

		.date-badge,
		.skill-badge {
			font-size: 0.8rem;
			padding: 0.25rem 0.5rem;
		}

		.answer-btn {
			width: 100%;
			justify-content: center;
			margin: 0.5em 0 0 0;
		}
	}

	@media (max-width: 480px) {
		.meta-info {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}

		.question-content {
			font-size: 1rem;
			line-height: 1.5;
		}
	}

	@media (max-width: 600px) {
		.answers-actions {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5em;
		}
		.answers-actions-spacer {
			display: none;
		}
		.skill-badge {
			margin-right: 0;
			margin-bottom: 0.25em;
			width: 100%;
			justify-content: flex-start;
		}
		.answer-item {
			padding: 0.75em 0.5em;
			gap: 0.25em;
		}
		.answer-label-badge {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25em;
		}
		.answer-label {
			font-size: 0.98em;
		}
		.answer-badge {
			margin-left: 0;
			margin-top: 0.25em;
			width: 100%;
			text-align: center;
			font-size: 1em;
		}
		.answer-body {
			font-size: 1em;
		}
		.replies-btn,
		.answer-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
