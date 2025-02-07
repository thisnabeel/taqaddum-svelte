<script>
	export let avatar = null;
	export let avatarPreview = '/default-avatar.png'; // Default placeholder

	function handleFileUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				avatarPreview = e.target.result;
				avatar = file;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="text-center">
	<label for="avatar-upload">
		<img src={avatarPreview} alt="Avatar Preview" class="avatar-preview mb-3" />
	</label>
	<input
		type="file"
		id="avatar-upload"
		accept="image/*"
		on:change={handleFileUpload}
		class="d-none"
	/>
	<p class="text-muted small">Click image to upload</p>
</div>

<style>
	.avatar-preview {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		cursor: pointer;
		object-fit: cover;
		border: 2px solid #ccc;
	}
</style>
