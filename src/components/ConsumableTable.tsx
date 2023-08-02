import React, { ReactElement, useState } from 'react';
import styles from '../styles/ExpenseTable.module.scss';
import ConsumableListItem from './ConsumableListItem';
import { ConsumableType, ProjectType } from '../types/types';
import { useSession } from 'next-auth/react';
import Modal from './Modal';
import { trpc } from '../utils/trpc';

interface PropsType {
	activeProject: ProjectType | null;
}

type ConsumableInputType = {
	name: string;
	amount: number;
	cost: number;
	[key: string | number]: string | number;
};

type ConsumableInputTypeWithId = ConsumableInputType & { userId: string };

export default function ConsumableTable({ activeProject }: PropsType) {
	const { data: session, status } = useSession();
	const [consumables, setConsumables] = useState<ConsumableInputType[]>([{ name: '', amount: 0, cost: 0 }]);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const ctx = trpc.useContext();
	// trpc api call for creating consumables
	const addConsumables = trpc.consumable.addNewConsumables.useMutation({
		onSuccess: () => {
			ctx.user.getProjectsById.invalidate();
			ctx.consumable.getAllConsumables.invalidate();
		},
		onSettled: () => {
			setModalIsOpen(false);
		},
	});

	const { data: consumableList } = trpc.consumable.getAllConsumables.useQuery(session?.user?.id!);
	let consumableListArray: JSX.Element[] | null;
	if (consumableList) {
		consumableListArray = consumableList.map((consumable) => {
			return (
				<ConsumableListItem
					activeProject={activeProject}
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
	// if (activeProject) {
	// 	consumableList = activeProject.consumables.map((consumable) => (
	// 		<ConsumableListItem name={consumable.productName} cost={consumable.price} />
	// 	));
	// }

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
		// submit expenses array to backend trpc route to createMany expenses for our active project
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
				<input
					type='number'
					min={0}
					name='amount'
					value={consumable.amount ? consumable.amount : ''}
					placeholder='Percentage of cost to apply'
					onChange={(e) => handleChange(index, e)}
				/>
				<input
					type='text'
					name='name'
					value={consumable.name}
					placeholder='consumable name'
					onChange={(e) => handleChange(index, e)}
				/>
				<input
					type='number'
					min={0}
					name='cost'
					value={consumable.cost ? consumable.cost : ''}
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

	return (
		<>
			<Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
				<div className={styles.modalContainer}>
					<h4 className={styles.header}>Add New Consumables</h4>

					<form>{consumablesFormList}</form>
					<button onClick={handleAddConsumable}>Add Another Consumable</button>
					<div className={styles.btngroup}>
						<button className='cancel-btn' onClick={handleCancelConsumables}>
							Cancel
						</button>
						<button className='done-btn' onClick={handleSubmitConsumables}>
							Done
						</button>
					</div>
				</div>
			</Modal>
			<div className={styles.container}>
				<div className={styles.categoryContainer}>
					<div className={styles.flexGroup}>
						<h4 className={styles.category}>Consumables</h4>
						<p className={styles.categoryDescription}>Apply consumable costs to this Project</p>
					</div>
					<button onClick={handleOpenModal}>Add Consumable</button>
				</div>
				<div className={styles.list}>{consumableListArray}</div>
			</div>
		</>
	);
}
