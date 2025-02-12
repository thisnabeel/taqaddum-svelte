<script>
	import { user } from '$lib/stores/user';
</script>

<div>
	{#if !$user || !['rockystorm@gmail.com', 'nabeel.khan.swe@gmail.com', 'midris@stanford.edu', 'sundusabushar1999@yahoo.com'].includes($user.email)}
		<h1>Unauthorized...</h1>
	{:else}
		<ul class="clean-list nav">
			<li>
				<a href="/admin/skills">Skills</a>
			</li>
			<li>
				<a href="/admin/mentors">Mentors</a>
			</li>
		</ul>
		<slot />
	{/if}
</div>

<style>
	.nav {
		text-align: center;
		max-width: 200px;
		display: block;
		margin: 0 auto;
	}
	.nav li {
		display: inline;
	}
</style>
