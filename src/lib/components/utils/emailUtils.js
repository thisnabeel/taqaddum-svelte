export function generateInvitationEmail(lead, token) {
	return `
		<p>Assalamualikum ${lead?.first_name || 'User'},</p>
		<p>You have been pre-approved to be a mentor on Taqaddum for:</p>
		<ul>
			${(lead?.mentorships || lead?.menteeships || [])
				.map((item) => `<li>${item.skill?.title}</li>`)
				.join('')}
		</ul>
		<p>All you have to do is click the link below to complete your registration:</p>
		<a href="https://www.taqaddum.org/users/preapproval/${token}" target="_blank">
			Complete Registration
		</a>
		<hr />
		<p>JazakAllah Khayr for your time,<br />Assalamualikum</p>
	`;
}
