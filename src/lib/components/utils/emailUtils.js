export function generateInvitationEmail(lead, token, inviter) {
	return `
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<p style="font-size: 16px;">Assalamualikum ${lead?.first_name || 'User'},</p>
			<p style="font-size: 16px;">${inviter?.first_name} recommended you for <a href="https://www.taqaddum.org">Taqaddum</a>.</p>
			<p style="font-size: 16px;">Taqaddum is a first-of-its-kind mentorship platform for Muslims seeking professional growth anchored in Islamic values.</p>
			<p style="font-size: 16px;">Key features of Taqaddum include:</p>
			<ul style="font-size: 16px; padding-left: 20px;">
				<li>Vetted Mentors & Mentees: Ensuring meaningful and productive interactions.</li>
				<li>Intelligent Session Suggestions: Personalized mentorship topics based on career goals.</li>
				<li>Real Human Connections: Authentic relationships with personalized advice.</li>
				<li>Islamic Professional Development: Integrating values like Ikhlas (Sincerity) and Shukr (Gratitude) into workplace success.</li>
			</ul>
			<p style="font-size: 16px;">We take great care in vetting both mentors and mentees to ensure meaningful connections and to respect everyone’s time. This process ensures that all participants are committed, qualified, and aligned with the platform’s values.</p>
			<p style="font-size: 18px; font-weight: bold; color: #007BFF;">We are proud to pre-approve you to be a mentor on Taqaddum for:</p>
			<ul style="font-size: 16px; padding-left: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
				${(lead?.mentorships || lead?.menteeships || [])
					.map(
						(item) =>
							`<li style='margin-bottom: 10px; font-size: 16px; color: #333;'><strong>${item.skill?.title}</strong></li>`
					)
					.join('')}
			</ul>
			<p style="font-size: 16px;">We look forward to you joining us.</p>
			<p style="font-size: 16px; font-style: italic;">As Allah says in the Quran: "Help one another in acts of piety and righteousness..." (Surah Al-Ma'idah 5:2)</p>
			<p style="font-size: 16px;">All you have to do is click the link below to complete your registration:</p>
			<a href="https://www.taqaddum.org/users/preapproval/${token}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Complete Registration</a>
			<hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc;" />
			<p style="font-size: 16px;">JazakAllah Khayr for your time,<br />Assalamualikum<br />The Taqaddum Team</p>
		</div>
	`;
}
