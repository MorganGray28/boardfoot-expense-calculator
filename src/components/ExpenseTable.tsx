import React from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import CostList from './CostList';
import { ProjectType, LumberType, ConsumableType } from './Dashboard';
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
					thickness={l.thickness}
					boardFeet={22}
					cost={200}
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
