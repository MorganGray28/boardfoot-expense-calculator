import React, { type Dispatch, type SetStateAction, useState } from 'react';
import type { ProjectType } from '../types/types';
import styles from '../styles/ExpenseAndConsumableGroup.module.scss';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';

interface PropsType {
	activeProject: ProjectType | null;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	setTotalExpenseAmount: Dispatch<SetStateAction<number>>;
	setTotalConsumableAmount: Dispatch<SetStateAction<number>>;
}

export default function ExpenseAndConsumableGroup({
	activeProject,
	setActiveProject,
	setTotalExpenseAmount,
	setTotalConsumableAmount,
}: PropsType) {
	const [activeTab, setActiveTab] = useState<0 | 1 | 2>(1);

	return (
		<div className={styles.flexContainer}>
			<div className={styles.tabGroup}>
				<div className={styles.tabLabel}>
					<div className={styles.labelContainer}>
						{/* <p onClick={() => setActiveTab(0)}>Board Foot Calculator</p> */}
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
			<ExpenseTable
				activeTab={activeTab === 1}
				activeProject={activeProject}
				setActiveProject={setActiveProject}
				setTotalExpenseAmount={setTotalExpenseAmount}
			/>
			<ConsumableTable activeTab={activeTab === 2} setTotalConsumableAmount={setTotalConsumableAmount} />
		</div>
	);
}
