import { Body, Container, Head, Heading, Html, Link, Preview } from '@react-email/components';
import * as React from 'react';

interface WaitlistEmailProps {
	url: string;
}

export const WaitlistEmail: React.FC<WaitlistEmailProps> = ({ url }) => (
	<Html>
		<Head />
		<Preview>Magic Link to sign in to Woodworking Expense Calculator</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={h1}>Log in to start tracking your Woodworking Expenses</Heading>
				<Link href={url} target='_blank'>
					Click here to login using magic link
				</Link>
				{/* <Text style={text}>
				</Text> */}
			</Container>
		</Body>
	</Html>
);

export default WaitlistEmail;

const main = {
	backgroundColor: '#ffffff',
	margin: '0 auto',

	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
	margin: 'auto',
	padding: '96px 20px 64px',
};

const h1 = {
	color: '#222',
	fontSize: '24px',
	fontWeight: '600',
	lineHeight: '40px',
	margin: '0 0 20px',
};

// const text = {
// 	color: '#aaaaaa',
// 	fontSize: '14px',
// 	lineHeight: '24px',
// 	margin: '0 0 40px',
// };
