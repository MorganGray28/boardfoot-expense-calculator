import React from 'react';
import styles from '../styles/CostList.module.scss';
import LumberExpenseListItem from './LumberExpenseListItem';

interface PropTypes {
	category: string;
	description: string;
	children?: React.ReactNode;
}

export default function CostList({ category, description, children }: PropTypes) {
	return (
		<>
			<div className={styles.categoryContainer}>
				<h4 className={styles.category}>{category}</h4>
				{<p className={styles.categoryDescription}>{description}</p>}
			</div>
			<div className={styles.list}>{children}</div>
		</>
	);
}
