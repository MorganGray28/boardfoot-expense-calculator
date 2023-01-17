import React from 'react';
import styles from '../styles/LumberExpenseListItem.module.scss';

interface PropTypes {
	lumberName?: string;
	species: string;
	thickness: number;
	boardFeet: number;
	cost: number;
}

// TODO: Style the item container for alternating background colors

export default function LumberExpenseListItem({
	lumberName,
	species,
	thickness,
	boardFeet,
	cost,
}: PropTypes) {
	return (
		<div className={styles.container}>
			<h2 className={styles.name}>{lumberName}</h2>
			<div className={styles.flexContainer}>
				<div className={styles.speciesThicknessGroup}>
					<p className={styles.species}>{species}</p>
					<p className={styles.thickness}>{thickness}"</p>
				</div>
				<p className={styles.boardFeet}>{boardFeet} BF</p>
				<p className={styles.cost}>${cost}</p>
			</div>
		</div>
	);
}
