import React, { ChangeEvent, FormEvent, useState } from 'react';
import { BoardFeetData } from '../types/types';
import styles from '../styles/boardFootCalculator.module.css';

function BoardFootCalculator() {
	const initialValues: BoardFeetData = {
		numOfPieces: '',
		thickness: '',
		width: '',
		length: '',
		species: '',
		price: '',
	};

	const [values, setValues] = useState(initialValues);
	let boardFeet: number | undefined = 0;
	let totalCost = 0;
	if (values.numOfPieces && values.thickness && values.width && values.length) {
		const { numOfPieces, thickness, width, length, price } = values;
		// T" x W" x L" ÷ 144 = Bd. Ft.
		boardFeet =
			parseInt(numOfPieces) * ((parseFloat(thickness) * parseFloat(width) * parseFloat(length)) / 144);
		if (boardFeet && price) {
			totalCost = boardFeet * parseFloat(price);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setValues({ ...values, [e.target.name]: e.target.value });
	}

	function handleClearForm() {
		setValues(initialValues);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log('submitting form data');
		console.log(values);
		// clear the form after submit
		handleClearForm();
	}

	return (
		<div className={styles.container}>
			<h4 className={styles.heading}>Board Foot Calculator</h4>
			<p className={styles.subheading}>Board Feet</p>
			<form onSubmit={handleSubmit}>
				<div className={styles.boardfootContainer}>
					<div className={styles.labelInputGroup}>
						<label htmlFor='numOfPieces'>No. of Pieces</label>
						<input name='numOfPieces' value={values.numOfPieces} onChange={handleChange} type='number' />
					</div>

					<div className={styles.labelInputGroup}>
						<label htmlFor='thickness'>Thickness</label>
						<div className={styles.inputUnitsGroup}>
							<input name='thickness' value={values.thickness} onChange={handleChange} type='number' />
							<span>in</span>
						</div>
					</div>

					<label htmlFor='width'>Width</label>
					<input
						name='width'
						value={values.width}
						placeholder='inches'
						onChange={handleChange}
						type='number'
					/>

					<label htmlFor='length'>Length</label>
					<input
						name='length'
						value={values.length}
						placeholder='inches'
						onChange={handleChange}
						type='number'
					/>
					<p>
						Total: <span>{boardFeet}</span>
					</p>
				</div>

				<p>Cost</p>
				<div className='cost-container'>
					<label>Species</label>
					<input type='text' name='species' onChange={handleChange} value={values.species} />

					<label>Price</label>
					<input type='text' name='price' onChange={handleChange} value={values.price} />

					<p>
						Total Cost: <span>{totalCost}</span>
					</p>
				</div>

				<button type='button' onClick={handleClearForm}>
					Clear
				</button>
				<button type='submit'>Add to Project</button>
			</form>
		</div>
	);
}

export default BoardFootCalculator;
