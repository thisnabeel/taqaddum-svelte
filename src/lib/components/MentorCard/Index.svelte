<script>
	export let mentor;
</script>

<div class="mentor-card">
	<img src={mentor.avatar_cropped_url} alt={mentor.first_name + ' ' + mentor.last_name} />
	<div class="info">
		<h3>{mentor.first_name} {mentor.last_name}</h3>
		<p>{mentor.profession}</p>

		<b> Mentoring: </b>
		<ul class="clean-list skills">
			{#each mentor.mentorships as mentorship}
				<li>{mentorship.skill.title}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.skills li {
		font-size: 1.2rem;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		white-space: nowrap;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
	}
	.mentor-card {
		background: white;
		border-radius: 10px;
		padding: 15px;
		text-align: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}
	.mentor-card img {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}
	.info {
		margin-top: 10px;
	}
	.social {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-top: 5px;
	}
</style>
