<script>
	export let mentor;
</script>

<div class="mentor-profile">
	<div class="mentor-card">
		<img
			class="mentor-avatar"
			src={mentor.avatar_cropped_url || '/default-avatar.png'}
			alt={mentor.first_name}
		/>
		<div class="mentor-info">
			<h2>{mentor.first_name} {mentor.last_name}</h2>
			<h4 class="mentor-profession">{mentor.profession}</h4>
			<h4 class="mentor-profession" style="color:#ffff93">@ {mentor.company}</h4>
			<!-- <p class="mentor-bio">
				{mentor.bio || 'This mentor has a wealth of knowledge to share!'}
			</p> -->
		</div>
	</div>
</div>

<style>
	.mentor-profile {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 40px 20px;
		background: linear-gradient(135deg, #007bff, #6610f2);
		color: white;
		border-radius: 12px;
		margin-bottom: 20px;
	}

	.mentor-card {
		display: flex;
		align-items: center;
		gap: 20px;
		max-width: 600px;
	}

	.mentor-avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid white;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
	}

	.mentor-info {
		text-align: left;
	}

	.mentor-info h2 {
		font-size: 24px;
		margin: 0;
	}

	.mentor-profession {
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 10px;
	}

	.mentor-bio {
		font-size: 16px;
		color: rgba(255, 255, 255, 0.9);
	}
</style>
