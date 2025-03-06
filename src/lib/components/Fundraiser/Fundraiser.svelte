<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import API from '$lib/api/api';
	import { page } from '$app/stores';
	import { modals } from 'svelte-modals';
	import ThankYouModal from './ThankYouModal.svelte';
	import stripe_key from '$lib/api/stripe_key';

	let stripe;
	let donationAmount = 100;
	let fundsRaised = 1000;
	const goalAmount = 12000;
	let donation_category = 'Donation';
	let loadingRaisedMount = false;

	// pk_live_51QxIVvGWlqH4iAnzh0UBtEKsROAsYvueTsOEyvK23yxCaMkBC9MRxeFDctqNIDa9ZOGa5p4ACukxdNig3IZrq1Bo00kcx3YgUo
	onMount(async () => {
		stripe = await loadStripe(stripe_key);
		moneyRaised();
	});

	async function moneyRaised() {
		loadingRaisedMount = true;
		const res = await API.get(`/fundraiser/money_raised`);

		fundsRaised = fundsRaised + res.net_money_raised;
		loadingRaisedMount = false;
	}

	async function donate() {
		if (donationAmount < 1) return;

		const response = await API.post('/create-checkout-session', {
			amount: donationAmount,
			success_url: $page.url + '?thank_you',
			cancel_url: $page.url,
			name: 'Donation'
		});

		stripe.redirectToCheckout({ sessionId: response.sessionId });
	}

	async function sponsor() {
		if (donationAmount < 1) return;

		const response = await API.post('/create-checkout-session', {
			amount: 3000,
			success_url: $page.url,
			cancel_url: $page.url,
			name: 'Sponsorship'
		});

		stripe.redirectToCheckout({ sessionId: response.sessionId });
	}

	function getProgress() {
		return Math.min((fundsRaised / goalAmount) * 100, 100);
	}

	page.subscribe((p) => {
		console.log(p);

		if (p.url.searchParams.get('session_id')) {
			modals.open(ThankYouModal, { sessionId: p.url.searchParams.get('session_id') });
		}
	});
</script>

<div class="wrapper container py-5 text-center">
	<h2 class="mb-3">Earn Sadaqah Jariyah</h2>
	<p class="lead"><i>for Empowering future generations through career mentorship</i></p>
	<p class="lead goal">
		Help us reach our goal of <strong><u>${goalAmount.toLocaleString()}</u></strong> by Eid-ul-Fitr!
	</p>

	{#if loadingRaisedMount}
		<div class="spinner-border text-primary" role="status"></div>
	{:else}
		<p class="lead">${fundsRaised.toLocaleString()} raised so far</p>
	{/if}

	<!-- Progress Bar -->
	<div class="progress mb-3" style="height: 20px;">
		<div
			class="progress-bar bg-success"
			role="progressbar"
			style="width: {getProgress()}%;"
			aria-valuenow={getProgress()}
			aria-valuemin="0"
			aria-valuemax="100"
		>
			{getProgress().toFixed(0)}%
		</div>
	</div>

	<!-- Donation Form -->
	<div class="row justify-content-center">
		<div class="col-sm-12 col-md-12 col-lg-10 col-xl-8 d-flex gap-2">
			<div class="input-group">
				<span class="input-group-text">$</span>
				<input type="number" class="form-control" bind:value={donationAmount} min="1" />
			</div>
			<button class="btn btn-success" on:click={donate}> Donate </button>
		</div>
	</div>

	<!-- <br />
	<hr />

	<p class="text-muted">Become a Sponsor & Get Featured on Taqaddum</p>

	<div class="row justify-content-center">
		<div class="col-sm-12 col-md-12 col-lg-10 col-xl-8 d-flex gap-2">
			<div class="input-group">
				<span class="input-group-text">$</span>
				<input type="number" class="form-control" disabled value="3000" />
			</div>
			<button class="btn btn-outline-primary" on:click={sponsor}> Sponsor </button>
		</div>
	</div> -->
</div>

<style>
	.wrapper {
		background-color: #f4f1f1;
		padding: 24px;
		margin: 0;
		border-radius: 10px;
	}

	.progress-bar {
		transition: width 0.5s ease-in-out;
	}

	.goal {
		color: #555b1b;
		font-weight: bold;
	}
</style>
