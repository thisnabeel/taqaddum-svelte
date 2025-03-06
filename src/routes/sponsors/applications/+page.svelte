<script>
	import API from '$lib/api/api';
	import AdminWall from '$lib/components/Admin/AdminWall.svelte';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	// State for sponsorship interests
	let sponsorshipInterests = [];
	let isLoading = true;
	let error = null;

	// Pagination state
	let currentPage = 1;
	let itemsPerPage = 10;
	let totalPages = 0;

	// Sorting state
	let sortField = 'created_at';
	let sortDirection = 'desc';

	// Filtering state
	let statusFilter = 'all';
	let searchQuery = '';

	// Function to fetch sponsorship interests
	async function fetchSponsorshipInterests() {
		isLoading = true;
		error = null;

		try {
			// In a real implementation, you would use your actual API endpoint
			// Example: const response = await fetch(`/api/sponsorship_interests?page=${currentPage}&per_page=${itemsPerPage}&sort=${sortField}&direction=${sortDirection}&status=${statusFilter}&search=${searchQuery}`);

			// This is mock data for demonstration purposes
			sponsorshipInterests = await API.get('/sponsorship_interests');

			totalPages = 1;
			currentPage = 1;
		} catch (err) {
			console.error('Error fetching sponsorship interests:', err);
			error = 'Failed to load sponsorship interests. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	// Function to update interest status
	async function updateStatus(id, newStatus) {
		try {
			// In a real implementation, you would call your API
			// Example: await fetch(`/api/sponsorship_interests/${id}`, {
			//   method: 'PATCH',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({ status: newStatus })
			// });

			// For demo, just update the local state
			sponsorshipInterests = sponsorshipInterests.map((interest) =>
				interest.id === id ? { ...interest, status: newStatus } : interest
			);

			Swal.fire({
				icon: 'success',
				title: 'Status Updated',
				text: `Sponsorship interest status has been updated to ${newStatus}.`,
				confirmButtonColor: '#0d6efd',
				timer: 2000,
				timerProgressBar: true
			});
		} catch (err) {
			console.error('Error updating status:', err);
			Swal.fire({
				icon: 'error',
				title: 'Update Failed',
				text: 'Unable to update the status. Please try again.',
				confirmButtonColor: '#0d6efd'
			});
		}
	}

	// Function to view details
	function viewDetails(interest) {
		Swal.fire({
			title: `${interest.org_name}`,
			html: `
        <div class="text-start">
          <p><strong>Contact:</strong> ${interest.contact_name}</p>
          <p><strong>Email:</strong> ${interest.contact_email}</p>
          <p><strong>Phone:</strong> ${interest.contact_phone}</p>
          <p><strong>Website:</strong> <a href="${interest.org_website}" target="_blank">${interest.org_website}</a></p>
          <p><strong>Details:</strong></p>
          <div class="p-3 bg-light rounded text-start">${interest.org_details}</div>
          <p class="mt-3"><strong>Status:</strong> <span class="badge bg-${getStatusBadgeColor(interest.status)}">${interest.status}</span></p>
          <p><strong>Submitted:</strong> ${formatDate(interest.created_at)}</p>
        </div>
      `,
			width: '600px',
			confirmButtonColor: '#0d6efd'
		});
	}

	// Function to export to CSV
	function exportToCSV() {
		// Create CSV headers
		const headers = [
			'ID',
			'Contact Name',
			'Contact Email',
			'Contact Phone',
			'Organization Name',
			'Organization Website',
			'Organization Details',
			'Status',
			'Created At'
		];

		// Convert data to CSV format
		const csvData = sponsorshipInterests.map((interest) => [
			interest.id,
			interest.contact_name,
			interest.contact_email,
			interest.contact_phone,
			interest.org_name,
			interest.org_website,
			`"${interest.org_details.replace(/"/g, '""')}"`, // Escape quotes in text
			interest.status,
			formatDate(interest.created_at)
		]);

		// Combine headers and data
		const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

		// Create download link
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute(
			'download',
			`sponsorship-interests-${new Date().toISOString().split('T')[0]}.csv`
		);
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// Utility function to get status badge color
	function getStatusBadgeColor(status) {
		switch (status) {
			case 'approved':
				return 'success';
			case 'rejected':
				return 'danger';
			case 'pending':
				return 'warning';
			default:
				return 'secondary';
		}
	}

	// Utility function to format date
	function formatDate(dateString) {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	// Handle page change
	function changePage(newPage) {
		if (newPage >= 1 && newPage <= totalPages) {
			currentPage = newPage;
			fetchSponsorshipInterests();
		}
	}

	// Handle filter change
	function applyFilters() {
		currentPage = 1; // Reset to first page when filters change
		fetchSponsorshipInterests();
	}

	// Handle sort change
	function changeSort(field) {
		if (sortField === field) {
			// Toggle direction if same field
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// Default to descending for new field
			sortField = field;
			sortDirection = 'desc';
		}
		fetchSponsorshipInterests();
	}

	// Load data on component mount
	onMount(() => {
		fetchSponsorshipInterests();
	});
</script>

<AdminWall>
	<div class="admin-sponsorship-container container-fluid py-4">
		<div class="card border-0 shadow-sm">
			<div class="card-header bg-white py-3">
				<div class="d-flex justify-content-between align-items-center flex-wrap">
					<h2 class="mb-0 h4">
						<i class="fa fa-handshake text-primary me-2"></i>
						Sponsorship Interests
					</h2>
					<div class="d-flex gap-2">
						<button class="btn btn-outline-primary" on:click={fetchSponsorshipInterests}>
							<i class="fa fa-sync-alt me-1"></i> Refresh
						</button>
						<button class="btn btn-success" on:click={exportToCSV}>
							<i class="fa fa-file-csv me-1"></i> Export CSV
						</button>
					</div>
				</div>
			</div>

			<div class="card-body">
				<!-- Filters -->
				<div class="row mb-3 g-2">
					<div class="col-md-4">
						<div class="input-group">
							<span class="input-group-text">
								<i class="fa fa-search"></i>
							</span>
							<input
								type="text"
								class="form-control"
								placeholder="Search by name, email, or organization..."
								bind:value={searchQuery}
								on:input={() => {
									if (searchQuery.length === 0 || searchQuery.length > 2) {
										applyFilters();
									}
								}}
							/>
						</div>
					</div>
					<div class="col-md-3">
						<select class="form-select" bind:value={statusFilter} on:change={applyFilters}>
							<option value="all">All Statuses</option>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>
					<div class="col-md-2">
						<select class="form-select" bind:value={itemsPerPage} on:change={applyFilters}>
							<option value="10">10 per page</option>
							<option value="25">25 per page</option>
							<option value="50">50 per page</option>
							<option value="100">100 per page</option>
						</select>
					</div>
				</div>

				<!-- Table -->
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-light">
							<tr>
								<th on:click={() => changeSort('org_name')} class="sortable">
									Organization
									{#if sortField === 'org_name'}
										<i class="fa fa-sort-{sortDirection === 'asc' ? 'up' : 'down'} ms-1"></i>
									{/if}
								</th>
								<th on:click={() => changeSort('contact_name')} class="sortable">
									Contact
									{#if sortField === 'contact_name'}
										<i class="fa fa-sort-{sortDirection === 'asc' ? 'up' : 'down'} ms-1"></i>
									{/if}
								</th>
								<th>Email</th>
								<th on:click={() => changeSort('created_at')} class="sortable">
									Date
									{#if sortField === 'created_at'}
										<i class="fa fa-sort-{sortDirection === 'asc' ? 'up' : 'down'} ms-1"></i>
									{/if}
								</th>
								<th on:click={() => changeSort('status')} class="sortable">
									Status
									{#if sortField === 'status'}
										<i class="fa fa-sort-{sortDirection === 'asc' ? 'up' : 'down'} ms-1"></i>
									{/if}
								</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#if isLoading}
								<tr>
									<td colspan="6" class="text-center py-4">
										<div class="spinner-border text-primary" role="status">
											<span class="visually-hidden">Loading...</span>
										</div>
									</td>
								</tr>
							{:else if error}
								<tr>
									<td colspan="6" class="text-center py-4 text-danger">
										<i class="fa fa-exclamation-circle me-2"></i>
										{error}
									</td>
								</tr>
							{:else if sponsorshipInterests.length === 0}
								<tr>
									<td colspan="6" class="text-center py-4">
										<i class="fa fa-info-circle me-2"></i>
										No sponsorship interests found.
									</td>
								</tr>
							{:else}
								{#each sponsorshipInterests as interest (interest.id)}
									<tr>
										<td>{interest.org_name}</td>
										<td>{interest.contact_name}</td>
										<td>
											<a href="mailto:{interest.contact_email}" class="text-decoration-none">
												{interest.contact_email}
											</a>
										</td>
										<td>{formatDate(interest.created_at)}</td>
										<td>
											<span class="badge bg-{getStatusBadgeColor(interest.status)} text-uppercase">
												{interest.status}
											</span>
										</td>
										<td>
											<div class="btn-group">
												<button
													class="btn btn-sm btn-outline-primary"
													on:click={() => viewDetails(interest)}
												>
													<i class="fa fa-eye"></i>
												</button>
												<button
													class="btn btn-sm btn-outline-success"
													on:click={() => updateStatus(interest.id, 'approved')}
													disabled={interest.status === 'approved'}
												>
													<i class="fa fa-check"></i>
												</button>
												<button
													class="btn btn-sm btn-outline-danger"
													on:click={() => updateStatus(interest.id, 'rejected')}
													disabled={interest.status === 'rejected'}
												>
													<i class="fa fa-times"></i>
												</button>
											</div>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				{#if !isLoading && !error && totalPages > 0}
					<nav aria-label="Sponsorship interests pagination">
						<ul class="pagination justify-content-center">
							<li class="page-item {currentPage === 1 ? 'disabled' : ''}">
								<button class="page-link" on:click={() => changePage(1)}>
									<i class="fa fa-angle-double-left"></i>
								</button>
							</li>
							<li class="page-item {currentPage === 1 ? 'disabled' : ''}">
								<button class="page-link" on:click={() => changePage(currentPage - 1)}>
									<i class="fa fa-angle-left"></i>
								</button>
							</li>

							{#each Array(totalPages) as _, i}
								<li class="page-item {currentPage === i + 1 ? 'active' : ''}">
									<button class="page-link" on:click={() => changePage(i + 1)}>
										{i + 1}
									</button>
								</li>
							{/each}

							<li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
								<button class="page-link" on:click={() => changePage(currentPage + 1)}>
									<i class="fa fa-angle-right"></i>
								</button>
							</li>
							<li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
								<button class="page-link" on:click={() => changePage(totalPages)}>
									<i class="fa fa-angle-double-right"></i>
								</button>
							</li>
						</ul>
					</nav>
				{/if}
			</div>
		</div>
	</div>
</AdminWall>

<style>
	.sortable {
		cursor: pointer;
	}

	.sortable:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
</style>
