<script>
	import Offering from './Offerings/Offering.svelte';

	export let potentialMeetups = [];
</script>

<div class="container">
	<ul class="meetup-list">
		{#if potentialMeetups.length < 1}
			<div class="jumbotron">
				<h2>You have no slots generated.</h2>
				<h4>Click the tabs above make sure you have offerings and availabilities selected.</h4>
			</div>
		{/if}
		{#each potentialMeetups as meetup}
			<Offering offering={meetup.offering} slotDetails={meetup}></Offering>
			{#if false}
				<li class="meetup-item">
					<div class="meetup-info">
						<h3>{meetup.title}</h3>
						<p><strong>Date:</strong> {meetup.booking_date}</p>
						<p>
							<strong>Time:</strong>
							{new Date(meetup.start_time).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})} - {new Date(meetup.end_time).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})}
						</p>
						<p><strong>Duration:</strong> {meetup.duration} minutes</p>
					</div>

					<div class="offering-info">
						<h4>{meetup.offering.title}</h4>
						<p>{meetup.offering.description}</p>
						<p><strong>Max Attendees:</strong> {meetup.offering.max_attendees}</p>
					</div>

					<div class="mentorship-info">
						<h5>Mentorship: {meetup.offering.mentorship.skill.title}</h5>
						<p>{meetup.offering.mentorship.skill.description}</p>
					</div>

					<div class="mentor-info">
						<img
							class="mentor-avatar"
							src={meetup.offering.mentorship.user.avatar_cropped_url}
							alt={meetup.offering.mentorship.user.first_name}
						/>
						<p>
							<strong>Mentor:</strong>
							{meetup.offering.mentorship.user.first_name}
							{meetup.offering.mentorship.user.last_name}
						</p>
						<p><strong>Profession:</strong> {meetup.offering.mentorship.user.profession}</p>
					</div>
				</li>
			{/if}
		{/each}
	</ul>
</div>

<style>
	.container {
		max-width: 600px;
		margin: auto;
		padding: 20px;
		border-radius: 8px;

		background: white;
	}
	.meetup-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.meetup-item {
		background: #fff;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		gap: 15px;
	}

	.meetup-info,
	.offering-info,
	.mentorship-info,
	.mentor-info {
		flex: 1;
	}

	.meetup-info h3,
	.offering-info h4,
	.mentorship-info h5 {
		margin-bottom: 8px;
	}

	.mentor-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		.meetup-item {
			flex-direction: column;
		}
	}
</style>
