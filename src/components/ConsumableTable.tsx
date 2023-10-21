import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import ConsumableListItem from './ConsumableListItem';
import { useSession } from 'next-auth/react';
import Modal from './Modal';
import { trpc } from '../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

type ConsumableInputType = {
	name: string;
	amount: number;
	cost: number;
	[key: string | number]: string | number;
};

type PropsType = {
	setTotalConsumableAmount: Dispatch<SetStateAction<number>>;
};

type ConsumableInputTypeWithId = ConsumableInputType & { userId: string };

export default function ConsumableTable({ setTotalConsumableAmount }: PropsType) {
	const { data: session } = useSession();
	const [consumables, setConsumables] = useState<ConsumableInputType[]>([{ name: '', amount: 0, cost: 0 }]);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const ctx = trpc.useContext();
	// trpc api call for creating consumables
	const addConsumables = trpc.consumable.addNewConsumables.useMutation({
		onSuccess: () => {
			ctx.consumable.getAllConsumables.invalidate();
		},
		onSettled: () => {
			setModalIsOpen(false);
		},
	});

	let totalConsumable = 0;

	const { data: consumableList } = trpc.consumable.getAllConsumables.useQuery(session?.user?.id!);
	let consumableListArray: JSX.Element[] | null;
	if (consumableList) {
		consumableListArray = consumableList.map((consumable) => {
			let percentage = consumable.amount * 0.01;
			totalConsumable += consumable.cost * percentage;
			return (
				<ConsumableListItem
					key={consumable.id}
					id={consumable.id}
					amount={consumable.amount}
					name={consumable.name}
					cost={consumable.cost}
				/>
			);
		});
	} else {
		consumableListArray = null;
	}

	setTotalConsumableAmount(totalConsumable);

	function handleOpenModal() {
		setModalIsOpen(true);
	}

	function handleChange(index: number, e: React.FormEvent<HTMLInputElement>) {
		let data = [...consumables];
		let property = e.currentTarget.name;
		if (data && data[index]) {
			if (property === 'amount' || property === 'cost') {
				data[index]![property] = parseFloat(parseFloat(e.currentTarget.value).toFixed(2));
			} else {
				data[index]![property] = e.currentTarget.value;
			}
		}
		setConsumables(data);
	}

	function handleAddConsumable() {
		let newInputField = { name: '', amount: 0, cost: 0 };
		setConsumables([...consumables, newInputField]);
	}

	function handleDelete(index: number) {
		let data = [...consumables];
		data.splice(index, 1);
		setConsumables(data);
	}

	function handleCancelConsumables() {
		setConsumables([{ name: '', amount: 0, cost: 0 }]);
		setModalIsOpen(false);
	}

	function handleSubmitConsumables(e: React.FormEvent) {
		e.preventDefault();
		// check if there are any invalid fields, if so, alert user to use valid inputs
		let invalidInput = false;
		for (let consumable of consumables) {
			if (consumable.amount <= 0 || consumable.cost < 0 || !consumable.name) {
				invalidInput = true;
			}
		}
		// submit expenses array to backend trpc route to createMany expenses
		if (invalidInput) {
			alert("Please make sure the consumable inputs aren't blank or invalid");
		} else {
			let consumablesWithUserId;
			if (session && session.user) {
				consumablesWithUserId = consumables.map((consumable) => {
					consumable.userId = session!.user!.id!;
					return consumable as ConsumableInputTypeWithId;
				});
			}
			if (consumablesWithUserId !== undefined) {
				addConsumables.mutateAsync(consumablesWithUserId);
			}
			setConsumables([{ amount: 0, name: '', cost: 0 }]);
		}
	}

	let consumablesFormList = consumables.map((consumable, index) => {
		return (
			<div className={styles.expenseInputContainer} key={index}>
				<div className={styles.labelInputGroup}>
					<label htmlFor='amount' className={styles.inputLabel}>
						Percentage Applied
					</label>
					<input
						className={styles.input}
						type='number'
						autoComplete='off'
						min={0}
						name='amount'
						value={consumable.amount ? consumable.amount : ''}
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
						value={consumable.name}
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
						value={consumable.cost ? consumable.cost : ''}
						onChange={(e) => handleChange(index, e)}
					/>
				</div>

				<div className={styles.expenseTotalContainer}>
					<p>Total: </p>
					<p>
						{consumable.amount && consumable.cost
							? `${((consumable.amount / 100) * consumable.cost).toFixed(2)}`
							: '0'}
					</p>
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

	return (
		<>
			<Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
				<div className={styles.modalContainer}>
					<h4 className={styles.header}>Add New Consumables</h4>

					<form className={styles.addExpenseForm}>{consumablesFormList}</form>
					<button onClick={handleAddConsumable} className={styles.addExpenseBtn}>
						<FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
						Add Another Consumable
					</button>
					<div className={styles.btngroup}>
						<button className={styles.dangerBtn} onClick={handleCancelConsumables}>
							Cancel
						</button>
						<button className={styles.approveBtn} onClick={handleSubmitConsumables}>
							Done
						</button>
					</div>
				</div>
			</Modal>
			<div className={styles.container}>
				<div className={styles.categoryContainer}>
					<div className={styles.flexGroup}>
						<h4 className={styles.category}>Consumables</h4>
						<p className={styles.categoryDescription}>Apply consumables costs to Project</p>
					</div>
					<button onClick={handleOpenModal} className={styles.addButton}>
						Add Consumable
					</button>
				</div>
				<div className={styles.list}>{consumableListArray}</div>
			</div>
		</>
	);
}
