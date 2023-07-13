import React from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import ConsumableListItem from './ConsumableListItem';
import { ProjectType } from '../types/types';

interface PropsType {
	activeProject: ProjectType | null;
}

export default function ConsumableTable({ activeProject }: PropsType) {
	let consumableList;
	if (activeProject) {
		consumableList = activeProject.consumables.map((consumable) => (
			<ConsumableListItem name={consumable.productName} cost={consumable.price} />
		));
	}
	return (
		<div className={styles.container}>
			<div className={styles.categoryContainer}>
				<div className={styles.flexGroup}>
					<h4 className={styles.category}>Project Expenses</h4>
					<p className={styles.categoryDescription}>List of all expenses for this Project</p>
				</div>
				<button>Add Expense</button>
			</div>
			<div className={styles.list}>{consumableList}</div>
		</div>
	);
}
