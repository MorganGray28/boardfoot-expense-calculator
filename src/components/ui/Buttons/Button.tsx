'use client';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './Button.module.scss';

interface PropsType extends React.ComponentProps<'button'> {
	isLoading?: boolean;
	loadingText?: string;
	color?: 'primary' | 'danger';
	variant?: 'contained' | 'outlined';
	size?: 'small' | 'medium' | 'large' | 'full';
}

function Button({
	isLoading,
	loadingText,
	color = 'primary',
	variant = 'contained',
	size = 'medium',
	children,
	...props
}: PropsType) {
	return (
		<button
			disabled={isLoading}
			className={`${styles.button}` + ` ${styles[buttonClass]}` + ` ${styles[size]}`}
			{...props}
		>
			{isLoading && <LoadingSpinner type='button' />}
			{isLoading ? loadingText : children}
		</button>
	);
}

export default Button;
