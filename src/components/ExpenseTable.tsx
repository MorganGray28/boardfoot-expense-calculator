import React from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import CostList from './CostList';
import { ProjectType } from '../types/types';
import LumberExpenseListItem from './LumberExpenseListItem';
import { trpc } from '../utils/trpc';

interface PropsType {
	activeProject: ProjectType | undefined;
}

export default function ExpenseTable({ activeProject }: PropsType) {
	let lumberListItems;
	if (activeProject) {
		lumberListItems = activeProject.lumber.map((l) => (
			<LumberExpenseListItem
				key={l.id}
				id={l.id}
				name={l.name}
				species={l.species}
				numOfPieces={l.numOfPieces}
				thickness={l.thickness}
				width={l.width}
				length={l.length}
				price={l.price}
				tax={l.tax}
			/>
		));
	}
	return (
		<div className={styles.container}>
			<CostList category='Project Expenses' description='List of all expenses for this Project'>
				{lumberListItems}
			</CostList>
		</div>
	);
}
