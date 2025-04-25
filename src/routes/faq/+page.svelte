<script>
	let faqs = [
		{
			question: 'What is Taqaddum?',
			answer:
				'Taqaddum is a mentorship platform connecting Muslim professionals with students and recent graduates to provide career guidance, shadowing opportunities, and professional development from an Islamic perspective.',
			icon: 'fa-handshake',
			image:
				'https://images.unsplash.com/photo-1581090700227-1e8e5f1a1c5c?auto=format&fit=crop&w=400&q=80'
		},
		{
			question: 'Who can be a mentor?',
			answer:
				'Any Muslim professional with experience in their field who wants to provide guidance and support to students and recent graduates.',
			icon: 'fa-user-tie',
			image:
				'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80'
		},
		{
			question: 'What do mentors gain?',
			answer:
				"Mentors gain valuable mentorship experience, insights from students' fresh perspectives, and the reward of Sadaqah Jariyah for helping others in their career journey.",
			icon: 'fa-gift',
			image:
				'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=400&q=80'
		},
		{
			question: 'What do students gain?',
			answer:
				'Students receive career advice, mentorship, exposure to real-world job environments, and insights on how Islamic principles contribute to professional success.',
			icon: 'fa-user-graduate',
			image:
				'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80'
		},
		{
			question: 'Why is mentorship important?',
			answer:
				'Mentorship helps students navigate career choices, gain clarity on their goals, and stay motivated. Having a mentor can accelerate career growth and provide a valuable support system.',
			icon: 'fa-lightbulb',
			image:
				'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80'
		},
		{
			question: 'Why is Taqaddum focused on the Muslim community?',
			answer:
				'Taqaddum integrates Islamic principles into career guidance, helping mentees see how practices like Salah, Shukr, and work-life balance contribute to professional success.',
			icon: 'fa-mosque',
			image:
				'https://images.unsplash.com/photo-1590490350339-8c5c9b4c6e38?auto=format&fit=crop&w=400&q=80'
		},
		{
			question: 'How can I sign up as a mentor or mentee?',
			answer:
				"You can sign up through our website by filling out a simple application form. Once approved, you'll be matched with a mentor or mentee based on your interests and expertise.",
			icon: 'fa-pen-to-square',
			image:
				'https://images.unsplash.com/photo-1584697964154-6e1f4d6e1d2c?auto=format&fit=crop&w=400&q=80'
		}
	];

	let open = [];
	$: console.log({ open });
</script>

<!-- Include Font Awesome -->
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>

<div class="faq-container">
	<h2><i class="fas fa-circle-question"></i> Frequently Asked Questions</h2>
	{#each faqs as faq, i}
		<div class="faq-item" id="faq-item-{i}">
			<div
				class="faq-header"
				class:open={open.includes(i)}
				on:click={() => {
					if (open.includes(i)) {
						open = open.filter((f) => f != i);
					} else {
						open = [...open, i];
					}
				}}
			>
				<i class="fas {faq.icon} faq-icon"></i>
				<span class="faq-question">{faq.question}</span>
			</div>
			{#if open.includes(i)}
				<div class="faq-content">
					<!-- <img src={faq.image} alt="Related image" class="faq-image" /> -->
					<p class="faq-answer">{faq.answer}</p>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.faq-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	.faq-container h2 {
		text-align: center;
		margin-bottom: 30px;
		font-size: 2em;
		color: #2c3e50;
	}

	.faq-item {
		border-bottom: 1px solid #e0e0e0;
		padding: 15px 0;
		transition: background-color 0.3s;
	}

	.faq-item.open {
		background-color: #f9f9f9;
	}

	.faq-header {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.faq-icon {
		margin-right: 10px;
		color: #3498db;
		font-size: 1.2em;
		flex-shrink: 0;
	}

	.faq-question {
		font-weight: 600;
		font-size: 1.1em;
		color: #34495e;
	}

	.faq-content {
		margin-top: 15px;
		align-items: flex-start;
	}

	.faq-item.open .faq-content {
		display: flex;
	}

	.faq-image {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-radius: 8px;
		margin-right: 15px;
		flex-shrink: 0;
	}

	.faq-answer {
		flex: 1;
		font-size: 1em;
		color: #555;
		padding: 0;
	}

	@media (max-width: 600px) {
		.faq-content {
			flex-direction: column;
		}

		.faq-image {
			width: 100%;
			height: auto;
			margin-bottom: 10px;
		}
	}
</style>
