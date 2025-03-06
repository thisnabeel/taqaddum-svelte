<script>
	// @ts-nocheck

	import { modals } from 'svelte-modals';
	import OutClick from 'svelte-outclick';
	import { onMount } from 'svelte';
	import { onBeforeClose } from 'svelte-modals';
	import Swal from 'sweetalert2';
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';

	export let sessionId;
	export let isOpen;
	let details = {};

	// provided by <Modals />
	let closable = true;
	const handleOutsideClick = () => {
		if (closable) {
			modals.close();
		}
	};

	$: getDetails(sessionId);
	async function getDetails(session_id) {
		try {
			details = await API.get('/success/' + session_id);
			console.log({ details });
		} catch (error) {
			console.error('Error fetching details:', error);
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if isOpen}
	<div role="dialog" class="modal" class:isOpen on:click|stopPropagation>
		<div class="barrier" on:click|stopPropagation>
			<OutClick on:outclick={handleOutsideClick}>
				<div class="contents">
					<div class="modal-header">
						<h2>Jazak Allahu Khayr for Your Support!</h2>
					</div>
					<div class="modal-body">
						{#if details && details.amount_received}
							<p class="receipt">
								<strong>Amount Paid:</strong>
								{details && details.amount_received
									? `$${details.amount_received} ${details.currency.toUpperCase()}`
									: 'Loading...'}
							</p>
						{/if}
						<section class="message">
							<p>
								Your generosity shapes a brighter future for Muslim professionals and students.
								Through <b>Taqaddum</b>, we create mentorship opportunities that provide career
								guidance, real-world experiences, and Islamic values.
							</p>
							<p>
								Every dollar fuels our mission—connecting mentors and mentees in a safe, structured,
								and impactful way. Your support enables vetted mentors, career roadmaps, and
								mentorship tools for valuable interactions.
							</p>
							<p>
								With your help, we foster <b>real connections</b>, integrate
								<b>Islamic principles in professional growth</b>, and ensure
								<b>structured career development</b> for students and graduates.
							</p>
							<p>
								May Allah reward you abundantly—your support is more than financial; it’s an
								<b>investment in the next generation of Muslim leaders</b>.
							</p>
						</section>
					</div>
					<div class="modal-footer">
						<button class="close-button btn btn-outline-info" on:click={() => modals.close()}
							>Close</button
						>
					</div>
				</div>
			</OutClick>
		</div>
	</div>
{/if}

<style>
	.receipt {
		font-size: 44px;
	}
	.contents {
		padding: 1em;
		border-radius: 8px;
	}
	label {
		font-weight: bold;
		margin-top: 10px;
	}
	[role='dialog'] {
		background: rgba(0, 0, 0, 0.5);
	}

	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		/* allow click-through to backdrop */
		/* pointer-events: none; */
	}

	.contents {
		min-width: 240px;
		/* padding: 16px; */
		max-width: 750px;
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	@media (max-width: 768px) {
		.message {
			max-height: 35vh;
			overflow-y: scroll;
		}
	}
</style>
