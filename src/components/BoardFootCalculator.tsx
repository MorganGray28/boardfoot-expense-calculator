import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BoardFeetType } from '../types/types';
import { calculateBoardFeet } from '../utils/calculationsUtils';
import styles from '../styles/boardFootCalculator.module.scss';
import { trpc } from '../utils/trpc';

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

	const { data: session } = useSession();

	const [values, setValues] = useState(initialValues);
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

	const postLumber = trpc.lumber.addDimensionLumber.useMutation();

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

	function handleClearForm() {
		setValues(initialValues);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		handleModal(values);
		handleClearForm();
	}

	return (
		<div className={styles.container}>
			<form onSubmit={handleSubmit}>
				<div className={styles.boardfootContainer}>
					<p className={styles.subheading}>Board Feet Calculator</p>
					<div className={styles.labelInputGroup}>
						<label className={styles.inputLabel} htmlFor='numOfPieces'>
							No. of Pieces
						</label>
						<input
							name='numOfPieces'
							value={values.numOfPieces || ''}
							onChange={handleChange}
							type='number'
						/>
					</div>
					<div className={styles.labelInputGroup}>
						<label className={styles.inputLabel} htmlFor='thickness'>
							Thickness
						</label>
						<div className={styles.inputUnitsGroup}>
							<input name='thickness' value={values.thickness || ''} onChange={handleChange} type='number' />
							<span>in</span>
						</div>
						<div className={styles.quarterThicknessContainer}>
							<p onClick={() => setValues({ ...values, thickness: 1 })}>4/4</p>
							<p onClick={() => setValues({ ...values, thickness: 1.5 })}>6/4</p>
							<p onClick={() => setValues({ ...values, thickness: 2 })}>8/4</p>
						</div>
					</div>
					<div className={styles.labelInputGroup}>
						<label className={styles.inputLabel} htmlFor='width'>
							Width
						</label>
						<div className={styles.inputUnitsGroup}>
							<input name='width' value={values.width || ''} onChange={handleChange} type='number' />
							<span>in</span>
						</div>
					</div>
					<div className={`${styles.labelInputGroup} ${styles.length}`}>
						<label className={styles.inputLabel} htmlFor='length'>
							Length
						</label>
						<div className={styles.inputUnitsGroup}>
							<input name='length' value={values.length || ''} onChange={handleChange} type='number' />
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
							id='name'
							name='name'
							onChange={handleChange}
							value={values.name}
							placeholder='e.g. Table Legs'
						/>
					</div>

					<div className={styles.labelInputGroup}>
						<label className={styles.inputLabel} htmlFor='species'>
							Species
						</label>
						<input type='text' name='species' onChange={handleChange} value={values.species} />
					</div>

					<div className={styles.labelInputGroup}>
						<label className={styles.inputLabel} htmlFor='price'>
							Price
						</label>
						<input type='number' name='price' onChange={handleChange} value={values.price || ''} />
					</div>

					<div className={`${styles.labelInputGroup}`}>
						<label className={styles.inputLabel} htmlFor='tax'>
							Tax
						</label>
						<div className={styles.inputUnitsGroup}>
							<input type='number' name='tax' onChange={handleChange} value={values.tax || ''} />
							<span>%</span>
						</div>
					</div>

					{values.tax !== 0 && (
						<div className={`${styles.tax}`}>
							<p>${preTax}</p>
							<p>+ ${formattedTax}</p>
						</div>
					)}

					<div className={styles.labelInputGroup}>
						<p>Total Cost:</p>
						<p>${totalCost}</p>
					</div>
				</div>

				<button
					disabled={!session}
					type='submit'
					className={session ? styles.primaryButton : styles.primaryButtonDisabled}
				>
					Add to Project
				</button>
				{!session && <p className={styles.helpMessage}>please sign in to add lumber to a project</p>}
			</form>
		</div>
	);
}

export default BoardFootCalculator;
