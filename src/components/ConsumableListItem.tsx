import React from 'react';
import styles from '../styles/ConsumableListItem.module.scss';

interface PropTypes {
	name: string;
	cost: number;
}

export default function ConsumableListItem({ name, cost }: PropTypes) {
	return (
		<div className={styles.container}>
			<input className={styles.checkbox} type='checkbox' />
			<h2 className={styles.name}>{name}</h2>
			<p className={styles.cost}>${cost}</p>
		</div>
	);
}
