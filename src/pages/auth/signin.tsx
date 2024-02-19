import React from 'react';
import styles from '../../styles/signin.module.scss';
import { signIn } from 'next-auth/react';
import type { NextPage } from 'next';
import EmailLogin from '../../components/ui/EmailLogin/EmailLogin';

const signin: NextPage = () => {
	return (
		<>
			<div className={styles.signin}>
				<div className={styles.container}>
					<h1 className={styles.header}>Sign in </h1>
					<p className={styles.subheader}>Log in or create a new account</p>
					<div className={styles.providerList}>
						<EmailLogin />
						<div className={styles.providerListBorder}>orE</div>

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
				</div>
			</div>
		</>
	);
};

export default signin;
