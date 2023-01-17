import React from 'react';
import styles from '../styles/ConsumableTable.module.scss';
import ConsumableListItem from './ConsumableListItem';
import CostList from './CostList';
import { ProjectType } from './Dashboard';

interface PropsType {
	activeProject: ProjectType | null;
}

export default function ConsumableTable({ activeProject }: PropsType) {
	return (
		<div className={styles.container}>
			<CostList category='Consumables'>
				<ConsumableListItem name='Blue Shop Towels' cost={15} />
			</CostList>
		</div>
	);
}
