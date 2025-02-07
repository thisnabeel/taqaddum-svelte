<script>
	import { avatar_cropped_blob_url } from '$lib/stores/signingUpStore';
	import { user } from '$lib/stores/user';
	import EditModal from './EditModal.svelte';
	import { modals } from 'svelte-modals';

	export let signingUp = false;

	let avatar_cropped_url =
		'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg';
</script>

<div class="avatar" style="position:relative; width:max-content">
	<img
		style="width: 150px"
		src={$avatar_cropped_blob_url || avatar_cropped_url}
		alt=""
		class="avatar"
	/>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<i
		class="fa fa-pen"
		on:click={() => {
			modals.open(EditModal, { signingUp: signingUp });
		}}
		style="position: absolute; top: 0px; right: -10px; background-color: #fff; padding:10px; border-radius: 100%; text-align: center;"
	/>
</div>

<style>
	.avatar {
		border-radius: 100%;
		margin: 0 auto;
		display: block;
	}
</style>
