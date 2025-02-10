<script>
	import { user } from '$lib/stores/user';
</script>

<div>
	{#if !$user || !['rockystorm@gmail.com', 'nabeel.khan.swe@gmail.com', 'midris@stanford.edu', 'sundusabushar1999@yahoo.com'].includes($user.email)}
		<h1>Unauthorized...</h1>
	{:else}
		<slot />
	{/if}
</div>
