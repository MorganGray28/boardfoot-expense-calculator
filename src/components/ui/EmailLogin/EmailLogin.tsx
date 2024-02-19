'use client';
import React, { useState } from 'react';
import styles from './EmailLogin.module.scss';

import { signIn } from 'next-auth/react';

function EmailLogin() {
	const [email, setEmail] = useState('');

	function handleEmailSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		signIn('resend', { email, callbackUrl: '/' });
	}
	return (
		<>
			<input
				className={styles.emailInput}
				type='text'
				id='email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<button className={styles.providerButton} onClick={(e) => handleEmailSubmit(e)}>
				Continue with email
			</button>
		</>
	);
}

export default EmailLogin;
