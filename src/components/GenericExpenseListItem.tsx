import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import styles from '../styles/GenericExpenseListItem.module.scss';
import { trpc } from '../utils/trpc';
import { ProjectType } from '../types/types';
import { checkForIdenticalObjects } from '../utils/utils';

type PropsType = {
	id: string;
	name: string;
	cost: number;
	amount: number;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
};

function GenericExpenseListItem({ id, name, cost, amount, setActiveProject }: PropsType) {
	const [isEditingExpense, setIsEditingExpense] = useState(false);
	const initialValues = { name, cost, amount };
	const [values, setValues] = useState(initialValues);
	const ctx = trpc.useContext();
	const deleteExpense = trpc.expense.deleteExpense.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
			ctx.user.getProjectsById.invalidate();
		},
	});

	const editGenericExpense = trpc.expense.editGenericExpense.useMutation({
		onSuccess: (data) => {
			ctx.user.getProjectsById.invalidate();
			setIsEditingExpense(false);
			if (data) {
				setActiveProject(data);
			}
		},
	});

	function handleDelete() {
		// send mutation for expense.deleteById using our id prop as input for api call
		deleteExpense.mutateAsync(id);
	}

	function handleCancel() {
		setValues(initialValues);
		setIsEditingExpense(false);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.name === 'name') {
			setValues({ ...values, [e.target.name]: e.target.value });
		} else {
			if (!e.target.value) {
				setValues({ ...values, [e.target.name]: 0 });
			} else {
				setValues({ ...values, [e.target.name]: parseFloat(e.target.value) });
			}
		}
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!values.amount || !values.cost || !values.name) {
			alert('Please fill inputs');
		} else if (checkForIdenticalObjects(values, initialValues)) {
			setIsEditingExpense(false);
		} else {
			editGenericExpense.mutate({ ...values, id });
			setIsEditingExpense(false);
		}
	}

	if (isEditingExpense) {
		return (
			<div className={styles.container}>
				<form onSubmit={(e) => handleSubmit(e)} noValidate>
					<label htmlFor='amount'>Amount</label>
					<input type='number' name='amount' value={values.amount || ''} onChange={handleChange} />
					<label htmlFor='name'>Name</label>
					<input type='text' name='name' value={values.name} onChange={handleChange} />
					<label htmlFor='cost'>Cost</label>
					<input type='number' name='cost' value={values.cost || ''} onChange={handleChange} />

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
				<div className={styles.flexContainer}>
					<p className={styles.listItem}>{amount}</p>
					<p className={styles.listItem}>${cost}/each</p>
					<p className={styles.listItem}>{name}</p>
					<div className='flex-vertical-container'>
						<p className={styles.listItem}>Total:</p>
						<p className={styles.listItem}>${(amount * cost).toFixed(2)}</p>
					</div>
				</div>
				<button onClick={() => setIsEditingExpense(true)}>Edit</button>
				<button onClick={handleDelete} disabled={deleteExpense.isLoading}>
					Delete
				</button>
			</div>
		);
	}
}

export default GenericExpenseListItem;
