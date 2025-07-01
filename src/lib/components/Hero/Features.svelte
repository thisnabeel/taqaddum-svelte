<section class="features">
	<h2>About Taqaddum</h2>
	<p>
		Taqaddum is a mentorship platform that connects Muslim professionals with students and recent
		graduates. <br />It provides career guidance, shadowing opportunities, and professional
		development with an Islamic perspective.
	</p>

	{#if false}
		<h2>Key Features</h2>
		<ul>
			<li>
				<!-- <img src="/booking.gif" alt="Vetted Mentors & Mentees" /> -->
				<div>
					<strong>Vetted Mentors & Mentees:</strong> Our professional faculty carefully vets both mentors
					and mentees to ensure a high level of commitment and expertise. This process ensures that no
					one’s time is wasted, and every interaction is meaningful and productive.
				</div>
			</li>
			<li>
				<!-- <img src="default-avatar.png" alt="Intelligent Session Suggestions" /> -->
				<div>
					<strong>Intelligent Session Suggestions:</strong> Receive personalized mentorship topics based
					on mentor expertise and your career goals.
				</div>
			</li>
			<li>
				<!-- <img src="default-avatar.png" alt="Real Human Connections" /> -->
				<div>
					<strong>Real Human Connections:</strong> Build authentic relationships with mentors who offer
					personalized advice and encouragement.
				</div>
			</li>
			<li>
				<!-- <img src="default-avatar.png" alt="Group Video Meetings with Safety Measures" /> -->
				<div>
					<strong>Group Video Meetings with Safety Measures:</strong> Participate in scheduled mentorship
					sessions with security features to ensure a respectful and safe environment.
				</div>
			</li>
			<li>
				<!-- <img src="default-avatar.png" alt="Islamic Professional Development" /> -->
				<div>
					<strong>Islamic Professional Development:</strong> Learn how values like Ikhlas (Sincerity)
					and Shukr (Gratitude) contribute to workplace success.
				</div>
			</li>
			<li>
				<!-- <img src="default-avatar.png" alt="Intelligent Career Roadmaps & Tasks" /> -->
				<div>
					<strong>Intelligent Career Roadmaps & Tasks:</strong> Get structured, step-by-step career guidance
					with actionable tasks to help you progress toward your goals.
				</div>
			</li>
			<li>
				<!-- <img src="default-avatar.png" alt="Intelligent Resume Building" /> -->
				<div>
					<strong>Intelligent Resume Building:</strong> Create compelling resumes that highlight your
					strengths and align with industry expectations.
				</div>
			</li>
			<li>
				<!-- <img src="default-avatar.png" alt="Mentorship Tools for Focused Advising" /> -->
				<div>
					<strong>Mentorship Tools for Focused Advising:</strong> Equip mentors with structured tools
					to ensure their guidance is impactful and efficient.
				</div>
			</li>
			<!-- <li>
			<img src="default-avatar.png" alt="Measurable, Actionable Tasks" />
			<div>
				<strong>Measurable, Actionable Tasks:</strong> Mentors and mentees set clear, trackable goals
				to drive progress and accountability.
			</div>
		</li> -->
		</ul>
	{/if}
</section>

<style>
	.features {
		padding: 40px;
		text-align: center;
	}

	.features h2 {
		margin-top: 20px;
		color: #333;
		font-size: 28px;
	}

	.features p {
		font-size: 18px;
		color: #555;
		margin-bottom: 30px;
	}

	.features ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.features li {
		display: flex;
		align-items: center;
		gap: 15px;
		width: 90%;
		max-width: 700px;
		padding: 15px;
		border-radius: 10px;
		background: #f9f9f9;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.features img {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		object-fit: cover;
	}

	.features div {
		text-align: left;
		font-size: 16px;
		color: #444;
	}

	.features strong {
		display: block;
		font-size: 18px;
		color: #222;
		margin-bottom: 5px;
	}

	@media (max-width: 600px) {
		.features li {
			flex-direction: column;
			text-align: center;
			padding: 20px;
		}

		.features img {
			width: 200px;
			height: 200px;
		}

		.features div {
			text-align: center;
		}
	}
</style>
