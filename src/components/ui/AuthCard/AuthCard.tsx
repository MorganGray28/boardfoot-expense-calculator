import React from 'react';
import styles from './AuthCard.module.scss';

function AuthCard({ children }: { children: React.ReactNode }) {
	return (
		<div className={styles.signin}>
			<div className={styles.container}>{children}</div>
		</div>
	);
}

export default AuthCard;
