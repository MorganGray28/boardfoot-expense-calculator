import React from 'react';
import styles from '../styles/ProjectCostSummary.module.scss';

type PropsType = {
	totalExpenses: number;
	totalConsumables: number;
};

function ProjectCostSummary({ totalExpenses, totalConsumables }: PropsType) {
	return (
		<div className={styles.container}>
			<h5>Expenses for this project:</h5>
			<p>${totalExpenses.toFixed(2)}</p>
			<h5>Consumable costs applied for this project:</h5>
			<p>${totalConsumables.toFixed(2)}</p>

			<h5>Total:</h5>
			<p>${(totalExpenses + totalConsumables).toFixed(2)}</p>
		</div>
	);
}

export default ProjectCostSummary;
