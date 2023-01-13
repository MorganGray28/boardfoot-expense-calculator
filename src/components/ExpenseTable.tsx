import React from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import CostList from './CostList';
import LumberExpenseListItem from './LumberExpenseListItem';

export default function ExpenseTable() {
	return (
		<div className={styles.container}>
			<CostList category='Project Expenses'>
				<LumberExpenseListItem name='Table Top' species='Walnut' thickness={1.75} boardFeet={16} cost={216} />
				<LumberExpenseListItem
					name='Table Legs'
					species='Walnut'
					thickness={1.75}
					boardFeet={14}
					cost={200}
				/>
				<LumberExpenseListItem name='Table Top' species='Walnut' thickness={1.75} boardFeet={16} cost={216} />
				<LumberExpenseListItem name='Table Top' species='Walnut' thickness={1.75} boardFeet={16} cost={216} />
				<LumberExpenseListItem name='Table Top' species='Walnut' thickness={1.75} boardFeet={16} cost={216} />
			</CostList>
		</div>
	);
}
