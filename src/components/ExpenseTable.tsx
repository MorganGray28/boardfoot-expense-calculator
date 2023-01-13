import React from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import CostList from './CostList';

export default function ExpenseTable() {
	return (
		<div className={styles.container}>
			<CostList category='Project Expenses' />
		</div>
	);
}
