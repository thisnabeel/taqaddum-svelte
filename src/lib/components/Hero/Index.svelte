<script>
	import Fundraiser from '../Fundraiser/Fundraiser.svelte';
	import ScrollingList from '../Skills/ScrollingList.svelte';
	import Search from '../Skills/Search.svelte';
	import Steps from '../Steps/Steps.svelte';

	export let subtext =
		"Get the kind of personalized advice you'd never find reading blog posts or watching courses.";

	let showSecondEmail = false;
</script>

<section class="hero">
	<div class="fundraiser" id="fundraiser">
		<div class="left">
			<div class="email-stack" on:click={() => (showSecondEmail = !showSecondEmail)}>
				<img
					class="email-img"
					class:hidden={showSecondEmail}
					src="/email-1.jpg"
					alt="Email example 1"
				/>
				<img
					class="email-img second"
					class:hidden={!showSecondEmail}
					src="/email-2.jpg"
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

	<ScrollingList></ScrollingList>
</section>

<style>
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

	.email-img.click-up {
		box-shadow: none;
		transition: all 0.5s ease;
		width: 50%;
	}

	.email-img.hidden {
		display: none;
	}

	.email-img.second {
		position: static;
	}

	.email-img.hidden {
		opacity: 0;
		visibility: hidden;
	}

	.email-img.visible {
		opacity: 1;
		visibility: visible;
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
	}
	.steps-section {
		margin: 4rem 0;
	}
</style>
