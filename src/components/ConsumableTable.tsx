import React from 'react';
import styles from '../styles/ConsumableTable.module.scss';
import CostList from './CostList';

export default function ConsumableTable() {
	return (
		<div className={styles.container}>
			<CostList category='Consumables' />
		</div>
	);
}
