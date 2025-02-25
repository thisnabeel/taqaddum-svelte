<script>
	import ScrollingList from '../Skills/ScrollingList.svelte';
	import Search from '../Skills/Search.svelte';

	export let subtext =
		"Get the kind of personalized advice you'd never find reading blog posts or watching courses.";
</script>

<section class="hero">
	<div class="text-center" style="width: 23em; display:inline-block;margin-bottom:20px">
		<img style="width:100%" src="/cta2.png" alt="" />
	</div>

	<h1 class="heading">Islamic Values, <span>Professional Success.</span></h1>
	<p>{subtext}</p>

	<div class="search-bar">
		<!-- <Search placeholder={'Search by Expertise...'}></Search> -->
		<!-- <select>
			<option>Expertise</option>
		</select>
		<select>
			<option>Country</option>
		</select> -->
		<button>Get Started Today</button>
	</div>

	<ScrollingList></ScrollingList>
</section>

<style>
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
		.heading span {
			display: block;
		}
	}
</style>
