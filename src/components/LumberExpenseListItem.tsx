import React, { useState, Dispatch, SetStateAction, ChangeEvent } from 'react';
import styles from '../styles/LumberExpenseListItem.module.scss';
import { calculateBoardFeet, calculateCostFromBF } from '../utils/calculationsUtils';
import { checkForIdenticalObjects } from '../utils/utils';
import { trpc } from '../utils/trpc';
import { ProjectType } from '../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

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
	const [isEditingExpense, setIsEditingExpense] = useState(false);
	const initialValues = {
		numOfPieces,
		thickness,
		width,
		length,
		name: name || undefined,
		species,
		price,
		tax,
	};
	const [values, setValues] = useState(initialValues);

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

	const editLumberExpense = trpc.lumber.editDimensionLumber.useMutation({
		onSuccess: (data) => {
			ctx.user.getProjectsById.invalidate();
			setIsEditingExpense(false);
			if (data) {
				setActiveProject(data);
			}
		},
	});

	function handleDelete() {
		deleteLumber.mutate(id);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.name === 'species' || e.target.name === 'name') {
			setValues({ ...values, [e.target.name]: e.target.value });
		} else if (e.target.name === 'numOfPieces') {
			setValues({ ...values, [e.target.name]: parseInt(e.target.value) });
		} else {
			if (!e.target.value) {
				setValues({ ...values, [e.target.name]: 0 });
			} else {
				setValues({ ...values, [e.target.name]: parseFloat(e.target.value) });
			}
		}
	}

	function handleCancel() {
		setValues(initialValues);
		setIsEditingExpense(false);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		// Check to see if any of the required values are empty or unchanged from initial values to avoid unnecessary api call
		if (!values.length || !values.numOfPieces || !values.species || !values.thickness || !values.width) {
			alert('Please fill out required inputs');
		} else if (checkForIdenticalObjects(values, initialValues)) {
			setIsEditingExpense(false);
		} else {
			// call a trpc api call to submit an update call
			editLumberExpense.mutate({ ...values, id });
		}
	}

	if (isEditingExpense) {
		return (
			<div className={styles.container}>
				<form onSubmit={(e) => handleSubmit(e)} noValidate>
					<label htmlFor='numOfPieces'>No. of Pieces</label>
					<input
						name='numOfPieces'
						autoComplete='off'
						type='number'
						value={values.numOfPieces || ''}
						onChange={handleChange}
					/>
					<label htmlFor='thickness'>Thickness</label>
					<input
						name='thickness'
						autoComplete='off'
						type='number'
						value={values.thickness || ''}
						onChange={handleChange}
					/>
					<label htmlFor='width'>Width</label>
					<input
						name='width'
						autoComplete='off'
						type='number'
						value={values.width || ''}
						onChange={handleChange}
					/>
					<label htmlFor='length'>Length</label>
					<input
						name='length'
						autoComplete='off'
						type='number'
						value={values.length || ''}
						onChange={handleChange}
					/>
					<label htmlFor='name'>Description</label>
					<input
						name='name'
						autoComplete='off'
						type='text'
						value={values.name || ''}
						onChange={handleChange}
					/>
					<label htmlFor='species'>Species</label>
					<input
						name='species'
						autoComplete='off'
						type='text'
						value={values.species || ''}
						onChange={handleChange}
					/>
					<label htmlFor='price'>Price</label>
					<input
						name='price'
						autoComplete='off'
						type='number'
						value={values.price || ''}
						onChange={handleChange}
					/>
					<label htmlFor='tax'>Tax</label>
					<input
						name='tax'
						autoComplete='off'
						type='number'
						value={values.tax || ''}
						onChange={handleChange}
					/>

					<button type='button' onClick={handleCancel}>
						Cancel
					</button>
					<button type='submit'>Done</button>
				</form>
			</div>
		);
	} else {
		return (
			<div className={styles.container}>
				<h2 className={styles.name}>{name}</h2>
				<div className={styles.flexContainer}>
					<div className={styles.speciesThicknessGroup}>
						<p className={styles.species}>{species}</p>
						<p className={styles.thickness}>{thickness}" thick</p>
					</div>
					<p className={styles.boardFeet}>{boardFeet} BF</p>
					<p className={styles.cost}>${cost.toFixed(2)}</p>
				</div>
				<div className={styles.buttonGroup}>
					<button onClick={() => setIsEditingExpense(true)} className={styles.iconEditButton} title='edit'>
						<FontAwesomeIcon icon={faPenToSquare} className={styles.editIcon} />
					</button>
					<button
						onClick={handleDelete}
						disabled={deleteLumber.isLoading}
						className={styles.iconDeleteButton}
						title='delete'
					>
						<FontAwesomeIcon icon={faTrashCan} className={styles.deleteIcon} />
					</button>
				</div>
			</div>
		);
	}
}
