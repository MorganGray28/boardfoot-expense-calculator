import React, { Dispatch, SetStateAction } from 'react';
import styles from '../styles/LumberExpenseListItem.module.scss';
import { calculateBoardFeet, calculateCostFromBF } from '../utils/calculationsUtils';
import { trpc } from '../utils/trpc';
import { ProjectType } from '../types/types';

interface PropTypes {
	id: string;
	name?: string | null;
	species: string;
	numOfPieces: number;
	thickness: number;
	width: number;
	length: number;
	price: number;
	tax: number;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
}

// TODO: Style the item container for alternating background colors

export default function LumberExpenseListItem({
	id,
	name,
	species,
	numOfPieces,
	thickness,
	width,
	length,
	price,
	tax,
	setActiveProject,
}: PropTypes) {
	let boardFeet = calculateBoardFeet({ numOfPieces, thickness, width, length });
	let cost = calculateCostFromBF({ boardFeet, price, tax });
	const ctx = trpc.useContext();
	const deleteLumber = trpc.lumber.deleteDimensionLumber.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
			ctx.user.getProjectsById.invalidate();
		},
	});

	function handleDelete() {
		deleteLumber.mutate(id);
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.name}>{name}</h2>
			<div className={styles.flexContainer}>
				<div className={styles.speciesThicknessGroup}>
					<p className={styles.species}>{species}</p>
					<p className={styles.thickness}>{thickness}"</p>
				</div>
				<p className={styles.boardFeet}>{boardFeet} BF</p>
				<p className={styles.cost}>${cost.toFixed(2)}</p>
			</div>
			<button onClick={handleDelete} disabled={deleteLumber.isLoading}>
				Delete
			</button>
		</div>
	);
}
