import React from 'react';
import { BoardFeetType } from '../types/types';
import styles from '../styles/ProjectFormListItem.module.scss';

type PropsType = {
	name: string;
	species: string;
	cost: number;
	id: string;
	values: BoardFeetType | null;
	handleClick: (id: string, values: BoardFeetType | null) => void;
};

function ProjectFormListItem({ name, species, cost, id, values, handleClick }: PropsType) {
	return (
		<li className={styles.projectListItem} onClick={() => handleClick(id, values)}>
			<p className={styles.projectName}>{name}</p>
			<p className={styles.projectSpecies}>{species}</p>
			<p className={styles.projectCost}>{cost ? '$' + cost : '$0'}</p>
		</li>
	);
}

export default ProjectFormListItem;
