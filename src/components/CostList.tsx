import React from 'react';
import styles from '../styles/CostList.module.scss';
import LumberExpenseListItem from './LumberExpenseListItem';

interface PropTypes {
	category: string;
	children?: React.ReactNode;
}

export default function CostList({ category, children }: PropTypes) {
	return (
		<>
			<p className={styles.category}>{category}</p>
			<div className={styles.list}>{children}</div>
		</>
	);
}
