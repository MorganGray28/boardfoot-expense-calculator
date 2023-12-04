import React from 'react';
import styles from '../styles/ProjectCostSummary.module.scss';

type PropsType = {
	totalExpenses: number;
	totalConsumables: number;
};

function ProjectCostSummary({ totalExpenses, totalConsumables }: PropsType) {
	return (
		<div className={styles.ProjectCostSummary}>
			<h3 className={styles.header}>Expenses Overview</h3>
			<div className={styles.container}>
				<div className={styles.flexGroup}>
					<p className={styles.category}>Project Expenses</p>
					<p className={styles.amount}>${totalExpenses.toFixed(2)}</p>
				</div>
				<div className={styles.flexGroup}>
					<p className={styles.category}>Consumables Applied</p>
					<p className={styles.amount}>${totalConsumables.toFixed(2)}</p>
				</div>
				<div className={styles.flexGroup}>
					<p className={styles.total}>Total:</p>
					<p className={styles.amount}>${(totalExpenses + totalConsumables).toFixed(2)}</p>
				</div>
			</div>
		</div>
	);
}

export default ProjectCostSummary;
