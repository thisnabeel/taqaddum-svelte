<script>
	import API from '$lib/api/api';
	import Swal from 'sweetalert2';

	// Configurable sponsorship amount
	export let annualSponsorshipCost = 3000;

	// Form data
	let formData = {
		contact_name: '',
		contact_email: '',
		contact_phone: '',
		org_name: '',
		org_website: '',
		org_details: ''
	};

	// Function to handle form submission
	async function submitSponsorshipInterest() {
		try {
			// This would be your API call
			// Example: await fetch('/api/sponsorship-interest', {
			//   method: 'POST',
			//   body: JSON.stringify(formData)
			// });

			// Simulate API call with timeout
			await API.post('/sponsorship_interests', formData);

			// Show success notification
			Swal.fire({
				icon: 'success',
				title: 'Thank You!',
				text: 'Your sponsorship interest has been received. We will review your information and get back to you shortly.',
				confirmButtonColor: '#0d6efd'
			});

			// Reset form
			formData = {
				contact_name: '',
				contact_email: '',
				contact_phone: '',
				org_name: '',
				org_website: '',
				org_details: ''
			};
		} catch (error) {
			// Handle error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong! Please try again later.',
				confirmButtonColor: '#0d6efd'
			});
		}
	}

	// Sample benefits array
	const sponsorshipBenefits = [
		"Organization logo prominently displayed on Taqaddum's homepage",
		'Brand visibility in all marketing materials and communications',
		'Recognition in monthly newsletters sent to all mentors and mentees',
		'Acknowledgment during virtual events and workshops',
		'Opportunity to share relevant job postings with our talented pool of mentees',
		'Annual impact report detailing how your sponsorship has supported Muslim professionals'
	];

	// Sample values that organizations must align with
	const coreValues = [
		'Commitment to ethical business practices',
		'Support for diversity and inclusion in the workplace',
		'Recognition of religious accommodations for employees',
		'Dedication to professional development and growth',
		'Support for work-life balance and employee wellbeing'
	];
</script>

<section class="sponsorship-container container py-5">
	<div class="intro-section text-center mb-5">
		<h1 class="display-4">Partner With Taqaddum</h1>
		<h2 class="text-primary mb-4">Support the Next Generation of Muslim Professionals</h2>

		<p class="intro-text lead mx-auto mb-5">
			By sponsoring Taqaddum, your organization plays a crucial role in empowering Muslim students
			and recent graduates to excel in their professional journeys while maintaining their Islamic
			identity and values.
		</p>

		<div
			class="sponsorship-highlight bg-light rounded p-4 shadow-sm mx-auto"
			style="max-width: 500px;"
		>
			<div class="cost-badge mb-3">
				<span class="text-success h3">$</span>
				<span class="text-success display-3 fw-bold">{annualSponsorshipCost.toLocaleString()}</span>
				<span class="text-muted h4">/year</span>
			</div>
			<p class="fs-5 mb-0">Invest in the future of ethical professional development</p>
		</div>
	</div>

	<div class="details-section row g-4">
		<div class="values-alignment col-md-6">
			<div class="card h-100 border-0 shadow-sm">
				<div class="card-body">
					<h3 class="card-title mb-3">
						<i class="fa fa-handshake text-primary me-2"></i>
						Our Values-Based Partnership Approach
					</h3>
					<p class="card-text">
						At Taqaddum, we carefully vet potential sponsor organizations to ensure alignment with
						our mission and Islamic values. Before accepting any sponsorship, we conduct a thorough
						review process to verify that our partnership will be mutually beneficial and supportive
						of our mentees' career aspirations.
					</p>

					<h4 class="card-subtitle mb-3">
						<i class="fa fa-check-circle text-success me-2"></i>
						We partner with organizations that demonstrate:
					</h4>
					<ul class="values-list">
						{#each coreValues as value}
							<li><i class="fa fa-star text-warning me-2"></i>{value}</li>
						{/each}
					</ul>

					<p class="vetting-note card-text text-muted fst-italic">
						<i class="fa fa-info-circle me-2"></i>
						Our vetting process includes reviewing your organization's public statements, policies, and
						practices to ensure they align with our commitment to nurturing talent in an ethical and
						supportive environment.
					</p>
				</div>
			</div>
		</div>

		<div class="benefits col-md-6">
			<div class="card h-100 border-0 shadow-sm">
				<div class="card-body">
					<h3 class="card-title mb-3">
						<i class="fa fa-gift text-primary me-2"></i>
						Sponsorship Benefits
					</h3>
					<p class="card-text">
						As a Taqaddum sponsor, your organization will receive exclusive benefits while making a
						significant impact on the professional development of Muslim talent.
					</p>

					<ul class="benefits-list">
						{#each sponsorshipBenefits as benefit}
							<li><i class="fa fa-check text-success me-2"></i>{benefit}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<div class="cta-section col-12 mt-4">
			<div class="card border-0 shadow-sm bg-primary text-white">
				<div class="card-body py-4">
					<h3 class="card-title text-center">
						<i class="fa fa-rocket me-2"></i>
						Become a Sponsor Today
					</h3>
					<p class="card-text text-center px-md-5 mx-md-5 mb-4">
						Join us in building bridges between experienced Muslim professionals and the next
						generation of talent. Your support enables us to continue providing valuable mentorship,
						career guidance, and professional development services with an Islamic perspective.
					</p>

					<form on:submit|preventDefault={submitSponsorshipInterest} class="row g-3 px-3 px-md-5">
						<div class="col-md-6">
							<label for="contact_name" class="form-label">Contact Name *</label>
							<input
								type="text"
								class="form-control"
								id="contact_name"
								bind:value={formData.contact_name}
								required
							/>
						</div>
						<div class="col-md-6">
							<label for="contact_email" class="form-label">Contact Email *</label>
							<input
								type="email"
								class="form-control"
								id="contact_email"
								bind:value={formData.contact_email}
								required
							/>
						</div>
						<div class="col-md-6">
							<label for="contact_phone" class="form-label">Contact Phone *</label>
							<input
								type="tel"
								class="form-control"
								id="contact_phone"
								bind:value={formData.contact_phone}
								required
							/>
						</div>
						<div class="col-md-6">
							<label for="org_name" class="form-label">Organization Name *</label>
							<input
								type="text"
								class="form-control"
								id="org_name"
								bind:value={formData.org_name}
								required
							/>
						</div>
						<div class="col-md-6">
							<label for="org_website" class="form-label">Organization Website *</label>
							<input
								type="text"
								class="form-control"
								id="org_website"
								bind:value={formData.org_website}
								required
							/>
						</div>
						<div class="col-12">
							<label for="org_details" class="form-label">Organization Details *</label>
							<textarea
								class="form-control"
								id="org_details"
								rows="4"
								placeholder="Please share a brief description of your organization and why you'd like to sponsor Taqaddum..."
								bind:value={formData.org_details}
								required
							></textarea>
						</div>
						<div class="col-12 text-center mt-4">
							<button type="submit" class="btn btn-light btn-lg">
								<i class="fa fa-paper-plane me-2"></i>
								Submit Sponsorship Interest
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
