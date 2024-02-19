import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Button,
	Preview,
	Section,
	Text,
	Hr,
} from '@react-email/components';
import * as React from 'react';

type MagicLinkEmailType = {
	url: string;
	identifier: string;
};

export const MagicLinkEmail: React.FC<MagicLinkEmailType> = ({ url, identifier }) => (
	<Html>
		<Head />
		<Preview>Magic Link sign in for Woodworking Expense Tracker</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={h1}>Woodworking Expense Tracker</Heading>
				<Hr style={divider} />
				<Text style={text}>Hello, {identifier}</Text>
				<Text style={text}>Sign in to start tracking your woodworking expenses</Text>
				<Section style={btnContainer}>
					<Button style={button} href={url} target='_blank'>
						Sign In
					</Button>
				</Section>
			</Container>
		</Body>
	</Html>
);

export default MagicLinkEmail;

const main = {
	backgroundColor: '#ffffff',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	border: '1px solid rgba(0,0,0,.08)',
	borderRadius: '9px',
	margin: '0 auto',
	padding: '32px 24px 42px 24px',
};

const h1 = {
	textAlign: 'center' as const,
	fontSize: '1.5rem',
	fontWeight: '400',
	paddingBottom: '.75rem',
	color: '#32436d',
};

const divider = {
	borderColor: '#e6ebf1',
	margin: '24px 0',
};

const btnContainer = {
	textAlign: 'center' as const,
};

const text = {
	color: '#525f7f',
	textAlign: 'center' as const,
	fontSize: '16px',
	lineHeight: '26px',
};

const button = {
	backgroundColor: '#1b4276',
	borderRadius: '5px',
	color: '#fff',
	fontSize: '16px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	marginTop: '64px',
	padding: '12px 24px',
};
