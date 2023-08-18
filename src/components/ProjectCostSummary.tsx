import React from 'react';
import styles from '../styles/ProjectCostSummary.module.scss';

type PropsType = {
	totalExpenses: number;
	totalConsumables: number;
};

function ProjectCostSummary({ totalExpenses, totalConsumables }: PropsType) {
	return (
		<div className={styles.container}>
			<p>Total Expenses for this project:</p>
			<p>${totalExpenses.toFixed(2)}</p>
			<p>Total Consumable costs applied for this project:</p>
			<p>${totalConsumables.toFixed(2)}</p>
		</div>
	);
}

export default ProjectCostSummary;
