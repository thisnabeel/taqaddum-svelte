<script>
	import Fundraiser from '../Fundraiser/Fundraiser.svelte';
	import ScrollingList from '../Skills/ScrollingList.svelte';
	import Search from '../Skills/Search.svelte';
	import Steps from '../Steps/Steps.svelte';
	import { activeRole } from '$lib/stores/stories';

	export let subtext =
		"Get the kind of personalized advice you'd never find reading blog posts or watching courses.";

	let showSecondEmail = false;
</script>

<div class="enrollment-banner">
	<span
		><b>tldr;</b>
		{#if $activeRole === 'mentee'}
			Answers from <u>Muslim</u> mentors for your career growth.
		{:else}
			Answer <u>Muslim</u> mentees in their career growth.
		{/if}
	</span>
</div>

<section class="hero">
	<div class="fundraiser" id="fundraiser">
		<div class="left">
			<div class="tabs">
				<button class:active={$activeRole === 'mentee'} on:click={() => ($activeRole = 'mentee')}>
					Mentee
				</button>
				<button class:active={$activeRole === 'mentor'} on:click={() => ($activeRole = 'mentor')}>
					Mentor
				</button>
			</div>
			<div class="email-stack" on:click={() => (showSecondEmail = !showSecondEmail)}>
				<img
					class="email-img"
					class:hidden={showSecondEmail}
					src={$activeRole === 'mentee' ? '/mentee-email-1.jpg' : '/mentor-email-1.jpg'}
					alt="Email example 1"
				/>
				<img
					class="email-img second"
					class:hidden={!showSecondEmail}
					src={$activeRole === 'mentee' ? '/mentee-email-2.jpg' : '/mentor-email-2.jpg'}
					alt="Email example 2"
				/>
				<img class="email-img click-up" class:hidden={showSecondEmail} src="/cta-click-up.png" />
			</div>
			<h3 class="heading">Islamic Values, <span>Professional Success.</span></h3>
			<p>{subtext}</p>
		</div>

		<div class="right steps-section">
			<Steps />
		</div>
	</div>

	<!-- <ScrollingList></ScrollingList> -->
</section>

<style>
	.enrollment-banner {
		width: 100%;
		margin-bottom: 1rem;
		text-align: center;
	}

	.enrollment-banner span {
		display: inline-block;
		background-color: #d9f99d;
		color: #374151;
		padding: 0.25rem 1.5rem;
		border-radius: 9999px;
		font-size: 0.875rem;
	}

	.email-img.click-up {
		box-shadow: none;
		transition: all 0.5s ease;
		width: 50%;
		position: relative;
		bottom: -10px;
		right: 0;
		animation: float 2s ease-in-out infinite;
	}

	@keyframes float {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-8px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	.fundraiser {
		display: flex;
		align-items: center;
	}

	.fundraiser .left {
		flex: 1 1 50%;
	}

	.fundraiser .right {
		flex: 1 1 50%;
	}

	.tabs {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
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

	.email-stack {
		width: 23em;
		display: inline-block;
		margin-bottom: 20px;
		position: relative;
		cursor: pointer;
	}

	.email-img {
		width: 100%;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		opacity: 1;
	}

	.email-img.hidden {
		display: none;
	}

	.email-img.second {
		position: static;
	}

	.email-img:hover {
		transform: translateY(-5px);
	}

	.hero {
		text-align: center;
		padding: 50px 20px;
		padding-top: 0px;
	}

	.search-bar {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-top: 20px;
	}

	.search-bar :global(input) {
		height: 100%;
	}

	.search-bar input,
	.search-bar select,
	.search-bar button {
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.search-bar button {
		background: black;
		color: white;
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.fundraiser {
			display: block;
			align-items: center;
		}
		.heading span {
			display: block;
		}

		.steps-section {
			margin: 0 !important;
		}

		.tabs {
			margin-top: 2rem;
		}
	}
	.steps-section {
		margin: 4rem 0;
	}
</style>
