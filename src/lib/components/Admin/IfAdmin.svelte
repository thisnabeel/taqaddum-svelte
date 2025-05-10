<script>
	import { user } from '$lib/stores/user';
</script>

{#if $user?.roles?.includes('admin')}
	<slot />
{/if}
