import React, { type ChangeEvent, type Dispatch, type SetStateAction, useState } from 'react';
import styles from '../styles/GenericExpenseListItem.module.scss';
import { trpc } from '../utils/trpc';
import type { ProjectType } from '../types/types';
import { checkForIdenticalObjects } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import toast from 'react-hot-toast';

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
			toast.success('Deleted!');
		},
	});

	const editGenericExpense = trpc.expense.editGenericExpense.useMutation({
		onSuccess: (data) => {
			ctx.user.getProjectsById.invalidate();
			setIsEditingExpense(false);
			if (data) {
				setActiveProject(data);
			}
			toast.success('Updated!');
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
			toast.error('Please fill in inputs');
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
					<div className={styles.inputFlexContainer}>
						<div className={`${styles.labelInputGroup} ${styles.flexShrink}`}>
							<label htmlFor='amount' className={styles.inputLabel}>
								Amount
							</label>
							<input
								className={styles.input}
								type='number'
								autoComplete='off'
								id='amount'
								name='amount'
								value={values.amount || ''}
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
								value={values.name}
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
								autoComplete='off'
								id='cost'
								name='cost'
								value={values.cost || ''}
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
				<div className={styles.flexContainer}>
					<div className={styles.listItemContainer}>
						<p className={styles.listItem}>{amount}</p>
					</div>
					<div className={styles.listItemContainer}>
						<p className={styles.listItem}>{name}</p>
					</div>
					<div className={styles.listItemContainer}>
						<p className={styles.listItem}>
							${cost} <br /> /each
						</p>
					</div>
					<div className={styles.listItemContainer}>
						<p className={styles.listItem}>Total:</p>
						<p className={styles.listItem}>${(amount * cost).toFixed(2)}</p>
					</div>
				</div>
				<div className={styles.buttonGroup}>
					<button onClick={() => setIsEditingExpense(true)} className={styles.iconEditButton} title='edit'>
						<FontAwesomeIcon icon={faPenToSquare} className={styles.editIcon} />
					</button>
					<button
						onClick={handleDelete}
						disabled={deleteExpense.isLoading}
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

export default GenericExpenseListItem;
