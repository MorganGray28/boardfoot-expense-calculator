import React from 'react';
import styles from '../../styles/signin.module.scss';
import { signIn } from 'next-auth/react';
import type { NextPage } from 'next';

const signin: NextPage = () => {
	return (
		<>
			<div className={styles.signin}>
				<div className={styles.container}>
					<h1 className={styles.header}>Sign In</h1>
					<p className={styles.subheader}>Log in or create a new account</p>
					<div className={styles.providerList}>
						<button className={styles.providerButton} onClick={() => signIn('google', { callbackUrl: '/' })}>
							<img src='/google-logo.svg' alt='google logo' />
							Sign in with Google
						</button>
						<button className={styles.providerButton} onClick={() => signIn('discord', { callbackUrl: '/' })}>
							<img src='/discord-logo.svg' alt='discord logo' />
							Sign in with Discord
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default signin;
