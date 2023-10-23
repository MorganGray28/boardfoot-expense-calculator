import React, { useState } from 'react';
import styles from '../styles/ConsumableListItem.module.scss';
import { trpc } from '../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

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
					<div className={styles.inputFlexContainer}>
						<div className={`${styles.labelInputGroup} ${styles.flexShrink}`}>
							<label htmlFor='amount' className={styles.inputLabel}>
								Amount
							</label>
							<input
								className={styles.input}
								type='number'
								name='amount'
								autoComplete='off'
								id='amount'
								value={editInputFields.amount || ''}
								onChange={handleChange}
							/>
						</div>
						<div className={styles.labelInputGroup}>
							<label htmlFor='name' className={styles.inputLabel}>
								Name
							</label>
							<input
								className={styles.input}
								type='text'
								autoComplete='off'
								name='name'
								id='name'
								value={editInputFields.name}
								onChange={handleChange}
							/>
						</div>
						<div className={`${styles.labelInputGroup} ${styles.flexShrink}`}>
							<label htmlFor='cost' className={styles.inputLabel}>
								Cost
							</label>
							<input
								className={styles.input}
								type='number'
								name='cost'
								autoComplete='off'
								id='cost'
								value={editInputFields.cost || ''}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className={styles.formButtonGroup}>
						<button className={styles.dangerBtn} type='button' onClick={handleCancel}>
							Cancel
						</button>
						<button className={styles.approveBtn} type='submit' disabled={isLoading}>
							Done
						</button>
					</div>
				</form>
			</div>
		);
	} else {
		return (
			<div className={styles.container}>
				<h2 className={styles.name}>{name}</h2>
				<p className={styles.percentage}>{amount}%</p>
				<p className={styles.cost}>${cost.toFixed(2)}</p>
				<button onClick={() => setIsEditing(true)} className={styles.iconEditButton} title='edit'>
					<FontAwesomeIcon icon={faPenToSquare} className={styles.editIcon} />
				</button>
				<button
					onClick={handleDelete}
					disabled={isDeleting}
					className={styles.iconDeleteButton}
					title='delete'
				>
					<FontAwesomeIcon icon={faTrashCan} className={styles.deleteIcon} />
				</button>
			</div>
		);
	}
}
