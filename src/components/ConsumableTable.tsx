import React from 'react';
import styles from '../styles/ConsumableTable.module.scss';
import ConsumableListItem from './ConsumableListItem';
import CostList from './CostList';

export default function ConsumableTable() {
	return (
		<div className={styles.container}>
			<CostList category='Consumables'>
				<ConsumableListItem name='Blue Shop Towels' cost={15} />
			</CostList>
		</div>
	);
}
