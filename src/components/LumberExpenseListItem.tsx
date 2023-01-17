import React from 'react';
import styles from '../styles/LumberExpenseListItem.module.scss';
import { calculateBoardFeet, calculateCostFromBF } from '../utils/calculationsUtils';

interface PropTypes {
	lumberName?: string;
	species: string;
	numOfPieces: number;
	thickness: number;
	width: number;
	length: number;
	price: number;
	tax: number;
}

// TODO: Style the item container for alternating background colors

export default function LumberExpenseListItem({
	lumberName,
	species,
	numOfPieces,
	thickness,
	width,
	length,
	price,
	tax,
}: PropTypes) {
	let boardFeet = calculateBoardFeet({ numOfPieces, thickness, width, length });
	let cost = calculateCostFromBF({ boardFeet, price, tax });

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
