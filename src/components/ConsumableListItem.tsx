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

	const ctx = trpc.useContext();
	const updateConsumable = trpc.consumable.updateConsumable.useMutation({
		onSuccess: () => ctx.consumable.getAllConsumables.invalidate(),
		onSettled: () => setIsEditing(false),
	});
	let { isLoading } = updateConsumable;
	const { mutateAsync: deleteConsumable, isLoading: isDeleting } =
		trpc.consumable.deleteConsumable.useMutation({
			onSuccess: () => ctx.consumable.getAllConsumables.invalidate(),
		});

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

	function handleCancel() {
		setEditInputFields({ name, amount, cost });
		setIsEditing(false);
	}

	function handleDelete() {
		deleteConsumable(id);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// if nothing is changed, we don't make an api call
		if (name === editInputFields.name && cost === editInputFields.cost && amount === editInputFields.amount) {
			setIsEditing(false);
		} else if (!editInputFields.name || !editInputFields.cost || !editInputFields.amount) {
			alert('Please fill out empty input fields');
		} else {
			updateConsumable.mutateAsync({ ...editInputFields, id });
		}
	}

	if (isEditing) {
		return (
			<div className={styles.container}>
				<form className={styles.editForm} onSubmit={handleSubmit} noValidate>
					<input
						type='text'
						autoComplete='off'
						name='name'
						id='name'
						value={editInputFields.name}
						onChange={handleChange}
					/>
					<input
						type='number'
						name='amount'
						autoComplete='off'
						id='amount'
						value={editInputFields.amount || ''}
						onChange={handleChange}
					/>
					<input
						type='number'
						name='cost'
						autoComplete='off'
						id='cost'
						value={editInputFields.cost || ''}
						onChange={handleChange}
					/>
					<button type='button' onClick={handleCancel}>
						Cancel
					</button>
					<button type='submit' disabled={isLoading}>
						Done
					</button>
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
				<button onClick={handleDelete} disabled={isDeleting}>
					X
				</button>
			</div>
		);
	}
}
