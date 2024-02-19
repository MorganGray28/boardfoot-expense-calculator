import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import AuthCard from '../../components/ui/AuthCard/AuthCard';
import styles from '../../styles/emailVerification.module.scss';

const emailVerification: NextPage = () => {
	return (
		<AuthCard>
			<h1 className={styles.header}>Email Sent</h1>
			<p className={styles.subheader}>A sign in link has been sent to your email address</p>

			<Link className={styles.link} href='/'>
				Go Back
			</Link>
		</AuthCard>
	);
};

export default emailVerification;
