<script>
	import uuid from '$lib/components/functions/uuid';

	let roomId = 'taqaddum5050';

	let src = `https://sfu.mirotalk.com/join?room=${roomId}&roomPassword=0&name=mirotalksfu&audio=0&video=0&screen=0&hide=0&notify=0&duration=unlimited`;
</script>

<iframe
	allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
	{src}
	style="width: 100vw; height: 100vh; border: 0px;"
></iframe>
