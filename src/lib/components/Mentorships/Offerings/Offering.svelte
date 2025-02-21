<script>
	import { goto } from '$app/navigation';
	import API from '$lib/api/api';
	import { user } from '$lib/stores/user';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	export let offering;
	export let mentorships;
	export let index;
	export let removeOffering;
	export let readOnly = true;
	export let slotDetails;
	export let slotsAdmin;
	export let status;
	export let editing = false;

	async function startChatRoom(slotDetails) {
		if (!$user) {
			Swal.fire('You must Sign In to book a meeting');
			return;
		}
		const code = await generateChatRoomId(slotDetails);
		goto('/video/' + code + '/2');
	}
	async function generateChatRoomId(session) {
		// Extract relevant fields
		const keyData = JSON.stringify({
			title: session.title.trim().toLowerCase(),
			date: session.booking_date,
			startTime: session.start_time,
			mentorId: session.offering.mentorship.user.id,
			skillId: session.offering.mentorship.skill.id
		});

		// Encode data as Uint8Array
		const encoder = new TextEncoder();
		const data = encoder.encode(keyData);

		// Hash using SHA-256
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));

		// Convert to hex and return first 10 chars for uniqueness
		return hashArray
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('')
			.slice(0, 10);
	}

	// Example usage

	async function deleteMeetingOffering(id) {
		if (offering.uuid) {
			removeOffering(offering.uuid, 'code');
			return;
		}
		if (!confirm('Are you sure you want to delete this meeting offering?')) return;
		try {
			console.log({ offering });

			await API.delete(`/meeting_offerings/${id}`);
			removeOffering(id, 'id');
		} catch (error) {
			console.error('Error deleting meeting offering:', error);
		}
	}

	function formatMeetupTimeLuxon(meetup) {
		const start = DateTime.fromISO(meetup.start_time).setZone('America/Los_Angeles');
		const end = DateTime.fromISO(meetup.end_time).setZone('America/Los_Angeles');

		return `${start.toFormat('EEE, MMM d @ h:mm a')} - ${end.toFormat('h:mm a')}`;
	}

	async function saveChanges() {
		let response = null;
		try {
			if (offering.id < 1) {
				offering.id = null;
				response = await API.post(`/meeting_offerings`, {
					meeting_offering: offering
				});
			} else {
				response = await API.put(`/meeting_offerings/${offering.id}`, {
					meeting_offering: offering
				});
			}

			if (response) {
				offering = response;
				editing = false;
			}
		} catch (error) {
			console.error('Error saving changes:', error);
		}
	}

	function updateField(field, event) {
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const offset = range.startOffset;

		offering[field] = event.target.innerText;

		// Restore cursor position
		requestAnimationFrame(() => {
			if (!event.target || !event.target.firstChild) return;
			range.setStart(event.target.firstChild, Math.min(offset, event.target.firstChild.length));
			range.setEnd(event.target.firstChild, Math.min(offset, event.target.firstChild.length));
			selection.removeAllRanges();
			selection.addRange(range);
		});
	}

	async function saveSlot() {
		const res = await API.post('/slots/configure', {
			user_id: $user.id,
			slot_details: slotDetails,
			status: slotDetails.status
		});
		Swal.close();
	}

	function denySlot() {
		slotDetails.status = 'denied';
		Swal.fire({
			title: `Denying slot...`,
			text: 'Please stay on page...',
			showCloseButton: false,
			showConfirmButton: false
		});
		saveSlot();
	}

	function lockSlot() {
		slotDetails.status = 'locked';
		Swal.fire({
			title: `Locking slot...`,
			text: 'Please stay on page...',
			showCloseButton: false,
			showConfirmButton: false
		});
		saveSlot();
	}

	function clearSlot() {
		slotDetails.status = 'open';
		Swal.fire({
			title: `Opening slot...`,
			text: 'Please stay on page...',
			showCloseButton: false,
			showConfirmButton: false
		});
		saveSlot();
	}
</script>

<li class:editing class="main {slotDetails && slotDetails.status ? slotDetails.status : ''}">
	<div class="content">
		{#if editing}
			<div class="unsaved-banner">Unsaved</div>
			<select
				name=""
				id=""
				bind:value={offering.mentorship_id}
				on:change={() => console.log(offering)}
			>
				<option value={null}></option>
				{#each mentorships as mentorship}
					<option value={mentorship.id}>{mentorship.skill.title}</option>
				{/each}
			</select>
		{:else if !offering.mentorship}
			<h5>No Mentorship Selected</h5>
		{:else}
			<h5>{offering.mentorship.skill.title}</h5>
		{/if}

		<!-- Editable Title -->
		<br />
		<h4
			contenteditable={editing}
			on:input={(e) => updateField('title', e)}
			class:editable={editing}
		>
			{offering.title}
		</h4>

		<!-- Editable Description -->
		<p
			style="display:block;"
			contenteditable={editing}
			on:input={(e) => updateField('description', e)}
			class:editable={editing}
		>
			{offering.description}
		</p>

		{#if editing}
			<small class="durations" style="display:block;">
				Duration:
				{#each [30, 60, 90, 120] as duration}
					<span
						on:click={() => (offering.duration = duration)}
						class:yellow={duration === offering.duration}
					>
						{duration}
					</span>
				{/each}
				<span class="yellow"> minutes </span>
			</small>
		{:else if slotDetails}
			<small class="flex" style="align-items: baseline;">
				<div class="flex-70 flex-grow">
					<b class="">
						{formatMeetupTimeLuxon(slotDetails)}
					</b>
				</div>

				<div
					class="btn btn-outline-primary flex-30 flex-grow"
					on:click={() => startChatRoom(slotDetails)}
				>
					{#if slotsAdmin || ($user && $user.id === slotDetails.user_id)}
						Enter Meeting
					{:else}
						{#if !$user}
							<i class="fa fa-lock"></i>
						{/if}{'  '}Book Now
					{/if}
				</div>
			</small>
			{#if slotsAdmin}
				<div class="status">
					<div
						class="fa fa-circle-o"
						class:active={slotDetails.status === 'open'}
						on:click={() => clearSlot()}
					></div>
					<div
						class="fa fa-times-circle"
						class:active={slotDetails.status === 'denied'}
						on:click={() => denySlot()}
					></div>
				</div>
			{/if}
		{:else}
			<small style="display:block;">
				Duration Per Session:
				<span class="yellow">
					{offering.duration}
					minutes
				</span>
			</small>
		{/if}
	</div>

	{#if !readOnly}
		<div class="actions">
			{#if editing}
				<button on:click={saveChanges}>
					<i class="fa fa-save"></i>
				</button>
				{#if offering.id === -1}
					<button on:click={() => deleteMeetingOffering(offering.uuid)} class="delete">
						<i class="fa fa-trash"></i>
					</button>
				{:else}
					<button on:click={() => (editing = false)} class="cancel">
						<i class="fa fa-times"></i>
					</button>
				{/if}
			{:else}
				<button on:click={() => (editing = true)}>
					<i class="fa fa-edit"></i>
				</button>
				<button on:click={() => deleteMeetingOffering(offering.id)} class="delete">
					<i class="fa fa-trash"></i>
				</button>
			{/if}
		</div>
	{/if}
</li>

<style>
	.status {
		position: absolute;
		top: 0;
		left: -50px;
		display: inline-grid;
		font-size: 34px;
		top: 12px;
		color: #ccc;
		cursor: pointer;
	}

	.status > *:hover {
		color: rgb(129, 0, 129);
	}

	.status > * {
		margin-bottom: 10px;
	}
	.denied {
		text-decoration: line-through;
		color: #ccc;
		background-color: #f3f3f3;
	}

	.locked {
		background-color: #beffdf;
	}

	.status .fa.fa-times-circle.active {
		color: red;
	}

	.status .fa.fa-lock.active {
		color: green;
	}

	.status .fa.fa-circle-o.active {
		color: black;
	}
	.durations span {
		margin-right: 8px;
		cursor: pointer;
	}

	.yellow {
		background: #ffff93;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 10px;
		border-radius: 6px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
		transition: 0.3s ease-in-out;
	}

	.content {
		flex: 1;
	}

	.actions {
		display: flex;
		gap: 5px;
	}

	.actions button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		transition: color 0.2s ease;
	}

	.actions .delete {
		color: red;
	}

	.actions .cancel {
		color: gray;
	}

	h5 {
		padding: 6px;
		display: inline-block;
		background-color: rgb(255, 255, 146);
		border-radius: 4px;
	}

	select {
		padding: 6px;
		display: inline-block;
		background-color: rgb(255, 255, 146);
		border: none;
		font-size: 20px;
		margin-bottom: 2px;
	}

	h4,
	p,
	span {
		transition: background 0.2s ease-in-out;
	}

	/* Light gray background for contentEditable fields */
	.editable {
		background: #f3f3f3;
		padding: 2px 5px;
		border-radius: 4px;
		display: inline-block;
	}

	.editing {
		border: 1px dashed;
	}

	li {
		position: relative;
	}

	.unsaved-banner {
		position: absolute;
		top: -9px;
		right: 4px;
		background: #ff1d1d;
		color: #fff;
		padding: 10px;
		border-radius: 10px;
	}

	@media (max-width: 768px) {
		.status {
			display: block;
			position: initial;
		}
	}
</style>
