import React from 'react';
import styles from '../../styles/signin.module.scss';
import { signIn } from 'next-auth/react';
import type { NextPage } from 'next';
import EmailLogin from '../../components/ui/EmailLogin/EmailLogin';
import AuthCard from '../../components/ui/AuthCard/AuthCard';

const signin: NextPage = () => {
	return (
		<>
			<AuthCard>
				<h1 className={styles.header}>Sign in</h1>
				<p className={styles.subheader}>Log in or create a new account</p>
				<div className={styles.providerList}>
					<EmailLogin />
					<div className={styles.providerListBorder}>or</div>
					<button
						style={{ marginTop: '1rem' }}
						className={styles.providerButton}
						onClick={() => signIn('google', { callbackUrl: '/' })}
					>
						<img src='/google-logo.svg' alt='google logo' />
						Continue with Google
					</button>
					<button className={styles.providerButton} onClick={() => signIn('discord', { callbackUrl: '/' })}>
						<img src='/discord-logo.svg' alt='discord logo' />
						Continue with Discord
					</button>
				</div>
			</AuthCard>
		</>
	);
};

export default signin;
