<script>
	import { onMount } from 'svelte';

	// For animation effects
	let visible = false;

	// Form state
	let name = '';
	let email = '';
	let profession = '';
	let experience = '';
	let submitted = false;

	// Testimonials data
	const testimonials = [];

	// FAQ data
	const faqs = [
		{
			question: 'How much time do I need to commit?',
			answer:
				'You decide your availability. Most mentors commit to 1-2 hours monthly, with flexible scheduling options.'
		},
		{
			question: 'What support will I receive as a mentor?',
			answer:
				'We provide session guides, mentorship resources, and structured programs so you can focus on sharing your expertise without administrative burden.'
		},
		{
			question: 'Do I need extensive experience to mentor?',
			answer:
				"Whether you're a seasoned professional or early in your career, your journey and insights are valuable. We match mentors and mentees based on experience level and goals."
		}
	];

	// Islamic principles that connect to professional development
	const principles = [
		{ name: 'Ihsan (Excellence)', description: 'Strive for excellence in all endeavors' },
		{ name: 'Amanah (Trustworthiness)', description: 'Fulfill responsibilities with integrity' },
		{ name: 'Sadaqah Jariyah', description: 'Continuous charity through sharing knowledge' },
		{ name: 'Ukhuwah (Brotherhood/Sisterhood)', description: 'Foster community bonds and support' }
	];

	function handleSubmit() {
		// In a real implementation, this would send data to backend
		submitted = true;
		// Add analytics tracking for lead generation
	}

	onMount(() => {
		// Animation for elements appearing
		setTimeout(() => {
			visible = true;
		}, 100);

		// Add intersection observer for scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-in');
					}
				});
			},
			{ threshold: 0.1 }
		);

		document.querySelectorAll('.animate-on-scroll').forEach((el) => {
			observer.observe(el);
		});
	});
</script>

<div class:visible>
	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-content">
			<div class="fade-in" style="transition-delay: 0.1s;">
				<h1>Shape the Future of Muslim Professionals</h1>
				<p>
					Join Taqaddum as a mentor and make a lasting impact through knowledge sharing while
					earning ongoing Sadaqah Jariyah.
				</p>
			</div>
			<div class="fade-in" style="transition-delay: 0.3s;">
				<button class="cta-button" on:click={() => (window.location.href = '#signup')}
					>Become a Mentor</button
				>
			</div>
		</div>
	</section>

	<!-- Benefits Section -->
	<section class="section">
		<div class="section-title animate-on-scroll">
			<h2>Benefits of Mentoring</h2>
		</div>
		<div class="benefits-grid">
			<div class="benefit-card animate-on-scroll">
				<div class="benefit-icon">🌟</div>
				<h3>Professional Development</h3>
				<p>
					Enhance your leadership, communication, and coaching skills while receiving formal
					recognition for your contribution.
				</p>
			</div>
			<div class="benefit-card animate-on-scroll">
				<div class="benefit-icon">🤲</div>
				<h3>Sadaqah Jariyah</h3>
				<p>
					Share knowledge that continues to benefit others, earning ongoing rewards in this life and
					the next.
				</p>
			</div>
			<div class="benefit-card animate-on-scroll">
				<div class="benefit-icon">🔄</div>
				<h3>Flexible Commitment</h3>
				<p>
					Choose your availability and mentorship format. Most mentors commit just 1-2 hours
					monthly.
				</p>
			</div>
			<div class="benefit-card animate-on-scroll">
				<div class="benefit-icon">🔗</div>
				<h3>Expand Your Network</h3>
				<p>
					Connect with other professional Muslims across industries and build meaningful
					relationships.
				</p>
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<!-- <section class="section testimonials">
		<div class="section-title animate-on-scroll">
			<h2>Mentor Experiences</h2>
		</div>
		<div class="testimonial-grid">
			{#each testimonials as testimonial, i}
				<div class="testimonial-card animate-on-scroll">
					<div class="testimonial-header">
						<img src={testimonial.image} alt={testimonial.name} class="testimonial-image" />
						<div class="testimonial-info">
							<h3>{testimonial.name}</h3>
							<p>{testimonial.role}</p>
						</div>
					</div>
					<p class="testimonial-quote">"{testimonial.quote}"</p>
				</div>
			{/each}
		</div>
	</section> -->

	<!-- FAQ Section -->
	<section class="section">
		<div class="section-title animate-on-scroll">
			<h2>Frequently Asked Questions</h2>
		</div>
		<div class="faq-section">
			{#each faqs as faq, i}
				<div class="faq-item animate-on-scroll">
					<div class="faq-question">{faq.question}</div>
					<div class="faq-answer">{faq.answer}</div>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	/* Global styles */
	:global(body) {
		font-family: 'Poppins', sans-serif;
		color: #333;
		background-color: #f8f9fa;
		margin: 0;
		padding: 0;
	}

	/* Animation classes */
	.fade-in {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.8s ease,
			transform 0.8s ease;
	}

	.visible .fade-in {
		opacity: 1;
		transform: translateY(0);
	}

	.animate-on-scroll {
		/* opacity: 0; */
		transform: translateY(20px);
		transition:
			opacity 0.8s ease,
			transform 0.8s ease;
	}

	.animate-in {
		opacity: 1;
		transform: translateY(0);
	}

	/* Component-specific styles */
	.hero {
		background: linear-gradient(135deg, #1e5f74 0%, #133b5c 100%);
		color: white;
		padding: 5rem 2rem;
		text-align: center;
		position: relative;
	}

	.hero-content {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		z-index: 2;
	}

	.hero h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.hero p {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		opacity: 0.9;
	}

	.hero::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('/images/pattern.svg');
		background-size: cover;
		opacity: 0.1;
		z-index: 1;
	}

	.cta-button {
		background-color: #e63946;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.cta-button:hover {
		background-color: #d62839;
	}

	.section {
		padding: 4rem 2rem;
	}

	.section-title {
		text-align: center;
		margin-bottom: 3rem;
	}

	.section-title h2 {
		font-size: 2rem;
		color: #133b5c;
		position: relative;
		display: inline-block;
	}

	.section-title h2::after {
		content: '';
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 3px;
		background-color: #e63946;
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.benefit-card {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}

	.benefit-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
	}

	.benefit-icon {
		font-size: 2.5rem;
		color: #1e5f74;
		margin-bottom: 1rem;
	}

	.benefit-card h3 {
		margin-top: 0;
		color: #133b5c;
	}

	.testimonials {
		background-color: #f0f7fa;
	}

	.testimonial-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.testimonial-card {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.testimonial-header {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.testimonial-image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 1rem;
	}

	.testimonial-info h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.testimonial-info p {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}

	.testimonial-quote {
		font-style: italic;
		color: #555;
		line-height: 1.6;
	}

	.values-section {
		background-color: #133b5c;
		color: white;
	}

	.values-section .section-title h2 {
		color: white;
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.value-card {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1.5rem;
		text-align: center;
		transition: transform 0.3s;
	}

	.value-card:hover {
		transform: translateY(-5px);
	}

	.value-card h3 {
		margin-top: 0;
		color: #a8dadc;
	}

	.faq-section {
		max-width: 800px;
		margin: 0 auto;
	}

	.faq-item {
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
		padding-bottom: 1.5rem;
	}

	.faq-question {
		font-weight: 600;
		color: #133b5c;
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
	}

	.faq-answer {
		color: #555;
		line-height: 1.6;
	}

	.signup-section {
		background: linear-gradient(135deg, #133b5c 0%, #1e5f74 100%);
		color: white;
		text-align: center;
	}

	.signup-form {
		max-width: 500px;
		margin: 0 auto;
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		color: #333;
		font-weight: 500;
	}

	.form-control {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.form-select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		appearance: none;
		background: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
			no-repeat;
		background-position: right 10px center;
		background-size: 20px;
	}

	.success-message {
		background-color: #d4edda;
		color: #155724;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	footer {
		background-color: #133b5c;
		color: white;
		padding: 2rem;
		text-align: center;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-links {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.footer-links a {
		color: white;
		margin: 0 1rem;
		text-decoration: none;
	}

	.footer-links a:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.hero h1 {
			font-size: 2rem;
		}

		.hero p {
			font-size: 1rem;
		}

		.benefit-card,
		.testimonial-card,
		.value-card {
			padding: 1.5rem;
		}

		.section {
			padding: 3rem 1rem;
		}
	}
</style>
