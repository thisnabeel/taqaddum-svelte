<script>
	export let lead;
	export let token;
</script>

<h2>Invitation Email Preview</h2>
<p>Assalamualikum {lead?.first_name || 'User'},</p>
<p>You have been pre-approved to be a mentor on Taqaddum for:</p>
<ul>
	{#each lead?.mentorships || lead?.menteeships as item}
		<li>{item.skill?.title}</li>
	{/each}
</ul>
<p>All you have to do is click the link below to complete your registration:</p>
<a href={`https://taqaddum.com/users/preapproval/${token}`} target="_blank">
	Complete Registration
</a>
<hr />
<p>JazakAllah Khayr for your time,<br />Assalamualikum</p>
