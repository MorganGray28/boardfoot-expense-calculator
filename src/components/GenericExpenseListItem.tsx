import React from 'react';
import styles from '../styles/GenericExpenseListItem.module.scss';
import { trpc } from '../utils/trpc';

type PropsType = {
	id: string;
	name: string;
	cost: number;
	amount: number;
};

function GenericExpenseListItem({ id, name, cost, amount }: PropsType) {
	const ctx = trpc.useContext();
	const deleteExpense = trpc.expense.deleteExpense.useMutation({
		onSettled: () => ctx.user.getProjectsById.invalidate(),
	});

	function handleDelete() {
		// send mutation for expense.deleteById using our id prop as input for api call
		deleteExpense.mutateAsync(id);
	}

	return (
		<div className={styles.container}>
			<div className={styles.flexContainer}>
				<p className={styles.listItem}>{amount}</p>
				<p className={styles.listItem}>${cost}/each</p>
				<p className={styles.listItem}>{name}</p>
				<div className='flex-vertical-container'>
					<p className={styles.listItem}>Total:</p>
					<p className={styles.listItem}>${amount * cost}</p>
				</div>
			</div>
			<button onClick={handleDelete} disabled={deleteExpense.isLoading}>
				Delete
			</button>
		</div>
	);
}

export default GenericExpenseListItem;
