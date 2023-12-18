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
					<p className={styles.subheader}>Sign in or create a new account</p>
					<div className={styles.providerList}>
						<button className={styles.providerButton} onClick={() => signIn('google', { callbackUrl: '/' })}>
							Login in with Google
						</button>
						<button className={styles.providerButton} onClick={() => signIn('discord', { callbackUrl: '/' })}>
							Login in with Discord
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default signin;
