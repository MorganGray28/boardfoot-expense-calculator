import React from 'react';
import styles from '../styles/ProjectFormListItem.module.scss';

type PropsType = {
	name: string;
	species: string;
	cost: number;
};

function ProjectFormListItem({ name, species, cost }: PropsType) {
	return (
		<li className={styles.projectListItem}>
			<p className={styles.projectName}>{name}</p>
			<p className={styles.projectSpecies}>{species}</p>
			<p className={styles.projectCost}>${cost}</p>
		</li>
	);
}

export default ProjectFormListItem;
