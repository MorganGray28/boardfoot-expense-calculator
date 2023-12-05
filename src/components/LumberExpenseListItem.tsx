import React, { useState, type Dispatch, type SetStateAction, type ChangeEvent } from 'react';
import styles from '../styles/LumberExpenseListItem.module.scss';
import { calculateBoardFeet, calculateCostFromBF } from '../utils/calculationsUtils';
import { checkForIdenticalObjects } from '../utils/utils';
import { trpc } from '../utils/trpc';
import type { ProjectType } from '../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import toast from 'react-hot-toast';

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

	const initialInputErrorValues = {
		numOfPieces: false,
		thickness: false,
		width: false,
		length: false,
		species: false,
	};
	const [inputErrors, setInputErrors] = useState(initialInputErrorValues);

	const boardFeet = calculateBoardFeet({ numOfPieces, thickness, width, length });
	const cost = calculateCostFromBF({ boardFeet, price, tax });
	const ctx = trpc.useContext();
	const deleteLumber = trpc.lumber.deleteDimensionLumber.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
			ctx.user.getProjectsById.invalidate();
			toast.success('Deleted!');
		},
		onError: () => toast.error('Error, please try again'),
	});

	const editLumberExpense = trpc.lumber.editDimensionLumber.useMutation({
		onSuccess: (data) => {
			ctx.user.getProjectsById.invalidate();
			setIsEditingExpense(false);
			if (data) {
				setActiveProject(data);
			}
			toast.success('Updated!');
		},
		onError: () => toast.error('Error, please try again'),
	});

	function handleDelete() {
		deleteLumber.mutate(id);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.name === 'species' || e.target.name === 'name') {
			setValues({ ...values, [e.target.name]: e.target.value });

			if (e.target.name === 'species') {
				setInputErrors({ ...inputErrors, species: false });
			}
		} else if (e.target.name === 'numOfPieces') {
			setValues({ ...values, [e.target.name]: parseInt(e.target.value) });
			setInputErrors({ ...inputErrors, numOfPieces: false });
		} else {
			if (e.target.name === 'thickness') {
				setInputErrors({ ...inputErrors, thickness: false });
			} else if (e.target.name === 'width') {
				setInputErrors({ ...inputErrors, width: false });
			} else if (e.target.name === 'length') {
				setInputErrors({ ...inputErrors, length: false });
			}

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
		let isValid = true;

		// Check to see if any of the required values are empty or unchanged from initial values to avoid unnecessary api call
		if (!values.length || !values.numOfPieces || !values.species || !values.thickness || !values.width) {
			if (!values.numOfPieces) {
				isValid = false;
				setInputErrors((prevState) => {
					return { ...prevState, numOfPieces: true };
				});
			}

			if (!values.thickness) {
				isValid = false;
				setInputErrors((prevState) => {
					return { ...prevState, thickness: true };
				});
			}

			if (!values.width) {
				isValid = false;
				setInputErrors((prevState) => {
					return { ...prevState, width: true };
				});
			}

			if (!values.length) {
				isValid = false;
				setInputErrors((prevState) => {
					return { ...prevState, length: true };
				});
			}

			if (!values.species) {
				isValid = false;
				setInputErrors((prevState) => {
					return { ...prevState, species: true };
				});
			}
			toast.error('Please fill out required inputs', { id: `expenseError${id}` });
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
					<div className={styles.formFlexWrapper}>
						<div
							className={
								`${styles.labelInputGroup}` + (inputErrors.numOfPieces ? ` ${styles.inputError}` : '')
							}
						>
							<label className={styles.inputLabel} htmlFor='numOfPieces'>
								No. of Pieces
							</label>
							<input
								className={styles.input}
								id='numOfPieces'
								name='numOfPieces'
								autoComplete='off'
								type='number'
								value={values.numOfPieces || ''}
								onChange={handleChange}
							/>
						</div>
						<div
							className={`${styles.labelInputGroup}` + (inputErrors.thickness ? ` ${styles.inputError}` : '')}
						>
							<label className={styles.inputLabel} htmlFor='thickness'>
								Thickness
							</label>
							<input
								className={styles.input}
								id='thickness'
								name='thickness'
								autoComplete='off'
								type='number'
								value={values.thickness || ''}
								onChange={handleChange}
							/>
						</div>
						<div className={`${styles.labelInputGroup}` + (inputErrors.width ? ` ${styles.inputError}` : '')}>
							<label className={styles.inputLabel} htmlFor='width'>
								Width
							</label>
							<input
								className={styles.input}
								id='width'
								name='width'
								autoComplete='off'
								type='number'
								value={values.width || ''}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className={styles.formFlexWrapper}>
						<div
							className={`${styles.labelInputGroup}` + (inputErrors.length ? ` ${styles.inputError}` : '')}
						>
							<label className={styles.inputLabel} htmlFor='length'>
								Length
							</label>
							<input
								className={styles.input}
								id='length'
								name='length'
								autoComplete='off'
								type='number'
								value={values.length || ''}
								onChange={handleChange}
							/>
						</div>
						<div className={styles.labelInputGroup}>
							<label className={styles.inputLabel} htmlFor='price'>
								Price
							</label>
							<input
								className={styles.input}
								id='price'
								name='price'
								autoComplete='off'
								type='number'
								value={values.price || ''}
								onChange={handleChange}
							/>
						</div>
						<div className={styles.labelInputGroup}>
							<label className={styles.inputLabel} htmlFor='tax'>
								Tax
							</label>
							<input
								className={styles.input}
								id='tax'
								name='tax'
								autoComplete='off'
								type='number'
								value={values.tax || ''}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className={styles.formFlexWrapper}>
						<div className={styles.labelInputGroup}>
							<label className={styles.inputLabel} htmlFor='name'>
								Description
							</label>
							<input
								className={styles.input}
								id='name'
								name='name'
								autoComplete='off'
								type='text'
								value={values.name || ''}
								onChange={handleChange}
							/>
						</div>
						<div
							className={`${styles.labelInputGroup}` + (inputErrors.species ? ` ${styles.inputError}` : '')}
						>
							<label className={styles.inputLabel} htmlFor='species'>
								Species
							</label>
							<input
								className={styles.input}
								id='species'
								name='species'
								autoComplete='off'
								type='text'
								value={values.species || ''}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className={styles.formButtonGroup}>
						<button className={styles.dangerBtn} type='button' onClick={handleCancel}>
							Cancel
						</button>
						<button className={styles.approveBtn} type='submit'>
							Save
						</button>
					</div>
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
						<p className={styles.thickness}>
							{thickness}
							{`"`} thick
						</p>
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
