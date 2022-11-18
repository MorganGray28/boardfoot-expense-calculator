import React, { ChangeEvent, FormEvent, useState } from 'react';

function BoardFootCalculator() {
	const [numOfPieces, setNumOfPieces] = useState('');
	const [thickness, setThickness] = useState('');
	const [width, setWidth] = useState('');
	const [length, setLength] = useState('');

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		let name = e.target.name;
		if (name === 'numOfPieces') {
			setNumOfPieces(e.target.value);
		} else if (name === 'thickness') {
			setThickness(e.target.value);
		} else if (name === 'width') {
			setWidth(e.target.value);
		} else if (name === 'length') {
			setLength(e.target.value);
		}
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(numOfPieces);
		console.log(thickness);
		console.log(width);
		console.log(length);

		// clear the form after submit
		handleClearForm();
	}

	function handleClearForm() {
		setNumOfPieces('');
		setThickness('');
		setWidth('');
		setLength('');
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className='boardfoot-container'>
					<label htmlFor='numOfPieces'>Number of Pieces</label>
					<input name='numOfPieces' value={numOfPieces} onChange={handleChange} type='number' />

					<label htmlFor='thickness'>Thickness</label>
					<input
						name='thickness'
						value={thickness}
						placeholder='inches'
						onChange={handleChange}
						type='number'
					/>

					<label htmlFor='width'>Width</label>
					<input name='width' value={width} placeholder='inches' onChange={handleChange} type='number' />

					<label htmlFor='length'>Length</label>
					<input name='length' value={length} placeholder='inches' onChange={handleChange} type='number' />
				</div>

				<p>Cost</p>
				<div className='cost-container'>
					<label>Species</label>
					<input type='text' />

					<label>Price</label>
					<input type='text' />

					<span>Total Cost</span>
					<span>$45</span>
				</div>

				<button onClick={handleClearForm}>Clear</button>
				<button type='submit'>Add to Project</button>
			</form>
		</div>
	);
}

export default BoardFootCalculator;
