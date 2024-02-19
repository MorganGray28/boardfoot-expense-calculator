import React, { type Dispatch, type SetStateAction, useState } from 'react';
import type { ProjectType } from '../types/types';
import styles from '../styles/ExpenseAndConsumableGroup.module.scss';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';
import ProjectCostSummary from './ProjectCostSummary';

interface PropsType {
	activeProject: ProjectType | null;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	totalExpenses: number;
	setTotalExpenseAmount: Dispatch<SetStateAction<number>>;
	totalConsumables: number;
	setTotalConsumableAmount: Dispatch<SetStateAction<number>>;
}

export default function ExpenseAndConsumableGroup({
	activeProject,
	setActiveProject,
	totalExpenses,
	setTotalExpenseAmount,
	totalConsumables,
	setTotalConsumableAmount,
}: PropsType) {
	const [activeTab, setActiveTab] = useState<1 | 2>(1);

	return (
		<div className={styles.container}>
			<div className={styles.flexContainer}>
				<div className={styles.tabGroup}>
					<div className={styles.tabLabel}>
						<div className={styles.labelContainer}>
							<p
								onClick={() => setActiveTab(1)}
								className={activeTab === 1 ? `${styles.activeTabLabel}` : `${styles.inactiveTabLabel}`}
							>
								Expenses
							</p>
							<p
								onClick={() => setActiveTab(2)}
								className={activeTab === 2 ? `${styles.activeTabLabel}` : `${styles.inactiveTabLabel}`}
							>
								Consumables
							</p>
						</div>
					</div>
				</div>
				<div className={styles.expenseConsumablesFlex}>
					<ExpenseTable
						activeTab={activeTab === 1}
						activeProject={activeProject}
						setActiveProject={setActiveProject}
						setTotalExpenseAmount={setTotalExpenseAmount}
					/>
					<ConsumableTable activeTab={activeTab === 2} setTotalConsumableAmount={setTotalConsumableAmount} />
				</div>
				<ProjectCostSummary totalExpenses={totalExpenses} totalConsumables={totalConsumables} />
			</div>
		</div>
	);
}
