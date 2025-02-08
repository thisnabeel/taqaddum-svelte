<script>
	let faqs = [
		{
			question: 'What is Taqaddum?',
			answer:
				'Taqaddum is a mentorship platform connecting Muslim professionals with students and recent graduates to provide career guidance, shadowing opportunities, and professional development from an Islamic perspective.'
		},
		{
			question: 'Who can be a mentor?',
			answer:
				'Any Muslim professional with experience in their field who wants to provide guidance and support to students and recent graduates.'
		},
		{
			question: 'What do mentors gain?',
			answer:
				"Mentors gain valuable mentorship experience, insights from students' fresh perspectives, and the reward of Sadaqah Jariyah for helping others in their career journey."
		},
		{
			question: 'What do students gain?',
			answer:
				'Students receive career advice, mentorship, exposure to real-world job environments, and insights on how Islamic principles contribute to professional success.'
		},
		{
			question: 'Why is mentorship important?',
			answer:
				'Mentorship helps students navigate career choices, gain clarity on their goals, and stay motivated. Having a mentor can accelerate career growth and provide a valuable support system.'
		},
		{
			question: 'Why is Taqaddum focused on the Muslim community?',
			answer:
				'Taqaddum integrates Islamic principles into career guidance, helping mentees see how practices like Salah, Shukr, and work-life balance contribute to professional success.'
		},
		{
			question: 'How can I sign up as a mentor or mentee?',
			answer:
				"You can sign up through our website by filling out a simple application form. Once approved, you'll be matched with a mentor or mentee based on your interests and expertise."
		}
	];
</script>

<div class="faq-container">
	<h2>Frequently Asked Questions</h2>
	{#each faqs as faq, i}
		<div class="faq-item open">
			<div class="faq-question">{faq.question}</div>
			<div class="faq-answer">{faq.answer}</div>
		</div>
	{/each}
</div>

<style>
	.faq-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}
	.faq-item {
		border-bottom: 1px solid #ddd;
		padding: 10px 0;
	}
	.faq-question {
		font-weight: bold;
		cursor: pointer;
		transition: color 0.3s;
	}
	.faq-question:hover {
		color: #007bff;
	}
	.faq-answer {
		margin-top: 5px;
		display: none;
	}
	.open .faq-answer {
		display: block;
	}
</style>
