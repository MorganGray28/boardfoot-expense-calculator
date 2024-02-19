'use client';
import React, { useState } from 'react';
import styles from './EmailLogin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

import { signIn } from 'next-auth/react';

function EmailLogin() {
	const [email, setEmail] = useState('');

	function handleEmailSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		if (!email) {
			toast.error('please enter valid email address');
		} else {
			signIn('resend', { email, callbackUrl: '/' });
		}
	}
	return (
		<>
			<input
				className={styles.emailInput}
				type='text'
				id='email'
				value={email}
				placeholder='Email Address'
				onChange={(e) => setEmail(e.target.value)}
			/>
			<button className={styles.providerButton} onClick={(e) => handleEmailSubmit(e)}>
				<FontAwesomeIcon className={styles.emailIcon} icon={faEnvelope} />
				Continue with Email
			</button>
		</>
	);
}

export default EmailLogin;
