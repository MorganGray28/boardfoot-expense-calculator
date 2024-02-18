import { SendVerificationRequestParams } from 'next-auth/providers';
import { resend } from '../lib/resend';
import { WaitlistEmail } from '../components/email/emailTemplate';

export default async function sendVerificationRequest(params: SendVerificationRequestParams) {
	const { identifier, url } = params;
	const { host } = new URL(url);

	try {
		await resend.emails.send({
			from: 'noreply@woodworkingexpensetracker.com',
			to: identifier,
			subject: `Log in to ${host}`,
			text: text({ url, host }),
			react: WaitlistEmail({ url, host }),
		});
	} catch (error) {
		console.log(error);
	}
}

function text({ url, host }: { url: string; host: string }) {
	return `Sign in to ${host}\n${url}\n\n`;
}
