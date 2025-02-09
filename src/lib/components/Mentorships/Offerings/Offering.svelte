<script>
	import { goto } from '$app/navigation';
	import API from '$lib/api/api';
	import { DateTime } from 'luxon';

	export let offering;
	export let mentorships;
	export let index;
	export let removeOffering;
	export let readOnly = true;
	export let slotDetails;

	let editing = false;

	$: checkInit(offering);
	function checkInit(offering) {
		if (offering.id < 0) {
			editing = true;
		}
	}

	async function startChatRoom(slotDetails) {
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
			removeOffering(offering.uuid);
			return;
		}
		if (!confirm('Are you sure you want to delete this meeting offering?')) return;
		try {
			await API.delete(`/meeting_offerings/${id}`);
			fetchMeetingOfferings(); // Ensure this function is available in the parent component
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
			range.setStart(event.target.firstChild, Math.min(offset, event.target.firstChild.length));
			range.setEnd(event.target.firstChild, Math.min(offset, event.target.firstChild.length));
			selection.removeAllRanges();
			selection.addRange(range);
		});
	}
</script>

<li class:editing>
	<div class="content">
		{#if editing}
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
					Book Now
				</div>
			</small>
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
				<button on:click={() => (editing = false)} class="cancel">
					<i class="fa fa-times"></i>
				</button>
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
</style>
