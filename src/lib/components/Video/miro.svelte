<script>
	import uuid from '$lib/components/functions/uuid';

	export let code;
	export let user;

	let src = `https://sfu.mirotalk.com/join?room=${code}&roomPassword=0&name=${user.type + ' ' + user.first_name + ' ' + user.last_name + '_' + user.id}&audio=1&video=1&screen=0&hide=0&notify=0&duration=unlimited`;
</script>

<iframe
	allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
	{src}
	style="width: 100vw; height: 100vh; border: 0px;"
></iframe>
