<script>
	export let mentor;
</script>

<div class="mentor-card">
	<img src={mentor.avatar} alt={mentor.first_name + ' ' + mentor.last_name} />
	<div class="info">
		<h3>{mentor.first_name} {mentor.last_name}</h3>
		<p>{mentor.profession}</p>
		<hr />
		<ul class="clean-list">
			{#each mentor.mentorships as mentorship}
				<li>{mentorship.skill.title}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
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
