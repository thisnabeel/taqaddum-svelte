<script>
	import Fundraiser from '../Fundraiser/Fundraiser.svelte';
	import ScrollingList from '../Skills/ScrollingList.svelte';
	import Search from '../Skills/Search.svelte';
	import Steps from '../Steps/Steps.svelte';

	export let subtext =
		"Get the kind of personalized advice you'd never find reading blog posts or watching courses.";
</script>

<section class="hero">
	<div class="fundraiser" id="fundraiser">
		<div class="left">
			<div class="text-center" style="width: 23em; display:inline-block;margin-bottom:20px">
				<img style="width:100%" src="/cta2.png" alt="" />
			</div>
			<h3 class="heading">Islamic Values, <span>Professional Success.</span></h3>
			<p>{subtext}</p>
		</div>

		<div class="right steps-section">
			<Steps />
		</div>
	</div>
	<!-- <div>
		<div class="text-center" style="width: 23em; display:inline-block;margin-bottom:20px">
			<img style="width:100%" src="/booking.gif" alt="" />
		</div>
		<h3 class="heading">Islamic Values, <span>Professional Success.</span></h3>
		<p>{subtext}</p>
	</div> -->

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
