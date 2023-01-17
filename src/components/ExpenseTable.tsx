import React from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import CostList from './CostList';
import { ProjectType } from './Dashboard';
import LumberExpenseListItem from './LumberExpenseListItem';

interface PropsType {
	activeProject: ProjectType | null;
}

export default function ExpenseTable({ activeProject }: PropsType) {
	let lumberListItems;
	if (activeProject) {
		console.log(activeProject);

		// TODO: Import Cost and BoardFeet calculation functions to calculate cost/bf instead of storing in DB
		if (activeProject.lumber.length) {
			lumberListItems = activeProject.lumber.map((l) => (
				<LumberExpenseListItem
					key={l.id}
					lumberName={l.lumberName}
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
	}
	return (
		<div className={styles.container}>
			<CostList category='Project Expenses'>{lumberListItems}</CostList>
		</div>
	);
}
