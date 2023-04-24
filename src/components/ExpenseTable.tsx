import React from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import CostList from './CostList';
import { ProjectType } from '../types/types';
import LumberExpenseListItem from './LumberExpenseListItem';
import { trpc } from '../utils/trpc';

interface PropsType {
	activeProject: ProjectType | null;
}

export default function ExpenseTable({ activeProject }: PropsType) {
	let lumberListItems;
	const { data: singleProjectData, refetch: refetchActiveProjectExpenses } = trpc.project.getProject.useQuery(
		activeProject?.id!
	);

	if (activeProject) {
		// TODO: Import Cost and BoardFeet calculation functions to calculate cost/bf instead of storing in DB
		if (singleProjectData) {
			lumberListItems = singleProjectData.lumber.map((l) => (
				<LumberExpenseListItem
					key={l.id}
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
	}
	return (
		<div className={styles.container}>
			<CostList category='Project Expenses' description='List of all expenses for this Project'>
				{lumberListItems}
			</CostList>
		</div>
	);
}
