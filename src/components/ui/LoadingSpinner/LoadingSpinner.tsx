'use client';

import styles from './LoadingSpinner.module.scss';

type PropsType = {
	type: 'standalone' | 'button';
};

function LoadingSpinner({ type }: PropsType) {
	return (
		<div
			className={`${styles.loadingSpinner}` + (type === 'standalone' ? '' : ` ${styles.buttonType}`)}
		></div>
	);
}

export default LoadingSpinner;
