import React from 'react';
import styles from '../styles/ConsumableTable.module.scss';
import ConsumableListItem from './ConsumableListItem';
import CostList from './CostList';
import { ProjectType } from '../types/types';

interface PropsType {
	activeProject: ProjectType | null;
}

export default function ConsumableTable({ activeProject }: PropsType) {
	let consumableList;
	if (activeProject) {
		consumableList = activeProject.consumables.map((consumable) => (
			<ConsumableListItem name={consumable.productName} cost={consumable.price} />
		));
	}
	return (
		<div className={styles.container}>
			<CostList
				category='Consumables'
				description="Apply specific consumable costs for each Project's expenses"
			>
				{consumableList}
			</CostList>
		</div>
	);
}
