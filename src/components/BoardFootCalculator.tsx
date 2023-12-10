import React, { type ChangeEvent, type FormEvent, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import type { BoardFeetType } from '../types/types';
import { calculateBoardFeet } from '../utils/calculationsUtils';
import styles from '../styles/boardFootCalculator.module.scss';

import hamburgerCloseIcon from '../../public/hamburger-close-icon.svg';
import hamburgerIcon from '../../public/hamburger-icon.svg';

type PropsType = {
	handleModal: (values: BoardFeetType) => void;
};

function BoardFootCalculator({ handleModal }: PropsType) {
	const initialValues: BoardFeetType = {
		numOfPieces: 0,
		thickness: 0,
		width: 0,
		length: 0,
		name: '',
		species: '',
		price: 0,
		tax: 0,
	};

	const initialInputErrorValues = {
		numOfPieces: false,
		thickness: false,
		width: false,
		length: false,
		species: false,
	};

	const { data: session } = useSession();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [values, setValues] = useState(initialValues);
	const [inputErrors, setInputErrors] = useState(initialInputErrorValues);
	let boardFeet: number | undefined = 0;
	let preTax = 0;
	let postTax = 0;
	let totalCost = 0;
	let formattedTax = 0;
	if (values.numOfPieces && values.thickness && values.width && values.length) {
		const { numOfPieces, thickness, width, length, price, tax } = values;
		// T" x W" x L" ÷ 144 = Bd. Ft.
		boardFeet = calculateBoardFeet({ numOfPieces, thickness, width, length });
		if (boardFeet && price) {
			preTax = parseFloat((boardFeet * price).toFixed(2));
			if (tax) {
				formattedTax = parseFloat(((tax / 100) * preTax).toFixed(2));
				postTax = (tax / 100) * preTax + preTax;
				postTax = parseFloat(postTax.toFixed(2));
				totalCost = postTax;
			} else {
				totalCost = preTax;
			}
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.name === 'species' || e.target.name === 'name') {
			setValues({ ...values, [e.target.name]: e.target.value });

			// if changing input that is required, reset error state for that input when user changes its value
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

	function handleClearForm() {
		setValues(initialValues);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		let isValid = true;
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

		if (isValid) {
			setSidebarOpen(false);
			handleModal(values);
			handleClearForm();
		}
	}

	return (
		<>
			{!sidebarOpen && (
				<Image
					// priority
					className={styles.hamburgerIcon}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					src={hamburgerIcon}
					alt='hamburger menu icon'
					width={22}
					height={22}
				/>
			)}
			<div className={sidebarOpen ? `${styles.sidebarOpen} ${styles.container}` : `${styles.container}`}>
				{sidebarOpen && (
					<Image
						// priority
						className={styles.sidebarIcon}
						onClick={() => setSidebarOpen(!sidebarOpen)}
						src={hamburgerCloseIcon}
						alt='hamburger menu close icon'
						width={22}
						height={22}
					/>
				)}
				<div className={styles.stickyContainer}>
					<form className={styles.calculatorForm} onSubmit={handleSubmit}>
						<div className={styles.boardfootContainer}>
							<p className={styles.subheading}>Board Feet Calculator</p>
							<div
								className={
									`${styles.labelInputGroup}` + (inputErrors.numOfPieces ? ` ${styles.inputError}` : '')
								}
							>
								<div className={styles.inputLabelFlexGroup}>
									<label className={styles.inputLabel} htmlFor='numOfPieces'>
										No. of Pieces
									</label>
									{inputErrors.numOfPieces && <p className={styles.errorMessage}>*Required</p>}
								</div>
								<input
									id='numOfPieces'
									name='numOfPieces'
									autoComplete='off'
									value={values.numOfPieces || ''}
									onChange={handleChange}
									type='number'
								/>
							</div>
							<div
								className={
									`${styles.labelInputGroup}` + (inputErrors.thickness ? ` ${styles.inputError}` : '')
								}
							>
								<div className={styles.inputLabelFlexGroup}>
									<label className={styles.inputLabel} htmlFor='thickness'>
										Thickness
									</label>
									{inputErrors.thickness && <p className={styles.errorMessage}>*Required</p>}
								</div>
								<div className={styles.inputUnitsGroup}>
									<input
										id='thickness'
										name='thickness'
										autoComplete='off'
										value={values.thickness || ''}
										onChange={handleChange}
										type='number'
									/>
									<span>in</span>
								</div>
								<div className={styles.quarterThicknessContainer}>
									<p
										onClick={() => {
											setValues({ ...values, thickness: 1 });
											setInputErrors({ ...inputErrors, thickness: false });
										}}
									>
										4/4
									</p>
									<p
										onClick={() => {
											setValues({ ...values, thickness: 1.5 });
											setInputErrors({ ...inputErrors, thickness: false });
										}}
									>
										6/4
									</p>
									<p
										onClick={() => {
											setValues({ ...values, thickness: 2 });
											setInputErrors({ ...inputErrors, thickness: false });
										}}
									>
										8/4
									</p>
								</div>
							</div>
							<div
								className={`${styles.labelInputGroup}` + (inputErrors.width ? ` ${styles.inputError}` : '')}
							>
								<div className={styles.inputLabelFlexGroup}>
									<label className={styles.inputLabel} htmlFor='width'>
										Width
									</label>
									{inputErrors.width && <p className={styles.errorMessage}>*Required</p>}
								</div>
								<div className={styles.inputUnitsGroup}>
									<input
										id='width'
										name='width'
										autoComplete='off'
										value={values.width || ''}
										onChange={handleChange}
										type='number'
									/>
									<span>in</span>
								</div>
							</div>
							<div
								className={
									`${styles.labelInputGroup} ${styles.length}` +
									(inputErrors.length ? ` ${styles.inputError}` : '')
								}
							>
								<div className={styles.inputLabelFlexGroup}>
									<label className={styles.inputLabel} htmlFor='length'>
										Length
									</label>
									{inputErrors.length && <p className={styles.errorMessage}>*Required</p>}
								</div>
								<div className={styles.inputUnitsGroup}>
									<input
										id='length'
										name='length'
										autoComplete='off'
										value={values.length || ''}
										onChange={handleChange}
										type='number'
									/>
									<span>in</span>
								</div>
							</div>
							<div className={styles.labelInputGroup}>
								<p>Total:</p>
								<p>{boardFeet} BF</p>
							</div>
						</div>
						<button className={styles.clearButton} type='button' onClick={handleClearForm}>
							Clear
						</button>
						<div className={styles.boardfootContainer}>
							<p className={styles.subheading}>Cost</p>
							<div className={styles.labelInputGroup}>
								<label className={styles.inputLabel} htmlFor='name'>
									Description <span className={styles.optionalSpan}>(optional)</span>
								</label>
								<input
									type='text'
									autoComplete='off'
									id='name'
									name='name'
									onChange={handleChange}
									value={values.name}
									placeholder='e.g. Table Legs'
								/>
							</div>
							<div
								className={`${styles.labelInputGroup}` + (inputErrors.species ? ` ${styles.inputError}` : '')}
							>
								<div className={styles.inputLabelFlexGroup}>
									<label className={styles.inputLabel} htmlFor='species'>
										Species
									</label>
									{inputErrors.species && <p className={styles.errorMessage}>*Required</p>}
								</div>
								<input
									id='species'
									type='text'
									autoComplete='off'
									name='species'
									onChange={handleChange}
									value={values.species}
								/>
							</div>
							<div className={styles.labelInputGroup}>
								<label className={styles.inputLabel} htmlFor='price'>
									Price
								</label>
								<input
									id='price'
									type='number'
									autoComplete='off'
									name='price'
									onChange={handleChange}
									value={values.price || ''}
								/>
							</div>
							<div className={`${styles.labelInputGroup}`}>
								<label className={styles.inputLabel} htmlFor='tax'>
									Tax
								</label>
								<div className={styles.inputUnitsGroup}>
									<input
										id='tax'
										type='number'
										autoComplete='off'
										name='tax'
										onChange={handleChange}
										value={values.tax || ''}
									/>
									<span>%</span>
								</div>
							</div>
							<div className={`${styles.tax}`}>
								<p>${preTax}</p>
								<p>+ ${formattedTax || 0} tax</p>
							</div>
							<div className={styles.labelInputGroup}>
								<p>Total Cost:</p>
								<p>${totalCost}</p>
							</div>
						</div>
						<button disabled={!session} type='submit' className={styles.primaryButton}>
							Add to Project
						</button>
						{!session && <p className={styles.helpMessage}>please sign in to add lumber to a project</p>}
					</form>
				</div>
			</div>
		</>
	);
}

export default BoardFootCalculator;
