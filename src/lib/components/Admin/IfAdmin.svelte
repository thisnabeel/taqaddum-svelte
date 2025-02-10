<script>
	import { user } from '$lib/stores/user';
</script>

{#if $user && ['rockystorm@gmail.com', 'nabeel.khan.swe@gmail.com', 'midris@stanford.edu', 'sundusabushar1999@yahoo.com'].includes($user.email)}
	<slot />
{/if}
