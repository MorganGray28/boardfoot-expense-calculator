import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import { ProjectType, ExpenseType } from '../types/types';
import LumberExpenseListItem from './LumberExpenseListItem';
import { calculateBoardFeet, calculateCostFromBF } from '../utils/calculationsUtils';
import Modal from './Modal';
import { trpc } from '../utils/trpc';
import GenericExpenseListItem from './GenericExpenseListItem';

interface PropsType {
	activeProject: ProjectType | undefined;
}

type ExpenseWithId = ExpenseType & { projectId: string };

export default function ExpenseTable({ activeProject }: PropsType) {
	const [modalOpen, setModalOpen] = useState(false);
	const [expenses, setExpenses] = useState<ExpenseType[]>([{ amount: 0, name: '', cost: 0 }]);

	const ctx = trpc.useContext();
	// trpc api call for creating expenses
	const addExpenses = trpc.expense.addManyExpenses.useMutation({
		onSuccess: () => {
			ctx.user.getProjectsById.invalidate();
		},
		onSettled: () => {
			setModalOpen(false);
		},
	});

	function handleClick() {
		setModalOpen(true);
	}

	function handleChange(index: number, e: React.FormEvent<HTMLInputElement>) {
		let data = [...expenses];
		let property = e.currentTarget.name;
		if (data && data[index]) {
			if (property === 'amount' || property === 'cost') {
				data[index]![property] = parseFloat(parseFloat(e.currentTarget.value).toFixed(2));
			} else {
				data[index]![property] = e.currentTarget.value;
			}
		}
		setExpenses(data);
	}

	function handleAddExpense() {
		let newInputField = { amount: 0, name: '', cost: 0 };
		setExpenses([...expenses, newInputField]);
	}

	function handleDelete(index: number) {
		console.log('delete input at index ' + index);
		let data = [...expenses];
		data.splice(index, 1);
		console.log(data);
		setExpenses(data);
	}

	function handleCancelExpenses() {
		setExpenses([{ amount: 0, name: '', cost: 0 }]);
		setModalOpen(false);
	}

	function handleSubmitExpenses() {
		// check if there are any invalid fields, if so, alert user to use valid inputs
		let invalidInput = false;
		for (let expense of expenses) {
			if (expense.amount <= 0 || expense.cost < 0 || !expense.name) {
				invalidInput = true;
			}
		}
		// submit expenses array to backend trpc route to createMany expenses for our active project
		if (invalidInput) {
			alert("Please make sure the expense inputs aren't blank or invalid");
		} else {
			if (activeProject && activeProject.id) {
				// add projectId to our ExpenseType
				let expensesWithProjectId = expenses.map((expense) => {
					expense.projectId! = activeProject.id;
					return expense as ExpenseWithId;
				});
				addExpenses.mutateAsync(expensesWithProjectId);
				console.log(expensesWithProjectId);
				setExpenses([{ amount: 0, name: '', cost: 0 }]);
			}
		}
		// set expenses state to our initial single expense object
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		console.log(expenses);
	}

	let expensesFormList = expenses.map((expense, index) => {
		return (
			<div className={styles.expenseInputContainer} key={index}>
				<input
					type='number'
					min={0}
					name='amount'
					value={expense.amount ? expense.amount : ''}
					placeholder='amount'
					onChange={(e) => handleChange(index, e)}
				/>
				<input
					type='text'
					name='name'
					value={expense.name}
					placeholder='name'
					onChange={(e) => handleChange(index, e)}
				/>
				<input
					type='number'
					min={0}
					name='cost'
					value={expense.cost ? expense.cost : ''}
					placeholder='cost'
					onChange={(e) => handleChange(index, e)}
				/>

				<p>Total: </p>

				<button type='button' onClick={(e) => handleDelete(index)}>
					Delete
				</button>
			</div>
		);
	});

	// Calculate Expense Totals and display each Expense Item
	let lumberListItems;
	let genericExpenseList;
	let totalExpense = 0;
	if (activeProject) {
		lumberListItems = activeProject.lumber.map((l) => {
			let boardFeet = calculateBoardFeet({
				numOfPieces: l.numOfPieces,
				thickness: l.thickness,
				width: l.width,
				length: l.length,
			});
			let cost = calculateCostFromBF({ boardFeet: boardFeet, price: l.price, tax: l.tax });
			totalExpense += cost;
			return (
				<LumberExpenseListItem
					key={l.id}
					id={l.id}
					name={l.name}
					species={l.species}
					numOfPieces={l.numOfPieces}
					thickness={l.thickness}
					width={l.width}
					length={l.length}
					price={l.price}
					tax={l.tax}
				/>
			);
		});

		genericExpenseList = activeProject.expenses.map((exp) => {
			totalExpense += exp.amount * exp.cost;
			return (
				<GenericExpenseListItem
					key={exp.id}
					id={exp.id}
					name={exp.name}
					cost={exp.cost}
					amount={exp.amount}
				/>
			);
		});
	}

	return (
		<>
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<div className={styles.modalContainer}>
					<h4 className={styles.header}>Add New Project Expenses</h4>
					<form onSubmit={(e) => handleSubmit(e)}>{expensesFormList}</form>
					<button onClick={handleAddExpense}>Add Another Expense</button>
					<div className={styles.btngroup}>
						<button className='cancel-btn' onClick={handleCancelExpenses}>
							Cancel
						</button>
						<button className='done-btn' onClick={handleSubmitExpenses}>
							Done
						</button>
					</div>
				</div>
			</Modal>
			<div className={styles.container}>
				<div className={styles.categoryContainer}>
					<div className={styles.flexGroup}>
						<h4 className={styles.category}>Project Expenses</h4>
						<p className={styles.categoryDescription}>List of all expenses for this Project</p>
					</div>
					<button onClick={handleClick}>Add Expense</button>
				</div>
				<div className={styles.list}>
					{lumberListItems} {genericExpenseList}
				</div>
				<p>Total Expenses:</p>
				<p>{totalExpense}</p>
			</div>
		</>
	);
}
