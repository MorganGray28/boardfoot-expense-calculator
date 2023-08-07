import React, { useState } from 'react';
import styles from '../styles/ConsumableListItem.module.scss';
import { trpc } from '../utils/trpc';

type InputFieldsType = {
	name: string;
	amount: number;
	cost: number;
};

type PropsType = InputFieldsType & { id: string };

export default function ConsumableListItem({ name, amount, cost, id }: PropsType) {
	const [isEditing, setIsEditing] = useState(false);
	const [editInputFields, setEditInputFields] = useState<InputFieldsType>({ name, amount, cost });
	console.log(editInputFields);

	const ctx = trpc.useContext();
	const updateConsumable = trpc.consumable.updateConsumable.useMutation({
		onSuccess: () => ctx.consumable.getAllConsumables.invalidate(),
		onSettled: () => setIsEditing(false),
	});
	let { isLoading } = updateConsumable;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const key = e.currentTarget.name as keyof InputFieldsType;
		let updatedData = { ...editInputFields };
		if (key === 'name') {
			updatedData[key] = e.currentTarget.value;
		} else {
			if (e.currentTarget.value) {
				let formattedNumber = parseFloat(parseFloat(e.currentTarget.value).toFixed(2));
				updatedData[key] = formattedNumber;
			} else {
				updatedData[key] = 0;
			}
		}
		setEditInputFields(updatedData);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// if nothing is changed, we don't make an api call
		if (name === editInputFields.name && cost === editInputFields.cost && amount === editInputFields.amount) {
			setIsEditing(false);
		} else {
			updateConsumable.mutateAsync({ ...editInputFields, id });
		}
	}

	// add edit button to trigger input fields
	// edit toggles isEditing State
	// renders inputs for name, amount, and cost and a done button
	// done button triggers a submit function that calls an updateConsumable api call
	// updateConsumable mutation accepts the updated fields and the id of the consumable item to
	// onSuccess of the updateConsumable useMutation, we'll invalidate our getAllConsumables query
	// TODO: Add a disabled property for the Done button while it's loading
	// Also set isEditing to false after we submit our mutation

	if (isEditing) {
		return (
			<div className={styles.container}>
				<form className={styles.editForm} onSubmit={handleSubmit}>
					<input type='text' name='name' id='name' value={editInputFields.name} onChange={handleChange} />
					<input
						type='number'
						name='amount'
						id='amount'
						value={editInputFields.amount || ''}
						onChange={handleChange}
					/>
					<input
						type='number'
						name='cost'
						id='cost'
						value={editInputFields.cost || ''}
						onChange={handleChange}
					/>
					<button disabled={isLoading}>Done</button>
				</form>
			</div>
		);
	} else {
		return (
			<div className={styles.container}>
				<h2 className={styles.name}>{name}</h2>
				<p className={styles.percentage}>{amount}%</p>
				<p className={styles.cost}>${cost.toFixed(2)}</p>
				<button onClick={() => setIsEditing(true)}>Edit</button>
			</div>
		);
	}
}
