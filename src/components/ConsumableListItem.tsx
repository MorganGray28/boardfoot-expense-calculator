import React from 'react';
import styles from '../styles/ConsumableListItem.module.scss';
import { ProjectType } from '../types/types';
import { trpc } from '../utils/trpc';

interface PropTypes {
	name: string;
	amount: number;
	cost: number;
	id: string;
	activeProject: ProjectType | null;
}

export default function ConsumableListItem({ name, amount, cost, id, activeProject }: PropTypes) {
	const ctx = trpc.useContext();

	return (
		<div className={styles.container}>
			<h2 className={styles.name}>{name}</h2>
			<p className={styles.percentage}>{amount}</p>
			<p className={styles.cost}>${cost}</p>
		</div>
	);
}
