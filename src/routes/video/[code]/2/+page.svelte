<script>
	import { page } from '$app/state';
	import Miro from '$lib/components/Video/miro.svelte';
	import { user } from '$lib/stores/user';

	let build = false;
	user.subscribe((p) => {
		build = true;
	});
</script>

{#if page.params.code && build}
	{#if $user}
		<Miro user={$user} code={page.params.code}></Miro>
	{:else}
		<Miro user={{ first_name: 'Demo', last_name: 'Khan' }} code={page.params.code}></Miro>
	{/if}
{/if}
