import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import { ProjectType, ExpenseType } from '../types/types';
import LumberExpenseListItem from './LumberExpenseListItem';
import { calculateBoardFeet, calculateCostFromBF } from '../utils/calculationsUtils';
import Modal from './Modal';
import { trpc } from '../utils/trpc';
import GenericExpenseListItem from './GenericExpenseListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface PropsType {
	activeProject: ProjectType | null;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	setTotalExpenseAmount: Dispatch<SetStateAction<number>>;
}

type ExpenseWithId = ExpenseType & { projectId: string };

export default function ExpenseTable({ activeProject, setActiveProject, setTotalExpenseAmount }: PropsType) {
	const [modalOpen, setModalOpen] = useState(false);
	const [expenses, setExpenses] = useState<ExpenseType[]>([{ amount: 0, name: '', cost: 0 }]);

	const ctx = trpc.useContext();
	// trpc api call for creating expenses
	const addExpenses = trpc.expense.addManyExpenses.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
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
		if (expenses.length > 20) {
			alert(
				"Can't add more expense entries at this time. Please submit these expenses and add the rest afterwards."
			);
			return;
		}
		let newInputField = { amount: 0, name: '', cost: 0 };
		setExpenses([...expenses, newInputField]);
	}

	function handleDelete(index: number) {
		let data = [...expenses];
		data.splice(index, 1);
		setExpenses(data);
	}

	function handleCancelExpenses() {
		setExpenses([{ amount: 0, name: '', cost: 0 }]);
		setModalOpen(false);
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
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
				setExpenses([{ amount: 0, name: '', cost: 0 }]);
			}
		}
		// set expenses state to our initial single expense object
	}

	let expensesFormList = expenses.map((expense, index) => {
		return (
			<div className={styles.expenseInputContainer} key={index}>
				<div className={styles.labelInputGroup}>
					<label htmlFor='amount' className={styles.inputLabel}>
						Amount
					</label>
					<input
						className={styles.input}
						type='number'
						autoComplete='off'
						min={0}
						name='amount'
						value={expense.amount ? expense.amount : ''}
						onChange={(e) => handleChange(index, e)}
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
						value={expense.name}
						onChange={(e) => handleChange(index, e)}
					/>
				</div>
				<div className={styles.labelInputGroup}>
					<label htmlFor='cost' className={styles.inputLabel}>
						Cost
					</label>
					<input
						className={styles.input}
						type='number'
						autoComplete='off'
						min={0}
						name='cost'
						value={expense.cost ? expense.cost : ''}
						onChange={(e) => handleChange(index, e)}
					/>
				</div>

				<div className={styles.expenseTotalContainer}>
					<p>Total: </p>
					<p>{expense.amount && expense.cost ? `${(expense.amount * expense.cost).toFixed(2)}` : '0'}</p>
				</div>

				<button
					type='button'
					onClick={(e) => handleDelete(index)}
					className={styles.iconDeleteButton}
					title='delete'
				>
					<FontAwesomeIcon icon={faTrashCan} className={styles.deleteIcon} />
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
					setActiveProject={setActiveProject}
				/>
			);
		});

		genericExpenseList = activeProject.expenses.map((exp) => {
			totalExpense += exp.amount * exp.cost;
			return (
				<GenericExpenseListItem
					setActiveProject={setActiveProject}
					key={exp.id}
					id={exp.id}
					name={exp.name}
					cost={exp.cost}
					amount={exp.amount}
				/>
			);
		});
	}
	setTotalExpenseAmount(totalExpense);

	return (
		<>
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<div className={styles.modalContainer}>
					<h4 className={styles.header}>Add New Project Expenses</h4>
					<form onSubmit={(e) => handleSubmit(e)} className={styles.addExpenseForm}>
						{expensesFormList}
					</form>
					<button onClick={handleAddExpense} className={styles.addExpenseBtn}>
						<FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
						Add Another Expense
					</button>
					<div className={styles.btngroup}>
						<button className={styles.dangerBtn} type='button' onClick={handleCancelExpenses}>
							Cancel
						</button>
						<button className={styles.approveBtn} type='submit' onClick={(e) => handleSubmit(e)}>
							Done
						</button>
					</div>
				</div>
			</Modal>
			<div className={styles.container}>
				<div className={styles.categoryContainer}>
					<div className={styles.flexGroup}>
						<h4 className={styles.category}>Project Expenses</h4>
						<p className={styles.categoryDescription}>Lumber and Project-specific costs</p>
					</div>
					<button onClick={handleClick} className={styles.addButton}>
						Add Expense
					</button>
				</div>
				<div className={styles.list}>
					{lumberListItems} {genericExpenseList}
				</div>
			</div>
		</>
	);
}
