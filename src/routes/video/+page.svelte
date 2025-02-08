<script>
	import { onMount } from 'svelte';

	let api;

	let roomId = 'test5050';
	onMount(() => {
		if (typeof JitsiMeetExternalAPI !== 'undefined') {
			api = new JitsiMeetExternalAPI('8x8.vc', {
				roomName: 'vpaas-magic-cookie-1d35e23b50344b6aba96ccf79fe3d755/' + roomId,
				parentNode: document.querySelector('#jaas-container'),
				jwt: 'eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMWQzNWUyM2I1MDM0NGI2YWJhOTZjY2Y3OWZlM2Q3NTUvNmY4Njg3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3MzkwNTQxOTYsImV4cCI6MTczOTA2MTM5NiwibmJmIjoxNzM5MDU0MTkxLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMWQzNWUyM2I1MDM0NGI2YWJhOTZjY2Y3OWZlM2Q3NTUiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE1OTcxMzQ0Njc3NDkzMDE4MDU1IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJ0ZXN0LnVzZXJAY29tcGFueS5jb20ifX0sInJvb20iOiIqIn0.JBBH_O23m9dsMgQenDDk1QSeXr1jfuQfDXWFxr0enpxbeeSc6VKrzgnmr26w7d1vHBgQs6AMIDL9wuJ-Atr33UV8mhYxKGBsDe_aUx2jmU6IocURczvFRyQu7IBvN1_RUmuR-hn2zjlHU__rbmj21iT8wRMzeOXd1q8AMXWGTOgplf2Paxvg8vYPJYgjC_8iHIb4oHQIjQqNqFt5Z3yFsU7iVCWOPLJ6D7emrauIaXAGCetNtsbK0n5lZgaiyGF3Vqj9usKJbtvDTniT8cNw-CrYjHyd_PosTOAdbS0gwnkVvL_ruJfcJIiu1Y2R4swm8Qo12ig35DxF2aBk3TJmGA'
			});
		} else {
			console.error('JitsiMeetExternalAPI is not available');
		}
	});
</script>

<svelte:head>
	<script
		src="https://8x8.vc/vpaas-magic-cookie-1d35e23b50344b6aba96ccf79fe3d755/external_api.js"
		async
	></script>
</svelte:head>

<div id="jaas-container" class="jaas-container"></div>

<style>
	.jaas-container {
		height: 100vh;
		width: 100%;
	}
</style>
